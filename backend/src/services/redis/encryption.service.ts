import { redisClient } from '../../lib/redis.js';

// =====================================================
// ENCRYPTION KEY CACHE REDIS SERVICES (2 structures)
// =====================================================

/**
 * 21. key_cache:{userId}:{chatId} - Decrypted AES keys cache
 * TTL: 5 minutes
 */
export const KeyCacheService = {
  // Cache decrypted key
  async cacheKey(userId: string, chatId: string, decryptedKey: string): Promise<void> {
    const key = `key_cache:${userId}:${chatId}`;
    const ttl = 5 * 60; // 5 minutes
    await redisClient.setEx(key, ttl, decryptedKey);
  },

  // Get cached key
  async getCachedKey(userId: string, chatId: string): Promise<string | null> {
    const key = `key_cache:${userId}:${chatId}`;
    return await redisClient.get(key);
  },

  // Delete cached key
  async deleteCachedKey(userId: string, chatId: string): Promise<void> {
    const key = `key_cache:${userId}:${chatId}`;
    await redisClient.del(key);
  },

  // Clear all cached keys for user
  async clearUserKeys(userId: string): Promise<void> {
    const pattern = `key_cache:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },

  // Clear all cached keys for chat
  async clearChatKeys(chatId: string): Promise<void> {
    const pattern = `key_cache:*:${chatId}`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },

  // Refresh key cache TTL
  async refreshKeyCacheTTL(userId: string, chatId: string): Promise<void> {
    const key = `key_cache:${userId}:${chatId}`;
    const ttl = 5 * 60;
    await redisClient.expire(key, ttl);
  },

  // Check if key is cached
  async isKeyCached(userId: string, chatId: string): Promise<boolean> {
    const key = `key_cache:${userId}:${chatId}`;
    return await redisClient.exists(key) === 1;
  }
};

/**
 * 22. key_version:{chatId} - Current encryption key version
 * TTL: 30 days
 */
export const KeyVersionService = {
  // Set key version
  async setKeyVersion(chatId: string, version: number): Promise<void> {
    const key = `key_version:${chatId}`;
    const ttl = 30 * 24 * 60 * 60; // 30 days
    await redisClient.setEx(key, ttl, version.toString());
  },

  // Get key version
  async getKeyVersion(chatId: string): Promise<number> {
    const key = `key_version:${chatId}`;
    const version = await redisClient.get(key);
    return version ? parseInt(version) : 1; // Default to version 1
  },

  // Increment key version
  async incrementKeyVersion(chatId: string): Promise<number> {
    const key = `key_version:${chatId}`;
    const newVersion = await redisClient.incr(key);
    
    // Set TTL
    const ttl = 30 * 24 * 60 * 60;
    await redisClient.expire(key, ttl);
    
    return newVersion;
  },

  // Delete key version
  async deleteKeyVersion(chatId: string): Promise<void> {
    const key = `key_version:${chatId}`;
    await redisClient.del(key);
  },

  // Reset key version
  async resetKeyVersion(chatId: string): Promise<void> {
    const key = `key_version:${chatId}`;
    const ttl = 30 * 24 * 60 * 60;
    await redisClient.setEx(key, ttl, '1');
  },

  // Check if key version exists
  async keyVersionExists(chatId: string): Promise<boolean> {
    const key = `key_version:${chatId}`;
    return await redisClient.exists(key) === 1;
  }
};
