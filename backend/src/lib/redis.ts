import { createClient } from 'redis';
import { config } from '../config/index.js';

const redisOptions: any = {
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  database: config.redis.db
};

// // Create Redis client
// const redisClient = createClient({
//   socket: {
//     host: config.redis.host,
//     port: config.redis.port
//   },
//   password: config.redis.password,
//   database: config.redis.db
// });

if (config.redis.password !== undefined) {
  redisOptions.password = config.redis.password;
}

const redisClient = createClient(redisOptions);

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Connect to Redis
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log('✅ Redis disconnected successfully');
    }
  } catch (error) {
    console.error('Error disconnecting from Redis:', error);
  }
};

export { redisClient };
