import { redisClient } from '../../lib/redis.js';

// =====================================================
// ANONYMOUS IDENTITY CACHE REDIS SERVICES (3 structures)
// =====================================================

/**
 * 18. anon_map:{randomString} - Quick anonymous ID lookup
 * TTL: 30 days
 */
export const AnonMapService = {
  // Map random string to user ID
  async mapAnonToUser(randomString: string, userId: string): Promise<void> {
    const key = `anon_map:${randomString}`;
    const ttl = 30 * 24 * 60 * 60; // 30 days
    await redisClient.setEx(key, ttl, userId);
  },

  // Get user ID from random string
  async getUserFromAnon(randomString: string): Promise<string | null> {
    const key = `anon_map:${randomString}`;
    return await redisClient.get(key);
  },

  // Delete anonymous mapping
  async deleteAnonMapping(randomString: string): Promise<void> {
    const key = `anon_map:${randomString}`;
    await redisClient.del(key);
  },

  // Check if anonymous ID exists
  async anonExists(randomString: string): Promise<boolean> {
    const key = `anon_map:${randomString}`;
    return await redisClient.exists(key) === 1;
  },

  // Extend TTL
  async extendAnonTTL(randomString: string): Promise<void> {
    const key = `anon_map:${randomString}`;
    const ttl = 30 * 24 * 60 * 60;
    await redisClient.expire(key, ttl);
  }
};

/**
 * 19. user_anon:{userId}:{targetId} - Reverse anonymous mapping
 * TTL: 30 days
 */
export const UserAnonService = {
  // Map user to anonymous string for a target
  async mapUserAnon(userId: string, targetId: string, randomString: string): Promise<void> {
    const key = `user_anon:${userId}:${targetId}`;
    const ttl = 30 * 24 * 60 * 60; // 30 days
    await redisClient.setEx(key, ttl, randomString);
  },

  // Get anonymous string for user-target pair
  async getAnonString(userId: string, targetId: string): Promise<string | null> {
    const key = `user_anon:${userId}:${targetId}`;
    return await redisClient.get(key);
  },

  // Delete user anonymous mapping
  async deleteUserAnon(userId: string, targetId: string): Promise<void> {
    const key = `user_anon:${userId}:${targetId}`;
    await redisClient.del(key);
  },

  // Get all anonymous mappings for a user
  async getAllUserAnon(userId: string): Promise<Record<string, string>> {
    const pattern = `user_anon:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    const mappings: Record<string, string> = {};
    
    for (const key of keys) {
      const targetId = key.split(':')[2];
      const randomString = await redisClient.get(key);
      if (targetId && randomString) {
        mappings[targetId] = randomString;
      }
    }
    
    return mappings;
  },

  // Clear all anonymous identities for a user
  async clearUserAnon(userId: string): Promise<void> {
    const pattern = `user_anon:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
};

/**
 * 20. anon_cache:{userId}:{chatId} - Cached anonymous identity for chat
 * TTL: 1 hour
 */
export const AnonCacheService = {
  // Cache anonymous identity for active chat
  async cacheAnonIdentity(userId: string, chatId: string, anonymousIdentityId: string): Promise<void> {
    const key = `anon_cache:${userId}:${chatId}`;
    const ttl = 60 * 60; // 1 hour
    await redisClient.setEx(key, ttl, anonymousIdentityId);
  },

  // Get cached anonymous identity
  async getCachedAnonIdentity(userId: string, chatId: string): Promise<string | null> {
    const key = `anon_cache:${userId}:${chatId}`;
    return await redisClient.get(key);
  },

  // Delete cached anonymous identity
  async deleteCachedAnon(userId: string, chatId: string): Promise<void> {
    const key = `anon_cache:${userId}:${chatId}`;
    await redisClient.del(key);
  },

  // Clear all cached anonymous identities for user
  async clearUserAnonCache(userId: string): Promise<void> {
    const pattern = `anon_cache:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },

  // Refresh cache TTL
  async refreshAnonCache(userId: string, chatId: string): Promise<void> {
    const key = `anon_cache:${userId}:${chatId}`;
    const ttl = 60 * 60;
    await redisClient.expire(key, ttl);
  },

  // Get all cached anonymous identities for user
  async getAllCachedAnon(userId: string): Promise<Record<string, string>> {
    const pattern = `anon_cache:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    const cache: Record<string, string> = {};
    
    for (const key of keys) {
      const chatId = key.split(':')[2];
      const identityId = await redisClient.get(key);
      if (chatId && identityId) {
        cache[chatId] = identityId;
      }
    }
    
    return cache;
  }
};
