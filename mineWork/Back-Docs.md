# Byte-Chat Backend Documentation

## Overview

**Byte-Chat** is a real-time messaging application backend built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL** (via Supabase), and **Redis**. It supports end-to-end encrypted messaging, anonymous chat, group chats with polling, user blocking/reporting, and real-time notifications via Socket.IO.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Core Modules](#4-core-modules)
5. [Authentication System](#5-authentication-system)
6. [Chat System](#6-chat-system)
7. [Group System](#7-group-system)
8. [Anonymous Chat](#8-anonymous-chat)
9. [Security Features](#9-security-features)
10. [Caching Strategy](#10-caching-strategy)
11. [Database Design](#11-database-design)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / WebSocket
┌───────────────────────────────▼─────────────────────────────────┐
│                         EXPRESS SERVER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Routes    │  │ Controllers │  │  Services   │  │ Middleware│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   PostgreSQL  │      │    Redis      │      │  Cloudinary   │
│   (Supabase)  │      │   (Cache/     │      │  (Image Store)│
│               │      │    PubSub)    │      │               │
└───────────────┘      └───────────────┘      └───────────────┘
```

### Key Architectural Decisions:

- **Layered Architecture**: Routes → Controllers → Services → Database
- **Redis for Everything Fast**: Sessions, caching, presence, notifications, rate limiting
- **PostgreSQL for Persistence**: User data, messages, groups, relationships
- **Socket.IO for Real-time**: Chat, typing indicators, online presence

---

## 2. Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Framework** | Express.js | Web framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **Database** | PostgreSQL (Supabase) | Primary data store |
| **Cache** | Redis | Session, cache, real-time features |
| **Real-time** | Socket.IO | WebSocket communication |
| **Auth** | JWT + Session | Dual authentication |
| **Storage** | Cloudinary | Image storage |
| **Email** | Nodemailer + Gmail SMTP | OTP emails |
| **Security** | Argon2, Helmet, CORS | Password hashing, HTTP security |

---

## 3. Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point, server initialization
│   ├── config/               # Configuration management
│   │   └── index.ts          # Environment variables, validation
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts          # Signup, login, OTP, password reset
│   │   ├── auth.controller.supabase.ts # Supabase auth variant
│   │   ├── profile.controller.ts       # User profiles, avatars
│   │   ├── chat.controller.ts          # Regular chat operations
│   │   ├── anonymous-chat.controller.ts# Anonymous messaging
│   │   ├── anonymous.controller.ts     # Anonymous identity management
│   │   ├── group.controller.ts         # Groups, polls
│   │   ├── block-report.controller.ts  # Blocking and reporting
│   │   ├── settings.controller.ts      # User settings
│   │   ├── message-management.controller.ts # Reactions, edits
│   │   └── notification.controller.ts  # Push notifications
│   ├── services/             # Business logic
│   │   ├── authCache.service.ts        # Token blacklist, permissions
│   │   ├── session.service.ts          # Redis session management
│   │   ├── notification.service.ts     # Notification queue
│   │   ├── presence.service.ts         # Online/offline tracking
│   │   ├── chat/                       # Chat-specific services
│   │   │   ├── conversation.service.ts
│   │   │   ├── message-send.service.ts
│   │   │   ├── message-read.service.ts
│   │   │   └── session-keys.service.ts
│   │   └── group/                      # Group-specific services
│   │       ├── group-chat.service.ts
│   │       ├── group-members.service.ts
│   │       └── group-polls.service.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts      # JWT/Session verification
│   │   ├── rateLimiter.ts        # Redis-based rate limiting
│   │   ├── upload.middleware.ts  # Multer image upload
│   │   └── verification.middleware.ts # Email verification check
│   ├── lib/                  # Database connections
│   │   ├── db.ts             # PostgreSQL pool with monitoring
│   │   ├── redis.ts          # Redis client
│   │   └── supabase.ts       # Supabase admin client
│   ├── utils/                # Helper utilities
│   │   ├── jwt.util.ts       # Token generation/verification
│   │   ├── password.util.ts  # Argon2 hashing
│   │   ├── email.util.ts     # SMTP email sending
│   │   ├── cloudinary.util.ts# Image upload/delete
│   │   ├── cache.util.ts     # Redis caching helpers
│   │   └── error.util.ts     # Error handling
│   ├── socket/               # WebSocket logic
│   │   └── index.ts          # Socket.IO initialization, events
│   ├── types/                # TypeScript types
│   │   ├── auth.types.ts
│   │   └── chat.types.ts
│   └── routes/               # Route definitions
│       ├── auth.routes.ts
│       ├── chat.routes.ts
│       ├── group.routes.ts
│       └── ...
├── package.json
├── tsconfig.json
└── .env                     # Environment variables
```

---

## 4. Core Modules

### 4.1 Configuration (`config/index.ts`)

**Purpose**: Centralized environment configuration with validation.

**Key Functions**:
- `requireEnv(name: string)` - Validates required environment variables, throws if missing

**Configuration Categories**:
- `database`: DATABASE_URL
- `jwt`: Access/refresh secrets and expiry times
- `otp`: Expiry minutes, max attempts
- `rateLimit`: Login attempts, lock duration
- `email`: Gmail SMTP credentials
- `server`: Port, environment
- `cors`: Frontend URL
- `redis`: Host, port, password, DB

---

### 4.2 Database Layer (`lib/db.ts`)

**Purpose**: PostgreSQL connection pool with monitoring and failover.

**Key Exports**:
- `pool` - PostgreSQL connection pool (max 50 connections)
- `query<T>()` - Type-safe query wrapper with metrics
- `startDbPoolMonitor()` - Periodic health checks
- `getDbFailoverState()` - Returns 'primary' | 'degraded' | 'unknown'
- `getDbPoolMetrics()` - Returns pool statistics from Redis

**Features**:
- SSL enabled for Supabase compatibility
- Query duration tracking (>1500ms logs slow queries)
- Automatic state publishing to Redis
- Graceful shutdown support

**Why**: Monitors database health, prevents connection leaks, provides visibility into DB performance.

---

### 4.3 Redis Layer (`lib/redis.ts`)

**Purpose**: Redis client initialization and connection management.

**Key Export**:
- `redis` - Singleton ioredis client
- `connectRedis()` - Connection check

**Used For**:
- Session storage
- Token blacklisting
- Rate limiting counters
- Cache storage
- Presence tracking (online users)
- Pub/Sub for Socket.IO adapter

---

### 4.4 Error Handling (`utils/error.util.ts`)

**Purpose**: Standardized API error handling.

**ApiError Class**:
```typescript
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string);
}
```

**Error Handler Middleware**:
- Catches ApiError instances
- Returns JSON: `{ success: false, message, statusCode }`
- Logs unexpected errors

---

## 5. Authentication System

### 5.1 Authentication Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│  User   │───▶│  Signup  │───▶│  OTP     │───▶│  Verify │
│         │    │  (email) │    │  Sent    │    │  Email  │
└─────────┘    └──────────┘    └──────────┘    └─────────┘
                                                   │
                                                   ▼
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│  Access │◀───│  Tokens  │◀───│  Session │◀───│  Auto   │
│  App    │    │  Created │    │  Created │    │  Login  │
└─────────┘    └──────────┘    └──────────┘    └─────────┘
```

### 5.2 JWT Authentication (`utils/jwt.util.ts`)

**Functions**:
- `generateAccessToken(userId, rollNo)` - 15-minute expiry
- `generateRefreshToken(userId, rollNo)` - 7-day expiry
- `verifyAccessToken(token)` - Validates and returns payload
- `verifyRefreshToken(token)` - Validates refresh token

**Token Payload Structure**:
```typescript
interface TokenPayload {
  userId: string;
  rollNo: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
  authVersion: number;
}
```

### 5.3 Session Management (`services/session.service.ts`)

**Purpose**: Redis-based session storage for Socket.IO and mobile apps.

**Functions**:
- `createSession(sessionId, data)` - Stores session in Redis (7-day TTL)
- `getSession(sessionId)` - Retrieves session
- `updateLastActivity(sessionId)` - Updates timestamp
- `deleteSession(sessionId)` - Removes session
- `storeRefreshToken(userId, tokenHash)` - Stores refresh token
- `getRefreshTokenUser(tokenHash)` - Gets user by refresh token
- `deleteRefreshToken(tokenHash)` - Removes refresh token

**Why Sessions**: Mobile apps and WebSocket connections need stateful authentication beyond JWTs.

### 5.4 OTP System (`services/authOtpCache.service.ts`)

**Functions**:
- `storeOtp(purpose, rollNo, userId, otp)` - Stores hashed OTP in Redis
- `matchesOtp(purpose, rollNo, userId, inputOtp)` - Verifies OTP
- `clearOtp(purpose, rollNo)` - Removes OTP
- `incrementOtpSendAttempts()` / `incrementOtpVerifyAttempts()` - Rate limiting
- `isOtpSendRateLimited()` / `isOtpVerifyRateLimited()` - Check limits

**Security**:
- OTPs hashed before storage
- Max 3 send attempts per hour
- Max 5 verify attempts per OTP
- 15-minute expiry

### 5.5 Auth Controller (`controllers/auth.controller.ts`)

**Endpoints**:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Step 1: Create user, send OTP |
| `/api/auth/verify-otp` | POST | Step 2: Verify email, auto-login |
| `/api/auth/login` | POST | Login with roll number/email + password |
| `/api/auth/refresh` | POST | Rotate refresh token, issue new tokens |
| `/api/auth/logout` | POST | Invalidate tokens, clear cookies |
| `/api/auth/forgot-password` | POST | Send password reset OTP |
| `/api/auth/reset-password` | POST | Reset password with OTP/token |
| `/api/auth/cancel-all-sessions` | POST | Global logout, revoke all tokens |

**Key Features**:
- **Token Rotation**: New refresh token on every refresh
- **Reuse Detection**: If stolen token is used, all sessions revoked
- **Audit Logging**: All auth events logged with IP and user agent
- **Rate Limiting**: 5 login attempts per IP per hour

---

## 6. Chat System

### 6.1 Conversation Types

1. **Regular Chat**: Known users, E2EE enabled
2. **Anonymous Chat**: Hidden identity, optional reveal
3. **Group Chat**: Multiple users, polls, admin roles

### 6.2 End-to-End Encryption (E2EE)

**Flow**:
```
Sender                    Server                    Recipient
  │                         │                          │
  │ 1. Generate session key │                          │
  │ 2. Encrypt with recipient's public key             │
  │────────────────────────▶│                          │
  │    Store encrypted keys │                          │
  │                         │                          │
  │ 3. Send message (encrypted with session key)      │
  │────────────────────────▶│                          │
  │    Store encrypted message                          │
  │                         │                          │
  │                         │◀─────────────────────────│
  │                         │    4. Fetch session key    │
  │                         │    5. Decrypt with private │
  │                         │       key                  │
```

**Session Keys Service** (`services/chat/session-keys.service.ts`):
- `handleStoreSessionKeys()` - Stores encrypted AES keys for each participant
- `handleGetParticipantPublicKeys()` - Retrieves public keys for key exchange

**Why**: Server never sees plaintext messages, only encrypted blobs.

### 6.3 Message Sending (`services/chat/message-send.service.ts`)

**Function**: `handleSendMessage(req, res)`

**Flow**:
1. Verify user is conversation participant
2. Check block status (cached + DB)
3. **Deduplication**: Build dedupe token, check Redis
4. Begin PostgreSQL transaction
5. Insert message with encrypted content
6. Update conversation `last_message_at`
7. Commit transaction
8. Complete dedupe token with message ID
9. **Enqueue post-commit job** (notifications, cache warmup, socket emit)

**Why Post-Commit Queue**: Decouples real-time features from DB transaction. If socket emit fails, message is still saved.

### 6.4 Message Reading (`services/chat/message-read.service.ts`)

**Function**: `handleGetMessages(req, res)`

**Features**:
- Pagination with cursor (before timestamp)
- Search within conversation
- Cache version checking (bump on new message)
- Redis cache for frequently accessed pages
- Pre-caching next page for smooth scrolling

**Message Status Tracking**:
- `message_status` table tracks: `sent` → `delivered` → `read`
- Updates via socket events

### 6.5 Chat Controller (`controllers/chat.controller.ts`)

**Key Endpoints**:

| Endpoint | Description |
|----------|-------------|
| `GET /api/chat/conversations` | List user's regular conversations |
| `POST /api/chat/conversation` | Get or create conversation |
| `GET /api/chat/conversation/:id/messages` | Get paginated messages |
| `POST /api/chat/send` | Send message |
| `POST /api/chat/upload-image` | Upload chat image to Cloudinary |
| `POST /api/chat/block/:conversationId` | Block user in conversation |
| `POST /api/chat/unblock/:conversationId` | Unblock user |
| `POST /api/chat/report` | Report user/message |

---

## 7. Group System

### 7.1 Group Structure

```
Group
├── Members (1-500)
│   ├── Owner (1) - Full control
│   ├── Admins (multiple) - Manage members, polls
│   └── Regular members
├── Messages (encrypted per-group)
└── Polls
    ├── kick_member
    ├── promote_member
    └── custom polls
```

### 7.2 Group Services

**Group Members** (`services/group/group-members.service.ts`):
- `handleJoinGroup()` - Join public groups
- `handleAddMemberToGroup()` - Admin invite to private groups
- `handleRemoveMemberFromGroup()` - Admin/owner removal
- `handleLeaveGroup()` - Self-leave
- `handlePromoteMemberToAdmin()` - Owner promotion

**Group Chat** (`services/group/group-chat.service.ts`):
- `handleGetGroupMessages()` - Paginated group messages
- `handleSendGroupMessage()` - Send to all members
- `handleUploadGroupChatImage()` - Image sharing
- `handleGetGroupParticipantPublicKeys()` - E2EE key exchange

**Group Polls** (`services/group/group-polls.service.ts`):
- `handleCreatePoll()` - Create kick/promote/custom polls
- `handleVoteOnPoll()` - Cast vote (yes/no)
- `handleGetPollResults()` - Live results
- `handleCancelPoll()` - Creator/admin cancellation
- `handleExecutePoll()` - Manual execution of passed polls

### 7.3 Poll System

**Poll Types**:
1. **kick_member**: Vote to remove a member
2. **promote_member**: Vote to make member admin
3. **custom**: General group decisions

**Poll Lifecycle**:
```
Created → Active (members vote) → Expires → Passed/Failed → Executed
```

**Auto-Resolution** (`index.ts` poll sweeper):
- Runs every 60 seconds
- Updates `status` based on votes_for vs votes_against
- Ties broken by random()
- Emits `poll-updated`, `poll-executed`, `member-removed` events
- Clears Redis cache

### 7.4 Group Controller (`controllers/group.controller.ts`)

**Key Endpoints**:

| Endpoint | Description |
|----------|-------------|
| `POST /api/groups` | Create new group |
| `GET /api/groups/public` | List public groups |
| `GET /api/groups/my` | List my groups |
| `GET /api/groups/:id` | Get group details |
| `POST /api/groups/:id/join` | Join public group |
| `POST /api/groups/:id/members` | Add member (private) |
| `DELETE /api/groups/:id/members/:userId` | Remove member |
| `POST /api/groups/:id/polls` | Create poll |
| `POST /api/groups/:id/polls/:pollId/vote` | Vote on poll |

---

## 8. Anonymous Chat

### 8.1 Anonymous Identity

**Concept**: Users can send messages without revealing identity. Revealing is optional and one-way.

**Database Schema**:
```sql
anonymous_identities:
- identity_id (UUID)
- user_id (real user)
- target_user_id (recipient)
- random_string (display name, customizable by recipient)
- display_gender (shown to recipient)
- is_revealed (boolean)
- conversation_id (linked conversation)
```

### 8.2 Anonymous Chat Controller (`controllers/anonymous-chat.controller.ts`)

**Key Functions**:

**`createAnonymousConversation(req, res)`**:
- Creates/finds anonymous conversation between two users
- Creates `anonymous_identities` record for sender
- Sets `anonymous_initiator_id` on conversation
- Returns conversation ID for messaging

**`sendAnonymousMessage(req, res)`**:
- Validates sender is conversation participant
- Stores message with `is_anonymous = true`
- Emits socket event with `random_string` as sender name
- Creates notification for recipient
- Queues offline message if recipient not online

**`revealAnonymousIdentity(req, res)`**:
- Only the initiator (sender) can reveal
- Two paths:
  - **Merge**: If regular conversation exists, move all messages there
  - **Convert**: Make anonymous conversation normal
- Updates `anonymous_identities.is_revealed = true`
- Emits `identity-revealed` event

**`updateAnonymousName(req, res)`**:
- Only the **receiver** can customize the display name
- Adds random 5-char suffix for uniqueness
- Updates `random_string` field

### 8.3 Anonymous Controller (`controllers/anonymous.controller.ts`)

**Purpose**: Manage anonymous identities separately from chat.

**Functions**:
- `getMyAnonymousIdentities()` - List all my anonymous personas
- `createAnonymousIdentity()` - Create new identity for target user/group
- `revealIdentity()` - Reveal identity (marked deprecated, use chat controller)

---

## 9. Security Features

### 9.1 Authentication Security

| Feature | Implementation | Purpose |
|---------|-----------------|---------|
| Password Hashing | Argon2id | Slow, memory-hard hashing |
| Token Rotation | Refresh token rotation | Prevent replay attacks |
| Token Blacklist | Redis SET | Revoke tokens immediately |
| Session Management | Redis with TTL | Stateful auth for sockets |
| Rate Limiting | Redis counters | Prevent brute force |
| Audit Logging | Database function | Compliance, forensics |

### 9.2 Block & Report System (`controllers/block-report.controller.ts`)

**Blocking**:
- Creates `user_blocks` record
- Blocks all conversations between users
- Rejects pending chat requests
- Cache invalidation for conversation lists

**Unblocking**:
- Removes block record
- Checks for reverse blocks (maintains block if other user blocked)
- Emits socket events for real-time UI update

**Reporting**:
- Categories: spam, harassment, inappropriate_content, impersonating, fake_profile, other
- Can report users, groups, or specific messages
- Anonymous user resolution (finds real user from conversation)

### 9.3 Middleware Security

**Auth Middleware** (`middleware/auth.middleware.ts`):
1. Check Bearer token or Session ID
2. Verify session in Redis
3. Check token blacklist
4. Validate JWT signature and expiry
5. Verify user exists and is active
6. Check token revocation timestamp
7. Cache validation result in Redis
8. Attach `req.user` and `req.permissions`

**Rate Limiter** (`middleware/rateLimiter.ts`):
- Redis-based counter per user per endpoint per minute
- 100 requests/minute default
- Fails open if Redis unavailable

**Verification Middleware** (`middleware/verification.middleware.ts`):
- Ensures email is verified before accessing sensitive features
- Checks `is_active` status

---

## 10. Caching Strategy

### 10.1 Cache Layers

```
Request → Auth Cache → App Cache → DB
              ↓           ↓
          Redis TTL   Redis TTL
```

### 10.2 Cache Categories

| Cache Type | Key Pattern | TTL | Purpose |
|------------|-------------|-----|---------|
| Token Validation | `token:{hash}` | 5 min | Avoid repeated JWT verification |
| User Profile | `user:profile:{userId}` | 5 min | Reduce DB lookups |
| Profile by Roll | `user:profile:roll:{rollNo}` | 5 min | Public profile caching |
| Conversations | `user:conv:{userId}` | 5 min | Conversation list |
| Messages | `msg:{conv}:{user}:{cursor}:{version}` | 5 min | Message pagination |
| Block Status | `block:either:{userA}:{userB}` | 10 min | Check if blocked |
| Permissions | `user:perm:{userId}` | 5 min | Group roles, global perms |
| Settings | `user:settings:{userId}` | 5 min | User preferences |
| Notifications | `notifications:user:{userId}` | 7 days | Notification list |
| Presence | `online_users` | - | Online status (SET) |
| Typing | `typing:{chatId}:{userId}` | 10 sec | Typing indicators |

### 10.3 Cache Invalidation

**Functions** (`utils/cache.util.ts`):
- `invalidateUserProfileCache(userId, rollNo?)` - Clear profile caches
- `invalidateUserPermissionCache(userId)` - Clear permission cache
- `bumpMessagesCacheVersion(conversationId)` - Increment version (forces re-fetch)

**Why Version-based**: Instead of deleting all message caches, we bump a version number. New requests use the new version, old caches naturally expire.

---

## 11. Database Design

### 11.1 Core Tables

**users**:
- `user_id` (UUID PK)
- `roll_no` (unique, indexed)
- `name`, `gender`, `branch`
- `password_hash` (Argon2)
- `dp_url` (Cloudinary URL or preset avatar)
- `is_verified`, `is_active`
- `created_at`, `updated_at`, `last_login`

**user_encryption_keys**:
- `user_id` (FK)
- `public_key` (for others to encrypt)
- `encrypted_private_key` (user's private key, encrypted with their password)

**chat_conversations**:
- `conversation_id` (UUID PK)
- `user1_id`, `user2_id` (FKs, ordered for uniqueness)
- `is_anonymous`, `anonymous_initiator_id` (FK to anonymous_identities)
- `is_accepted`, `is_blocked`, `blocked_by_user_id`
- `last_message_at`

**chat_messages**:
- `message_id` (UUID PK)
- `conversation_id` (FK)
- `sender_id` (FK)
- `message_type` (text, image, file)
- `encrypted_content`, `content_iv`, `content_auth_tag`
- `media_url`, `media_size`, `media_mime_type`, `thumbnail_url`
- `key_id` (FK to session_keys for decryption)
- `parent_message_id` (for replies)
- `is_anonymous`, `anonymous_identity_id`
- `is_deleted`, `deleted_for_everyone`, `deleted_for_user_ids[]`
- `was_anonymous_message` (for revealed chats)

**message_status**:
- `status_id` (UUID PK)
- `message_id` (FK)
- `user_id` (FK)
- `status` (sent, delivered, read)
- `read_at`

**groups**:
- `group_id` (UUID PK)
- `group_name`, `group_desc`, `group_dp_url`
- `is_public`, `is_active`
- `created_by` (FK)
- `max_members` (2-500)

**group_members**:
- `member_id` (UUID PK)
- `group_id`, `user_id` (FKs)
- `is_admin`, `is_owner`, `is_anonymous`
- `joined_at`

**polls**:
- `poll_id` (UUID PK)
- `group_id` (FK)
- `poll_type` (kick_member, promote_member, custom)
- `target_user_id` (for kick/promote)
- `title`, `description`
- `votes_for`, `votes_against`, `total_voters`
- `status` (active, passed, failed, cancelled)
- `expires_at`, `is_executed`, `executed_at`

**user_blocks**:
- `block_id` (UUID PK)
- `blocker_id`, `blocked_id` (FKs)
- `reason`, `block_type` (permanent, temporary)
- `expires_at`

**reports**:
- `report_id` (UUID PK)
- `reporter_user_id`, `reported_user_id` (FKs)
- `reported_group_id`, `reported_message_id`
- `report_type`, `description`, `evidence_urls[]`
- `status` (pending, resolved, dismissed)

### 11.2 Indexes

```sql
-- Fast user lookup by roll number
CREATE INDEX idx_users_roll_no ON users(roll_no);

-- Fast conversation lookup
CREATE INDEX idx_conversations_users ON chat_conversations(user1_id, user2_id);

-- Messages by conversation, sorted by time
CREATE INDEX idx_messages_conversation_created ON chat_messages(conversation_id, created_at DESC);

-- Anonymous identity lookups
CREATE INDEX idx_anon_identities_user_target ON anonymous_identities(user_id, target_user_id);

-- Block checking
CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id, blocked_id);
```

---

## 12. Socket.IO Events

### 12.1 Connection Flow

1. Client connects with `token` in `auth` or `accessToken` cookie
2. Server validates JWT or Session ID
3. Store `socket.data.userId`
4. Map socket to user in Redis (`socketRouting.service.ts`)
5. Add to online users set
6. Deliver offline messages
7. Join personal room (`user:{userId}`)

### 12.2 Room Structure

- `user:{userId}` - Personal notifications
- `conversation:{id}` - Chat participants
- `group:{id}` - Group members

### 12.3 Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join-conversation` | `conversationId` | Subscribe to chat |
| `leave-conversation` | `conversationId` | Unsubscribe |
| `join-group` | `groupId` | Subscribe to group |
| `leave-group` | `groupId` | Unsubscribe |
| `typing` | `{ chatId, isTyping }` | Typing indicator |
| `poll-vote` | `{ groupId, pollId, vote }` | Cast poll vote |
| `message-read` | `{ conversationId, messageId }` | Mark as read |

### 12.4 Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `new-message` | Message object | New message in joined room |
| `new-notification` | Notification | Push notification |
| `offline-messages` | Message[] | Queued messages |
| `user-typing` | `{ chatId, userId, isTyping }` | Typing status |
| `user-online` / `user-offline` | `{ userId }` | Presence |
| `message-status-updated` | `{ messageId, status }` | Delivery/read |
| `poll-updated` | Poll object | Poll results changed |
| `poll-executed` | `{ poll_id, type }` | Poll action taken |
| `member-removed` | `{ group_id, user_id }` | User kicked |
| `identity-revealed` | `{ userId, conversationId }` | Anonymous revealed |
| `group-updated` | Group object | Group info changed |
| `conversation-unblocked` | `{ conversationId }` | Can message now |

---

## 13. Key Design Decisions

### 13.1 Why Dual Auth (JWT + Session)?

- **JWT**: Stateless, perfect for REST API, works across domains
- **Session**: Stateful, required for Socket.IO (cookies don't work well with WebSockets), allows instant revocation

### 13.2 Why Redis for Everything Fast?

- Single source of truth for ephemeral data
- Pub/Sub for cross-server Socket.IO
- Atomic operations for rate limiting, counters
- TTL for automatic cleanup

### 13.3 Why Post-Commit Queue?

- Database transaction must succeed first
- Socket emits, notifications, cache updates can fail without data loss
- Retry logic for offline message delivery

### 13.4 Why Version-Based Cache Bumping?

- Deleting specific cache keys is error-prone
- Version increment forces clients to fetch fresh data
- Old versions naturally expire via TTL

### 13.5 Why Anonymous Identity Table?

- One user can have multiple anonymous personas (different recipients/groups)
- Recipient can customize display name
- Reveal is tracked per-identity, not per-user

---

## 14. Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OTP
OTP_EXPIRY_MINUTES=15
OTP_MAX_ATTEMPTS=5

# Rate Limiting
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCK_DURATION_MINUTES=60

# Email
GMAIL_USER=...@gmail.com
GMAIL_APP_PASSWORD=...

# Server
NODE_PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=...
REDIS_DB=0

# Supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 15. Running the Server

```bash
# Development
npm run dev          # nodemon + tsx

# Debug
npm run debug        # With Node inspector

# Production
npm run build        # tsc
npm run start        # node dist/index.js

# Utilities
npm run seed         # Seed database
npm run verify-redis # Check Redis connection
```

---

## Summary

The Byte-Chat backend is built for **security**, **scalability**, and **real-time performance**:

1. **Security**: E2EE, Argon2, token rotation, audit logging, rate limiting
2. **Scalability**: Redis pub/sub for multi-server Socket.IO, PostgreSQL connection pooling, query optimization
3. **Real-time**: Socket.IO with Redis adapter, presence tracking, typing indicators, offline message queue
4. **Features**: Regular chat, anonymous chat with reveal, groups with polls, blocking/reporting

The architecture follows clean separation of concerns with Controllers handling HTTP, Services handling business logic, and dedicated modules for cross-cutting concerns like caching and real-time events.
