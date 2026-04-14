
## 1. Frontend (Next.js/React)

### 1.3. List Virtualization
- **Use react-window** for long lists (messages, groups, users) to avoid DOM bloat.
- **Threshold:** Apply when >150 items.

### 1.5. Component Structure & Code Splitting
- **Split heavy client components** (chat, dashboard) into presentational chunks.
- **Memoize** where possible to reduce rerender fanout.
- **Bundle analysis:** Use `next build` and analyze for large modules.

### 1.6. Middleware & Socket Optimization
- **Tighten middleware matcher scope** to exclude routes that don't need auth/session.
- **Reduce SocketProvider polling**; prefer event-driven updates with fallback.

### 1.7. Accessibility & Animation
- **Respect reduced motion** preference for skeletons/animations.
- **Test in both light and dark mode.**

## 2. Backend (Express/Socket.IO)

### 2.1. API & Socket Performance
- **Add API timing middleware** to log p50/p95/p99 per route.
- **Enable DB slow query logging** (threshold: 50ms).
- **Track Redis command durations** for hot commands.
- **Optimize socket event handlers** for average duration.

### 2.2. Hot Path Improvements
- **Implement infinite scroll pagination** for all chat/message APIs.
- **Add/verify DB indexes** on message, group, and user tables.
- **Optimize media delivery:**
  - Use CDN-backed URLs
  - Tune image variants
  - Ensure Next.js remote image config is correct

### 2.3. Rate Limiting & Security
- **Review rate limiting** for login, messaging, and sensitive endpoints.
- **Audit CORS and session cookie settings** for tunnel/proxy compatibility.

