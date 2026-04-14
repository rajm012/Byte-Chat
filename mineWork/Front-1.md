# Byte-Chat Frontend Improvements Guide

## 2. Performance Optimizations

### A. Image Loading Strategy

**Current Issues**:
- No blur placeholders in most images
- Missing `priority` attribute for above-fold images
- No lazy loading boundaries

**Improvements**:

1. **Dashboard User Cards** - Add blur placeholders + priority
```tsx
<Image
  src={user.dp_url}
  alt={user.name}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  priority={index < 6} // Above-fold images
  placeholder="blur"
  blurDataURL={`data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23e0f2fe'/%3E%3Cstop offset='100%25' stop-color='%23bae6fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23g)'/%3E%3C/svg%3E`}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
/>
```

2. **Message Images** - Already has lazy loading (good!)
3. **Group Avatars** - Add similar treatment

### B. Code Splitting Opportunities

**Current**: All emoji picker functionality bundled in main chunks
**Improvement**: Dynamic imports already used, but can be optimized

```tsx
// Already done well:
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { 
  ssr: false,
  loading: () => <div className="w-80 h-96 bg-surface-container animate-pulse rounded-xl" />
});
```

**Additional splits needed**:
- Moderation components (heavy)
- Profile image manager
- Notification center details view

### C. Bundle Analysis

Run bundle analysis to find heavy dependencies:
```bash
cd frontend
ANALYZE=true npm run build
```

**Expected heavy dependencies**:
- `emoji-picker-react` (~200KB) - Already dynamically imported ✓
- `qrcode` - Only needed in specific pages
- `react-image-crop` - Only needed in profile edit

---

## 3. Data Fetching Optimizations

### A. React Query / SWR Integration

**Current**: Manual `useEffect` + `useState` for all data fetching
**Improvement**: Use SWR for automatic caching, revalidation, and stale-while-revalidate

**Installation**:
```bash
npm install swr
```

**Example Implementation**:
```tsx
// hooks/useUsers.ts
import useSWR from 'swr';

export function useUsers() {
  const { data, error, isLoading } = useSWR(
    '/api/profile/all',
    async (url) => {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    {
      refreshInterval: 30000, // Revalidate every 30s
      dedupingInterval: 2000, // Dedupe requests within 2s
      revalidateOnFocus: false,
    }
  );

  return {
    users: data?.data?.users || [],
    isLoading,
    error,
  };
}

// Usage in Dashboard:
const { users, isLoading } = useUsers();
// isLoading is true only on first fetch, false when cached data available
```

**Benefits**:
- Instant UI from cache while fresh data loads
- Automatic deduplication of concurrent requests
- Background revalidation
- Optimistic updates for mutations

### B. Infinite Scroll for Messages

**Current**: Loads all messages at once
**Improvement**: Paginated loading with intersection observer

```tsx
// hooks/useMessages.ts
export function useMessages(conversationId: string) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/api/chat/messages/${conversationId}?page=${pageIndex + 1}&limit=50`;
    },
    fetcher,
    {
      revalidateFirstPage: false,
    }
  );

  return {
    messages: data?.flat() || [],
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
  };
}
```

---

## 4. UX Enhancements

### A. Optimistic UI Updates

**Current**: Wait for API response before updating UI
**Improvement**: Update UI immediately, roll back on error

**Example - Sending Message**:
```tsx
const handleSendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;
  const optimisticMessage = {
    message_id: tempId,
    encrypted_content: content,
    created_at: new Date(),
    is_my_message: true,
    status: 'sending',
  };

  // 1. Optimistically add to UI
  setMessages(prev => [...prev, optimisticMessage]);

  try {
    const response = await sendMessageAPI(content);
    
    // 2. Replace temp with real message
    setMessages(prev => 
      prev.map(m => m.message_id === tempId ? response.data : m)
    );
  } catch (error) {
    // 3. Mark as failed, allow retry
    setMessages(prev =>
      prev.map(m => m.message_id === tempId ? { ...m, status: 'failed' } : m)
    );
    toast.error('Failed to send');
  }
};
```

### B. Typing Indicators Enhancement

**Current**: Simple "typing" text
**Improvement**: Animated dots + avatar

```tsx
function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 p-3">
      {users.slice(0, 3).map((user, i) => (
        <div 
          key={user}
          className="w-6 h-6 rounded-full bg-surface-container-high animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
```

### C. Message Read Receipts

**Current**: No visual indication
**Improvement**: Checkmarks like WhatsApp

```tsx
function MessageStatus({ status, readAt }: { status: string; readAt?: Date }) {
  return (
    <span className="flex items-center gap-0.5">
      {status === 'sent' && <SingleCheck />}
      {status === 'delivered' && <DoubleCheck />}
      {status === 'read' && <DoubleCheck color="var(--primary)" />}
    </span>
  );
}
```

---

## 5. Component Structure Improvements

### A. Extract Reusable Components

**Current**: Inline JSX for repeated patterns
**Improvement**: Create component library

**Components to Extract**:

1. **UserCard** - Used in dashboard, search results
```tsx
interface UserCardProps {
  user: User;
  onChat: (anonymous: boolean) => void;
  index: number; // For staggered animation
}
```

2. **GroupCard** - Used in dashboard, my-groups
```tsx
interface GroupCardProps {
  group: Group;
  onJoin?: () => void;
  isMember?: boolean;
}
```

3. **ChatHeader** - Used in all chat pages
```tsx
interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}
```

4. **MessageInput** - Unified input component
```tsx
interface MessageInputProps {
  onSend: (content: string, image?: File) => void;
  replyingTo?: Message | null;
  onCancelReply: () => void;
  disabled?: boolean;
}
```

### B. Custom Hooks Extraction

**Current**: Logic mixed in components
**Improvement**: Extract reusable hooks

```tsx
// hooks/useChat.ts - Unified chat logic
export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const { socket } = useSocket();

  // Message loading
  // E2EE key management
  // Socket event handling
  // Send message with optimistic update
  
  return {
    messages,
    sessionKey,
    sendMessage,
    loading,
    error,
  };
}

// hooks/useE2EE.ts - E2EE operations
export function useE2EE() {
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  
  const decrypt = useCallback(async (message: Message) => {
    if (!sessionKey) return message;
    // Decryption logic
  }, [sessionKey]);

  return { sessionKey, decrypt, initializeKey };
}
```

---

## 6. Implementation Priority

### Phase 2: Data Fetching (Week 1)
1. Install and configure SWR
2. Migrate dashboard to SWR
3. Migrate chat conversations to SWR
4. Add infinite scroll for messages

**Estimated Time**: 8-10 hours
**Impact**: High - Real performance gains + better UX

### Phase 3: Image Optimization (Week 2)
1. Add blur placeholders to all images
2. Configure priority loading
3. Optimize image sizes prop
4. Add CDN image optimization

**Estimated Time**: 4-5 hours
**Impact**: Medium - Faster LCP, better Lighthouse scores

### Phase 4: Component Refactoring (Ongoing)
1. Extract UserCard component
2. Extract GroupCard component
3. Extract ChatHeader component
4. Extract MessageInput component
5. Create useChat and useE2EE hooks


## 7. Testing Skeleton Loaders

### Visual Regression Testing
```bash
# Capture screenshots with skeletons
npm run test:visual:skeletons
```

### Performance Testing
```bash
# Measure perceived load time
npm run test:lighthouse
# Target: < 1.5s LCP with skeleton visible
```

### User Testing Checklist
- [ ] Skeleton appears immediately (< 100ms)
- [ ] Layout doesn't shift when content loads
- [ ] Animation is smooth, not jarring
- [ ] Dark mode skeletons look correct
- [ ] Reduced motion preference respected


## 8. Accessibility Considerations

### Reduced Motion Support
```tsx
export function Skeleton({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <div 
      className={`bg-surface-container-high ${className}`}
      aria-hidden="true"
    >
      {!prefersReducedMotion && <ShimmerOverlay />}
    </div>
  );
}
```

### Screen Reader Support
- Add `aria-hidden="true"` to all skeleton elements
- Use `aria-busy="true"` on parent containers
- Announce when content is loaded

---

