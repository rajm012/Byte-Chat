import { randomUUID } from 'crypto';
import { pool } from '../../lib/db.js';
import { redis } from '../../lib/redis.js';
import { emitToConversation, isUserOnline } from '../../socket/index.js';
import { queueOfflineMessage } from '../offlineMessage.service.js';
import { incrementUnread } from '../unread.service.js';
import { pushNotification } from '../notification.service.js';
import { getUserProfileCached } from '../userProfileCache.service.js';
import {getEncryptedSessionKeyCached} from '../messageDeliveryOptimization.service.js';
import { warmRegularConversationCacheForUsers } from './conversation.service.js';

const MESSAGE_POST_COMMIT_STREAM_KEY = 'queue:chat:message-post-commit';
const MESSAGE_POST_COMMIT_GROUP = 'chat-message-post-commit-workers';
const MESSAGE_POST_COMMIT_TTL_SECONDS = 7 * 24 * 60 * 60;
const MESSAGE_POST_COMMIT_WORKER_NAME = `${process.pid}:${randomUUID().slice(0, 8)}`;

type RegularMessagePostCommitJob = {
  messageId: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  messageType: string;
  dedupeToken: string;
  keyId?: string;
};

let workerStarted = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseJobPayload(rawFields: unknown): RegularMessagePostCommitJob | null {
  if (!Array.isArray(rawFields)) {
    return null;
  }

  for (let index = 0; index < rawFields.length; index += 2) {
    const fieldName = rawFields[index];
    const fieldValue = rawFields[index + 1];
    if (fieldName === 'payload' && typeof fieldValue === 'string') {
      try {
        const parsed = JSON.parse(fieldValue) as RegularMessagePostCommitJob;
        if (
          typeof parsed.messageId === 'string' &&
          typeof parsed.conversationId === 'string' &&
          typeof parsed.senderId === 'string' &&
          typeof parsed.recipientId === 'string' &&
          typeof parsed.messageType === 'string' &&
          typeof parsed.dedupeToken === 'string'
        ) {
          return parsed;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

async function loadSenderProfile(senderId: string): Promise<Record<string, unknown> | null> {
  const cachedProfile = await getUserProfileCached(senderId);
  if (cachedProfile) {
    return {
      user_id: senderId,
      name: cachedProfile.name,
      display_gender: cachedProfile.gender,
      dp_url: cachedProfile.dp_url,
      is_anonymous: false,
    };
  }

  const profileResult = await pool.query(
    `SELECT user_id, name, gender, dp_url
     FROM users
     WHERE user_id = $1
     LIMIT 1`,
    [senderId]
  );

  const profileRow = profileResult.rows[0];
  if (!profileRow) {
    return null;
  }

  return {
    user_id: profileRow.user_id,
    name: profileRow.name,
    display_gender: profileRow.gender,
    dp_url: profileRow.dp_url,
    is_anonymous: false,
  };
}

async function loadFullMessage(messageId: string): Promise<Record<string, unknown> | null> {
  const fullMessageResult = await pool.query(
    `SELECT
      cm.*,
      CASE
        WHEN cm.parent_message_id IS NOT NULL THEN jsonb_build_object(
          'message_id', pm.message_id,
          'encrypted_content', pm.encrypted_content,
          'content_iv', pm.content_iv,
          'content_auth_tag', pm.content_auth_tag,
          'sender', jsonb_build_object('name', pu.name)
        )
        ELSE null
      END as parent_message,
      NULL::text as user_session_key
    FROM chat_messages cm
    LEFT JOIN chat_messages pm ON cm.parent_message_id = pm.message_id
    LEFT JOIN users pu ON pm.sender_id = pu.user_id
    WHERE cm.message_id = $1`,
    [messageId]
  );

  return fullMessageResult.rows[0] ?? null;
}

async function getRecipientSessionKey(message: Record<string, unknown>, recipientId: string): Promise<string | null> {
  const keyId = message.key_id;
  if (typeof keyId !== 'string' || keyId.length === 0) {
    return null;
  }

  return getEncryptedSessionKeyCached(keyId, recipientId, async () => {
    const keyResult = await pool.query(
      `SELECT aes_key_encrypted
       FROM chat_session_keys
       WHERE session_key_id = $1 AND encrypted_for_user_id = $2
       LIMIT 1`,
      [keyId, recipientId]
    );

    return keyResult.rows[0]?.aes_key_encrypted ?? null;
  });
}

export async function processRegularMessagePostCommitJob(job: RegularMessagePostCommitJob): Promise<void> {
  const [message, senderProfile] = await Promise.all([
    loadFullMessage(job.messageId),
    loadSenderProfile(job.senderId),
  ]);

  if (!message || !senderProfile) {
    return;
  }

  const [recipientSessionKey, online] = await Promise.all([
    getRecipientSessionKey(message, job.recipientId),
    isUserOnline(job.recipientId),
  ]);

  await Promise.all([
    // CACHE DISABLED: Removed bumpMessagesCacheVersion
    warmRegularConversationCacheForUsers([job.senderId, job.recipientId]),
    // CACHE DISABLED: Removed cacheMessage
    incrementUnread(job.recipientId, job.conversationId),
  ]);

  if (!online) {
    await queueOfflineMessage(job.recipientId, message, job.dedupeToken);
  }

  await pushNotification(job.recipientId, {
    type: 'new_message',
    conversationId: job.conversationId,
    message: 'You received a new message',
    senderId: job.senderId,
    messageType: job.messageType,
    timestamp: Date.now(),
  });

  emitToConversation(job.conversationId, 'new-message', {
    ...message,
    user_session_key: recipientSessionKey,
    sender: senderProfile,
    is_my_message: false,
  });
}

async function ensureWorkerGroup(connection = redis): Promise<void> {
  try {
    await connection.xgroup('CREATE', MESSAGE_POST_COMMIT_STREAM_KEY, MESSAGE_POST_COMMIT_GROUP, '$', 'MKSTREAM');
  } catch (error: any) {
    if (typeof error?.message === 'string' && error.message.includes('BUSYGROUP')) {
      return;
    }

    throw error;
  }
}

async function acknowledgeJob(connection: typeof redis, entryId: string): Promise<void> {
  try {
    await connection.xack(MESSAGE_POST_COMMIT_STREAM_KEY, MESSAGE_POST_COMMIT_GROUP, entryId);
  } 
  catch {
    // Best-effort acknowledgement.
  }

  try {
    await connection.xdel(MESSAGE_POST_COMMIT_STREAM_KEY, entryId);
  } 
  catch {
    // Best-effort cleanup.
  }
}

export async function enqueueRegularMessagePostCommitJob(job: RegularMessagePostCommitJob): Promise<void> {
  try {
    await redis.xadd(MESSAGE_POST_COMMIT_STREAM_KEY, '*', 'payload', JSON.stringify(job));
  } 
  catch (error) {
    console.error('[MessageQueue] Failed to enqueue post-commit chat job, falling back to local processing:', error);
    void processRegularMessagePostCommitJob(job).catch((fallbackError) => {
      console.error('[MessageQueue] Fallback chat job processing failed:', fallbackError);
    });
  }
}

export function startRegularMessagePostCommitWorker(): void {
  if (workerStarted) {
    return;
  }

  workerStarted = true;
  void (async () => {
    const workerConnection = redis.duplicate();
    workerConnection.on('error', (error) => {
      console.error('[MessageQueue] Worker Redis error:', error);
    });

    try {
      await ensureWorkerGroup(workerConnection);
    } catch (error) {
      console.error('[MessageQueue] Failed to initialise chat message worker group:', error);
      return;
    }

    while (true) {
      try {
        const response = await (workerConnection as any).xreadgroup(
          'GROUP',
          MESSAGE_POST_COMMIT_GROUP,
          MESSAGE_POST_COMMIT_WORKER_NAME,
          'BLOCK',
          5000,
          'COUNT',
          10,
          'STREAMS',
          MESSAGE_POST_COMMIT_STREAM_KEY,
          '>'
        );

        if (!response) {
          continue;
        }

        for (const [, messages] of response as Array<[string, Array<[string, unknown]>]>) {
          for (const [entryId, rawFields] of messages) {
            const job = parseJobPayload(rawFields);
            if (!job) {
              await acknowledgeJob(workerConnection, entryId);
              continue;
            }

            try {
              await processRegularMessagePostCommitJob(job);
            } catch (error) {
              console.error('[MessageQueue] Chat post-commit job failed:', error);
            } finally {
              await acknowledgeJob(workerConnection, entryId);
            }
          }
        }
      } catch (error) {
        console.error('[MessageQueue] Chat worker loop error:', error);
        await sleep(1000);
      }
    }
  })();
}

export type { RegularMessagePostCommitJob };
export { MESSAGE_POST_COMMIT_TTL_SECONDS };
