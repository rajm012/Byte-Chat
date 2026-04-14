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
