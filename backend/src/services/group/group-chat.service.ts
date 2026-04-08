import type { Request, Response } from 'express';
import { pool } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { io } from '../../index.js';
import { isUserOnline } from '../../socket/index.js';
import { uploadToCloudinary } from '../../utils/cloudinary.util.js';
import { cacheMessage } from '../messageCache.service.js';
import { queueOfflineMessage } from '../offlineMessage.service.js';
import { incrementUnread, resetUnread } from '../unread.service.js';
import { cacheKeys, CACHE_TTL_SECONDS, getCacheJSON, setCacheJSON } from '../../utils/cache.util.js';
import { buildMessageDedupeToken, completeMessageDedupToken, 
    reserveMessageDedupToken} from '../messageDeliveryOptimization.service.js';

export const getGroupMessages = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { limit = 50, before, q } = req.query;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const memberCheck = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied to this group');
    }

    const parsedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const searchQuery = typeof q === 'string' ? q.trim() : '';
    const queryParams: Array<string | number> = [String(groupId), String(userId), parsedLimit];

    let beforeClause = '';
    if (before) {
      queryParams.push(String(before));
      beforeClause = `AND cm.created_at < $${queryParams.length}`;
    }

    let searchClause = '';
    if (searchQuery.length > 0) {
      queryParams.push(searchQuery);
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
        jsonb_build_object(
          'user_id', u.user_id,
          'name', u.name,
          'roll_no', u.roll_no,
          'display_gender', u.gender,
          'dp_url', u.dp_url,
          'is_anonymous', false
        ) as sender,
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
        sk.aes_key_encrypted as user_session_key,
        (
          SELECT json_build_object(
            'message_id', pm.message_id,
            'encrypted_content', pm.encrypted_content,
            'content_iv', pm.content_iv,
            'content_auth_tag', pm.content_auth_tag,
            'sender', json_build_object('name', pu.name)
          )
          FROM chat_messages pm
          LEFT JOIN users pu ON pm.sender_id = pu.user_id
          WHERE pm.message_id = cm.parent_message_id
        ) as parent_message
      FROM chat_messages cm
      LEFT JOIN users u ON cm.sender_id = u.user_id
      LEFT JOIN chat_session_keys sk ON cm.key_id = sk.session_key_id AND sk.encrypted_for_user_id = $2
      WHERE cm.group_id = $1
      ${beforeClause}
      ${searchClause}
      AND cm.is_deleted = false
      AND cm.deleted_for_everyone = false
      AND NOT ($2::uuid = ANY(COALESCE(cm.deleted_for_user_ids, ARRAY[]::uuid[])))
      ORDER BY cm.created_at DESC
      LIMIT $3`,
      queryParams
    );

    await resetUnread(userId, groupId as string);

    res.json({
      success: true,
      data: {
        messages: result.rows.reverse()
      }
    });
  } catch (error: any) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
};

export const sendGroupMessage = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;
  const {
    encryptedContent,
    contentIv,
    contentAuthTag,
    messageType = 'text',
    mediaUrl,
    mediaSize,
    mediaMimeType,
    thumbnailUrl,
    keyId,
    parentMessageId,
    clientMessageId
  } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!encryptedContent || !contentIv || !contentAuthTag) {
    throw new ApiError(400, 'Missing required fields');
  }

  const memberCheck = await pool.query(
    `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  );

  if (memberCheck.rows.length === 0) {
    throw new ApiError(403, 'Access denied to this group');
  }

  const dedupeInput: {
    scope: string;
    senderId: string;
    encryptedContent: string;
    contentIv: string;
    contentAuthTag: string;
    clientMessageId?: string;
    parentMessageId?: string;
    messageType?: string;
  } = {
    scope: `group:${groupId}`,
    senderId: String(userId),
    encryptedContent: String(encryptedContent),
    contentIv: String(contentIv),
    contentAuthTag: String(contentAuthTag),
  };

  if (typeof clientMessageId === 'string' && clientMessageId.length > 0) {
    dedupeInput.clientMessageId = clientMessageId;
  }
  if (parentMessageId) {
    dedupeInput.parentMessageId = String(parentMessageId);
  }
  if (typeof messageType === 'string' && messageType.length > 0) {
    dedupeInput.messageType = messageType;
  }

  const dedupeToken = buildMessageDedupeToken(dedupeInput);

  const dedupeState = await reserveMessageDedupToken(dedupeToken);
  if (!dedupeState.reserved && dedupeState.existingMessageId) {
    const existing = await pool.query(
      'SELECT * FROM chat_messages WHERE message_id = $1',
      [dedupeState.existingMessageId]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Duplicate message ignored',
        duplicate: true,
        data: existing.rows[0]
      });
    }
  }

  const result = await pool.query(
    `INSERT INTO chat_messages (
      group_id,
      sender_id,
      message_type,
      encrypted_content,
      content_iv,
      content_auth_tag,
      media_url,
      media_size,
      media_mime_type,
      thumbnail_url,
      is_anonymous,
      anonymous_identity_id,
      key_id,
      parent_message_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, NULL, $11, $12)
    RETURNING *`,
    [
      groupId,
      userId,
      messageType,
      encryptedContent,
      contentIv,
      contentAuthTag,
      mediaUrl,
      mediaSize,
      mediaMimeType,
      thumbnailUrl,
      keyId,
      parentMessageId
    ]
  );

  const messageId = result.rows[0].message_id;
  await completeMessageDedupToken(dedupeToken, String(messageId));

  if (io) {
    const fullMessage = await pool.query(
      `SELECT
        cm.*,
        jsonb_build_object(
          'user_id', u.user_id,
          'name', u.name,
          'roll_no', u.roll_no,
          'display_gender', u.gender,
          'dp_url', u.dp_url,
          'is_anonymous', false
        ) as sender,
        (
          SELECT json_build_object(
            'message_id', pm.message_id,
            'encrypted_content', pm.encrypted_content,
            'content_iv', pm.content_iv,
            'content_auth_tag', pm.content_auth_tag,
            'sender', json_build_object('name', pu.name)
          )
          FROM chat_messages pm
          LEFT JOIN users pu ON pm.sender_id = pu.user_id
          WHERE pm.message_id = cm.parent_message_id
        ) as parent_message
      FROM chat_messages cm
      LEFT JOIN users u ON cm.sender_id = u.user_id
      WHERE cm.message_id = $1`,
      [messageId]
    );

    io.to(`group:${groupId}`).emit('new-group-message', fullMessage.rows[0]);
  }

  const groupMessage = result.rows[0];
  await cacheMessage(groupId as string, groupMessage);

  const members = await pool.query(
    'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2',
    [groupId, userId]
  );

  for (const member of members.rows) {
    const memberId = member.user_id;
    await incrementUnread(memberId, groupId as string);

    const online = await isUserOnline(memberId);
    if (!online) {
      await queueOfflineMessage(memberId, groupMessage, `${dedupeToken}:${memberId}`);
    }
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

export const uploadGroupChatImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { groupId } = req.params;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const memberCheck = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied to this group');
    }

    if (!req.file) {
      throw new ApiError(400, 'No image file provided');
    }

    if (req.file.size > 5 * 1024 * 1024) {
      throw new ApiError(400, 'Image size must be less than 5MB');
    }

    const randomStr = Math.random().toString(36).substring(2, 10);
    const uniqueId = `group_${groupId}_${userId}_${Date.now()}_${randomStr}`;
    const result = await uploadToCloudinary(
      req.file.buffer,
      'chat_images',
      uniqueId,
      true
    );

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: req.file.size,
        mimeType: req.file.mimetype,
      }
    });

  } catch (error) {
    console.error('[ERROR] Upload group chat image error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to upload image');
  }
};

export async function getGroupParticipantPublicKeys(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { groupId } = req.params;

    if (!userId) throw new ApiError(401, 'Unauthorized');

    const memberCheck = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied to this group');
    }

    const cacheKey = cacheKeys.groupPublicKeys(String(groupId));
    let participants = await getCacheJSON<Array<Record<string, unknown>>>(cacheKey);

    if (!participants) {
      const result = await pool.query(
        `SELECT u.user_id, uek.public_key, u.name
         FROM group_members gm
         JOIN users u ON gm.user_id = u.user_id
         JOIN user_encryption_keys uek ON u.user_id = uek.user_id
         WHERE gm.group_id = $1`,
        [groupId]
      );
      participants = result.rows;
      await setCacheJSON(cacheKey, participants, CACHE_TTL_SECONDS.USER_PUBLIC_KEYS);
    }

    res.json({
      success: true,
      data: {
        participants
      }
    });
  } catch (error) {
    console.error('[E2EE] Get group participant public keys error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to fetch group public keys');
  }
}

export const getGroupOnlineCount = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const memberCheck = await pool.query(
    'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2',
    [groupId, userId]
  );
  if (memberCheck.rows.length === 0) throw new ApiError(403, 'You are not a member of this group');

  const membersResult = await pool.query(
    'SELECT user_id FROM group_members WHERE group_id = $1',
    [groupId]
  );

  const { isUserOnline } = await import('../presence.service.js');
  const checks = await Promise.all(membersResult.rows.map(r => isUserOnline(r.user_id)));
  const onlineCount = checks.filter(Boolean).length;

  res.json({ success: true, data: { onlineCount, totalMembers: membersResult.rows.length } });
};
