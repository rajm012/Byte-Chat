import type { Request, Response } from 'express';
import { pool } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { cacheKeys, CACHE_TTL_SECONDS, getCacheJSON, setCacheJSON } from '../../utils/cache.util.js';
import { sendConditionalJson } from '../../utils/httpCache.util.js';
import { getEitherBlockedStatusCached, setEitherBlockedStatusCached } from '../blockCache.service.js';

const CONVERSATION_LIST_CACHE_METRIC = 'conversation_list';

export async function fetchRegularConversationsFromDb(userId: string): Promise<Array<Record<string, unknown>>> {
  const result = await pool.query(
    `SELECT
      cc.*,
      CASE
        WHEN cc.user1_id = $1 THEN u2.user_id
        ELSE u1.user_id
      END as other_user_id,
      CASE
        WHEN cc.user1_id = $1 THEN u2.name
        ELSE u1.name
      END as other_user_name,
      CASE
        WHEN cc.user1_id = $1 THEN u2.dp_url
        ELSE u1.dp_url
      END as other_user_dp,
      CASE
        WHEN cc.user1_id = $1 THEN u2.gender
        ELSE u1.gender
      END as other_user_gender,
      lm.encrypted_content as last_message_preview,
      lm.message_type as last_message_type,
      lm.created_at as last_message_time,
      (SELECT COUNT(*) FROM message_status ms
       JOIN chat_messages cm ON ms.message_id = cm.message_id
       WHERE cm.conversation_id = cc.conversation_id
       AND ms.user_id = $1
       AND ms.status != 'read'
       AND cm.sender_id != $1) as unread_count
    FROM chat_conversations cc
    LEFT JOIN users u1 ON cc.user1_id = u1.user_id
    LEFT JOIN users u2 ON cc.user2_id = u2.user_id
    LEFT JOIN LATERAL (
      SELECT * FROM chat_messages
      WHERE conversation_id = cc.conversation_id
      ORDER BY created_at DESC
      LIMIT 1
    ) lm ON true
    WHERE (cc.user1_id = $1 OR cc.user2_id = $1)
    AND cc.is_blocked = false
    AND (cc.is_anonymous = false OR cc.is_anonymous IS NULL)
    AND cc.anonymous_initiator_id IS NULL
    ORDER BY cc.last_message_at DESC`,
    [userId]
  );

  return result.rows as Array<Record<string, unknown>>;
}

export async function warmRegularConversationCacheForUsers(userIds: Array<string | null | undefined>): Promise<void> {
  const uniqueUserIds = Array.from(
    new Set(userIds.filter((id): id is string => Boolean(id)).map((id) => String(id)))
  );

  await Promise.all(
    uniqueUserIds.map(async (uid) => {
      try {
        const rows = await fetchRegularConversationsFromDb(uid);
        await setCacheJSON(
          cacheKeys.userConversations(uid),
          rows,
          CACHE_TTL_SECONDS.USER_CONVERSATIONS
        );
      } catch {
        // Fail open - write-through refresh is best-effort.
      }
    })
  );
}

async function isEitherUserBlocked(userA: string, userB: string): Promise<boolean> {
  const cached = await getEitherBlockedStatusCached(userA, userB);
  if (cached !== null) {
    return cached;
  }

  const blockCheck = await pool.query(
    `SELECT EXISTS(
      SELECT 1 FROM user_blocks
      WHERE (blocker_id = $1 AND blocked_id = $2)
         OR (blocker_id = $2 AND blocked_id = $1)
    ) as is_blocked`,
    [userA, userB]
  );

  const isBlocked = Boolean(blockCheck.rows[0]?.is_blocked);
  await setEitherBlockedStatusCached(userA, userB, isBlocked);
  return isBlocked;
}

export async function handleGetOrCreateConversation(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { otherUserId } = req.body;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!otherUserId) {
      throw new ApiError(400, 'Other user ID is required');
    }

    if (userId === otherUserId) {
      throw new ApiError(400, 'Cannot message yourself');
    }

    const isBlocked = await isEitherUserBlocked(String(userId), String(otherUserId));
    if (isBlocked) {
      throw new ApiError(403, 'Cannot message this user');
    }

    const user1Id = userId < otherUserId ? userId : otherUserId;
    const user2Id = userId < otherUserId ? otherUserId : userId;

    let conversationCreated = false;

    let conversation = await pool.query(
      `SELECT * FROM chat_conversations
       WHERE user1_id = $1 AND user2_id = $2 AND anonymous_initiator_id IS NULL`,
      [user1Id, user2Id]
    );

    if (!conversation || conversation.rows.length === 0) {
      try {
        conversation = await pool.query(
          `INSERT INTO chat_conversations (
            user1_id, user2_id, is_anonymous, anonymous_initiator_id, is_accepted
          ) VALUES ($1, $2, false, NULL, true) RETURNING *`,
          [user1Id, user2Id]
        );
        conversationCreated = true;
      }
      catch (insertError: any) {
        if (insertError.code === '23505') {
          conversation = await pool.query(
            `SELECT * FROM chat_conversations
             WHERE user1_id = $1 AND user2_id = $2 AND anonymous_initiator_id IS NULL`,
            [user1Id, user2Id]
          );
        }
        else {
          throw insertError;
        }
      }
    }

    if (conversationCreated) {
      await warmRegularConversationCacheForUsers([String(userId), String(otherUserId)]);
    }

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation.rows[0].conversation_id
      }
    });
  }
  catch (error: any) {
    console.error('[ERROR] Get or create regular conversation error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      userId: req.user?.userId,
      otherUserId: req.body?.otherUserId
    });

    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to create regular conversation');
  }
}

export async function handleGetConversations(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const conversationsCacheKey = cacheKeys.userConversations(String(userId));
    const cachedConversations = await getCacheJSON<Array<Record<string, unknown>>>(
      conversationsCacheKey,
      CONVERSATION_LIST_CACHE_METRIC
    );

    if (cachedConversations) {
      return sendConditionalJson(req, res, {
        success: true,
        data: cachedConversations
      }, {
        maxAgeSeconds: 15,
        cacheStatus: 'HIT'
      });
    }

    const rows = await fetchRegularConversationsFromDb(String(userId));

    await setCacheJSON(
      conversationsCacheKey,
      rows,
      CACHE_TTL_SECONDS.USER_CONVERSATIONS
    );

    return sendConditionalJson(req, res, {
      success: true,
      data: rows
    }, {
      maxAgeSeconds: 15,
      cacheStatus: 'MISS'
    });
  }
  catch (error) {
    console.error('[ERROR] Get regular conversations error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to fetch regular conversations');
  }
}
