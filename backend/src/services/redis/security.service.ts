import { redisClient } from '../../lib/redis.js';

// =====================================================
// RATE LIMITING & SECURITY REDIS SERVICES (4 structures)
// =====================================================

/**
 * 23. login_attempts:{ip}:{hour} - Failed login attempts
 * TTL: 1 hour
 */
export const LoginAttemptsService = {
  // Increment login attempts
  async incrementLoginAttempts(ip: string): Promise<number> {
    const hour = Math.floor(Date.now() / (60 * 60 * 1000)); // Current hour
    const key = `login_attempts:${ip}:${hour}`;
    
    const count = await redisClient.incr(key);
    
    // Set TTL on first increment
    if (count === 1) {
      await redisClient.expire(key, 60 * 60); // 1 hour
    }
    
    return count;
  },

  // Get login attempts count
  async getLoginAttempts(ip: string): Promise<number> {
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    const key = `login_attempts:${ip}:${hour}`;
    const count = await redisClient.get(key);
    return count ? parseInt(count) : 0;
  },

  // Check if IP is blocked due to too many attempts
  async isIPBlocked(ip: string, maxAttempts: number = 5): Promise<boolean> {
    const attempts = await this.getLoginAttempts(ip);
    return attempts >= maxAttempts;
  },

  // Reset login attempts
  async resetLoginAttempts(ip: string): Promise<void> {
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    const key = `login_attempts:${ip}:${hour}`;
    await redisClient.del(key);
  },

  // Get TTL for current attempts
  async getAttemptsTTL(ip: string): Promise<number> {
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    const key = `login_attempts:${ip}:${hour}`;
    return await redisClient.ttl(key);
  }
};

/**
 * 24. email_otp:{email} - Email OTP codes
 * TTL: 10 minutes
 */
export const EmailOTPService = {
  // Store OTP
  async storeOTP(email: string, otp: string): Promise<void> {
    const key = `email_otp:${email}`;
    const ttl = 10 * 60; // 10 minutes
    await redisClient.setEx(key, ttl, otp);
  },

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const key = `email_otp:${email}`;
    const storedOTP = await redisClient.get(key);
    return storedOTP === otp;
  },

  // Get OTP (for testing/debugging only)
  async getOTP(email: string): Promise<string | null> {
    const key = `email_otp:${email}`;
    return await redisClient.get(key);
  },

  // Delete OTP (after verification)
  async deleteOTP(email: string): Promise<void> {
    const key = `email_otp:${email}`;
    await redisClient.del(key);
  },

  // Check if OTP exists
  async otpExists(email: string): Promise<boolean> {
    const key = `email_otp:${email}`;
    return await redisClient.exists(key) === 1;
  },

  // Get OTP TTL
  async getOTPTTL(email: string): Promise<number> {
    const key = `email_otp:${email}`;
    return await redisClient.ttl(key);
  }
};

/**
 * 25. blocked_ips:{ip} - Temporarily blocked IPs
 * TTL: 24 hours
 */
export const BlockedIPsService = {
  // Block IP
  async blockIP(ip: string, reason: string = 'Security violation'): Promise<void> {
    const key = `blocked_ips:${ip}`;
    const ttl = 24 * 60 * 60; // 24 hours
    await redisClient.setEx(key, ttl, reason);
  },

  // Check if IP is blocked
  async isIPBlocked(ip: string): Promise<boolean> {
    const key = `blocked_ips:${ip}`;
    return await redisClient.exists(key) === 1;
  },

  // Get block reason
  async getBlockReason(ip: string): Promise<string | null> {
    const key = `blocked_ips:${ip}`;
    return await redisClient.get(key);
  },

  // Unblock IP
  async unblockIP(ip: string): Promise<void> {
    const key = `blocked_ips:${ip}`;
    await redisClient.del(key);
  },

  // Get block TTL
  async getBlockTTL(ip: string): Promise<number> {
    const key = `blocked_ips:${ip}`;
    return await redisClient.ttl(key);
  },

  // Get all blocked IPs
  async getAllBlockedIPs(): Promise<string[]> {
    const pattern = 'blocked_ips:*';
    const keys = await redisClient.keys(pattern);
    return keys.map(key => key.replace('blocked_ips:', ''));
  }
};

/**
 * 26. ws_auth:{socketId} - WebSocket authentication
 * TTL: 30 seconds
 */
export const WebSocketAuthService = {
  // Store WebSocket auth token
  async storeWSAuth(socketId: string, userId: string, sessionToken: string): Promise<void> {
    const key = `ws_auth:${socketId}`;
    const data = {
      userId,
      sessionToken,
      authenticatedAt: new Date().toISOString()
    };
    const ttl = 30; // 30 seconds
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  },

  // Get WebSocket auth data
  async getWSAuth(socketId: string): Promise<{ userId: string; sessionToken: string; authenticatedAt: string } | null> {
    const key = `ws_auth:${socketId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Delete WebSocket auth
  async deleteWSAuth(socketId: string): Promise<void> {
    const key = `ws_auth:${socketId}`;
    await redisClient.del(key);
  },

  // Verify WebSocket authentication
  async verifyWSAuth(socketId: string, userId: string): Promise<boolean> {
    const authData = await this.getWSAuth(socketId);
    return authData?.userId === userId;
  },

  // Extend WebSocket auth TTL
  async extendWSAuth(socketId: string): Promise<void> {
    const key = `ws_auth:${socketId}`;
    await redisClient.expire(key, 30);
  }
};
