# Byte-Chat Backend Runtime and Throughput Audit

## High-Impact Pain Points

### 3) Conversation list query is expensive under scale
Conversation list fetch includes:
- lateral join for last message
- per-conversation subquery count of unread status
- joins for user details

Effect:
- As conversation count grows, query cost rises quickly.

Recommendation:
- Move unread_count to pre-aggregated per user+conversation table/materialized view or cached counter.
- Keep conversation summary table updated on message write events.
- Retain fallback DB recompute for repair jobs only.

Expected gain:
- Faster conversation list endpoint and less DB pressure.

---

### 4) Notification delete/clear is O(n) list rewrite
Notification service operations for single delete or conversation-clear:
- reads entire Redis list
- parses each JSON item
- filters in memory
- rewrites whole list

Effect:
- Slow operations with larger notification list.

Recommendation:
- Store notifications in Redis hash by notification_id + sorted set index by timestamp.
- Store conversation index key to map notification ids per conversation.
- Delete single and conversation keys without full-list rebuild.

Expected gain:
- Much faster delete/clear and lower Redis CPU.

---

### 5) No HTTP compression middleware in Express app
Current stack includes helmet/cors/rate-limits/json parsing but no compression.

Effect:
- JSON responses sent uncompressed can increase transfer time.

Recommendation:
- Add compression middleware (gzip/br where available).
- Exclude already compressed media.

Expected gain:
- Lower payload transfer times, especially on slower networks.

---

### 6) Socket online/offline broadcasts go to all clients
On connect/disconnect, server emits user-online and user-offline globally.

Effect:
- Event fan-out to clients that do not care about specific users.
- Extra frontend state updates and network noise.

Recommendation:
- Emit presence updates only to interested subscribers (watch lists/rooms).
- Keep global events for admin/monitoring channels only.

Expected gain:
- Lower socket traffic and less client-side event handling overhead.

---

### 7) Polling transport fallback can add overhead
Socket client currently allows transports [websocket, polling].

Effect:
- Some environments may temporarily hit polling path before websocket stability.

Recommendation:
- In controlled production env, prefer websocket-only if infra supports it reliably.
- Keep polling fallback for known problematic networks only.

Expected gain:
- Lower handshake overhead and event latency variance.

---

### 8) GET /messages rate-limit skip can permit heavy polling traffic
Global limiter skips GET paths that include /messages.

Effect:
- Under abuse or aggressive clients, DB can receive high load.

Recommendation:
- Apply route-specific limiter for messages endpoint with sane per-user/per-IP budget.
- Different thresholds for authenticated users vs anonymous endpoints.

Expected gain:
- Better protection against chat polling spikes.

---

## Backend Quick Wins (1-2 days)
1. Add compression middleware.
2. Defer non-critical sendMessage side effects after response or via async worker.
3. Add specific limiter to messages endpoints instead of global skip.
4. Reduce global presence fan-out (room/subscriber targeted emits).

---

## Medium Refactors (3-10 days)
1. Refactor chat/group controllers into focused service modules.
2. Introduce summary stores for conversation list (last message + unread aggregates).
3. Redesign notification storage model for delete/clear efficiency.
4. Add background jobs for cache warming and notification mirroring.

---

## Backend Measurement Plan
Track before/after:
- p50/p95/p99 latency for:
  - POST /api/chat/send
  - GET /api/chat/conversations
  - GET /api/chat/conversation/:id/messages
- DB query duration and wait_count from pool metrics.
- Redis command latency and ops/sec for notification keys.
- Socket events/sec and average event fan-out.

---

## Suggested Target Outcomes
- 30-50% p95 improvement on message send endpoint after async side-effect split.
- 20-40% faster conversation list endpoint under medium data volume.
- Lower socket bandwidth and fewer redundant client updates.
- Better runtime stability under burst traffic.
