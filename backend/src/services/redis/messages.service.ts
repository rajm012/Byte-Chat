import { redisClient } from '../../lib/redis.js';

// =====================================================
// MESSAGE QUEUE & CACHING REDIS SERVICES (3 structures)
// =====================================================

interface OfflineMessage {
  messageId: string;
  senderId: string;
  chatId: string;
  content: string;
  timestamp: string;
  type?: string;
}

interface CachedMessage {
  messageId: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
}

/**
 * 11. offline_messages:{userId} - Store messages for offline users
 * Max length: 100 messages
 */
export const OfflineMessagesService = {
  // Add message to offline queue
  async addOfflineMessage(userId: string, message: OfflineMessage): Promise<void> {
    const key = `offline_messages:${userId}`;
    await redisClient.lPush(key, JSON.stringify(message));
    
    // Trim to max 100 messages
    await redisClient.lTrim(key, 0, 99);
  },

  // Get all offline messages
  async getOfflineMessages(userId: string): Promise<OfflineMessage[]> {
    const key = `offline_messages:${userId}`;
    const messages = await redisClient.lRange(key, 0, -1);
    return messages.map(msg => JSON.parse(msg));
  },

  // Get offline messages count
  async getOfflineMessageCount(userId: string): Promise<number> {
    const key = `offline_messages:${userId}`;
    return await redisClient.lLen(key);
  },

  // Clear offline messages
  async clearOfflineMessages(userId: string): Promise<void> {
    const key = `offline_messages:${userId}`;
    await redisClient.del(key);
  },

  // Remove specific message
  async removeOfflineMessage(userId: string, messageId: string): Promise<void> {
    const key = `offline_messages:${userId}`;
    const messages = await this.getOfflineMessages(userId);
    const filtered = messages.filter(msg => msg.messageId !== messageId);
    
    await redisClient.del(key);
    for (const msg of filtered.reverse()) {
      await redisClient.lPush(key, JSON.stringify(msg));
    }
  }
};

/**
 * 12. unread_counts:{userId}:{chatId} - Unread message counts
 */
export const UnreadCountsService = {
  // Increment unread count
  async incrementUnreadCount(userId: string, chatId: string): Promise<number> {
    const key = `unread_counts:${userId}:${chatId}`;
    return await redisClient.incr(key);
  },

  // Get unread count
  async getUnreadCount(userId: string, chatId: string): Promise<number> {
    const key = `unread_counts:${userId}:${chatId}`;
    const count = await redisClient.get(key);
    return count ? parseInt(count) : 0;
  },

  // Reset unread count
  async resetUnreadCount(userId: string, chatId: string): Promise<void> {
    const key = `unread_counts:${userId}:${chatId}`;
    await redisClient.set(key, '0');
  },

  // Delete unread count
  async deleteUnreadCount(userId: string, chatId: string): Promise<void> {
    const key = `unread_counts:${userId}:${chatId}`;
    await redisClient.del(key);
  },

  // Get all unread counts for user
  async getAllUnreadCounts(userId: string): Promise<Record<string, number>> {
    const pattern = `unread_counts:${userId}:*`;
    const keys = await redisClient.keys(pattern);
    const counts: Record<string, number> = {};
    
    for (const key of keys) {
      const chatId = key.split(':')[2];
      if (chatId) {
        const count = await redisClient.get(key);
        counts[chatId] = count ? parseInt(count) : 0;
        }
    //   const count = await redisClient.get(key);
    //   counts[chatId] = count ? parseInt(count) : 0;
    }
    
    return counts;
  },

  // Get total unread count for user
  async getTotalUnreadCount(userId: string): Promise<number> {
    const counts = await this.getAllUnreadCounts(userId);
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }
};

/**
 * 13. message_cache:{chatId}:recent - Cache recent messages
 * TTL: 1 hour, Max: 50 messages
 */
export const MessageCacheService = {
  // Add message to cache
  async cacheMessage(chatId: string, message: CachedMessage): Promise<void> {
    const key = `message_cache:${chatId}:recent`;
    await redisClient.lPush(key, JSON.stringify(message));
    
    // Trim to max 50 messages
    await redisClient.lTrim(key, 0, 49);
    
    // Set TTL
    await redisClient.expire(key, 60 * 60); // 1 hour
  },

  // Get cached messages
  async getCachedMessages(chatId: string, limit: number = 50): Promise<CachedMessage[]> {
    const key = `message_cache:${chatId}:recent`;
    const messages = await redisClient.lRange(key, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg));
  },

  // Get cached messages count
  async getCachedMessageCount(chatId: string): Promise<number> {
    const key = `message_cache:${chatId}:recent`;
    return await redisClient.lLen(key);
  },

  // Clear message cache
  async clearMessageCache(chatId: string): Promise<void> {
    const key = `message_cache:${chatId}:recent`;
    await redisClient.del(key);
  },

  // Refresh cache TTL
  async refreshCacheTTL(chatId: string): Promise<void> {
    const key = `message_cache:${chatId}:recent`;
    await redisClient.expire(key, 60 * 60); // 1 hour
  },

  // Prepopulate cache with messages
  async prepopulateCache(chatId: string, messages: CachedMessage[]): Promise<void> {
    const key = `message_cache:${chatId}:recent`;
    await redisClient.del(key);
    
    for (const message of messages.reverse()) {
      await redisClient.lPush(key, JSON.stringify(message));
    }
    
    await redisClient.lTrim(key, 0, 49);
    await redisClient.expire(key, 60 * 60);
  }
};
