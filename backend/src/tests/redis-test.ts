/**
 * REDIS CONNECTION TEST
 * 
 * Run this file to verify Redis is properly configured and connected
 * Usage: npx tsx src/tests/redis-test.ts
 */

import { redisClient, connectRedis, disconnectRedis } from '../lib/redis.js';
import {
  SessionService,
  OnlineUsersService,
  MessageCacheService,
  PollLiveService,
  SystemHealthService
} from '../services/redis/index.js';

const runRedisTests = async () => {
  try {
    console.log('🧪 Starting Redis Connection Tests...\n');

    // Test 1: Connect to Redis
    console.log('Test 1: Connecting to Redis...');
    await connectRedis();
    console.log('✅ Redis connected successfully\n');

    // Test 2: Basic Operations
    console.log('Test 2: Testing basic operations...');
    await redisClient.set('test_key', 'Hello Redis!');
    const value = await redisClient.get('test_key');
    console.log(`✅ Stored and retrieved value: "${value}"\n`);

    // Test 3: Session Service
    console.log('Test 3: Testing SessionService...');
    const testSessionId = 'test-session-123';
    await SessionService.createSession(testSessionId, {
      userId: 'user-123',
      rollNo: 'B23CS001',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      device: 'test'
    });
    const session = await SessionService.getSession(testSessionId);
    console.log(`✅ Session created: ${JSON.stringify(session, null, 2)}\n`);

    // Test 4: Online Users
    console.log('Test 4: Testing OnlineUsersService...');
    await OnlineUsersService.setUserOnline('user-123');
    const isOnline = await OnlineUsersService.isUserOnline('user-123');
    console.log(`✅ User online status: ${isOnline}\n`);

    // Test 5: Message Cache
    console.log('Test 5: Testing MessageCacheService...');
    await MessageCacheService.cacheMessage('chat-123', {
      messageId: 'msg-1',
      senderId: 'user-123',
      content: 'Test message',
      timestamp: new Date().toISOString()
    });
    const messages = await MessageCacheService.getCachedMessages('chat-123');
    console.log(`✅ Cached messages: ${messages.length} message(s)\n`);

    // Test 6: Poll Service
    console.log('Test 6: Testing PollLiveService...');
    await PollLiveService.initializePoll('poll-123');
    await PollLiveService.voteFor('poll-123');
    await PollLiveService.voteAgainst('poll-123');
    const results = await PollLiveService.getPollResults('poll-123');
    console.log(`✅ Poll results: ${JSON.stringify(results, null, 2)}\n`);

    // Test 7: System Health
    console.log('Test 7: Testing SystemHealthService...');
    const health = await SystemHealthService.getSystemHealth();
    console.log(`✅ System health: ${JSON.stringify(health, null, 2)}\n`);

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await redisClient.del('test_key');
    await SessionService.deleteSession(testSessionId);
    await OnlineUsersService.setUserOffline('user-123');
    await MessageCacheService.clearMessageCache('chat-123');
    await PollLiveService.deletePoll('poll-123');
    console.log('✅ Cleanup complete\n');

    console.log('🎉 All Redis tests passed successfully!');

  } catch (error) {
    console.error('❌ Redis test failed:', error);
    process.exit(1);
  } finally {
    await disconnectRedis();
    console.log('\n✅ Disconnected from Redis');
    process.exit(0);
  }
};

// Run tests
runRedisTests();
