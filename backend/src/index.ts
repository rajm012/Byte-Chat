import express from 'express';
import compression from 'compression';
import type { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import {getDbFailoverState, pool, startDbPoolMonitor} from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import profileRoutes from './routes/profile.routes.js';
import anonymousRoutes from './routes/anonymous.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import chatRoutes from './routes/chat.routes.js';
import anonymousChatRoutes from './routes/anonymous-chat.routes.js';
import groupRoutes from './routes/group.routes.js';
import blockReportRoutes from './routes/block-report.routes.js';
import messageManagementRoutes from './routes/message-management.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './utils/error.util.js';
import { initializeSocket } from './socket/index.js';
import { clearPollCache } from './services/pollCache.service.js';
import { startCacheMetricsLogger } from './utils/cache.util.js';
import { startRegularMessagePostCommitWorker } from './services/chat/message-post-commit-queue.service.js';

// Redis connection
import { connectRedis } from './lib/redis.js';
const app: Express = express();
const httpServer = createServer(app);

// Trust proxy for Cloudflare/Tunnels
app.set('trust proxy', 1);

// Connect to Redis at server startup
connectRedis();
startCacheMetricsLogger();
startDbPoolMonitor();


// HTTP compression (skip binary/media types)
app.use(compression({
  filter: (req: Request, res: Response) => {
    // Skip compression for already-compressed or binary responses
    const type = res.getHeader('Content-Type');
    if (typeof type === 'string' && (
      type.startsWith('image/') ||
      type.startsWith('audio/') ||
      type.startsWith('video/') ||
      type === 'application/zip' ||
      type === 'application/gzip' ||
      type === 'application/octet-stream'
    )) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Security middleware
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  config.cors.frontendUrl
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.trycloudflare.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global rate limiter (broad, but skips message endpoints)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for message polling (still applies per-route below)
    return req.path.includes('/messages') && req.method === 'GET';
  }
});
app.use(globalLimiter);

// Dedicated message endpoint limiter (stricter)
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP (increased from 30)
  message: 'Too many message requests, slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import { rateLimiter } from './middleware/rateLimiter.js';
app.use('/api', rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/anonymous', anonymousRoutes);
app.use('/api/settings', settingsRoutes);

// Chat message endpoints
app.use('/api/chat/conversation/:conversationId/messages', messageLimiter);
app.use('/api/chat/send', messageLimiter);
app.use('/api/chat/message/:messageId/status', messageLimiter);
app.use('/api/chat/message/:messageId', messageLimiter);

// Group message endpoints
app.use('/api/groups/:groupId/messages', messageLimiter);
app.use('/api/groups/:groupId/messages', messageLimiter);

// Message management endpoints (reactions, edits, deletes)
app.use('/api/messages', messageLimiter, messageManagementRoutes);

// Other chat/group routes
app.use('/api/chat', chatRoutes);
app.use('/api/anonymous-chat', anonymousChatRoutes); // Separate anonymous chat routes
app.use('/api/groups', groupRoutes); // Group routes
app.use('/api/moderation', blockReportRoutes); // Block and report routes
app.use('/api/notifications', notificationRoutes); // Notifications

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const dbFailoverState = await getDbFailoverState();
  const status = dbFailoverState === 'degraded' ? 'degraded' : 'ok';

  res.status(200).json({
    status,
    timestamp: new Date().toISOString(),
    db: {
      failoverState: dbFailoverState,
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize Socket.io
export const io = initializeSocket(httpServer);
startRegularMessagePostCommitWorker();

// Start server
const PORT = config.server.port;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.server.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.cors.frontendUrl}`);
  console.log(`⚡ Socket.io initialized`);

  setInterval(async () => {
    try {
      // 1. Resolve active polls that have reached expires_at.
      // Majority wins; ties resolved via random() coin toss.
      const result = await pool.query<{
        poll_id: string;
        group_id: string;
        status: string;
        poll_type: string;
        target_user_id: string | null;
        is_executed: boolean;
        executed_at: Date | null;
        votes_for: number;
        votes_against: number;
        total_voters: number;
        title: string;
      }>(
        `UPDATE polls
         SET status = CASE 
               WHEN votes_for > votes_against THEN 'passed'::VARCHAR
               WHEN votes_against > votes_for THEN 'failed'::VARCHAR
               ELSE (CASE WHEN random() < 0.5 THEN 'passed'::VARCHAR ELSE 'failed'::VARCHAR END)
             END,
             updated_at = NOW()
         WHERE status = 'active' AND expires_at <= NOW()
         RETURNING *`
      );

      // 2. Notify clients and handle socket side-effects
      for (const poll of result.rows) {
        const roomId = `group:${poll.group_id}`;

        // Clear Redis cache when poll ends 
        try {
          await clearPollCache(poll.poll_id);
        } catch (redisErr) {
          console.error('[Poll Sweeper] Error clearing redis cache:', redisErr);
        }

        // Always notify the group that the poll state changed
        io.to(roomId).emit('poll-updated', poll);

        if (poll.status === 'passed' && poll.is_executed) {
          // If the poll passed, the DB trigger fn_execute_passed_poll already
          // handled the state change (kick/promote/etc.). Tell the clients.
          if (poll.poll_type === 'kick_member' && poll.target_user_id) {
            io.to(roomId).emit('member-removed', {
              group_id: poll.group_id,
              user_id: poll.target_user_id,
              reason: 'poll_vote_expiry',
              poll_id: poll.poll_id
            });
          }

          io.to(roomId).emit('poll-executed', {
            poll_id: poll.poll_id,
            group_id: poll.group_id,
            poll_type: poll.poll_type,
            executed_at: poll.executed_at,
          });
        }
      }

      if (result.rows.length > 0) {
        console.log(`[Poll Sweeper] Resolved ${result.rows.length} poll(s)`);
      }
    } catch (err) {
      console.error('[Poll Sweeper] Error resolving polls:', err);
    }
  }, 60_000); // every 60 seconds
});

export default app;
