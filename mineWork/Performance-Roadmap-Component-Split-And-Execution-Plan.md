# Byte-Chat Performance Execution Plan

## Phase 1 (Week 1): Quick Wins

### Frontend
1. Route-scope heavy providers
- Move SocketProvider, NotificationProvider, NotificationCenter out of global layout.
- Keep them in authenticated app route group only.

2. Remove session polling
- Replace 1s localStorage polling in socket context with event-driven updates.

3. Middleware scope reduction
- Limit middleware matcher to protected routes only.

4. Chat fetch stabilization
- Avoid full fetchMessages on every reaction/edit/delete event.
- Apply socket patch updates to local state first.

---

## Phase 2 (Week 2-3): Component and Hook Splits

### A) Chat Window Split (from frontend/src/app/chat/[conversationId]/page.tsx)
Create:
- components/chat/ChatHeader.tsx
- components/chat/MessageList.tsx
- components/chat/MessageActions.tsx
- components/chat/Composer.tsx
- components/chat/ReplyPreview.tsx
- components/chat/TypingIndicator.tsx
- hooks/useConversationBoot.ts
- hooks/useConversationSocket.ts
- hooks/useConversationSearch.ts
- hooks/useConversationE2EE.ts

Result:
- Smaller rerender boundaries.
- Cleaner dependency arrays.

### B) Group Chat Split (from frontend/src/app/groups/[groupId]/chat/page.tsx)
Create:
- components/groupchat/GroupHeader.tsx
- components/groupchat/GroupMessageList.tsx
- components/groupchat/PollPanel.tsx
- components/groupchat/GroupComposer.tsx
- hooks/useGroupChatBoot.ts
- hooks/useGroupChatSocket.ts
- hooks/useGroupPolls.ts
- hooks/useGroupSearch.ts

Result:
- Poll and messaging logic isolated.
- Less coupling between unrelated state updates.

### C) Dashboard Split (from frontend/src/app/dashboard/page.tsx)
Create:
- hooks/useDashboardData.ts
- components/dashboard/NavBar.tsx
- components/dashboard/Filters.tsx
- components/dashboard/UsersGrid.tsx
- components/dashboard/GroupsGrid.tsx

Result:
- Better memoization and easier parallel data fetch tuning.

## Phase 3 (Week 3-4): Backend Latency Reduction

### A) Fast-path message send
Refactor send flow:
- Inline only strict consistency operations.
- Move cache warm, notification writes, offline queue, and enrichment fetches to async worker.

### B) Conversation summary optimization
- Introduce derived conversation summary data store:
  - last_message_at
  - last_message_preview metadata
  - unread_count per user+conversation
- Keep fallback recompute for repair paths.

### D) Profile Edit Split (from frontend/src/app/profile/edit/page.tsx)
Create:
- hooks/useProfileSettingsData.ts
- components/profile/PersonalTab.tsx
- components/profile/SettingsTab.tsx
- components/profile/PrivacyTab.tsx
- components/profile/BlockedTab.tsx
- components/profile/SecurityTab.tsx

Result:
- Smaller tab updates and cleaner form ownership.

---

## Phase 4 (Week 4+): Observability and Guardrails

1. Add endpoint-level timing logs (sampled)
- include request id, route, db time, redis time, total time.

2. Add frontend web-vitals tracking
- collect LCP, INP, CLS on key routes.

3. Add performance budgets
- JS bundle budget for dashboard/chat routes
- p95 latency budget for message send and messages fetch

4. Add regression checks in CI
- basic lighthouse budget for top pages
- endpoint load smoke test script

---

## Prioritized Backlog (Order to Execute)
1. Provider scoping + remove session polling.
2. Chat event patch updates to avoid repeated full fetches.
3. Compression + route-specific rate limiting.
4. Chat window split into hooks/components.
5. Group chat split into hooks/components.
6. Fast-path backend send message with async side effects.
7. Conversation summary model for cheap list reads.
8. Notification storage redesign.

---

## KPI Targets (Realistic)
- 20-35% lower JS work on non-chat pages.
- 30-50% better p95 message send latency.
- 25-40% fewer redundant message/conversation fetches on active sessions.
- Lower idle CPU due to polling removal.

---
