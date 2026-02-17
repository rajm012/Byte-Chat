import { redisClient } from '../../lib/redis.js';

// =====================================================
// SESSION & AUTH REDIS SERVICES (4 structures)
// =====================================================

interface SessionData {
  userId: string;
  rollNo: string;
  createdAt: string;
  expiresAt: string;
  device?: string;
}

/**
 * 1. session:{sessionId} - Primary session store
 * TTL: 7 days
 */
export const SessionService = {
  // Create session
  async createSession(sessionId: string, data: SessionData): Promise<void> {
    const key = `session:${sessionId}`;
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  },

  // Get session
  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Update session
  async updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const key = `session:${sessionId}`;
    const existing = await this.getSession(sessionId);
    if (existing) {
      const updated = { ...existing, ...data };
      const ttl = 7 * 24 * 60 * 60;
      await redisClient.setEx(key, ttl, JSON.stringify(updated));
    }
  },

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await redisClient.del(key);
  },

  // Extend session TTL
  async extendSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    const ttl = 7 * 24 * 60 * 60;
    await redisClient.expire(key, ttl);
  }
};

/**
 * 2. user_sessions:{userId} - Set of active session IDs
 */
export const UserSessionsService = {
  // Add session ID to user's active sessions
  async addUserSession(userId: string, sessionId: string): Promise<void> {
    const key = `user_sessions:${userId}`;
    await redisClient.sAdd(key, sessionId);
  },

  // Remove session ID from user's active sessions
  async removeUserSession(userId: string, sessionId: string): Promise<void> {
    const key = `user_sessions:${userId}`;
    await redisClient.sRem(key, sessionId);
  },

  // Get all active sessions for a user
  async getUserSessions(userId: string): Promise<string[]> {
    const key = `user_sessions:${userId}`;
    return await redisClient.sMembers(key);
  },

  // Logout all sessions for a user
  async logoutAllSessions(userId: string): Promise<void> {
    const key = `user_sessions:${userId}`;
    const sessionIds = await redisClient.sMembers(key);
    
    // Delete all session data
    for (const sessionId of sessionIds) {
      await SessionService.deleteSession(sessionId);
    }
    
    // Clear the user_sessions set
    await redisClient.del(key);
  },

  // Count active sessions
  async countUserSessions(userId: string): Promise<number> {
    const key = `user_sessions:${userId}`;
    return await redisClient.sCard(key);
  }
};

/**
 * 3. rate_limit:{userId}:{endpoint}:{minute} - API rate limiting
 * TTL: 60 seconds
 */
export const RateLimitService = {
  // Increment rate limit counter
  async incrementRateLimit(userId: string, endpoint: string): Promise<number> {
    const minute = Math.floor(Date.now() / 60000); // Current minute
    const key = `rate_limit:${userId}:${endpoint}:${minute}`;
    
    const count = await redisClient.incr(key);
    
    // Set TTL only on first increment
    if (count === 1) {
      await redisClient.expire(key, 60);
    }
    
    return count;
  },

  // Check if rate limit exceeded
  async checkRateLimit(userId: string, endpoint: string, maxRequests: number): Promise<boolean> {
    const minute = Math.floor(Date.now() / 60000);
    const key = `rate_limit:${userId}:${endpoint}:${minute}`;
    const count = await redisClient.get(key);
    
    return count ? parseInt(count) >= maxRequests : false;
  },

  // Get current count
  async getRateLimitCount(userId: string, endpoint: string): Promise<number> {
    const minute = Math.floor(Date.now() / 60000);
    const key = `rate_limit:${userId}:${endpoint}:${minute}`;
    const count = await redisClient.get(key);
    return count ? parseInt(count) : 0;
  },

  // Reset rate limit for user
  async resetRateLimit(userId: string, endpoint: string): Promise<void> {
    const minute = Math.floor(Date.now() / 60000);
    const key = `rate_limit:${userId}:${endpoint}:${minute}`;
    await redisClient.del(key);
  }
};

/**
 * 4. session_cache:{userId}:{chatId} - Cached decrypted AES keys
 * TTL: 1 hour
 */
export const SessionCacheService = {
  // Store cached session data (e.g., decrypted keys)
  async setCachedKey(userId: string, chatId: string, aesKey: string, keyVersion: number): Promise<void> {
    const key = `session_cache:${userId}:${chatId}`;
    const data = {
      aesKey,
      keyVersion,
      lastUsed: new Date().toISOString()
    };
    const ttl = 60 * 60; // 1 hour
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  },

  // Get cached session data
  async getCachedKey(userId: string, chatId: string): Promise<{ aesKey: string; keyVersion: number; lastUsed: string } | null> {
    const key = `session_cache:${userId}:${chatId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Delete cached session data
  async deleteCachedKey(userId: string, chatId: string): Promise<void> {
    const key = `session_cache:${userId}:${chatId}`;
    await redisClient.del(key);
  },

  // Clear all cached keys for a user
  async clearUserCache(userId: string): Promise<void> {
    const pattern = `session_cache:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
};
