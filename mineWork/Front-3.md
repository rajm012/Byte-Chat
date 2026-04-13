# Skeleton Integration Examples

This document shows exactly how to integrate skeleton loaders into your existing pages.

---

## 1. Dashboard Page Integration

### Current Code (lines 293-302 in dashboard/page.tsx)

```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-mesh-warm flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p className="text-sm font-medium text-on-surface-variant">Loading campus…</p>
      </div>
    </div>
  );
}
```

### New Code with Skeleton

```tsx
import { DashboardPageSkeleton } from '@/components/skeletons';

if (loading) {
  return (
    <div className="min-h-screen bg-mesh-warm antialiased pb-28">
      {/* Fixed blobs - keep for visual consistency */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-linear-to-br from-primary-container/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-linear-to-br from-tertiary-container/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      {/* Header - keep navigation visible */}
      <header className="glass-nav fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-black text-on-surface tracking-tight">
              Byte<span className="text-primary">chat</span>
            </span>
          </Link>
          
          {/* Keep search bar visible but disabled */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Search batchmates..."
                disabled
                className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none text-sm text-on-surface opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
          
          {/* Keep user actions visible */}
          <div className="flex items-center gap-2">
            {/* Profile avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
          </div>
        </div>
      </header>
      
      {/* Skeleton Content */}
      <DashboardPageSkeleton />
    </div>
  );
}
```

---

## 2. Chat Page Integration

### For Chat List Loading (lines 400-450 area in chat/page.tsx)

Add a skeleton state for when conversations are loading:

```tsx
import { ConversationListSkeleton, ChatMessagesSkeleton, ChatHeaderSkeleton, MessageInputSkeleton } from '@/components/skeletons';

// In your component, add a state for list loading:
const [conversationsLoading, setConversationsLoading] = useState(true);

// During render:
{conversationsLoading ? (
  <ConversationListSkeleton />
) : (
  <div className="space-y-1">
    {conversations.map(conv => (
      <ConversationItem key={conv.id} data={conv} />
    ))}
  </div>
)}
```

### For Message Loading (when selecting a conversation)

```tsx
const [messagesLoading, setMessagesLoading] = useState(false);

// When selecting conversation:
const handleSelectConversation = async (conv) => {
  setSelectedConversation(conv);
  setMessagesLoading(true);
  
  try {
    const msgs = await loadMessages(conv.id);
    setMessages(msgs);
  } finally {
    setMessagesLoading(false);
  }
};

// In render:
{messagesLoading ? (
  <>
    <ChatHeaderSkeleton />
    <ChatMessagesSkeleton />
    <MessageInputSkeleton />
  </>
) : (
  <>
    <ChatHeader conversation={selectedConversation} />
    <MessageList messages={messages} />
    <MessageInput onSend={handleSend} />
  </>
)}
```

---

## 3. My Groups Page Integration

### Current Code (lines 411-421 in my-groups/page.tsx)

```tsx
if (loading) {
  return (
    <div className={`min-h-screen bg-[#e2fffe] flex items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-[#002020] dark:text-[#87ceeb] min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-[#87ceeb] dark:border-[#0c6780] border-t-transparent mx-auto mb-4 animate-spin" />
          <p className="text-sm text-[#0c6780] dark:text-[#87ceeb]">Loading groups…</p>
        </div>
      </div>
    </div>
  );
}
```

### New Code with Skeleton

```tsx
import { GroupListSkeleton, GroupChatHeaderSkeleton } from '@/components/skeletons';

if (loading) {
  return (
    <div className={`min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen">
        <div className="fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50">
            
            {/* Sidebar with skeleton */}
            <aside className="w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb]">Groups</h1>
                  <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse" />
                </div>
                
                {/* Search placeholder */}
                <div className="relative mb-4">
                  <div className="w-full bg-white dark:bg-[#004040] rounded-full py-2.5 pl-10 pr-4 h-10 animate-pulse" />
                </div>
                
                {/* Create button placeholder */}
                <div className="w-full py-3 px-4 rounded-xl h-11 bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 animate-pulse" />
              </div>
              
              {/* Group list skeleton */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <GroupListSkeleton />
              </div>
            </aside>
            
            {/* Main area with skeleton */}
            <main className="hidden md:flex flex-1 flex-col bg-white/50 dark:bg-[#003535]/30 min-h-0">
              <GroupChatHeaderSkeleton />
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mx-auto animate-pulse" />
                  <div className="h-4 w-32 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mx-auto rounded animate-pulse" />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Using Skeletons for Partial Loading (Best UX)

Instead of replacing the entire page, show skeletons only where data is loading:

```tsx
// Example: Dashboard with partial skeleton
export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  useEffect(() => {
    // Load users
    fetchUsers().then(data => {
      setUsers(data);
      setUsersLoading(false);
    });
    
    // Load groups
    fetchGroups().then(data => {
      setGroups(data);
      setGroupsLoading(false);
    });
  }, []);

  return (
    <div className="dashboard">
      <Header />
      
      {/* Tabs - always visible */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Content area with skeleton OR data */}
      {activeTab === 'users' && (
        usersLoading ? (
          <DashboardGridSkeleton />
        ) : (
          <UserGrid users={users} />
        )
      )}
      
      {activeTab === 'groups' && (
        groupsLoading ? (
          <DashboardGridSkeleton />
        ) : (
          <GroupGrid groups={groups} />
        )
      )}
    </div>
  );
}
```

---

## 5. Quick Copy-Paste Skeleton Usage

### Basic Skeleton (single element)
```tsx
import { Skeleton } from '@/components/skeletons';

<Skeleton height={40} width={200} className="rounded-lg" />
```

### Text Lines
```tsx
import { SkeletonText } from '@/components/skeletons';

<SkeletonText lines={3} width={['100%', '80%', '60%']} />
```

### Avatar
```tsx
import { SkeletonAvatar } from '@/components/skeletons';

<SkeletonAvatar size="lg" />
// sizes: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

### Full Page Skeletons
```tsx
import { 
  DashboardPageSkeleton, 
  ChatPageSkeleton,
  ProfilePageSkeleton 
} from '@/components/skeletons';

// Use as-is - they include all necessary styling
<DashboardPageSkeleton />
```

---

## 6. Staggered Animation (Fancy Effect)

Add staggered delays for multiple skeletons:

```tsx
<div className="grid grid-cols-3 gap-4">
  {Array.from({ length: 9 }).map((_, i) => (
    <div 
      key={i}
      style={{ animationDelay: `${i * 50}ms` }}
      className="animate-pulse"
    >
      <Skeleton height={100} className="rounded-lg" />
    </div>
  ))}
</div>
```

---

## Summary Checklist

- [ ] Install skeleton components to `frontend/src/components/skeletons/`
- [ ] Add CSS animation to `globals.css`
- [ ] Replace dashboard loading spinner with `DashboardPageSkeleton`
- [ ] Add `ConversationListSkeleton` to chat sidebar
- [ ] Add `ChatMessagesSkeleton` when loading messages
- [ ] Replace my-groups loading spinner with `GroupListSkeleton`
- [ ] Test in both light and dark mode
- [ ] Test with reduced motion preference
