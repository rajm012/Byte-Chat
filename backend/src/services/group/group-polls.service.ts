import type { Request, Response } from 'express';
import { pool, query } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { io } from '../../index.js';
import { pushNotification } from '../notification.service.js';
import {clearPollCache, getLiveGeneralPollOptions, getLivePoll, initGeneralPollOptionsCache, initPollCache, 
    rollbackGeneralPollVote, rollbackVotePoll, voteGeneralPoll, votePoll } from '../pollCache.service.js';
import { getUserPermissionSetCached } from '../authCache.service.js';

export const getPollResults = async (req: Request, res: Response) => {
  const { groupId, pollId } = req.params;
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const permissionSet = await getUserPermissionSetCached(userId);
  const isMember = permissionSet.groupRoles.some(r => r.groupId === groupId);
  if (!isMember) throw new ApiError(403, 'You are not a member of this group');

  const pollRes = await query(`SELECT * FROM polls WHERE poll_id = $1 AND group_id = $2`, [pollId, groupId]);
  if (pollRes.rows.length === 0) throw new ApiError(404, 'Poll not found');
  const poll = pollRes.rows[0];

  if (poll.poll_type === 'General') {
    const optionsRes = await query(`SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY option_order`, [pollId]);
    const options = optionsRes.rows;
    const votesRes = await query(
      `SELECT option_id, COUNT(*) as votes FROM votes WHERE poll_id = $1 GROUP BY option_id`,
      [pollId]
    );
    const voteCounts: Record<string, number> = {};
    for (const v of votesRes.rows) voteCounts[v.option_id] = Number(v.votes);
    const optionsWithVotes = options.map(opt => ({ ...opt, votes: voteCounts[opt.option_id] || 0 }));
    res.json({ success: true, data: { poll, options: optionsWithVotes } });
  } else {
    const votesRes = await query(
      `SELECT vote_value, COUNT(*) as votes FROM votes WHERE poll_id = $1 GROUP BY vote_value`,
      [pollId]
    );
    const counts: Record<string, number> = {};
    for (const v of votesRes.rows) counts[String(v.vote_value)] = Number(v.votes);
    res.json({ success: true, data: { poll, votes: counts } });
  }
};

export const createPoll = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { poll_type, title, description, target_user_id, expires_in_hours = 6, options } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const validPollTypes = ['kick_member', 'make_admin', 'remove_admin', 'General'];
  if (!validPollTypes.includes(poll_type)) {
    throw new ApiError(400, 'Invalid poll type');
  }

  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Poll title is required');
  }

  const hoursNum = Math.min(24, Math.max(1, Number(expires_in_hours) || 6));

  if (poll_type === 'General') {
    if (!Array.isArray(options) || options.length < 2) {
      throw new ApiError(400, 'General polls require at least 2 options');
    }
    for (const opt of options) {
      if (typeof opt !== 'string' || !opt.trim()) {
        throw new ApiError(400, 'Each option must be a non-empty string');
      }
    }
  }

  const memberPollTypes = ['kick_member', 'make_admin', 'remove_admin'];
  if (memberPollTypes.includes(poll_type) && !target_user_id) {
    throw new ApiError(400, `Poll type '${poll_type}' requires a target_user_id`);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const memberRow = await client.query(
      `SELECT is_admin, is_owner FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (memberRow.rows.length === 0) {
      throw new ApiError(403, 'You are not a member of this group');
    }

    if (target_user_id) {
      if (target_user_id === userId) {
        throw new ApiError(400, 'You cannot create a poll targeting yourself');
      }
      const targetCheck = await client.query(
        `SELECT is_owner FROM group_members WHERE group_id = $1 AND user_id = $2`,
        [groupId, target_user_id]
      );
      if (targetCheck.rows.length === 0) {
        throw new ApiError(404, 'Target user is not a member of this group');
      }
      if (targetCheck.rows[0].is_owner) {
        throw new ApiError(403, 'The group owner cannot be targeted by polls');
      }
    }

    const dupCheck = await client.query(
      `SELECT poll_id FROM polls
       WHERE group_id = $1
         AND poll_type = $2
         AND status = 'active'
         AND($3:: UUID IS NULL OR target_user_id = $3:: UUID)`,
      [groupId, poll_type, target_user_id || null]
    );
    if (dupCheck.rows.length > 0) {
      throw new ApiError(400, 'An active poll of this type already exists for this target');
    }

    const memberCountResult = await client.query(
      `SELECT COUNT(*) as count FROM group_members WHERE group_id = $1`,
      [groupId]
    );
    const memberCount = parseInt(memberCountResult.rows[0].count);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hoursNum);

    const pollResult = await client.query(
      `INSERT INTO polls(
        group_id, created_by, target_user_id, poll_type,
        title, description, total_voters, expires_at
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING * `,
      [
        groupId,
        userId,
        target_user_id || null,
        poll_type,
        title.trim(),
        description?.trim() || null,
        memberCount,
        expiresAt,
      ]
    );

    const poll = pollResult.rows[0];

    if (poll_type === 'General') {
      for (let i = 0; i < options.length; i++) {
        await client.query(
          `INSERT INTO poll_options(poll_id, option_text, option_order) VALUES($1, $2, $3)`,
          [poll.poll_id, options[i], i]
        );
      }
    }

    await client.query('COMMIT');

    let pollWithOptions = poll;
    if (poll_type === 'General') {
      const optsRes = await client.query(`SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY option_order`, [poll.poll_id]);
      pollWithOptions = { ...poll, options: optsRes.rows };

      await initGeneralPollOptionsCache(
        poll.poll_id,
        optsRes.rows.map((opt: { option_id: string }) => opt.option_id),
        poll.expires_at
      );
    }

    await initPollCache(poll.poll_id, poll);

    const groupMembersRes = await client.query(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2',
      [groupId, userId]
    );
    for (const row of groupMembersRes.rows) {
      await pushNotification(row.user_id, {
        type: 'poll_created',
        pollId: poll.poll_id,
        pollType: poll_type,
        groupId,
        createdBy: userId,
        timestamp: Date.now()
      });
    }

    io.to(`group:${groupId}`).emit('new-poll', pollWithOptions);

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: pollWithOptions,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating poll:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Failed to create poll');
  } finally {
    client.release();
  }
};

export const getGroupPolls = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;
  const { status = 'active' } = req.query;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(403, 'You are not a member of this group');
    }

    let queryText = `
      SELECT
        p.*,
        u.name as creator_name,
        u.roll_no as creator_roll_no,
        tu.name as target_name,
        tu.roll_no as target_roll_no,
        EXISTS(
          SELECT 1 FROM votes v
            WHERE v.poll_id = p.poll_id
            AND v.user_id = $2
        ) as has_voted,
        (
          SELECT vote_value FROM votes v
            WHERE v.poll_id = p.poll_id
            AND v.user_id = $2
        ) as user_vote
      FROM polls p
      JOIN users u ON p.created_by = u.user_id
      LEFT JOIN users tu ON p.target_user_id = tu.user_id
      WHERE p.group_id = $1
    `;

    const params: any[] = [groupId, userId];

    if (status && status !== 'all') {
      queryText += ` AND p.status = $3`;
      params.push(status);
    }

    queryText += ` ORDER BY p.created_at DESC`;

    const result = await query(queryText, params);

    const polls = result.rows;
    const pollIds = polls.filter(p => p.poll_type === 'General').map(p => p.poll_id);
    let optionsMap: Record<string, any[]> = {};
    if (pollIds.length > 0) {
      const optsRes = await query(
        `SELECT * FROM poll_options WHERE poll_id = ANY($1) ORDER BY option_order`,
        [pollIds]
      );

      for (const opt of optsRes.rows) {
        const pollId = opt.poll_id;
        if (pollId !== undefined && pollId !== null) {
          if (!optionsMap[pollId]) optionsMap[pollId] = [];
          optionsMap[pollId].push(opt);
        }
      }
    }
    const pollsWithOptions = polls.map(p =>
      p.poll_type === 'General' ? { ...p, options: optionsMap[p.poll_id] || [] } : p
    );

    res.json({
      success: true,
      data: pollsWithOptions
    });
  }
  catch (error: any) {
    console.error('Error fetching group polls:', error);
    throw error;
  }
};

export const voteOnPoll = async (req: Request, res: Response) => {
  const { groupId, pollId } = req.params;
  const { vote_value, option_id } = req.body;
  const userId = req.user?.userId;

  if (!userId) throw new ApiError(401, 'Unauthorized');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const memberCheck = await client.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (memberCheck.rows.length === 0) throw new ApiError(403, 'You are not a member of this group');

    const pollResult = await client.query(
      `SELECT poll_id, status, expires_at, poll_type, target_user_id
       FROM polls
       WHERE poll_id = $1 AND group_id = $2
       FOR UPDATE`,
      [pollId, groupId]
    );
    if (pollResult.rows.length === 0) throw new ApiError(404, 'Poll not found in this group');
    const poll = pollResult.rows[0];


    if (poll.status !== 'active') {
      throw new ApiError(400, `Cannot vote on a ${poll.status} poll`);
    }
    if (new Date(poll.expires_at) <= new Date()) {
      await client.query(
        `UPDATE polls SET status = 'expired', updated_at = NOW() WHERE poll_id = $1`,
        [pollId]
      );
      await client.query('COMMIT');
      io.to(`group:${groupId}`).emit('poll-expired', { poll_id: pollId, group_id: groupId });
      throw new ApiError(400, 'This poll has expired');
    }
    if (poll.poll_type === 'kick_member' && poll.target_user_id === userId) {
      throw new ApiError(403, 'You cannot vote on a poll targeting you for removal');
    }

    let insertResult;

    if (poll.poll_type === 'General') {
      if (!option_id) throw new ApiError(400, 'option_id is required for General polls');
      const optRes = await client.query(`SELECT 1 FROM poll_options WHERE poll_id = $1 AND option_id = $2`, [pollId, option_id]);
      if (optRes.rows.length === 0) throw new ApiError(400, 'Invalid option_id');

      const cacheResult = await voteGeneralPoll(pollId as string, userId, option_id as string);
      if (!cacheResult.applied) {
        throw new ApiError(400, 'You have already voted on this poll');
      }

      try {
        insertResult = await client.query(
          `INSERT INTO votes(poll_id, user_id, option_id)
           VALUES($1, $2, $3)
           ON CONFLICT(poll_id, user_id)
             WHERE user_id IS NOT NULL
           DO NOTHING
           RETURNING poll_id`,
          [pollId, userId, option_id]
        );

        if (insertResult.rows.length === 0) {
          await rollbackGeneralPollVote(pollId as string, userId, option_id as string);
          throw new ApiError(400, 'You have already voted on this poll');
        }
      } catch (dbErr) {
        await rollbackGeneralPollVote(pollId as string, userId, option_id as string);
        throw dbErr;
      }
    } else {
      if (typeof vote_value !== 'boolean') {
        throw new ApiError(400, 'vote_value must be a boolean (true = yes, false = no)');
      }

      const cacheResult = await votePoll(pollId as string, userId, vote_value);
      if (!cacheResult.applied) {
        throw new ApiError(400, 'You have already voted on this poll');
      }

      try {
        insertResult = await client.query(
          `INSERT INTO votes(poll_id, user_id, vote_value)
           VALUES($1, $2, $3)
           ON CONFLICT(poll_id, user_id)
             WHERE user_id IS NOT NULL
           DO NOTHING
           RETURNING poll_id`,
          [pollId, userId, vote_value]
        );

        if (insertResult.rows.length === 0) {
          await rollbackVotePoll(pollId as string, userId, vote_value);
          throw new ApiError(400, 'You have already voted on this poll');
        }
      } catch (dbErr) {
        await rollbackVotePoll(pollId as string, userId, vote_value);
        throw dbErr;
      }
    }

    await client.query('COMMIT');

    const finalPoll = await query(
      `SELECT p.*,
        u.name  AS creator_name,
        tu.name AS target_name
       FROM polls p
       JOIN  users u  ON p.created_by = u.user_id
       LEFT JOIN users tu ON p.target_user_id = tu.user_id
       WHERE p.poll_id = $1`,
      [pollId]
    );
    const updatedPoll = finalPoll.rows[0];

    const liveVotes = await getLivePoll(pollId as string);
    if (liveVotes) {
      updatedPoll.votes_for = liveVotes.votesFor;
      updatedPoll.votes_against = liveVotes.votesAgainst;
      updatedPoll.total_voters = liveVotes.totalVoters;
    }

    if (poll.poll_type === 'General') {
      const optionsRes = await query(
        `SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY option_order`,
        [pollId]
      );
      const optionVotes = await getLiveGeneralPollOptions(pollId as string);

      updatedPoll.options = optionsRes.rows.map((opt: { option_id: string }) => ({
        ...opt,
        votes: optionVotes[opt.option_id] ?? 0,
      }));
    }

    io.to(`group:${groupId}`).emit('poll-updated', updatedPoll);

    res.json({
      success: true,
      message: 'Vote cast successfully',
      data: { poll: updatedPoll, user_vote: poll.poll_type === 'General' ? option_id : vote_value },
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error voting on poll:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Failed to cast vote');
  } finally {
    client.release();
  }
};

export const cancelPoll = async (req: Request, res: Response) => {
  const { groupId, pollId } = req.params;
  const { reason } = req.body;
  const userId = req.user?.userId;

  if (!userId) throw new ApiError(401, 'Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const memberRow = await client.query(
      `SELECT is_admin, is_owner FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (memberRow.rows.length === 0) {
      throw new ApiError(403, 'You are not a member of this group');
    }
    const { is_admin, is_owner } = memberRow.rows[0];

    const pollRow = await client.query(
      `SELECT poll_id, status, created_by FROM polls
       WHERE poll_id = $1 AND group_id = $2`,
      [pollId, groupId]
    );
    if (pollRow.rows.length === 0) {
      throw new ApiError(404, 'Poll not found');
    }
    const poll = pollRow.rows[0];

    if (poll.status !== 'active') {
      throw new ApiError(400, `Cannot cancel a ${poll.status} poll`);
    }

    const isCreator = poll.created_by === userId;
    if (!isCreator && !is_admin && !is_owner) {
      throw new ApiError(403, 'Only the poll creator or a group admin can cancel this poll');
    }

    await client.query(
      `UPDATE polls
       SET status = 'cancelled',
           cancelled_by = $1,
           cancellation_reason = $2,
           updated_at = NOW()
       WHERE poll_id = $3`,
      [userId, reason?.trim() || null, pollId]
    );

    await client.query('COMMIT');

    await clearPollCache(pollId as string);

    io.to(`group:${groupId}`).emit('poll-cancelled', {
      poll_id: pollId,
      group_id: groupId,
      cancelled_by: userId,
    });

    res.json({
      success: true,
      message: 'Poll cancelled successfully',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error cancelling poll:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Failed to cancel poll');
  } finally {
    client.release();
  }
};

export const executePoll = async (req: Request, res: Response) => {
  const { groupId, pollId } = req.params;
  const userId = req.user?.userId;

  if (!userId) throw new ApiError(401, 'Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adminRow = await client.query(
      `SELECT is_admin, is_owner FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (adminRow.rows.length === 0) {
      throw new ApiError(403, 'You are not a member of this group');
    }
    if (!adminRow.rows[0].is_admin && !adminRow.rows[0].is_owner) {
      throw new ApiError(403, 'Only group admins can manually execute a poll');
    }

    const pollRow = await client.query(
      `SELECT * FROM polls WHERE poll_id = $1 AND group_id = $2 FOR UPDATE`,
      [pollId, groupId]
    );
    if (pollRow.rows.length === 0) {
      throw new ApiError(404, 'Poll not found');
    }
    const poll = pollRow.rows[0];

    if (poll.status !== 'passed') {
      throw new ApiError(400, `Poll must be in 'passed' status to execute(current: ${poll.status})`);
    }
    if (poll.is_executed) {
      throw new ApiError(400, 'This poll has already been executed');
    }

    await client.query(
      `UPDATE polls SET is_executed = FALSE, updated_at = NOW() WHERE poll_id = $1`,
      [pollId]
    );
    await client.query(
      `UPDATE polls SET status = 'active', updated_at = NOW() WHERE poll_id = $1`,
      [pollId]
    );
    await client.query(
      `UPDATE polls SET status = 'passed', updated_at = NOW() WHERE poll_id = $1`,
      [pollId]
    );

    await client.query('COMMIT');

    await clearPollCache(pollId as string);

    const finalRow = await query(`SELECT * FROM polls WHERE poll_id = $1`, [pollId]);
    const fp = finalRow.rows[0];

    if (fp?.is_executed) {
      if (fp.poll_type === 'kick_member' && fp.target_user_id) {
        io.to(`group:${groupId}`).emit('member-removed', {
          group_id: groupId,
          user_id: fp.target_user_id,
          reason: 'poll_manual_execute',
          poll_id: pollId,
        });
      }
      io.to(`group:${groupId}`).emit('poll-executed', {
        poll_id: pollId,
        group_id: groupId,
        poll_type: fp.poll_type,
        executed_at: fp.executed_at,
      });
    }

    res.json({ success: true, message: 'Poll executed successfully' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error executing poll:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Failed to execute poll');
  } finally {
    client.release();
  }
};
