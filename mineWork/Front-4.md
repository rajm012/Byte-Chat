# Byte-Chat Performance Optimization Guide

**Current State:**
- Solid foundation with Redis caching, E2EE, Socket.IO
- Good database connection pooling
- Request deduplication implemented
- Skeleton loaders recently added

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- API Response Time (p95): < 200ms
- Bundle Size: < 200KB (initial)

## 1. Database Optimizations

### 1.1 Add Database Indexes

Your conversation query in `conversation.service.ts` is complex with multiple JOINs. Add these indexes:

```sql
-- For conversation lookups
CREATE INDEX CONCURRENTLY idx_chat_conversations_user1_user2 
ON chat_conversations(user1_id, user2_id) 
WHERE anonymous_initiator_id IS NULL;

-- For message ordering
CREATE INDEX CONCURRENTLY idx_chat_messages_conversation_created 
ON chat_messages(conversation_id, created_at DESC);

-- For unread count queries
CREATE INDEX CONCURRENTLY idx_message_status_user_unread 
ON message_status(user_id, status) 
WHERE status != 'read';

-- For group member lookups
CREATE INDEX CONCURRENTLY idx_group_members_user_id 
ON group_members(user_id);

-- For last message queries (LATERAL JOIN optimization)
CREATE INDEX CONCURRENTLY idx_chat_messages_conversation_created_desc 
ON chat_messages(conversation_id, created_at DESC NULLS LAST);
```

### 1.2 Query Optimization

**Current Issue:** The conversation query uses LATERAL JOIN which can be slow with many conversations.

**Optimized Query Pattern:**

```typescript
// Instead of fetching all conversations with LATERAL JOIN
// Use a two-query approach for better performance

// Query 1: Get conversation list (simpler, faster)
const conversationsResult = await pool.query(
  `SELECT 
    cc.conversation_id,
    CASE WHEN cc.user1_id = $1 THEN u2.user_id ELSE u1.user_id END as other_user_id,
    CASE WHEN cc.user1_id = $1 THEN u2.name ELSE u1.name END as other_user_name,
    CASE WHEN cc.user1_id = $1 THEN u2.dp_url ELSE u1.dp_url END as other_user_dp,
    cc.last_message_at,
    cc.unread_count
  FROM chat_conversations cc
  LEFT JOIN users u1 ON cc.user1_id = u1.user_id
  LEFT JOIN users u2 ON cc.user2_id = u2.user_id
  WHERE (cc.user1_id = $1 OR cc.user2_id = $1)
    AND cc.is_blocked = false
    AND (cc.is_anonymous = false OR cc.is_anonymous IS NULL)
  ORDER BY cc.last_message_at DESC
  LIMIT 50`, // Add pagination
  [userId]
);

// Query 2: Batch fetch last messages for all conversations
const conversationIds = conversationsResult.rows.map(r => r.conversation_id);
const lastMessagesResult = await pool.query(
  `SELECT DISTINCT ON (conversation_id)
    conversation_id,
    encrypted_content as last_message_preview,
    message_type as last_message_type,
    created_at as last_message_time
  FROM chat_messages
  WHERE conversation_id = ANY($1)
  ORDER BY conversation_id, created_at DESC`,
  [conversationIds]
);
```

### 1.3 Connection Pool Tuning

**Current:** `max: 50` connections

**Optimized based on your traffic:**

```typescript
// backend/src/lib/db.ts
export const pool = new Pool({
  connectionString: config.database.url,
  max: 20,                    // Reduce - Supabase has connection limits
  min: 5,                     // Keep warm connections
  idleTimeoutMillis: 60000,    // Increase for less churn
  connectionTimeoutMillis: 5000,
  acquireTimeoutMillis: 8000,
  statement_timeout: 30000,    // Cancel slow queries
  query_timeout: 30000,
  ssl: {
    rejectUnauthorized: false
  }
});
```

### 1.4 Add Query Result Caching at DB Level

```typescript
// backend/src/lib/db.ts
const queryCache = new Map<string, { data: any; expiry: number }>();

export async function cachedQuery<T extends pg.QueryResultRow = any>(
  text: string, 
  params?: any[], 
  ttlSeconds: number = 30
): Promise<pg.QueryResult<T>> {
  const cacheKey = `${text}_${JSON.stringify(params)}`;
  const cached = queryCache.get(cacheKey);
  
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  
  const result = await query<T>(text, params);
  
  // Cache only SELECT queries
  if (text.trim().toLowerCase().startsWith('select')) {
    queryCache.set(cacheKey, {
      data: result,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  return result;
}
```

---

## 2. Backend API Optimizations

### 2.1 Implement Request Batching

**Problem:** Multiple separate API calls from frontend

**Solution:** Create batch endpoint

```typescript
// backend/src/routes/batch.routes.ts
import { Router } from 'express';

const router = Router();

router.post('/batch', async (req, res) => {
  const { requests } = req.body; // [{ endpoint, method, body }]
  
  const results = await Promise.all(
    requests.map(async (reqConfig: any) => {
      try {
        // Route to appropriate handler
        const result = await handleBatchRequest(reqConfig, req.user);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    })
  );
  
  res.json({ results });
});

// Frontend usage
const batchResponse = await fetch('/api/batch', {
  method: 'POST',
  body: JSON.stringify({
    requests: [
      { endpoint: '/api/chat/conversations', method: 'GET' },
      { endpoint: '/api/profile/me', method: 'GET' },
      { endpoint: '/api/notifications/unread', method: 'GET' }
    ]
  })
});
```

### 2.2 Add Compression for Large Responses

You already have compression, but optimize settings:

```typescript
// backend/src/index.ts
app.use(compression({
  filter: (req, res) => {
    const type = res.getHeader('Content-Type');
    if (typeof type === 'string' && (
      type.startsWith('image/') ||
      type.startsWith('audio/') ||
      type.startsWith('video/') ||
      type.includes('json') && res.getHeader('Content-Length') && 
        Number(res.getHeader('Content-Length')) < 1024 // Skip small JSON
    )) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balance between CPU and size
  threshold: 1024 // Only compress > 1KB
}));
```

### 2.3 Optimize Message Pagination

**Current:** Loading all messages

**Optimized:** Cursor-based pagination

```typescript
// backend/src/services/chat/message.service.ts
export async function getMessagesPaginated(
  conversationId: string, 
  cursor?: string, 
  limit: number = 50
) {
  const query = cursor 
    ? `SELECT * FROM chat_messages 
       WHERE conversation_id = $1 
       AND created_at < (SELECT created_at FROM chat_messages WHERE message_id = $2)
       ORDER BY created_at DESC 
       LIMIT $3`
    : `SELECT * FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`;
       
  const params = cursor 
    ? [conversationId, cursor, limit + 1] // +1 to check for more
    : [conversationId, limit + 1];
    
  const result = await pool.query(query, params);
  
  const hasMore = result.rows.length > limit;
  const messages = hasMore ? result.rows.slice(0, limit) : result.rows;
  
  return {
    messages,
    nextCursor: hasMore ? messages[messages.length - 1].message_id : null,
    hasMore
  };
}
```

### 2.4 Add API Response Caching Headers

```typescript
// backend/src/utils/cacheHeaders.ts
export function setCacheHeaders(
  res: Response, 
  options: {
    public?: boolean;
    maxAge?: number;
    staleWhileRevalidate?: number;
    etag?: string;
  }
) {
  const { public: isPublic, maxAge = 0, staleWhileRevalidate = 0, etag } = options;
  
  const directives = [isPublic ? 'public' : 'private'];
  
  if (maxAge > 0) {
    directives.push(`max-age=${maxAge}`);
  }
  
  if (staleWhileRevalidate > 0) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }
  
  res.setHeader('Cache-Control', directives.join(', '));
  
  if (etag) {
    res.setHeader('ETag', etag);
  }
}

// Usage in routes
// GET /api/users/profile/:id - cache for 5 minutes
setCacheHeaders(res, {
  public: false,
  maxAge: 300,
  staleWhileRevalidate: 600
});
```

---

## 3. Caching Strategies

### 3.1 Multi-Layer Caching Architecture

```
┌─────────────────┐
│   Browser Cache │  ← Cache-Control headers
├─────────────────┤
│   CDN Cache     │  ← Cloudflare/Vercel Edge
├─────────────────┤
│   Redis Cache   │  ← Application data
├─────────────────┤
│   DB Query Cache│  ← Prepared statements
└─────────────────┘
```

### 3.2 Optimize Redis Cache Patterns

**Current TTLs (from cache.util.ts):**
- USER_PROFILE: 30 min
- USER_SETTINGS: 30 min
- USER_CONVERSATIONS: 15 min

**Optimized TTLs based on data volatility:**

```typescript
// backend/src/utils/cache.util.ts
export const CACHE_TTL_SECONDS = {
  // User data - changes rarely
  USER_PROFILE: 60 * 60,        // 1 hour
  USER_SETTINGS: 30 * 60,        // 30 min
  USER_PUBLIC_KEYS: 60 * 60,     // 1 hour
  
  // Conversations - change frequently
  USER_CONVERSATIONS: 60,        // 1 minute (short for freshness)
  CONVERSATION_DETAIL: 5 * 60,    // 5 minutes
  
  // Messages - append-only, cache recent
  RECENT_MESSAGES: 2 * 60,       // 2 minutes
  MESSAGE_THREAD: 5 * 60,        // 5 minutes
  
  // Groups - moderate change
  GROUP_INFO: 10 * 60,           // 10 minutes
  GROUP_MEMBERS: 5 * 60,         // 5 minutes
  
  // System/static data - long cache
  APP_CONFIG: 60 * 60 * 24,      // 24 hours
  EMOJI_DATA: 60 * 60 * 24,      // 24 hours
} as const;
```

### 3.3 Add Cache Warming Strategy

```typescript
// backend/src/services/cacheWarmer.service.ts
export class CacheWarmer {
  static async warmUserConversations(userId: string) {
    // Pre-fetch and cache conversations on login
    const conversations = await fetchRegularConversationsFromDb(userId);
    await setCacheJSON(
      cacheKeys.userConversations(userId),
      conversations,
      CACHE_TTL_SECONDS.USER_CONVERSATIONS
    );
  }
  
  static async warmUserProfile(userId: string) {
    const profile = await getUserProfileFromDb(userId);
    await setCacheJSON(
      cacheKeys.userProfile(userId),
      profile,
      CACHE_TTL_SECONDS.USER_PROFILE
    );
  }
}

// Call on login
// auth.controller.ts
await CacheWarmer.warmUserConversations(userId);
await CacheWarmer.warmUserProfile(userId);
```

### 3.4 Implement Cache-Aside with Stale-While-Revalidate

```typescript
// backend/src/utils/smartCache.ts
export async function getWithStaleWhileRevalidate<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    freshTtl: number;    // Time before stale
    staleTtl: number;    // Total cache time
  }
): Promise<T> {
  const cached = await redis.get(key);
  
  if (cached) {
    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed._cachedAt;
    
    // If fresh, return immediately
    if (age < options.freshTtl * 1000) {
      return parsed.data;
    }
    
    // If stale but not expired, return and refresh in background
    if (age < options.staleTtl * 1000) {
      // Trigger background refresh
      fetchFn().then(freshData => {
        redis.set(key, JSON.stringify({
          data: freshData,
          _cachedAt: Date.now()
        }), 'EX', options.staleTtl);
      }).catch(() => {});
      
      return parsed.data;
    }
  }
  
  // Cache miss or expired - fetch and cache
  const data = await fetchFn();
  await redis.set(key, JSON.stringify({
    data,
    _cachedAt: Date.now()
  }), 'EX', options.staleTtl);
  
  return data;
}
```

---

## 4. Frontend Rendering Optimizations

### 4.1 Code Split Heavy Components

```typescript
// frontend/src/app/chat/page.tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const EmojiPicker = lazy(() => import('@/components/EmojiPicker'));
const MessageBubble = lazy(() => import('@/components/MessageBubble'));
const ImageViewer = lazy(() => import('@/components/ImageViewer'));

// Usage with skeleton fallback
<Suspense fallback={<MessageBubbleSkeleton />}>
  <MessageBubble message={message} />
</Suspense>
```

### 4.2 Virtualize Long Lists

```typescript
// frontend/src/components/VirtualizedMessageList.tsx
import { FixedSizeList as List } from 'react-window';
import { useMemo } from 'react';

export function VirtualizedMessageList({ messages }: { messages: Message[] }) {
  const itemHeight = 80; // Average message height
  const listHeight = Math.min(messages.length * itemHeight, 600);
  
  const Row = useMemo(() => ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <MessageBubble message={messages[index]} />
    </div>
  ), [messages]);
  
  if (messages.length > 100) {
    return (
      <List
        height={listHeight}
        itemCount={messages.length}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </List>
    );
  }
  
  // For short lists, render normally
  return messages.map(m => <MessageBubble key={m.message_id} message={m} />);
}
```

### 4.3 Optimize Re-renders with React.memo

```typescript
// frontend/src/components/ConversationItem.tsx
import { memo, useCallback } from 'react';

export const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  unreadCount
}: ConversationItemProps) {
  const handleClick = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);
  
  return (
    <div 
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
        isSelected ? "bg-primary-container" : "hover:bg-surface-container-high"
      )}
    >
      <Avatar src={conversation.other_user_dp} name={conversation.other_user_name} />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{conversation.other_user_name}</p>
        <p className="text-sm text-on-surface-variant truncate">
          {conversation.last_message_preview}
        </p>
      </div>
      {unreadCount > 0 && (
        <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}, (prev, next) => {
  // Custom comparison - only re-render if these change
  return (
    prev.conversation.conversation_id === next.conversation.conversation_id &&
    prev.isSelected === next.isSelected &&
    prev.unreadCount === next.unreadCount &&
    prev.conversation.last_message_at === next.conversation.last_message_at
  );
});
```

### 4.4 Use useDeferredValue for Search

```typescript
// frontend/src/app/dashboard/page.tsx
import { useDeferredValue, useMemo } from 'react';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  
  // Defer search to avoid blocking UI
  const deferredQuery = useDeferredValue(searchQuery);
  
  const filteredUsers = useMemo(() => {
    if (!deferredQuery) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      u.roll_no?.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [users, deferredQuery]);
  
  // Show skeleton while deferred value catches up
  const isSearching = searchQuery !== deferredQuery;
  
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {isSearching ? (
        <SearchResultsSkeleton />
      ) : (
        <UserGrid users={filteredUsers} />
      )}
    </div>
  );
}
```

### 4.5 Implement Intersection Observer for Lazy Loading

```typescript
// frontend/src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);
  
  return { ref: elementRef, isIntersecting, hasIntersected };
}

// Usage for lazy loading conversation items
function ConversationItem({ conversation }: { conversation: Conversation }) {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={ref}>
      {hasIntersected ? (
        <FullConversationItem conversation={conversation} />
      ) : (
        <ConversationItemSkeleton />
      )}
    </div>
  );
}
```

---


## 6. Bundle Optimization

### 6.1 Analyze Bundle Size

```bash
# Install bundle analyzer
cd frontend
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 6.2 Tree Shake Dependencies

```typescript
// frontend/src/lib/emoji.ts
// Instead of importing entire emoji library
import data from 'emoji-picker-react/dist/data/emojis-en.js';

// Use dynamic import for emoji picker
export async function getEmojiData() {
  if (typeof window === 'undefined') return null;
  const { default: data } = await import('emoji-picker-react/dist/data/emojis-en.js');
  return data;
}
```

### 6.3 Optimize Crypto Imports

```typescript
// Instead of importing all of crypto-js
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// Or use native Web Crypto API (already used in your codebase - good!)
```

### 6.4 Split Vendor Chunks

```typescript
// frontend/next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lodash',
      'date-fns',
      'emoji-picker-react',
    ],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};
```

---

## 7. Network Optimizations

### 7.1 Implement Request Deduplication

You already have this in `request-dedupe.service.ts` - ensure all GET requests use it:

```typescript
// frontend/src/services/chat.service.ts
export const chatService = {
  // All GET requests should use dedupedGet
  async getConversations(): Promise<Conversation[]> {
    const response = await dedupedGet<{
      data: Conversation[];
    }>(api, `${CHAT_PREFIX}/conversations`, undefined, { 
      namespace: CHAT_GET_DEDUPE_NAMESPACE 
    });
    return response.data.data;
  },
  
  // Add prefetch for common routes
  prefetchConversations() {
    // Start loading before component mounts
    return dedupedGet(api, `${CHAT_PREFIX}/conversations`, undefined, { 
      namespace: CHAT_GET_DEDUPE_NAMESPACE 
    });
  }
};
```

### 7.2 Add Service Worker for Offline Support

```typescript
// frontend/public/sw.js
const CACHE_NAME = 'bytechat-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/static/fonts/inter.woff2',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API requests
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch new
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache new static assets
        if (fetchResponse.ok && 
            (fetchResponse.headers.get('content-type')?.includes('image') ||
             fetchResponse.headers.get('content-type')?.includes('font'))) {
          const cacheCopy = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return fetchResponse;
      });
    })
  );
});
```

### 7.3 Preconnect to Critical Origins

```html
<!-- frontend/src/app/layout.tsx -->
<head>
  {/* Preconnect to API and image domains */}
  <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
  <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
  
  {/* DNS prefetch for non-critical */}
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
</head>
```

### 7.4 Implement Request Queuing

```typescript
// frontend/src/services/requestQueue.ts
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = false;
  private concurrency = 3; // Max parallel requests
  private active = 0;
  
  async add<T>(fn: () => Promise<T>, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        try {
          this.active++;
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.active--;
          this.process();
        }
      };
      
      // Add to front for high priority
      if (priority === 'high') {
        this.queue.unshift(task);
      } else {
        this.queue.push(task);
      }
      
      this.process();
    });
  }
  
  private process() {
    if (this.running || this.active >= this.concurrency) return;
    
    const task = this.queue.shift();
    if (!task) {
      this.running = false;
      return;
    }
    
    this.running = true;
    task();
    
    // Process next if capacity available
    if (this.active < this.concurrency && this.queue.length > 0) {
      setTimeout(() => this.process(), 0);
    }
  }
}

export const requestQueue = new RequestQueue();
```

---

## 8. Socket.IO Optimizations

### 8.1 Implement Connection Pooling

```typescript
// frontend/src/contexts/SocketContext.tsx
import { useEffect, useRef, useCallback } from 'react';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'], // Prefer WebSocket
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      
      // Auth on connect
      auth: {
        token: getAuthToken(),
      },
    });
    
    socket.on('connect', () => {
      reconnectAttempts.current = 0;
    });
    
    socket.on('connect_error', () => {
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        socket.disconnect();
        // Fall back to polling mode
        showOfflineModeNotification();
      }
    });
    
    socketRef.current = socket;
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  
  return socketRef.current;
}
```

### 8.2 Batch Socket Events

```typescript
// frontend/src/hooks/useBatchedSocket.ts
import { useRef, useEffect } from 'react';

export function useBatchedSocket(event: string, handler: (data: any) => void, delay: number = 50) {
  const batchedData = useRef<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const batchedHandler = useCallback((data: any) => {
    batchedData.current.push(data);
    
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        handler(batchedData.current);
        batchedData.current = [];
        timeoutRef.current = null;
      }, delay);
    }
  }, [handler, delay]);
  
  useEffect(() => {
    socket.on(event, batchedHandler);
    return () => {
      socket.off(event, batchedHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [event, batchedHandler]);
}

// Usage for message batching
useBatchedSocket('new-message', (messages) => {
  // Process multiple messages at once
  setMsgs(prev => [...prev, ...messages]);
}, 100);
```
