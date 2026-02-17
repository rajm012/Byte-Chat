import { redisClient } from '../../lib/redis.js';

// =====================================================
// REAL-TIME & PRESENCE REDIS SERVICES (5 structures)
// =====================================================

/**
 * 5. online_users - Set of currently online user IDs
 */
export const OnlineUsersService = {
  // Mark user as online
  async setUserOnline(userId: string): Promise<void> {
    await redisClient.sAdd('online_users', userId);
  },

  // Mark user as offline
  async setUserOffline(userId: string): Promise<void> {
    await redisClient.sRem('online_users', userId);
  },

  // Check if user is online
  async isUserOnline(userId: string): Promise<boolean> {
    // return await redisClient.sIsMember('online_users', userId);
    return (await redisClient.sIsMember('online_users', userId)) === 1;
  },

  // Get all online users
  async getAllOnlineUsers(): Promise<string[]> {
    return await redisClient.sMembers('online_users');
  },

  // Get online users count
  async getOnlineUsersCount(): Promise<number> {
    return await redisClient.sCard('online_users');
  },

  // Get multiple users online status
  async areUsersOnline(userIds: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};
    for (const userId of userIds) {
      result[userId] = await this.isUserOnline(userId);
    }
    return result;
  }
};

/**
 * 6. user_socket:{userId} - Map user to socket ID
 * 7. socket_user:{socketId} - Reverse mapping
 */
export const UserSocketService = {
  // Map user to socket
  async mapUserToSocket(userId: string, socketId: string): Promise<void> {
    const userKey = `user_socket:${userId}`;
    const socketKey = `socket_user:${socketId}`;
    
    await redisClient.set(userKey, socketId);
    await redisClient.set(socketKey, userId);
  },

  // Get socket ID for user
  async getSocketId(userId: string): Promise<string | null> {
    const key = `user_socket:${userId}`;
    return await redisClient.get(key);
  },

  // Get user ID for socket
  async getUserId(socketId: string): Promise<string | null> {
    const key = `socket_user:${socketId}`;
    return await redisClient.get(key);
  },

  // Remove mappings on disconnect
  async removeMapping(socketId: string): Promise<void> {
    const userId = await this.getUserId(socketId);
    
    if (userId) {
      const userKey = `user_socket:${userId}`;
      await redisClient.del(userKey);
    }
    
    const socketKey = `socket_user:${socketId}`;
    await redisClient.del(socketKey);
  },

  // Get all socket mappings for debugging
  async getAllMappings(): Promise<{ userId: string; socketId: string }[]> {
    const pattern = 'user_socket:*';
    const keys = await redisClient.keys(pattern);
    const mappings: { userId: string; socketId: string }[] = [];
    
    for (const key of keys) {
      const userId = key.replace('user_socket:', '');
      const socketId = await redisClient.get(key);
      if (socketId) {
        mappings.push({ userId, socketId });
      }
    }
    
    return mappings;
  }
};

/**
 * 8. room:{chatId} - Set of socket IDs in a chat room
 */
export const RoomService = {
  // Add socket to room
  async joinRoom(chatId: string, socketId: string): Promise<void> {
    const key = `room:${chatId}`;
    await redisClient.sAdd(key, socketId);
  },

  // Add socket to group room
  async joinGroupRoom(groupId: string, socketId: string): Promise<void> {
    const key = `room:group:${groupId}`;
    await redisClient.sAdd(key, socketId);
  },

  // Remove socket from room
  async leaveRoom(chatId: string, socketId: string): Promise<void> {
    const key = `room:${chatId}`;
    await redisClient.sRem(key, socketId);
  },

  // Remove socket from group room
  async leaveGroupRoom(groupId: string, socketId: string): Promise<void> {
    const key = `room:group:${groupId}`;
    await redisClient.sRem(key, socketId);
  },

  // Get all sockets in room
  async getRoomSockets(chatId: string): Promise<string[]> {
    const key = `room:${chatId}`;
    return await redisClient.sMembers(key);
  },

  // Get all sockets in group room
  async getGroupRoomSockets(groupId: string): Promise<string[]> {
    const key = `room:group:${groupId}`;
    return await redisClient.sMembers(key);
  },

  // Get room member count
  async getRoomCount(chatId: string): Promise<number> {
    const key = `room:${chatId}`;
    return await redisClient.sCard(key);
  },

  // Clear room (remove all sockets)
  async clearRoom(chatId: string): Promise<void> {
    const key = `room:${chatId}`;
    await redisClient.del(key);
  },

  // Remove socket from all rooms
  async leaveAllRooms(socketId: string): Promise<void> {
    const patterns = ['room:*', 'room:group:*'];
    
    for (const pattern of patterns) {
      const keys = await redisClient.keys(pattern);
      for (const key of keys) {
        await redisClient.sRem(key, socketId);
      }
    }
  }
};

/**
 * 9. typing:{chatId}:{userId} - Typing indicators
 * TTL: 5 seconds
 */
export const TypingService = {
  // Set user as typing
  async setTyping(chatId: string, userId: string): Promise<void> {
    const key = `typing:${chatId}:${userId}`;
    const timestamp = new Date().toISOString();
    await redisClient.setEx(key, 5, timestamp);
  },

  // Check if user is typing
  async isTyping(chatId: string, userId: string): Promise<boolean> {
    const key = `typing:${chatId}:${userId}`;
    const result = await redisClient.exists(key);
    return result === 1;
  },

  // Get all users typing in chat
  async getTypingUsers(chatId: string): Promise<string[]> {
    const pattern = `typing:${chatId}:*`;
    const keys = await redisClient.keys(pattern);
    // return keys.map(key => key.split(':')[2]);
    return keys
    .map(key => key.split(':')[2])
    .filter((userId): userId is string => typeof userId === 'string');
  },

  // Stop typing
  async stopTyping(chatId: string, userId: string): Promise<void> {
    const key = `typing:${chatId}:${userId}`;
    await redisClient.del(key);
  },

  // Clear all typing indicators for a chat
  async clearChatTyping(chatId: string): Promise<void> {
    const pattern = `typing:${chatId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
};

/**
 * 10. user_presence:{userId} - Last seen & status
 * TTL: 30 days
 */
export const UserPresenceService = {
  // Update user presence
  async updatePresence(userId: string, status: 'online' | 'away' | 'offline'): Promise<void> {
    const key = `user_presence:${userId}`;
    const data = {
      status,
      lastSeen: new Date().toISOString()
    };
    const ttl = 30 * 24 * 60 * 60; // 30 days
    await redisClient.hSet(key, data);
    await redisClient.expire(key, ttl);
  },

  // Get user presence
  async getPresence(userId: string): Promise<{ status: string; lastSeen: string } | null> {
    const key = `user_presence:${userId}`;
    const data = await redisClient.hGetAll(key);
    return data && Object.keys(data).length > 0 ? data as { status: string; lastSeen: string } : null;
  },

  // Get multiple users presence
  async getMultiplePresence(userIds: string[]): Promise<Record<string, { status: string; lastSeen: string } | null>> {
    const result: Record<string, { status: string; lastSeen: string } | null> = {};
    
    for (const userId of userIds) {
      result[userId] = await this.getPresence(userId);
    }
    
    return result;
  },

  // Update last seen only
  async updateLastSeen(userId: string): Promise<void> {
    const key = `user_presence:${userId}`;
    await redisClient.hSet(key, 'lastSeen', new Date().toISOString());
  }
};
