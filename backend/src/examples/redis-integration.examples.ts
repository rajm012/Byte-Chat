/**
 * REDIS INTEGRATION EXAMPLES
 * 
 * This file demonstrates how to integrate Redis services into your
 * controllers, middleware, and socket handlers.
 */

// =====================================================
// Example 1: Auth Controller Integration
// =====================================================

import type { Request, Response } from 'express';
import { SessionService, UserSessionsService, LoginAttemptsService, BlockedIPsService, EmailOTPService 
} from '../services/redis/index.js';

export const loginExample = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || 'unknown';

    // 1. Check if IP is blocked
    if (await BlockedIPsService.isIPBlocked(ipAddress)) {
      return res.status(403).json({ 
        success: false, 
        message: 'IP temporarily blocked due to suspicious activity' 
      });
    }

    // 2. Check login attempts
    const attempts = await LoginAttemptsService.getLoginAttempts(ipAddress);
    if (attempts >= 5) {
      await BlockedIPsService.blockIP(ipAddress, 'Too many failed login attempts');
      return res.status(429).json({ 
        success: false, 
        message: 'Too many login attempts. Try again later.' 
      });
    }

    // 3. Authenticate user (your existing logic)
    const user = null; // await authenticateUser(email, password);
    
    if (!user) {
      // Increment failed attempts
      await LoginAttemptsService.incrementLoginAttempts(ipAddress);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Reset login attempts on success
    await LoginAttemptsService.resetLoginAttempts(ipAddress);

    // 5. Create session in Redis
    const sessionId = crypto.randomUUID();
    await SessionService.createSession(sessionId, {
      userId: 'user.user_id',
      rollNo: 'user.roll_no',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      device: req.headers['user-agent'] || 'unknown'
    });

    // 6. Track user sessions
    await UserSessionsService.addUserSession('user.user_id', sessionId);

    res.json({ 
      success: true, 
      sessionId, 
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutExample = async (req: Request, res: Response) => {
  try {
    const { sessionId, userId } = req.body;

    // 1. Delete session from Redis
    await SessionService.deleteSession(sessionId);

    // 2. Remove from user's active sessions
    await UserSessionsService.removeUserSession(userId, sessionId);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendOTPExample = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 1. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Store in Redis
    await EmailOTPService.storeOTP(email, otp);

    // 3. Send email (your existing logic)
    // await sendEmail(email, otp);

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOTPExample = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // 1. Verify OTP
    const isValid = await EmailOTPService.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // 2. Delete OTP after verification
    await EmailOTPService.deleteOTP(email);

    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
// Example 2: Chat Controller Integration
// =====================================================

import { 
  MessageCacheService, 
  UnreadCountsService, 
  OfflineMessagesService,
  OnlineUsersService 
} from '../services/redis/index.js';

export const sendMessageExample = async (req: Request, res: Response) => {
  try {
    const { chatId, senderId, recipientId, content } = req.body;

    // 1. Save message to database (your existing logic)
    const message = {
      messageId: crypto.randomUUID(),
      senderId,
      content,
      timestamp: new Date().toISOString()
    };

    // 2. Cache message in Redis
    await MessageCacheService.cacheMessage(chatId, message);

    // 3. Check if recipient is online
    const isOnline = await OnlineUsersService.isUserOnline(recipientId);

    if (!isOnline) {
      // Store for offline delivery
      await OfflineMessagesService.addOfflineMessage(recipientId, {
        messageId: message.messageId,
        senderId,
        chatId,
        content,
        timestamp: message.timestamp
      });
    }

    // 4. Increment unread count
    await UnreadCountsService.incrementUnreadCount(recipientId, chatId);

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// export const getMessagesExample = async (req: Request, res: Response) => {
//   try {
//     const { chatId } = req.params;

//     // 1. Try to get from cache first
//     let messages = await MessageCacheService.getCachedMessages(chatId, 50);

//     if (messages.length === 0) {
//       // 2. Fetch from database if cache miss
//       // messages = await fetchMessagesFromDB(chatId);
      
//       // 3. Populate cache
//       // await MessageCacheService.prepopulateCache(chatId, messages);
//     }

//     res.json({ success: true, messages });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


export const getMessagesExample = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    if (typeof chatId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid chatId' });
    }

    // 1. Try to get from cache first
    let messages = await MessageCacheService.getCachedMessages(chatId, 50);

    if (messages.length === 0) {
      // 2. Fetch from database if cache miss
      // messages = await fetchMessagesFromDB(chatId);
      
      // 3. Populate cache
      // await MessageCacheService.prepopulateCache(chatId, messages);
    }

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const markAsReadExample = async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;

    // Reset unread count
    await UnreadCountsService.resetUnreadCount(userId, chatId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =====================================================
// Example 3: Socket Handler Integration
// =====================================================

import { Server, Socket } from 'socket.io';
import { 
  UserSocketService, 
  RoomService, 
  TypingService,
  UserPresenceService,
  WSConnectionsService,
  MessageThroughputService 
} from '../services/redis/index.js';

export const initializeSocketExample = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    const userId = socket.handshake.auth.userId;

    // 1. Map user to socket
    await UserSocketService.mapUserToSocket(userId, socket.id);

    // 2. Mark user online
    await OnlineUsersService.setUserOnline(userId);
    await UserPresenceService.updatePresence(userId, 'online');

    // 3. Increment connection count
    await WSConnectionsService.incrementConnections();

    // 4. Deliver offline messages
    const offlineMessages = await OfflineMessagesService.getOfflineMessages(userId);
    if (offlineMessages.length > 0) {
      socket.emit('offline_messages', offlineMessages);
      await OfflineMessagesService.clearOfflineMessages(userId);
    }

    console.log(`User ${userId} connected (${socket.id})`);

    // Join chat room
    socket.on('join_chat', async (chatId: string) => {
      await RoomService.joinRoom(chatId, socket.id);
      socket.join(chatId);
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    // Leave chat room
    socket.on('leave_chat', async (chatId: string) => {
      await RoomService.leaveRoom(chatId, socket.id);
      socket.leave(chatId);
    });

    // Typing indicator
    socket.on('typing_start', async (chatId: string) => {
      await TypingService.setTyping(chatId, userId);
      socket.to(chatId).emit('user_typing', { userId, chatId });
    });

    socket.on('typing_stop', async (chatId: string) => {
      await TypingService.stopTyping(chatId, userId);
      socket.to(chatId).emit('user_stopped_typing', { userId, chatId });
    });

    // Send message
    socket.on('send_message', async (data: any) => {
      const { chatId, content, recipientId } = data;

      // Increment throughput
      await MessageThroughputService.incrementThroughput();

      // Get recipient socket
      const recipientSocketId = await UserSocketService.getSocketId(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('new_message', {
          chatId,
          senderId: userId,
          content,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      // 1. Mark user offline
      await OnlineUsersService.setUserOffline(userId);
      await UserPresenceService.updatePresence(userId, 'offline');

      // 2. Remove socket mappings
      await UserSocketService.removeMapping(socket.id);

      // 3. Leave all rooms
      await RoomService.leaveAllRooms(socket.id);

      // 4. Decrement connection count
      await WSConnectionsService.decrementConnections();

      console.log(`User ${userId} disconnected`);
    });
  });
};

// =====================================================
// Example 4: Middleware Integration
// =====================================================

import { RateLimitService } from '../services/redis/index.js';

export const rateLimitMiddleware = async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.body.userId || 'anonymous';
    const endpoint = req.path;
    const maxRequests = 100; // per minute

    const count = await RateLimitService.incrementRateLimit(userId, endpoint);

    if (count > maxRequests) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const sessionAuthMiddleware = async (req: Request, res: Response, next: any) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;

    if (!sessionId) {
      return res.status(401).json({ success: false, message: 'No session' });
    }

    // Get session from Redis
    const session = await SessionService.getSession(sessionId);

    if (!session) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    // Extend session
    await SessionService.extendSession(sessionId);

    // Add user to request
    (req as any).user = session;

    next();
  } catch (error) {
    next(error);
  }
};

// =====================================================
// Example 5: Poll Management
// =====================================================

import { PollLiveService, UserVotedService } from '../services/redis/index.js';

export const createPollExample = async (req: Request, res: Response) => {
  try {
    const { groupId, question, duration } = req.body;

    // 1. Create poll in database
    const pollId = crypto.randomUUID();

    // 2. Initialize in Redis
    await PollLiveService.initializePoll(pollId);

    res.json({ success: true, pollId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const voteExample = async (req: Request, res: Response) => {
  try {
    const { pollId, userId, vote } = req.body; // vote: 'for' | 'against'

    // 1. Check if already voted
    if (await UserVotedService.hasUserVoted(pollId, userId)) {
      return res.status(400).json({ success: false, message: 'Already voted' });
    }

    // 2. Record vote
    const results = vote === 'for' 
      ? await PollLiveService.voteFor(pollId)
      : await PollLiveService.voteAgainst(pollId);

    // 3. Mark user as voted
    await UserVotedService.markUserVoted(pollId, userId);

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// export const getPollResultsExample = async (req: Request, res: Response) => {
//   try {
//     const { pollId } = req.params;
    
//     const results = await PollLiveService.getPollResults(pollId);

//     res.json({ success: true, results });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


export const getPollResultsExample = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;

    if (typeof pollId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid pollId' });
    }

    const results = await PollLiveService.getPollResults(pollId);

    res.json({ success: true, results });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
