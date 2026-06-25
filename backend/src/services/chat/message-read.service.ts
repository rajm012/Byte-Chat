import type { Request, Response } from 'express';
import { pool } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { getUserProfileCached } from '../userProfileCache.service.js';
import { resetUnread } from '../unread.service.js';
import { warmRegularConversationCacheForUsers } from './conversation.service.js';

function cursorToString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return null;
}

async function fetchRegularMessagesPage(params: {
  conversationId: string;
  userId: string;
  limit: number;
  before: string | null;
  searchQuery: string;
}): Promise<Array<Record<string, unknown>>> {
  const queryParams: Array<string | number> = [params.conversationId, params.userId, params.limit];

  let beforeClause = '';
  if (params.before) {
    queryParams.push(params.before);
    beforeClause = `AND cm.created_at < $${queryParams.length}`;
  }

  let searchClause = '';
  if (params.searchQuery.length > 0) {
    queryParams.push(params.searchQuery);
    const searchParam = queryParams.length;
    searchClause = `
      AND (
        cm.encrypted_content ILIKE '%' || $${searchParam} || '%'
        OR u.name ILIKE '%' || $${searchParam} || '%'
        OR u.roll_no ILIKE '%' || $${searchParam} || '%'
        OR cm.message_type ILIKE '%' || $${searchParam} || '%'
      )`;
  }

  const result = await pool.query(
    `SELECT
      cm.*,
      (cm.sender_id = $2) as is_my_message,
      CASE
        WHEN cm.sender_id != $2 THEN jsonb_build_object(
          'user_id', u.user_id,
          'name', u.name,
          'roll_no', u.roll_no,
          'display_gender', u.gender,
          'dp_url', u.dp_url,
          'is_anonymous', false
        )
        ELSE null
      END as sender,
      CASE
        WHEN cm.parent_message_id IS NOT NULL THEN jsonb_build_object(
          'message_id', pm.message_id,
          'encrypted_content', pm.encrypted_content,
          'content_iv', pm.content_iv,
          'content_auth_tag', pm.content_auth_tag,
          'sender', jsonb_build_object(
            'name', pu.name
          )
        )
        ELSE null
      END as parent_message,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'emoji', r.emoji,
              'count', r.count,
              'users', r.users
            )
          )
          FROM (
            SELECT
              mr.emoji,
              COUNT(*)::int as count,
              json_agg(
                json_build_object(
                  'user_id', ru.user_id,
                  'name', ru.name
                ) ORDER BY mr.created_at
              ) as users
            FROM message_reactions mr
            JOIN users ru ON mr.user_id = ru.user_id
            WHERE mr.message_id = cm.message_id
            GROUP BY mr.emoji
          ) r
        ),
        '[]'::json
      ) as reactions,
      sk.aes_key_encrypted as user_session_key
    FROM chat_messages cm
    LEFT JOIN users u ON cm.sender_id = u.user_id
    LEFT JOIN chat_messages pm ON cm.parent_message_id = pm.message_id
    LEFT JOIN users pu ON pm.sender_id = pu.user_id
    LEFT JOIN chat_session_keys sk ON cm.key_id = sk.session_key_id AND sk.encrypted_for_user_id = $2
    WHERE cm.conversation_id = $1
    ${beforeClause}
    ${searchClause}
    AND cm.is_deleted = false
    AND cm.deleted_for_everyone = false
    AND NOT ($2::uuid = ANY(COALESCE(cm.deleted_for_user_ids, ARRAY[]::uuid[])))
    ORDER BY cm.created_at DESC
    LIMIT $3`,
    queryParams
  );

  return result.rows as Array<Record<string, unknown>>;
}

export async function handleGetMessages(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;
    const { limit = 50, before, q, prefetchNext = '1' } = req.query;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const convCheck = await pool.query(
      `SELECT * FROM chat_conversations
       WHERE conversation_id = $1
       AND (user1_id = $2 OR user2_id = $2)
       AND (is_anonymous = false OR is_anonymous IS NULL)
       AND anonymous_initiator_id IS NULL`,
      [conversationId, userId]
    );

    if (convCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied to this conversation');
    }

    const conversation = convCheck.rows[0];
    const otherUserId = conversation.user1_id === userId ? conversation.user2_id : conversation.user1_id;

    const otherUserInfo = await getUserProfileCached(String(otherUserId));
    if (!otherUserInfo) {
      throw new ApiError(404, 'Other user not found');
    }

    const otherUserData = {
      user_id: otherUserInfo.user_id,
      name: otherUserInfo.name,
      roll_no: otherUserInfo.roll_no,
      gender: otherUserInfo.gender,
      dp_url: otherUserInfo.dp_url,
      is_anonymous: false
    };

    const parsedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const searchQuery = typeof q === 'string' ? q.trim() : '';
    const beforeCursor = typeof before === 'string' && before.trim().length > 0 ? before.trim() : null;

    // CACHE DISABLED: Always fetch fresh from database to prevent stale messages
    // This fixes AWS deployment issues where cache invalidation wasn't working
    const rowsDesc = await fetchRegularMessagesPage({
      conversationId: String(conversationId),
      userId: String(userId),
      limit: parsedLimit,
      before: beforeCursor,
      searchQuery,
    });

    const hasMore = rowsDesc.length === parsedLimit;
    const oldestRow = rowsDesc[rowsDesc.length - 1];
    const nextCursor = hasMore ? cursorToString(oldestRow?.created_at) : null;

    const pagePayload = {
      messages: [...rowsDesc].reverse(),
      hasMore,
      nextCursor,
    };

    if (!beforeCursor && searchQuery.length === 0) {
      await pool.query(
        `UPDATE message_status ms
         SET status = 'read', read_at = NOW()
         FROM chat_messages cm
         WHERE ms.message_id = cm.message_id
           AND ms.user_id = $1
           AND cm.conversation_id = $2
           AND cm.sender_id != $1
           AND ms.status != 'read'`,
        [userId, conversationId]
      );

      await resetUnread(userId, conversationId as string);
      await warmRegularConversationCacheForUsers([String(userId)]);
    }

    res.json({
      success: true,
      data: {
        conversation: conversation,
        messages: pagePayload.messages,
        hasMore: pagePayload.hasMore,
        nextCursor: pagePayload.nextCursor,
        otherUser: otherUserData
      }
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 403) {
      // expected for anonymous detection flow
    } else {
      console.error('[ERROR] Get regular messages error:', error);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to fetch regular messages');
  }
}

export async function handleUpdateMessageStatus(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { messageId } = req.params;
    const { status } = req.body;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!status || !['delivered', 'read'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const result = await pool.query(
      `UPDATE message_status
       SET status = $1,
           ${status === 'delivered' ? 'delivered_at = NOW()' : 'read_at = NOW()'}
       WHERE message_id = $2 AND user_id = $3
       RETURNING *`,
      [status, messageId, userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, 'Message status not found');
    }

    res.json({
      success: true,
      message: 'Message status updated',
      data: result.rows[0]
    });
  }
  catch (error) {
    console.error('[ERROR] Update message status error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to update message status');
  }
}
