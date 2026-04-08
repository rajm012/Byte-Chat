import type { Request, Response } from 'express';
import * as crypto from 'crypto';
import { pool } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { cacheKeys, CACHE_TTL_SECONDS, getCacheJSON, setCacheJSON } from '../../utils/cache.util.js';
import { primeEncryptedSessionKeyCache } from '../messageDeliveryOptimization.service.js';

export async function handleGetParticipantPublicKeys(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) throw new ApiError(401, 'Unauthorized');

    const convCheck = await pool.query(
      `SELECT user1_id, user2_id, is_anonymous FROM chat_conversations
       WHERE conversation_id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [conversationId, userId]
    );

    if (convCheck.rows.length === 0) {
      throw new ApiError(403, 'Access denied to this conversation');
    }

    const { is_anonymous } = convCheck.rows[0];

    const cacheKey = cacheKeys.conversationPublicKeys(String(conversationId));
    let participants = await getCacheJSON<Array<Record<string, unknown>>>(cacheKey);

    if (!participants) {
      const result = await pool.query(
        `SELECT uek.user_id, uek.public_key, u.name
         FROM user_encryption_keys uek
         JOIN users u ON uek.user_id = u.user_id
         JOIN chat_conversations cc ON uek.user_id = cc.user1_id OR uek.user_id = cc.user2_id
         WHERE cc.conversation_id = $1`,
        [conversationId]
      );
      participants = result.rows;
      await setCacheJSON(cacheKey, participants, CACHE_TTL_SECONDS.USER_PUBLIC_KEYS);
    }

    res.json({
      success: true,
      data: {
        participants,
        isAnonymous: !!is_anonymous
      }
    });
  } catch (error) {
    console.error('[E2EE] Get participant public keys error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to fetch public keys');
  }
}

export async function handleStoreSessionKeys(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { conversationId, groupId, keys } = req.body;

    if (!userId) throw new ApiError(401, 'Unauthorized');
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      throw new ApiError(400, 'Keys array is required');
    }

    const sessionKeyGroupId = crypto.randomUUID();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const k of keys) {
        await client.query(
          `INSERT INTO chat_session_keys (
            session_key_id, conversation_id, group_id,
            aes_key_encrypted, aes_key_iv,
            encrypted_for_user_id, encrypted_with_key_version
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            sessionKeyGroupId,
            conversationId || null,
            groupId || null,
            k.encryptedKey,
            k.aesKeyIv || null,
            k.userId,
            k.keyVersion || 1
          ]
        );

        await primeEncryptedSessionKeyCache(
          String(sessionKeyGroupId),
          String(k.userId),
          String(k.encryptedKey)
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.status(201).json({
      success: true,
      data: {
        keyId: sessionKeyGroupId
      }
    });
  } catch (error) {
    console.error('[E2EE] Store session keys error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to store session keys');
  }
}
