# Cache Architecture Analysis

## Overview
Your Byte-Chat application uses a comprehensive multi-layered caching strategy primarily built on Redis, with both backend and frontend caching mechanisms.

## Backend Caching Implementation

### Core Cache Infrastructure
- **Base Utility**: `cache.util.ts` provides the foundation with JSON serialization/deserialization
- **Metrics**: Built-in hit/miss tracking with periodic logging every 5 minutes
- **TTL Management**: Different TTL values for different data types (30min for profiles, 15min for conversations)

### Caching Categories & Algorithms

#### 1. **Authentication & Session Cache**
- **Token Validation**: SHA256-hashed tokens with 5-minute TTL
- **Blacklist Mechanism**: Immediate invalidation with configurable TTL
- **Permission Cache**: 3-minute TTL with database fallback
- **Session Storage**: 7-day TTL using Redis Hash structures

#### 2. **User Profile Cache**
- **Profile Data**: 30-minute TTL with roll number lookup
- **Invalidation**: Targeted cache clearing on profile updates
- **Algorithm**: Simple key-value with manual invalidation

#### 3. **Messaging Cache**
- **Recent Messages**: Redis List with LPUSH/LTRIM (LRU-style, max 50 messages)
- **Pagination Cache**: Versioned cache keys with SHA1 query hashing
- **Cache Invalidation**: Version bumping strategy for conversation-level invalidation

#### 4. **Presence & Real-time Cache**
- **Online Users**: Redis Set for O(1) membership checks
- **Typing Indicators**: 5-second TTL with auto-expiration
- **Socket Routing**: Bidirectional mapping using Sets and simple keys

#### 5. **Block Management Cache**
- **Block Lists**: JSON cache with 10-minute TTL
- **Block Sets**: Redis Set with marker-based validation
- **Pair Status**: Sorted key naming for consistent lookups

## Frontend Caching Implementation

### Request Deduplication
- **In-flight Request Caching**: Map-based deduplication for identical GET requests
- **Namespace Isolation**: Separate caches for different API sections
- **Auto-cleanup**: Automatic removal after request completion
- **Stale Prevention**: Prevents multiple identical requests during same timeframe

## Data Retrieval Patterns

### Backend Retrieval
1. **Cache-Aside Pattern**: Check cache → Database fallback → Cache populate
2. **Write-Through**: Immediate cache updates on data changes
3. **Version-Based Invalidation**: Incremental version numbers for bulk invalidation
4. **Fail-Open Strategy**: Cache failures don't block API responses

### Frontend Retrieval
1. **Deduped GET Requests**: Prevents duplicate network calls
2. **Cache Invalidation**: Manual cache clearing on mutations
3. **Namespace-based Isolation**: Separate caches per API domain

## Cache Discard Mechanisms

### TTL-Based Expiration
- **Short TTL**: Typing indicators (5s), permissions (3min)
- **Medium TTL**: Messages (10min), blocks (10-30min)
- **Long TTL**: Profiles (30min), sessions (7 days)

### Manual Invalidation
- **Targeted Deletion**: Specific key removal on updates
- **Version Bumping**: Incremental invalidation for related caches
- **Namespace Clearing**: Bulk frontend cache invalidation

### Algorithmic Approaches
1. **LRU Simulation**: Message lists with LTRIM for size limits
2. **Hash-Based Keys**: Consistent key generation for query caching
3. **Set Operations**: Efficient membership testing for presence/blocking
4. **Versioning**: Conversation-level cache invalidation

## Underlying Algorithms

### Cache Key Strategies
- **Hierarchical Naming**: `cache:type:subtype:identifier`
- **Hash Sharding**: SHA256 for tokens, SHA1 for queries
- **Normalization**: Lowercase, trimmed query strings

### Performance Optimizations
- **Pipeline Operations**: Redis multi-commands for atomicity
- **SCAN Operations**: Efficient key iteration for typing indicators
- **Batch Operations**: Multiple cache operations in single transactions

### Metrics & Monitoring
- **Hit Rate Tracking**: Per-metric hit/miss/error counting
- **Memory Monitoring**: Redis memory usage and key count
- **Performance Logging**: Periodic cache health reporting
