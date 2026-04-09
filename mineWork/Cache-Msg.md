
# Message Caching & Validation Architecture

## In-Flight Message Caching Strategy
### 1. **Real-time Message Cache**
**Location**: [messageCache.service.ts]
- **Structure**: Redis List with `message_cache:{chatId}:recent`
- **Algorithm**: LPUSH + LTRIM (LRU simulation)
- **Capacity**: 50 most recent messages
- **TTL**: 1 hour
- **Order**: Newest messages at front, oldest removed via LTRIM

```typescript
await redis.lpush(key, JSON.stringify(message));  // Add newest
await redis.ltrim(key, 0, CACHE_LIMIT - 1);        // Keep only 50
```

### 2. **Message Deduplication System**
**Location**: [messageDeliveryOptimization.service.ts]
- **Dedupe Token**: SHA1 hash of message content + metadata
- **TTL**: 10 minutes for deduplication
- **States**: PENDING → COMPLETE (with messageId)

**Token Creation**:
```typescript
const base = `${scope}|${senderId}|${encryptedContent}|${contentIv}|${contentAuthTag}`;
return createHash('sha1').update(base).digest('hex');
```

### 3. **Pagination Cache with Versioning**
**Location**: [messagePaginationCache.service.ts]
- **Cache Key**: Includes conversationId, userId, version, limit, cursor, search hash
- **Version Bumping**: Invalidates all cached pages when new messages arrive
- **Pre-caching**: Automatically fetches next page during current request

## Message Age Validation & Ordering
### 1. **Database-Level Ordering**
**Primary Sort**: `ORDER BY created_at DESC` (newest first)
- **Cursor-based Pagination**: Uses `created_at` as cursor
- **Consistent Ordering**: Database ensures chronological integrity

### 2. **Cache Invalidation Strategy**
**Version-based Invalidation**:
```typescript
// New message → bump version → invalidate all cached pages
await redis.multi().incr(versionKey).expire(versionKey, TTL).exec();
```

### 3. **Message Retrieval Flow**
1. **Check Cache**: Look for cached page with current version
2. **Cache Miss**: Fetch from database with `created_at` ordering
3. **Cache Store**: Store with versioned key for 10 minutes
4. **Pre-fetch**: Automatically cache next page

## Offline Message Handling
### **Queue System**
**Location**: [offlineMessage.service.ts]
- **Structure**: Redis List with `offline_messages:{userId}`
- **Capacity**: 100 messages per user
- **TTL**: 7 days
- **Deduplication**: Prevents duplicate offline messages

```typescript
await redis.lpush(key, JSON.stringify(message));
await redis.ltrim(key, 0, OFFLINE_LIMIT - 1);
```

## Message Deletion & Cleanup
### 1. **Automatic Expiration**
- **Recent Messages**: 1 hour TTL
- **Pagination Cache**: 10 minutes TTL
- **Dedupe Tokens**: 10 minutes TTL
- **Offline Messages**: 7 days TTL

### 2. **Size-Based Cleanup**
- **LRU Simulation**: LTRIM maintains fixed sizes
- **Recent Messages**: Max 50 per conversation
- **Offline Messages**: Max 100 per user

### 3. **Version-Based Cleanup**
- **Global Invalidation**: New messages increment conversation version
- **Cascade Effect**: All cached pages for conversation become invalid
- **Immediate Effect**: Next request fetches fresh data

## Real-time Validation
### 1. **Message Ordering Validation**
- **Database Authority**: `created_at` timestamps are source of truth
- **Cursor Consistency**: Each page uses oldest message timestamp as next cursor
- **Search Integration**: Search results maintain chronological order

### 2. **Duplicate Prevention**
- **Content Hashing**: SHA1 prevents identical message duplicates
- **Client Message ID**: Optional client-side deduplication
- **Scope Isolation**: Deduplication scoped to conversation level

### 3. **Cache Coherency**
- **Write-Through**: New messages immediately update cache
- **Version Bumping**: Ensures cache consistency across all users
- **Pre-fetching**: Maintains cache warm for smooth scrolling

## Performance Optimizations
### 1. **Efficient Key Patterns**
- **Hierarchical**: `cache:messages:page:{conversationId}:{userId}:v{version}`
- **Hashed Queries**: SHA1 for search query caching
- **Normalized**: Consistent key generation

### 2. **Batch Operations**
- **Pipeline Commands**: Atomic Redis operations
- **Multi-transaction**: Version bump + expire in single operation
- **Bulk Pre-caching**: Next page fetched asynchronously


## LRU Simulation (What You're Using)
### **Message Cache**
- **Redis List with LPUSH + LTRIM**
- **How it works**: New messages added to front, oldest removed when limit reached
- **Behavior**: Approximates LRU but removes by position, not actual access time

```typescript
await redis.lpush(key, message);     // Add to front (most recent)
await redis.ltrim(key, 0, 49);       // Remove oldest 50+ items
```

### **Why It's LRU Simulation**
- **Pros**: Simple, fast O(1) operations
- **Cons**: Doesn't track actual access patterns
- **Reality**: Removes based on insertion order, not usage

## What You're NOT Using
### **True LRU**
- Would track access timestamps
- Remove the item that hasn't been accessed for longest time
- More complex, requires metadata storage

### **LFU (Least Frequently Used)**
- Would track access frequency/counters
- Remove least frequently accessed items
- Better for read-heavy workloads

### **Other Algorithms You Use**
#### **TTL-Based Expiration** (Time-based)
- Messages expire after fixed time (1 hour, 10 minutes, etc.)
- Independent of usage patterns

#### **Version-Based Invalidation** (Event-based)
- Cache invalidated when new messages arrive
- Proactive invalidation, not based on age/usage

## Summary

**You're primarily using LRU simulation** for size management, combined with:
- **TTL expiration** for time-based cleanup
- **Version invalidation** for data consistency

This hybrid approach is actually **well-suited for chat applications** where:
- Recent messages are most valuable (LRU simulation works well)
- Time-based expiration prevents stale data
- Version invalidation ensures real-time consistency
