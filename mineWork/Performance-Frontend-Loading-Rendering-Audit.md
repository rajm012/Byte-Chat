# Byte-Chat Frontend Performance Audit

## Scope Reviewed
- App shell and providers
- Chat list and chat window pages
- Group chat page
- Dashboard and profile edit pages
- Notification center and related contexts/services
- Next.js config and middleware

Primary files reviewed include:
- frontend/src/app/layout.tsx
- frontend/src/contexts/SocketContext.tsx
- frontend/src/contexts/NotificationContext.tsx
- frontend/src/app/chat/page.tsx
- frontend/src/app/chat/[conversationId]/page.tsx
- frontend/src/app/groups/[groupId]/chat/page.tsx
- frontend/src/app/dashboard/page.tsx
- frontend/src/app/profile/edit/page.tsx
- frontend/src/components/NotificationCenter.tsx
- frontend/src/services/*

---

## High-Impact Pain Points

### 1) Too much global client work in Root Layout
You currently mount all of these globally for every route:
- ThemeProvider
- SocketProvider
- NotificationProvider
- ToastProvider
- NotificationCenterClient

Effect:
- Even non-chat pages pay for chat/socket/notification setup.
- Increases hydration and runtime work across the whole app.

Why it hurts loading:
- Every page load includes logic for socket auth/session checks and notification behavior.
- Global providers trigger app-wide re-renders when internal state updates.

Recommendation:
- Keep ThemeProvider and ToastProvider global.
- Move SocketProvider + NotificationProvider + NotificationCenter to a route-group layout for authenticated app areas only (dashboard/chat/groups/profile).
- Do not mount notification UI on routes where it is hidden.

Expected gain:
- Faster initial load and hydration for public pages.
- Lower background CPU and fewer effects firing globally.

---

### 2) Session polling every 1 second in SocketContext
Socket session sync currently uses setInterval(syncSession, 1000) + storage listener.

Effect:
- Constant CPU wakeups.
- Constant localStorage parsing checks.
- Unnecessary work while user is idle.

Recommendation:
- Replace polling with event-driven session updates:
  - update auth state on login/logout/refresh success paths
  - keep storage event listener for cross-tab only
  - optional visibilitychange re-check when tab becomes active

Expected gain:
- Lower idle CPU usage and smoother UI under load.

---

### 3) Very large page components causing broad re-renders
Hotspot file sizes:
- chat window: 1360 lines
- group chat window: 1525 lines
- profile edit: 697 lines
- dashboard: 466 lines

Effect:
- A single state change can re-render a huge subtree.
- Hard to reason about dependencies, easy to accidentally trigger extra effects.

Recommendation (component breakdown):

For chat window page:
- hooks/useConversationBoot.ts (initial load, permissions, E2EE boot)
- hooks/useConversationSocket.ts (socket listeners only)
- hooks/useConversationSearch.ts (debounced local search)
- components/chat/ChatHeader.tsx
- components/chat/MessageList.tsx
- components/chat/Composer.tsx
- components/chat/ReplyPreview.tsx
- components/chat/TypingIndicator.tsx
- components/chat/ChatActionsMenu.tsx

For group chat page:
- hooks/useGroupChatBoot.ts
- hooks/useGroupPolls.ts
- hooks/useGroupSocket.ts
- components/groupchat/GroupHeader.tsx
- components/groupchat/GroupPollPanel.tsx
- components/groupchat/GroupComposer.tsx
- components/groupchat/GroupTypingStrip.tsx

For dashboard page:
- hooks/useDashboardData.ts
- components/dashboard/TopNav.tsx
- components/dashboard/FilterBar.tsx
- components/dashboard/UserGrid.tsx
- components/dashboard/GroupGrid.tsx
- components/dashboard/CreateGroupModal.tsx (already isolated; keep and memoize)

For profile edit page:
- hooks/useProfileSettingsData.ts
- components/profile/Tabs.tsx
- components/profile/PersonalTab.tsx
- components/profile/SettingsTab.tsx
- components/profile/PrivacyTab.tsx
- components/profile/BlockedUsersTab.tsx
- components/profile/SecurityTab.tsx

Expected gain:
- Lower render cost per interaction.
- Better ability to memoize and isolate updates.

---

### 4) Re-fetch-heavy chat behavior
Observed pattern:
- Multiple actions call fetchMessages() repeatedly in chat window.
- Reaction events trigger full refresh.
- Chat list updates and request actions trigger broad re-fetches.

Effect:
- Excess network calls and decrypt work.
- More JSON parse + diffing in large message arrays.

Recommendation:
- Use patch updates from socket payload whenever possible.
- Keep full re-fetch as fallback only on out-of-sync conditions.
- Add request cancellation for stale fetches (AbortController or axios cancel token).
- Add client cache per conversation page (messages keyed by conversationId + cursor).

Expected gain:
- Lower latency and smoother message interactions.

---

### 5) Local message search runs on full message array frequently
Search debounces at ~280ms and filters entire messages list in-memory.

Effect:
- CPU spikes for long conversations.

Recommendation:
- Build lightweight indexed snapshot once per message update:
  - searchableText = lower(encrypted_content + sender)
- Use memoized index and search that list only.
- For very large threads, virtualize visible rows and delay search until input length >= 2.

Expected gain:
- Smoother typing and lower CPU for heavy chats.

---

### 6) Presence fetch sensitivity to userIds ordering
usePresence effect dependency uses userIds.join(',').

Effect:
- If order changes, it can trigger extra presence fetches for same set.

Recommendation:
- Normalize IDs before dependency key creation:
  - unique + sort + join
- Optionally hash IDs for stable dependency key.

Expected gain:
- Fewer redundant presence network calls.

---

### 7) NotificationCenter mounted globally and computes UI often
NotificationCenter is dynamically imported with ssr:false and mounted globally.

Effect:
- Client-only hydration overhead across app.
- Path checks, auth checks, rendering logic everywhere.

Recommendation:
- Mount NotificationCenter only in authenticated app layout.
- Lazy open behavior is good; keep it.
- Add React.memo around list item rows if notification list grows.

Expected gain:
- Reduced hydration work on non-auth/public pages.

---

### 8) Middleware matcher is broad
Current matcher runs middleware for many paths except static/image/favicon and image extensions.

Effect:
- Additional edge/server work for routes that may not need auth/session updates.

Recommendation:
- Restrict matcher to protected routes only.
- Keep public/static/marketing routes out of middleware path.

Expected gain:
- Lower request overhead and faster navigation.

---

## Frontend Quick Wins (Can do in 1-2 days)
1. Route-scope socket and notification providers away from public pages.
2. Remove 1-second session polling in SocketContext.
3. Replace repeated full fetchMessages calls for reaction/edit/delete with targeted local state patches.
4. Normalize usePresence dependency keys.
5. Restrict middleware matcher to protected paths.

---

## Medium Refactors (3-7 days)
1. Split chat window page into hooks + presentational components.
2. Split group chat page similarly and isolate poll state manager.
3. Split profile edit and dashboard pages into tabs/grids with memoized children.
4. Introduce query client (TanStack Query) or similar for cache, dedupe, stale-while-revalidate, and cancellation.

---

## Frontend Measurement Plan
Track before/after for these:
- Time to interactive on public home, dashboard, chat list
- Number of client fetches during:
  - open dashboard
  - open chat list
  - open one conversation and send one message
- Main-thread blocking time while typing in search
- React commit count for chat and group chat interactions

Use:
- Chrome Performance panel
- Next build analyze mode
- React Profiler

---

## Suggested Target Outcomes
- 20-35% reduction in initial JS work on public pages.
- 25-40% fewer chat-related network calls during active usage.
- Noticeably smoother message interactions under burst socket events.
- Lower idle CPU because polling is removed.
