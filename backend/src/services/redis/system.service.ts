import { redisClient } from '../../lib/redis.js';

// =====================================================
// SYSTEM HEALTH REDIS SERVICES (2 structures)
// =====================================================

/**
 * 29. ws_connections - Active WebSocket connections count
 */
export const WSConnectionsService = {
  // Increment connection count
  async incrementConnections(): Promise<number> {
    return await redisClient.incr('ws_connections');
  },

  // Decrement connection count
  async decrementConnections(): Promise<number> {
    const count = await redisClient.decr('ws_connections');
    
    // Ensure count doesn't go below 0
    if (count < 0) {
      await redisClient.set('ws_connections', '0');
      return 0;
    }
    
    return count;
  },

  // Get connection count
  async getConnectionCount(): Promise<number> {
    const count = await redisClient.get('ws_connections');
    return count ? parseInt(count) : 0;
  },

  // Set connection count
  async setConnectionCount(count: number): Promise<void> {
    await redisClient.set('ws_connections', count.toString());
  },

  // Reset connection count
  async resetConnectionCount(): Promise<void> {
    await redisClient.set('ws_connections', '0');
  }
};

/**
 * 30. message_throughput:{second} - Messages per second
 * TTL: 60 seconds
 */
export const MessageThroughputService = {
  // Increment message count for current second
  async incrementThroughput(): Promise<number> {
    const second = Math.floor(Date.now() / 1000); // Current second
    const key = `message_throughput:${second}`;
    
    const count = await redisClient.incr(key);
    
    // Set TTL on first increment
    if (count === 1) {
      await redisClient.expire(key, 60); // 60 seconds
    }
    
    return count;
  },

  // Get current throughput
  async getCurrentThroughput(): Promise<number> {
    const second = Math.floor(Date.now() / 1000);
    const key = `message_throughput:${second}`;
    const count = await redisClient.get(key);
    return count ? parseInt(count) : 0;
  },

  // Get average throughput over last N seconds
  async getAverageThroughput(seconds: number = 60): Promise<number> {
    const currentSecond = Math.floor(Date.now() / 1000);
    let total = 0;
    let validSeconds = 0;
    
    for (let i = 0; i < seconds; i++) {
      const key = `message_throughput:${currentSecond - i}`;
      const count = await redisClient.get(key);
      if (count) {
        total += parseInt(count);
        validSeconds++;
      }
    }
    
    return validSeconds > 0 ? Math.round(total / validSeconds) : 0;
  },

  // Get peak throughput in last N seconds
  async getPeakThroughput(seconds: number = 60): Promise<number> {
    const currentSecond = Math.floor(Date.now() / 1000);
    let peak = 0;
    
    for (let i = 0; i < seconds; i++) {
      const key = `message_throughput:${currentSecond - i}`;
      const count = await redisClient.get(key);
      if (count) {
        const countNum = parseInt(count);
        if (countNum > peak) {
          peak = countNum;
        }
      }
    }
    
    return peak;
  },

  // Get throughput history (last N seconds)
  async getThroughputHistory(seconds: number = 60): Promise<Array<{ timestamp: number; count: number }>> {
    const currentSecond = Math.floor(Date.now() / 1000);
    const history: Array<{ timestamp: number; count: number }> = [];
    
    for (let i = seconds - 1; i >= 0; i--) {
      const timestamp = currentSecond - i;
      const key = `message_throughput:${timestamp}`;
      const count = await redisClient.get(key);
      history.push({
        timestamp,
        count: count ? parseInt(count) : 0
      });
    }
    
    return history;
  }
};

/**
 * System Health Monitoring - Combined service
 */
export const SystemHealthService = {
  // Get overall system health
  async getSystemHealth(): Promise<{
    activeConnections: number;
    currentThroughput: number;
    averageThroughput: number;
    peakThroughput: number;
    timestamp: string;
  }> {
    return {
      activeConnections: await WSConnectionsService.getConnectionCount(),
      currentThroughput: await MessageThroughputService.getCurrentThroughput(),
      averageThroughput: await MessageThroughputService.getAverageThroughput(60),
      peakThroughput: await MessageThroughputService.getPeakThroughput(60),
      timestamp: new Date().toISOString()
    };
  },

  // Get detailed health metrics
  async getDetailedHealth(): Promise<{
    connections: number;
    throughput: {
      current: number;
      average: number;
      peak: number;
      history: Array<{ timestamp: number; count: number }>;
    };
    timestamp: string;
  }> {
    return {
      connections: await WSConnectionsService.getConnectionCount(),
      throughput: {
        current: await MessageThroughputService.getCurrentThroughput(),
        average: await MessageThroughputService.getAverageThroughput(60),
        peak: await MessageThroughputService.getPeakThroughput(60),
        history: await MessageThroughputService.getThroughputHistory(60)
      },
      timestamp: new Date().toISOString()
    };
  }
};
