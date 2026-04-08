import type { Request, Response } from 'express';
import { pool, query } from '../../lib/db.js';
import { ApiError } from '../../utils/error.util.js';
import { getUserGenderCached } from '../userProfileCache.service.js';
import { pushNotification } from '../notification.service.js';
import { getUserPermissionSetCached, invalidateUserPermissionCache } from '../authCache.service.js';

export const joinGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { is_anonymous = false } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupResult = await client.query(
      `SELECT * FROM groups WHERE group_id = $1 AND is_active = true`,
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const group = groupResult.rows[0];

    if (!group.is_public) {
      throw new ApiError(403, 'Cannot join private group without invitation');
    }

    const memberCheck = await client.query(
      `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length > 0) {
      throw new ApiError(400, 'Already a member of this group');
    }

    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM group_members WHERE group_id = $1`,
      [groupId]
    );

    if (parseInt(countResult.rows[0].count) >= group.max_members) {
      throw new ApiError(400, 'Group is full');
    }

    let anonymousIdentityId = null;
    if (is_anonymous) {
      const gender = await getUserGenderCached(String(userId));
      if (!gender) {
        throw new ApiError(404, 'User not found');
      }

      const anonymousResult = await client.query(
        `INSERT INTO anonymous_identities (
          user_id,
          group_id,
          random_string,
          display_gender
        ) VALUES ($1, $2, $3, $4)
        RETURNING identity_id`,
        [
          userId,
          groupId,
          `anon_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
          gender
        ]
      );

      anonymousIdentityId = anonymousResult.rows[0].identity_id;
    }

    await client.query(
      `INSERT INTO group_members (
        group_id,
        user_id,
        is_admin,
        is_owner,
        is_anonymous,
        anonymous_identity_id
      ) VALUES ($1, $2, false, false, $3, $4)`,
      [groupId, userId, is_anonymous, anonymousIdentityId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Joined group successfully'
    });
  }
  catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error joining group:', error);
    throw error;
  }
  finally {
    client.release();
  }
};

export const addMemberToGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { user_id, is_anonymous = false } = req.body;
  const adminUserId = req.user?.userId;

  if (!adminUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!user_id) {
    throw new ApiError(400, 'User ID is required');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupResult = await client.query(
      `SELECT * FROM groups WHERE group_id = $1 AND is_active = true`,
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const group = groupResult.rows[0];

    const adminPermissionSet = await getUserPermissionSetCached(adminUserId);
    const adminRole = adminPermissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!adminRole || (!adminRole.isAdmin && !adminRole.isOwner)) {
      throw new ApiError(403, 'Only group admins can add members');
    }

    const userExists = await client.query(
      `SELECT user_id, gender FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (userExists.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    const memberCheck = await client.query(
      `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, user_id]
    );

    if (memberCheck.rows.length > 0) {
      throw new ApiError(400, 'User is already a member of this group');
    }

    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM group_members WHERE group_id = $1`,
      [groupId]
    );

    if (parseInt(countResult.rows[0].count) >= group.max_members) {
      throw new ApiError(400, 'Group is full');
    }

    let anonymousIdentityId = null;
    if (is_anonymous) {
      const anonymousResult = await client.query(
        `INSERT INTO anonymous_identities (
          user_id,
          group_id,
          random_string,
          display_gender
        ) VALUES ($1, $2, $3, $4)
        RETURNING identity_id`,
        [
          user_id,
          groupId,
          `anon_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
          userExists.rows[0].gender
        ]
      );

      anonymousIdentityId = anonymousResult.rows[0].identity_id;
    }

    await client.query(
      `INSERT INTO group_members (
        group_id,
        user_id,
        is_admin,
        is_owner,
        is_anonymous,
        anonymous_identity_id
      ) VALUES ($1, $2, false, false, $3, $4)`,
      [groupId, user_id, is_anonymous, anonymousIdentityId]
    );

    await pushNotification(user_id, {
      type: 'group_invite',
      groupId,
      createdBy: adminUserId,
      timestamp: Date.now()
    });

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Member added successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error adding member to group:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const memberCheck = await query(
      `SELECT is_admin, is_owner FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(403, 'You must be a member to view group members');
    }

    const result = await query(
      `SELECT
        gm.member_id,
        gm.user_id,
        gm.is_admin,
        gm.is_owner,
        gm.is_anonymous,
        gm.joined_at,
        u.name,
        u.roll_no,
        u.dp_url,
        u.branch,
        ai.random_string as anonymous_name,
        ai.display_gender as anonymous_gender
      FROM group_members gm
      INNER JOIN users u ON gm.user_id = u.user_id
      LEFT JOIN anonymous_identities ai ON gm.anonymous_identity_id = ai.identity_id
      WHERE gm.group_id = $1
      ORDER BY gm.is_owner DESC, gm.is_admin DESC, gm.joined_at ASC`,
      [groupId]
    );

    res.json({
      success: true,
      data: { members: result.rows }
    });
  } catch (error: any) {
    console.error('Error fetching group members:', error);
    throw error;
  }
};

export const removeMemberFromGroup = async (req: Request, res: Response) => {
  const { groupId, memberId } = req.params;
  const adminUserId = req.user?.userId;

  if (!adminUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupCheck = await client.query(
      `SELECT is_public FROM groups WHERE group_id = $1`,
      [groupId]
    );

    if (groupCheck.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    if (groupCheck.rows[0].is_public) {
      throw new ApiError(403, 'Cannot remove members from public groups. Members must leave on their own.');
    }

    const adminPermissionSet = await getUserPermissionSetCached(adminUserId);
    const adminRole = adminPermissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!adminRole || (!adminRole.isAdmin && !adminRole.isOwner)) {
      throw new ApiError(403, 'Only group admins can remove members');
    }

    const memberToRemove = await client.query(
      `SELECT user_id, is_owner, is_admin FROM group_members
       WHERE group_id = $1 AND member_id = $2`,
      [groupId, memberId]
    );

    if (memberToRemove.rows.length === 0) {
      throw new ApiError(404, 'Member not found in this group');
    }

    if (memberToRemove.rows[0].is_owner) {
      throw new ApiError(403, 'Cannot remove the group owner');
    }

    if (memberToRemove.rows[0].is_admin && !(adminRole && adminRole.isOwner)) {
      throw new ApiError(403, 'Only the group owner can remove admins');
    }

    const removedUserId = String(memberToRemove.rows[0].user_id);

    await client.query(
      `DELETE FROM group_members WHERE group_id = $1 AND member_id = $2`,
      [groupId, memberId]
    );

    await client.query('COMMIT');
    await invalidateUserPermissionCache(removedUserId);

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error removing member from group:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const memberCheck = await client.query(
      `SELECT member_id, is_owner, is_admin FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(400, 'You are not a member of this group');
    }

    const member = memberCheck.rows[0];

    await client.query(
      `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    const remainingMembers = await client.query(
      `SELECT COUNT(*) as count,
              COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_count
       FROM group_members WHERE group_id = $1`,
      [groupId]
    );

    const memberCount = parseInt(remainingMembers.rows[0].count);
    const adminCount = parseInt(remainingMembers.rows[0].admin_count);

    if (memberCount === 0) {
      await client.query(
        `UPDATE groups SET is_active = false WHERE group_id = $1`,
        [groupId]
      );
    }
    else if (member.is_admin && adminCount === 0) {
      const promotedOwner = await client.query<{ user_id: string }>(
        `UPDATE group_members
         SET is_admin = true, is_owner = true
         WHERE member_id = (
           SELECT member_id FROM group_members
           WHERE group_id = $1
           ORDER BY joined_at ASC
           LIMIT 1
          )
         RETURNING user_id`,
        [groupId]
      );

      if (promotedOwner.rows.length > 0) {
        const promotedOwnerRow = promotedOwner.rows[0];
        if (promotedOwnerRow) {
          await invalidateUserPermissionCache(promotedOwnerRow.user_id);
        }
      }
    }

    await client.query('COMMIT');
    await invalidateUserPermissionCache(userId);

    res.json({
      success: true,
      message: memberCount === 0 ? 'Left group and group deleted' : 'Left group successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error leaving group:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const promoteMemberToAdmin = async (req: Request, res: Response) => {
  const { groupId, memberId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ownerCheck = await client.query(
      `SELECT is_owner FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (ownerCheck.rows.length === 0 || !ownerCheck.rows[0].is_owner) {
      throw new ApiError(403, 'Only group owners can promote members to admin');
    }

    const memberCheck = await client.query(
      `SELECT is_admin FROM group_members
       WHERE group_id = $1 AND member_id = $2`,
      [groupId, memberId]
    );

    if (memberCheck.rows.length === 0) {
      throw new ApiError(404, 'Member not found in this group');
    }

    if (memberCheck.rows[0].is_admin) {
      throw new ApiError(400, 'Member is already an admin');
    }

    await client.query(
      `UPDATE group_members
       SET is_admin = true
       WHERE group_id = $1 AND member_id = $2`,
      [groupId, memberId]
    );

    const memberUserIdResult = await client.query(
      `SELECT user_id FROM group_members WHERE group_id = $1 AND member_id = $2`,
      [groupId, memberId]
    );
    if (memberUserIdResult.rows.length > 0) {
      await invalidateUserPermissionCache(memberUserIdResult.rows[0].user_id);
      await pushNotification(memberUserIdResult.rows[0].user_id, {
        type: 'admin_promoted',
        groupId,
        createdBy: userId,
        timestamp: Date.now()
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Member promoted to admin successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error promoting member:', error);
    throw error;
  } finally {
    client.release();
  }
};
