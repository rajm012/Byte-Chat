import type { Request, Response } from 'express';
import type { PoolClient } from 'pg';
import { pool } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import {buildMessageDedupeToken, completeMessageDedupToken, 
  reserveMessageDedupToken } from '../messageDeliveryOptimization.service.js';
import { getEitherBlockedStatusCached, setEitherBlockedStatusCached } from '../blockCache.service.js';
import {enqueueRegularMessagePostCommitJob} from './message-post-commit-queue.service.js';

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

export async function handleSendMessage(req: Request, res: Response) {
  let client: PoolClient | null = null;
  try {
    const userId = req.user?.userId;
    const {
      conversationId,
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

    if (!conversationId || !encryptedContent || !contentIv || !contentAuthTag) {
      throw new ApiError(400, 'Missing required fields');
    }

    const convCheck = await pool.query(
      `SELECT * FROM chat_conversations
       WHERE conversation_id = $1
       AND (user1_id = $2 OR user2_id = $2)
       AND is_blocked = false
       AND (is_anonymous = false OR is_anonymous IS NULL)
       AND anonymous_initiator_id IS NULL`,
      [conversationId, userId]
    );

    if (convCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied or conversation blocked/not regular');
    }

    const conv = convCheck.rows[0];
    const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;

    const isBlocked = await isEitherUserBlocked(String(userId), String(otherUserId));
    if (isBlocked) {
      throw new ApiError(403, 'Cannot send message - user is blocked');
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
      scope: `conversation:${conversationId}`,
      senderId: String(userId),
      encryptedContent: String(encryptedContent),
      contentIv: String(contentIv),
      contentAuthTag: String(contentAuthTag),
    };

    if (typeof clientMessageId === 'string' && clientMessageId.length > 0) {
      dedupeInput.clientMessageId = clientMessageId;
    }
    if (typeof parentMessageId === 'string' && parentMessageId.length > 0) {
      dedupeInput.parentMessageId = parentMessageId;
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

      const existingMessage = existing.rows[0];
      if (existingMessage) {
        return res.status(200).json({
          success: true,
          message: 'Duplicate message ignored',
          duplicate: true,
          data: existingMessage
        });
      }
    }

    const transactionClient = await pool.connect();
    client = transactionClient;
    await transactionClient.query('BEGIN');

    const result = await transactionClient.query(
      `INSERT INTO chat_messages (
        conversation_id,
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
        conversationId,
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
        typeof parentMessageId === 'string' && parentMessageId.length > 0 ? parentMessageId : null
      ]
    );

    const message = result.rows[0];
    if (!message) {
      throw new ApiError(500, 'Failed to create message');
    }

    await transactionClient.query(
      'UPDATE chat_conversations SET last_message_at = NOW() WHERE conversation_id = $1',
      [conversationId]
    );

    await transactionClient.query('COMMIT');
    transactionClient.release();
    client = null;

    await completeMessageDedupToken(dedupeToken, String(message.message_id));

    const job = {
      messageId: String(message.message_id),
      conversationId: String(conversationId),
      senderId: String(userId),
      recipientId: String(otherUserId),
      messageType: typeof messageType === 'string' && messageType.length > 0 ? messageType : 'text',
      dedupeToken,
      ...(typeof keyId === 'string' && keyId.length > 0 ? { keyId } : {}),
    };

    await enqueueRegularMessagePostCommitJob(job);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  }
  catch (error) {
    if (client) {
      const rollbackClient = client;
      try {
        await rollbackClient.query('ROLLBACK');
      } catch {
        // Ignore rollback errors.
      } finally {
        rollbackClient.release();
      }
    }
    console.error('[MSGES] Send regular message error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to send regular message');
  }
}
