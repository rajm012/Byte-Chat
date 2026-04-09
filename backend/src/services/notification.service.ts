import { redis } from "../lib/redis.js";
import { pool } from "../lib/db.js";
import { randomUUID } from "node:crypto";

const MAX_NOTIFICATIONS = 50;
const TTL = 604800; // 7 days

type NotificationPayload = Record<string, any> & {
  notification_id?: string;
  timestamp?: number;
  read?: boolean;
};

function listKeyForUser(userId: string) {
  return `notifications:user:${userId}`;
}

function countKeyForUser(userId: string) {
  return `notification_count:${userId}`;
}

function unreadCountKeyForUser(userId: string) {
  return `notification_unread_count:${userId}`;
}

function notificationHashKey(notificationId: string) {
  return `notification:${notificationId}`;
}

function conversationIndexKeyForUser(userId: string, conversationId: string) {
  return `notifications:user:${userId}:conversation:${conversationId}`;
}

function getConversationIdFromNotification(notification: Record<string, unknown>): string | undefined {
  const candidates = [notification.conversationId, notification.conversation_id, notification.chatId, notification.chat_id];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return undefined;
}

async function syncCountFromIndex(userId: string): Promise<number> {
  const zsetKey = listKeyForUser(userId);
  const countKey = countKeyForUser(userId);
  const length = await redis.zcard(zsetKey);
  await redis.set(countKey, String(length));
  await redis.expire(countKey, TTL);
  return Number(length);
}

async function syncUnreadCountFromIndex(userId: string): Promise<number> {
  const unreadKey = unreadCountKeyForUser(userId);
  const zsetKey = listKeyForUser(userId);
  const notificationIds = await redis.zrevrange(zsetKey, 0, -1);
  
  if (notificationIds.length === 0) {
    await redis.set(unreadKey, '0');
    await redis.expire(unreadKey, TTL);
    return 0;
  }

  const pipeline = redis.pipeline();
  for (const notificationId of notificationIds) {
    pipeline.hget(notificationHashKey(notificationId), 'read');
  }
  const results = await pipeline.exec();
  
  const unreadCount = results?.filter(row => {
    const isRead = row?.[1];
    return isRead !== 'true';
  }).length || 0;
  
  await redis.set(unreadKey, String(unreadCount));
  await redis.expire(unreadKey, TTL);
  return unreadCount;
}

async function deleteNotificationIdsFromIndexes(userId: string, notificationIds: string[]): Promise<number> {
  if (notificationIds.length === 0) {
    await syncCountFromIndex(userId);
    return await syncUnreadCountFromIndex(userId);
  }

  const zsetKey = listKeyForUser(userId);
  const pipeline = redis.pipeline();

  for (const notificationId of notificationIds) {
    const hashKey = notificationHashKey(notificationId);
    pipeline.hget(hashKey, "conversation_id");
    pipeline.hget(hashKey, "read");
  }

  const conversationLookup = await pipeline.exec();
  const cleanupPipeline = redis.pipeline();

  cleanupPipeline.zrem(zsetKey, ...notificationIds);

  for (let i = 0; i < notificationIds.length; i += 1) {
    const notificationId = notificationIds[i];
    if (!notificationId) continue; // Skip if notificationId is undefined/empty
    
    const conversationLookupResult = conversationLookup?.[i * 2] as [Error | null, string | undefined] | undefined;
    const readLookupResult = conversationLookup?.[(i * 2) + 1] as [Error | null, string | undefined] | undefined;
    
    const conversationIdRaw = conversationLookupResult?.[1];
    const isRead = readLookupResult?.[1] === 'true';
    
    if (typeof conversationIdRaw === "string" && conversationIdRaw.trim()) {
      cleanupPipeline.zrem(conversationIndexKeyForUser(userId, conversationIdRaw), notificationId);
    }
    cleanupPipeline.del(notificationHashKey(notificationId));
  }

  cleanupPipeline.expire(zsetKey, TTL);
  await cleanupPipeline.exec();

  await syncCountFromIndex(userId);
  return await syncUnreadCountFromIndex(userId);
}

async function trimUserNotifications(userId: string): Promise<void> {
  const zsetKey = listKeyForUser(userId);
  const total = await redis.zcard(zsetKey);
  if (total <= MAX_NOTIFICATIONS) {
    return;
  }

  const overflow = total - MAX_NOTIFICATIONS;
  const oldestIds = await redis.zrange(zsetKey, 0, overflow - 1);
  if (oldestIds.length > 0) {
    await deleteNotificationIdsFromIndexes(userId, oldestIds);
  }
}

async function readNotificationsByIds(notificationIds: string[]): Promise<NotificationPayload[]> {
  if (notificationIds.length === 0) {
    return [];
  }

  const pipeline = redis.pipeline();
  for (const notificationId of notificationIds) {
    pipeline.hgetall(notificationHashKey(notificationId));
  }
  const rows = await pipeline.exec();

  const notifications: NotificationPayload[] = [];
  for (const row of rows ?? []) {
    const hash = row?.[1] as Record<string, string> | undefined;
    if (!hash || Object.keys(hash).length === 0) {
      continue;
    }

    const payloadRaw = hash.payload;
    if (!payloadRaw) {
      continue;
    }

    try {
      const parsed = JSON.parse(payloadRaw) as NotificationPayload;
      // Include read status from hash
      parsed.read = hash.read === 'true';
      notifications.push(parsed);
    } catch {
      // Skip malformed payload and continue.
    }
  }

  return notifications;
}

async function mirrorInsertSystemNotification(userId: string, notification: NotificationPayload) {
  try {
    await pool.query(
      `INSERT INTO system_notifications (notification_id, user_id, notification_type, title, body, data, is_read)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, FALSE)`,
      [
        notification.notification_id,
        userId,
        typeof notification.type === "string" ? notification.type : "notification",
        typeof notification.title === "string" ? notification.title : "Notification",
        typeof notification.message === "string" ? notification.message : "You have a new update.",
        JSON.stringify(notification),
      ]
    );
  } catch {
    // DB mirror is best-effort; Redis remains source of truth for speed.
  }
}

async function mirrorDeleteAllSystemNotifications(userId: string) {
  try {
    await pool.query(`DELETE FROM system_notifications WHERE user_id = $1`, [userId]);
  } catch {
    // Best-effort cleanup.
  }
}

async function mirrorDeleteOneSystemNotification(userId: string, notificationId: string) {
  try {
    await pool.query(
      `DELETE FROM system_notifications
       WHERE user_id = $1
         AND (notification_id = $2 OR data->>'notification_id' = $2)`,
      [userId, notificationId]
    );
  } catch {
    // Best-effort cleanup.
  }
}

async function mirrorDeleteConversationSystemNotifications(userId: string, conversationId: string) {
  try {
    await pool.query(
      `DELETE FROM system_notifications
       WHERE user_id = $1
         AND (
           data->>'conversationId' = $2
           OR data->>'conversation_id' = $2
           OR data->>'chatId' = $2
           OR data->>'chat_id' = $2
         )`,
      [userId, conversationId]
    );
  } catch {
    // Best-effort cleanup.
  }
}

/**
 * Pushes a notification to a user's notification list, increments their unread count,
 * and emits a real-time socket event to the user's personal room.
 */
export async function pushNotification(userId: string, notification: NotificationPayload) {
  const zsetKey = listKeyForUser(userId);
  const countKey = countKeyForUser(userId);

  // Add the timestamp to the notification if it doesn't have one
  const enrichedNotification = {
    ...notification,
    notification_id: notification.notification_id || randomUUID(),
    timestamp: notification.timestamp || Date.now()
  };

  const conversationId = getConversationIdFromNotification(enrichedNotification);
  const notificationId = enrichedNotification.notification_id;
  const timestamp = Number(enrichedNotification.timestamp || Date.now());

  const hashKey = notificationHashKey(notificationId);
  const pipeline = redis.pipeline();

  pipeline.hset(hashKey, {
    notification_id: notificationId,
    user_id: userId,
    timestamp: String(timestamp),
    conversation_id: conversationId || "",
    payload: JSON.stringify(enrichedNotification),
  });
  pipeline.expire(hashKey, TTL);
  pipeline.zadd(zsetKey, timestamp, notificationId);
  pipeline.expire(zsetKey, TTL);

  if (conversationId) {
    const conversationKey = conversationIndexKeyForUser(userId, conversationId);
    pipeline.zadd(conversationKey, timestamp, notificationId);
    pipeline.expire(conversationKey, TTL);
  }

  await pipeline.exec();
  await trimUserNotifications(userId);

  // Update both total count and unread count
  const newCount = await redis.zcard(zsetKey);
  await redis.set(countKey, String(newCount));
  await redis.expire(countKey, TTL);
  
  // Increment unread count for new notification
  const unreadKey = unreadCountKeyForUser(userId);
  await redis.incr(unreadKey);
  await redis.expire(unreadKey, TTL);

  await mirrorInsertSystemNotification(userId, enrichedNotification);

  // Emit real-time socket event to the user's personal room.
  // Lazy import avoids circular-dependency issues at module-load time.
  try {
    const { emitToUser } = await import("../socket/index.js");
    const unreadCount = await getUnreadNotificationCount(userId);
    emitToUser(userId, "new-notification", {
      notification: enrichedNotification,
      totalCount: newCount,
      unreadCount: unreadCount
    });
  } catch (socketErr) {
    // Socket not yet initialised (e.g. during startup) — non-fatal
    console.warn("[Notification] Could not emit socket event:", socketErr);
  }
}

/**
 * Retrieves the latest notifications for a user.
 */
export async function getNotifications(userId: string) {
  const zsetKey = listKeyForUser(userId);
  const notificationIds = await redis.zrevrange(zsetKey, 0, 19);
  return readNotificationsByIds(notificationIds);
}

/**
 * Retrieves the current total notification count.
 */
export async function getNotificationCount(userId: string) {
  const key = countKeyForUser(userId);
  const count = await redis.get(key);
  
  return Number(count || 0);
}

/**
 * Retrieves the current unread notification count.
 */
export async function getUnreadNotificationCount(userId: string) {
  const key = unreadCountKeyForUser(userId);
  const count = await redis.get(key);
  
  if (count !== null) {
    return Number(count);
  }
  
  // Fallback: sync from index if key doesn't exist
  return await syncUnreadCountFromIndex(userId);
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(userId: string, notificationId: string) {
  const hashKey = notificationHashKey(notificationId);
  const zsetKey = listKeyForUser(userId);
  
  // Check if notification exists and belongs to user
  const existsInUserIndex = await redis.zscore(zsetKey, notificationId);
  if (existsInUserIndex === null) {
    return { success: false, error: 'Notification not found' };
  }
  
  // Check if already read
  const currentReadStatus = await redis.hget(hashKey, 'read');
  if (currentReadStatus === 'true') {
    return { success: true, alreadyRead: true };
  }
  
  // Mark as read
  await redis.hset(hashKey, 'read', 'true');
  await redis.expire(hashKey, TTL);
  
  // Decrement unread count
  const unreadKey = unreadCountKeyForUser(userId);
  await redis.decr(unreadKey);
  await redis.expire(unreadKey, TTL);
  
  return { success: true };
}

/**
 * Marks all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userId: string) {
  const zsetKey = listKeyForUser(userId);
  const notificationIds = await redis.zrevrange(zsetKey, 0, -1);
  
  if (notificationIds.length === 0) {
    return { success: true, marked: 0 };
  }
  
  const pipeline = redis.pipeline();
  for (const notificationId of notificationIds) {
    pipeline.hset(notificationHashKey(notificationId), 'read', 'true');
    pipeline.expire(notificationHashKey(notificationId), TTL);
  }
  
  await pipeline.exec();
  
  // Reset unread count to 0
  const unreadKey = unreadCountKeyForUser(userId);
  await redis.set(unreadKey, '0');
  await redis.expire(unreadKey, TTL);
  
  return { success: true, marked: notificationIds.length };
}

/**
 * Permanently deletes all notifications for user from Redis and DB mirror.
 */
export async function clearAllNotifications(userId: string) {
  const zsetKey = listKeyForUser(userId);
  const countKey = countKeyForUser(userId);

  const allIds = await redis.zrange(zsetKey, 0, -1);
  if (allIds.length > 0) {
    await deleteNotificationIdsFromIndexes(userId, allIds);
  }

  const conversationIndexPattern = conversationIndexKeyForUser(userId, "*");
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", conversationIndexPattern, "COUNT", 200);
    cursor = nextCursor;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");

  await redis.del(zsetKey);
  await redis.del(countKey);
  await redis.del(unreadCountKeyForUser(userId));
  await mirrorDeleteAllSystemNotifications(userId);

  return 0;
}

/**
 * Permanently deletes one notification by id from Redis and DB mirror.
 */
export async function deleteNotificationById(userId: string, notificationId: string) {
  const zsetKey = listKeyForUser(userId);
  const existsInUserIndex = await redis.zscore(zsetKey, notificationId);
  const deleted = existsInUserIndex !== null;

  let count = await syncCountFromIndex(userId);
  let unreadCount = await syncUnreadCountFromIndex(userId);
  
  if (deleted) {
    // Check if notification was unread before deletion
    const hashKey = notificationHashKey(notificationId);
    const wasRead = await redis.hget(hashKey, 'read');
    
    const newCounts = await deleteNotificationIdsFromIndexes(userId, [notificationId]);
    count = newCounts;
    
    // If it was unread, unread count was already decremented in deleteNotificationIdsFromIndexes
    unreadCount = newCounts;
  }

  await mirrorDeleteOneSystemNotification(userId, notificationId);

  return { deleted, count, unreadCount };
}

/**
 * Deletes all notifications associated with a direct chat conversation.
 */
export async function clearConversationNotifications(userId: string, conversationId: string) {
  const conversationKey = conversationIndexKeyForUser(userId, conversationId);
  const ids = await redis.zrange(conversationKey, 0, -1);
  const removed = ids.length;
  const count = await deleteNotificationIdsFromIndexes(userId, ids);
  await redis.del(conversationKey);
  await mirrorDeleteConversationSystemNotifications(userId, conversationId);

  return { removed, count };
}
