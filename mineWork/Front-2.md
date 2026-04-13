# Frontend Performance and UX Improvement Plan

## Goal
Make the app feel instant without changing your final product structure.
Focus on:
- Faster perceived loading
- Lower blocking work on initial render
- Predictable skeleton loaders on deterministic screens
- No regressions in realtime chat behavior

## Repo Audit Summary

### What is already good
- Request dedupe already exists in chat APIs via dedupedGet.
- Socket context is centralized and reusable.
- Basic loading states exist in many pages.
- A reusable skeleton CSS utility already exists.
- One page already uses skeleton patterns as reference.

### Biggest opportunities from current code
1. No route-level loading.tsx files in app routes
- This means users often wait for full client hydration before seeing meaningful placeholders.

2. Heavy client pages fetch everything after mount
- Dashboard and chat pages are client-heavy and do multiple fetches on load.
- Current UX often shows spinner-only states, not structure-preserving placeholders.

3. Chat main page does expensive state updates and frequent full reload patterns
- Many actions trigger full message/conversation reloads instead of optimistic local updates.

4. Socket session polling in SocketProvider every 1s
- Useful fallback, but can add constant overhead.

5. Middleware matcher runs broadly
- Works, but can be tightened to reduce unnecessary middleware execution.

## Primary Targets (2-week measurable targets)
- Initial visual response under 300ms for primary tabs (Dashboard, Chat, My Groups)
- Time to first meaningful placeholder under 150ms
- 30 to 50 percent reduction in spinner-only waits
- No message list hard refresh required after sending/receiving
- Keep interaction latency under 100ms for tab switches and chat panel transitions

## Priority Improvements

## P0: Perceived Speed and Stability

### 1) Add deterministic skeleton loaders on main tabs
Use skeletons only where final shape is known:
- Dashboard users list and groups list cards
- Chat conversation list items
- Chat message list bubbles
- My Groups list and selected group message panel

Do not use skeleton for non-deterministic overlays or micro-elements.

### 2) Replace full-page spinner states with layout-preserving skeletons
Current spinner-only states create jumpy UI and worse perceived speed.
Keep structure mounted and swap content sections with skeleton blocks.

### 3) Keep realtime lists warm after first fetch
Do not clear lists to empty between refreshes.
Use stale-while-refresh behavior:
- Keep previous list visible
- Overlay subtle loading shimmer on affected rows

## P1: Data and Render Efficiency

### 4) Split heavy client components into presentational chunks
Examples:
- Chat page: split sidebar, message list, composer, header actions
- Dashboard: split users tab and groups tab panels

Benefits:
- Better memo boundaries
- Less rerender fanout
- Easier skeleton reuse

### 5) Add list virtualization where message counts are high
You already have react-window dependency.
Apply virtualization to chat and group message lists after threshold (for example 150+ messages).

### 6) Avoid unnecessary full refetches after single actions
For reactions/edit/delete, update local state first and optionally revalidate in background.

## P2: Runtime and Network Cleanup

### 7) Tighten SocketProvider session sync loop
Current 1-second polling can be reduced or replaced by event-driven updates with fallback.

### 8) Optimize middleware matcher scope
Exclude routes that do not need auth/session work where possible.

### 9) Add image loading consistency
Standardize size hints and lazy behavior for non-critical images.
Use priority only for true above-the-fold hero content.

## Skeleton Loader Strategy

## Design Principles
- Always mirror the final layout shape.
- Keep dimensions close to real content to avoid layout shift.
- Use subtle shimmer and low-contrast neutral tones.
- Animate at moderate speed (no high-frequency flashing).
- Keep skeleton visible only while data is unresolved.

## Skeleton Building Blocks
Use reusable primitives:
- AvatarCircleSkeleton
- TextLineSkeleton variants (short, medium, long)
- MessageBubbleSkeleton (incoming and outgoing)
- ListItemSkeleton
- PanelHeaderSkeleton

## Deterministic Placement Plan

### A) Dashboard
- Left/profile area: avatar + two text lines
- Users tab: 8 card skeleton rows
- Groups tab: 6 group card skeleton rows
- Search bar skeleton only on very first load

### B) Main Chat page
- Conversation list panel: 10 chat-row skeletons
  - Avatar circle placeholder
  - Name line
  - Last-message line
  - Timestamp block
- Message panel while conversation loads:
  - Date chip placeholders
  - Incoming and outgoing bubble skeletons
  - Composer stays visible but disabled until load complete

### C) My Groups
- Group list skeletons in left panel
- Selected group chat skeleton in right panel
- Message bubble skeleton pattern same as chat for consistency

## Fast Loading Gate (when to show skeleton vs instant content)
Use this practical gate:
- If expected fetch < 120ms, do not force skeleton flash
- If expected fetch >= 120ms, show skeleton immediately
- If fetch resolves quickly after skeleton appears, keep minimum 180ms display to avoid flicker

Implementation note:
- Track timing with a tiny useDeferredLoading utility.

## Implementation Steps

### Phase 1: Foundation (1 to 2 days)
1. Create skeleton component library in components/skeleton.
2. Add useDeferredLoading hook with anti-flicker timing.
3. Define page-level skeleton composition for Dashboard, Chat, My Groups.

### Phase 2: Main Tabs (2 to 4 days)
1. Dashboard skeleton integration.
2. Chat sidebar and message panel skeleton integration.
3. My Groups skeleton integration.
4. Replace spinner-only full-page loading states for these routes.

### Phase 3: Render and Data Optimizations (3 to 5 days)
1. Chat local optimistic updates for reaction/edit/delete.
2. Component split and memo boundaries in heavy pages.
3. Virtualize long message lists.
4. Add lightweight performance marks and monitor improvements.

## Suggested File-Level Focus in this repo
- frontend/src/app/chat/page.tsx
- frontend/src/app/my-groups/page.tsx
- frontend/src/app/dashboard/page.tsx
- frontend/src/app/globals.css
- frontend/src/contexts/SocketContext.tsx
- frontend/src/middleware.ts
- frontend/src/app/my-identities/page.tsx (reference for skeleton style)

## Quick Win Checklist
- Add skeletons to Chat and Dashboard first.
- Preserve layout while loading (no blank/center-only spinner states).
- Keep stale data visible during refetch.
- Batch state updates and avoid redundant full refetches.
- Add virtualization threshold for very long message histories.

## Validation Checklist
- Profile with browser performance panel before and after.
- Verify no CLS spikes when content resolves.
- Verify socket events still update UI immediately.
- Verify keyboard/input remains responsive while background fetch occurs.
- Compare p50 and p95 route transition and data-ready times.

## Recommended Next Execution Order
1. Implement skeleton primitives and hook.
2. Integrate Chat page skeletons.
3. Integrate Dashboard skeletons.
4. Integrate My Groups skeletons.
5. Add virtualization and local optimistic updates.
6. Tune middleware and socket session polling.

## Notes for your team
Your architecture is already solid for scaling this work. Most gains now are in perceived-performance UX and reducing unnecessary rerender/refetch patterns in the heaviest client screens.