import { redisClient } from '../../lib/redis.js';

// =====================================================
// NOTIFICATIONS REDIS SERVICES (2 structures)
// =====================================================

interface Notification {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  isRead: boolean;
}

/**
 * 14. notifications:{userId} - Pending notifications list
 * TTL: 7 days, Max: 50 notifications
 */
export const NotificationsService = {
  // Add notification
  async addNotification(userId: string, notification: Notification): Promise<void> {
    const key = `notifications:${userId}`;
    await redisClient.lPush(key, JSON.stringify(notification));
    
    // Trim to max 50 notifications
    await redisClient.lTrim(key, 0, 49);
    
    // Set TTL to 7 days
    await redisClient.expire(key, 7 * 24 * 60 * 60);
  },

  // Get all notifications
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    const key = `notifications:${userId}`;
    const notifications = await redisClient.lRange(key, 0, limit - 1);
    return notifications.map(notif => JSON.parse(notif));
  },

  // Get unread notifications
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const allNotifications = await this.getNotifications(userId);
    return allNotifications.filter(notif => !notif.isRead);
  },

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const notifications = await this.getNotifications(userId);
    const updated = notifications.map(notif => 
      notif.notificationId === notificationId 
        ? { ...notif, isRead: true }
        : notif
    );
    
    const key = `notifications:${userId}`;
    await redisClient.del(key);
    
    for (const notif of updated.reverse()) {
      await redisClient.lPush(key, JSON.stringify(notif));
    }
    
    await redisClient.expire(key, 7 * 24 * 60 * 60);
  },

  // Mark all as read
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getNotifications(userId);
    const updated = notifications.map(notif => ({ ...notif, isRead: true }));
    
    const key = `notifications:${userId}`;
    await redisClient.del(key);
    
    for (const notif of updated.reverse()) {
      await redisClient.lPush(key, JSON.stringify(notif));
    }
    
    await redisClient.expire(key, 7 * 24 * 60 * 60);
  },

  // Delete notification
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const notifications = await this.getNotifications(userId);
    const filtered = notifications.filter(notif => notif.notificationId !== notificationId);
    
    const key = `notifications:${userId}`;
    await redisClient.del(key);
    
    for (const notif of filtered.reverse()) {
      await redisClient.lPush(key, JSON.stringify(notif));
    }
    
    await redisClient.expire(key, 7 * 24 * 60 * 60);
  },

  // Clear all notifications
  async clearNotifications(userId: string): Promise<void> {
    const key = `notifications:${userId}`;
    await redisClient.del(key);
  },

  // Get notifications count
  async getNotificationsCount(userId: string): Promise<number> {
    const key = `notifications:${userId}`;
    return await redisClient.lLen(key);
  }
};

/**
 * 15. notification_count:{userId} - Unread notification counter
 * TTL: 7 days
 */
export const NotificationCountService = {
  // Increment notification count
  async incrementCount(userId: string): Promise<number> {
    const key = `notification_count:${userId}`;
    const count = await redisClient.incr(key);
    
    // Set TTL to 7 days
    await redisClient.expire(key, 7 * 24 * 60 * 60);
    
    return count;
  },

  // Get notification count
  async getCount(userId: string): Promise<number> {
    const key = `notification_count:${userId}`;
    const count = await redisClient.get(key);
    return count ? parseInt(count) : 0;
  },

  // Reset notification count
  async resetCount(userId: string): Promise<void> {
    const key = `notification_count:${userId}`;
    await redisClient.set(key, '0');
    await redisClient.expire(key, 7 * 24 * 60 * 60);
  },

  // Decrement notification count
  async decrementCount(userId: string): Promise<number> {
    const key = `notification_count:${userId}`;
    const count = await redisClient.decr(key);
    
    // Ensure count doesn't go below 0
    if (count < 0) {
      await redisClient.set(key, '0');
      return 0;
    }
    
    return count;
  },

  // Delete notification count
  async deleteCount(userId: string): Promise<void> {
    const key = `notification_count:${userId}`;
    await redisClient.del(key);
  }
};
