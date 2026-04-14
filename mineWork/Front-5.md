# Byte-Chat Performance Quick

### 1. Add Database Indexes (10 min)

Run these SQL commands on your Supabase database:

```sql
-- 1. Conversation lookups (BIGGEST IMPACT)
CREATE INDEX CONCURRENTLY idx_chat_conversations_users 
ON chat_conversations(user1_id, user2_id) 
WHERE anonymous_initiator_id IS NULL;

-- 2. Message ordering
CREATE INDEX CONCURRENTLY idx_messages_conversation_time 
ON chat_messages(conversation_id, created_at DESC);

-- 3. Unread counts
CREATE INDEX CONCURRENTLY idx_message_status_unread 
ON message_status(user_id, status) 
WHERE status != 'read';

-- 4. Group memberships
CREATE INDEX CONCURRENTLY idx_group_members_user 
ON group_members(user_id);
```

**Expected:** API response times drop 60-80%

---

### 2. Fix Image Loading (5 min)

Update `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'], // Add modern formats
  minimumCacheTTL: 86400, // Cache for 24h
  deviceSizes: [640, 750, 828, 1080, 1200],
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
    { protocol: 'https', hostname: 'ui-avatars.com' },
    { protocol: 'https', hostname: 'api.dicebear.com' },
  ],
}
```

**Expected:** 40-60% smaller image sizes

---

### 3. Optimize Cache TTLs (5 min)

Update `backend/src/utils/cache.util.ts`:

```typescript
export const CACHE_TTL_SECONDS = {
  USER_PROFILE: 60 * 60,        // 1 hour (was 30 min)
  USER_SETTINGS: 30 * 60,        // 30 min
  USER_CONVERSATIONS: 60,       // 1 min (freshness critical)
  RECENT_MESSAGES: 2 * 60,      // 2 min
  GROUP_INFO: 10 * 60,          // 10 min
};
```

**Expected:** 50% reduction in database queries

---

### 4. Enable Bundle Analysis (5 min)

```bash
cd frontend
npm install --save-dev @next/bundle-analyzer
```

Update `next.config.ts`:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

Run:
```bash
ANALYZE=true npm run build
```

**Expected:** Identify 100-200KB of unnecessary code

---

### 5. Add Preconnect Headers (2 min)

Update `frontend/src/app/layout.tsx`:

```tsx
<head>
  <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
  <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
</head>
```

**Expected:** 100-200ms faster initial load

---
