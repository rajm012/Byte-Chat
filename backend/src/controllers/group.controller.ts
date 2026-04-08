
import type { Request, Response } from 'express';
import { pool, query } from '../lib/db.js';
import { ApiError } from '../utils/error.util.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId, getDefaultGroupDP } from '../utils/cloudinary.util.js';
import { getAvatarUrl, isValidPresetAvatar, getRandomAvatar } from '../utils/avatar.util.js';
import { io } from '../index.js';
import { invalidateUserPermissionCache, getUserPermissionSetCached } from '../services/authCache.service.js';
import multer from 'multer';
import {
  joinGroup as handleJoinGroup,
  addMemberToGroup as handleAddMemberToGroup,
  getGroupMembers as handleGetGroupMembers,
  removeMemberFromGroup as handleRemoveMemberFromGroup,
  leaveGroup as handleLeaveGroup,
  promoteMemberToAdmin as handlePromoteMemberToAdmin,
} from '../services/group/group-members.service.js';
import {
  getGroupMessages as handleGetGroupMessages,
  sendGroupMessage as handleSendGroupMessage,
  uploadGroupChatImage as handleUploadGroupChatImage,
  getGroupParticipantPublicKeys as handleGetGroupParticipantPublicKeys,
  getGroupOnlineCount as handleGetGroupOnlineCount,
} from '../services/group/group-chat.service.js';
import {
  getPollResults as handleGetPollResults,
  createPoll as handleCreatePoll,
  getGroupPolls as handleGetGroupPolls,
  voteOnPoll as handleVoteOnPoll,
  cancelPoll as handleCancelPoll,
  executePoll as handleExecutePoll,
} from '../services/group/group-polls.service.js';

// Create a new group (public or private)
export const createGroup = async (req: Request, res: Response) => {
  const { group_name, group_desc, group_dp_url, is_public, max_members = 500 } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!group_name || group_name.trim().length === 0) {
    throw new ApiError(400, 'Group name is required');
  }

  if (max_members < 2 || max_members > 500) {
    throw new ApiError(400, 'Max members must be between 2 and 500');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create the group
    const groupResult = await client.query(
      `INSERT INTO groups (
        group_name, 
        group_desc, 
        group_dp_url,
        is_public, 
        created_by, 
        max_members
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        group_name.trim(),
        group_desc?.trim() || '',
        group_dp_url?.trim() || getDefaultGroupDP(),
        is_public === true,
        userId,
        max_members
      ]
    );

    const group = groupResult.rows[0];

    // Add creator as owner and admin
    await client.query(
      `INSERT INTO group_members (
        group_id,
        user_id,
        is_admin,
        is_owner,
        is_anonymous
      ) VALUES ($1, $2, true, true, false)`,
      [group.group_id, userId]
    );

    await client.query('COMMIT');
    await invalidateUserPermissionCache(userId);

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group }
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating group:', error);
    throw new ApiError(500, error.message || 'Failed to create group');
  } finally {
    client.release();
  }
};

// polls results
export const getPollResults = async (req: Request, res: Response) => {
  return handleGetPollResults(req, res);
};

// Get all public groups
export const getPublicGroups = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        g.group_id,
        g.group_name,
        g.group_desc,
        g.group_dp_url,
        g.is_public,
        g.max_members,
        g.created_at,
        g.updated_at,
        u.name as creator_name,
        u.roll_no as creator_roll_no,
        COUNT(DISTINCT gm.member_id) as member_count
      FROM groups g
      LEFT JOIN users u ON g.created_by = u.user_id
      LEFT JOIN group_members gm ON g.group_id = gm.group_id
      WHERE g.is_public = true AND g.is_active = true
      GROUP BY g.group_id, u.name, u.roll_no
      ORDER BY g.created_at DESC`
    );

    res.json({
      success: true,
      data: { groups: result.rows }
    });
  } catch (error: any) {
    console.error('Error fetching public groups:', error);
    throw new ApiError(500, error.message || 'Failed to fetch public groups');
  }
};

// Get groups the user is a member of
export const getMyGroups = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    const result = await query(
      `SELECT 
        g.group_id,
        g.group_name,
        g.group_desc,
        g.group_dp_url,
        g.is_public,
        g.max_members,
        g.created_at,
        gm.is_admin,
        gm.is_owner,
        gm.is_anonymous,
        gm.joined_at,
        COUNT(DISTINCT gm2.member_id) as member_count
      FROM groups g
      INNER JOIN group_members gm ON g.group_id = gm.group_id
      LEFT JOIN group_members gm2 ON g.group_id = gm2.group_id
      WHERE gm.user_id = $1 AND g.is_active = true
      GROUP BY g.group_id, gm.is_admin, gm.is_owner, gm.is_anonymous, gm.joined_at
      ORDER BY gm.joined_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: { groups: result.rows }
    });
  }
  catch (error: any) {
    console.error('Error fetching user groups:', error);
    throw new ApiError(500, error.message || 'Failed to fetch groups');
  }
};

// Get group details
export const getGroupDetails = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  try {
    // Get group info
    const groupResult = await query(
      `SELECT 
        g.*,
        u.name as creator_name,
        u.roll_no as creator_roll_no,
        COUNT(DISTINCT gm.member_id) as member_count,
        CASE 
          WHEN gm_user.user_id IS NOT NULL THEN true 
          ELSE false 
        END as is_member,
        COALESCE(gm_user.is_admin, false) as user_is_admin,
        COALESCE(gm_user.is_owner, false) as user_is_owner
      FROM groups g
      LEFT JOIN users u ON g.created_by = u.user_id
      LEFT JOIN group_members gm ON g.group_id = gm.group_id
      LEFT JOIN group_members gm_user ON g.group_id = gm_user.group_id AND gm_user.user_id = $2
      WHERE g.group_id = $1 AND g.is_active = true
      GROUP BY g.group_id, u.name, u.roll_no, gm_user.user_id, gm_user.is_admin, gm_user.is_owner`,
      [groupId, userId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const group = groupResult.rows[0];

    // If group is private and user is not a member, don't show details
    if (!group.is_public && !group.is_member) {
      throw new ApiError(403, 'Access denied');
    }

    res.json({
      success: true,
      data: { group }
    });
  } catch (error: any) {
    console.error('Error fetching group details:', error);
    throw error;
  }
};

// Join a public group
export const joinGroup = async (req: Request, res: Response) => {
  return handleJoinGroup(req, res);
};

// Add member to group (for private groups or admin invites)
export const addMemberToGroup = async (req: Request, res: Response) => {
  return handleAddMemberToGroup(req, res);
};

// Get group members (for admins/owners)
export const getGroupMembers = async (req: Request, res: Response) => {
  return handleGetGroupMembers(req, res);
};

// Remove member from group (for admins/owners, private groups only)
export const removeMemberFromGroup = async (req: Request, res: Response) => {
  return handleRemoveMemberFromGroup(req, res);
};

// Leave group (for all members)
export const leaveGroup = async (req: Request, res: Response) => {
  return handleLeaveGroup(req, res);
};

// Update group details (for admins/owners)
export const updateGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { group_name, group_desc, group_dp_url, max_members } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user is admin or owner using permission cache
    const permissionSet = await getUserPermissionSetCached(userId);
    const role = permissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!role || (!role.isAdmin && !role.isOwner)) {
      throw new ApiError(403, 'Only group admins can update group details');
    }

    // Validate max_members if provided
    if (max_members !== undefined && (max_members < 2 || max_members > 500)) {
      throw new ApiError(400, 'Max members must be between 2 and 500');
    }

    // Check current member count if max_members is being reduced
    if (max_members !== undefined) {
      const memberCount = await client.query(
        `SELECT COUNT(*) as count FROM group_members WHERE group_id = $1`,
        [groupId]
      );

      if (parseInt(memberCount.rows[0].count) > max_members) {
        throw new ApiError(400, 'Cannot set max members below current member count');
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (group_name !== undefined && group_name.trim().length > 0) {
      updates.push(`group_name = $${paramCount}`);
      values.push(group_name.trim());
      paramCount++;
    }

    if (group_desc !== undefined) {
      updates.push(`group_desc = $${paramCount}`);
      values.push(group_desc.trim());
      paramCount++;
    }

    if (group_dp_url !== undefined) {
      updates.push(`group_dp_url = $${paramCount}`);
      values.push(group_dp_url?.trim() || null);
      paramCount++;
    }

    if (max_members !== undefined) {
      updates.push(`max_members = $${paramCount}`);
      values.push(max_members);
      paramCount++;
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(groupId);

    const updateQuery = `
      UPDATE groups 
      SET ${updates.join(', ')}
      WHERE group_id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: { group: result.rows[0] }
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating group:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Get group messages
export const getGroupMessages = async (req: Request, res: Response) => {
  return handleGetGroupMessages(req, res);
};

// Send a group message
export const sendGroupMessage = async (req: Request, res: Response) => {
  return handleSendGroupMessage(req, res);
};

// Promote member to admin (for owners only)
export const promoteMemberToAdmin = async (req: Request, res: Response) => {
  return handlePromoteMemberToAdmin(req, res);
};

// ============================================================
// Create a poll (admins only)
// ============================================================
export const createPoll = async (req: Request, res: Response) => {
  return handleCreatePoll(req, res);
};

// Get all polls for a group
export const getGroupPolls = async (req: Request, res: Response) => {
  return handleGetGroupPolls(req, res);
};

// ============================================================
// Vote on a poll
// ============================================================
export const voteOnPoll = async (req: Request, res: Response) => {
  return handleVoteOnPoll(req, res);
};

// ============================================================
// Cancel a poll (creator or any admin)
// ============================================================
export const cancelPoll = async (req: Request, res: Response) => {
  return handleCancelPoll(req, res);
};

// ============================================================
// Manually execute a passed (but not yet executed) poll — admins only
// Useful if auto-execution failed for any reason.
// ============================================================
export const executePoll = async (req: Request, res: Response) => {
  return handleExecutePoll(req, res);
};


// Upload group picture (admins/owners only)
export const uploadGroupPicture = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user is admin or owner using permission cache
    const permissionSet = await getUserPermissionSetCached(userId);
    const role = permissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!role || (!role.isAdmin && !role.isOwner)) {
      throw new ApiError(403, 'Only group admins can update group picture');
    }

    // Get current group data
    const groupResult = await client.query(
      'SELECT group_dp_url FROM groups WHERE group_id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const currentDpUrl = groupResult.rows[0].group_dp_url;

    // Delete old image from Cloudinary if exists
    if (currentDpUrl) {
      const publicId = extractPublicId(currentDpUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Upload new image to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'group_pictures',
      `group_${groupId}_${Date.now()} `
    );

    // Update database with new image URL
    const updateResult = await client.query(
      `UPDATE groups 
       SET group_dp_url = $1, updated_at = NOW()
       WHERE group_id = $2
  RETURNING * `,
      [uploadResult.secure_url, groupId]
    );

    await client.query('COMMIT');

    // Emit socket event for real-time update
    io.to(`group - ${groupId} `).emit('group-updated', updateResult.rows[0]);

    res.json({
      success: true,
      message: 'Group picture uploaded successfully',
      data: {
        group: updateResult.rows[0],
        imageUrl: uploadResult.secure_url
      }
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error uploading group picture:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Delete group picture (admins/owners only)
export const deleteGroupPicture = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user is admin or owner using permission cache
    const permissionSet = await getUserPermissionSetCached(userId);
    const role = permissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!role || (!role.isAdmin && !role.isOwner)) {
      throw new ApiError(403, 'Only group admins can delete group picture');
    }

    // Get current group data
    const groupResult = await client.query(
      'SELECT group_dp_url FROM groups WHERE group_id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const currentDpUrl = groupResult.rows[0].group_dp_url;

    // Delete old image from Cloudinary if exists
    if (currentDpUrl) {
      const publicId = extractPublicId(currentDpUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Update database to remove image URL
    const updateResult = await client.query(
      `UPDATE groups 
       SET group_dp_url = NULL, updated_at = NOW()
       WHERE group_id = $1
  RETURNING * `,
      [groupId]
    );

    await client.query('COMMIT');

    // Emit socket event for real-time update
    io.to(`group - ${groupId} `).emit('group-updated', updateResult.rows[0]);

    res.json({
      success: true,
      message: 'Group picture deleted successfully',
      data: {
        group: updateResult.rows[0]
      }
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error deleting group picture:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Configure Multer for memory storage
export const uploadGroup = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed') as any);
    }
  },
});

// Select preset avatar for group (admins/owners only)
export const selectGroupPresetAvatar = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;
  const { avatarId } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user is admin or owner using permission cache
    const permissionSet = await getUserPermissionSetCached(userId);
    const role = permissionSet.groupRoles.find(r => r.groupId === groupId);
    if (!role || (!role.isAdmin && !role.isOwner)) {
      throw new ApiError(403, 'Only group admins can update group picture');
    }

    // Validate avatar ID if provided, otherwise use random
    let selectedAvatarId = avatarId;

    if (avatarId) {
      if (!isValidPresetAvatar(avatarId)) {
        throw new ApiError(400, 'Invalid avatar ID');
      }
    } else {
      // No avatar selected, assign random
      selectedAvatarId = getRandomAvatar();
    }

    // Get current group data
    const groupResult = await client.query(
      'SELECT group_dp_url FROM groups WHERE group_id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      throw new ApiError(404, 'Group not found');
    }

    const currentDpUrl = groupResult.rows[0].group_dp_url;

    // Delete old custom uploaded image from Cloudinary if exists (but not preset avatars)
    if (currentDpUrl) {
      const publicId = extractPublicId(currentDpUrl);
      if (publicId && !publicId.startsWith('avatars/')) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Generate avatar URL
    const avatarUrl = getAvatarUrl(selectedAvatarId);

    // Update database with new avatar
    const updateResult = await client.query(
      `UPDATE groups 
       SET group_dp_url = $1, updated_at = NOW()
       WHERE group_id = $2
  RETURNING * `,
      [avatarUrl, groupId]
    );

    await client.query('COMMIT');

    // Emit socket event for real-time update
    io.to(`group - ${groupId} `).emit('group-updated', updateResult.rows[0]);

    res.json({
      success: true,
      message: 'Group avatar selected successfully',
      data: {
        group: updateResult.rows[0],
        imageUrl: avatarUrl
      }
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error selecting group avatar:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Upload group chat image to Cloudinary
export const uploadGroupChatImage = async (req: Request, res: Response) => {
  return handleUploadGroupChatImage(req, res);
};

// Get public keys of all participants in a group
export async function getGroupParticipantPublicKeys(req: Request, res: Response) {
  return handleGetGroupParticipantPublicKeys(req, res);
}

/**
 * GET /api/groups/:groupId/online-count
 * Returns { onlineCount: number } — how many members of this group are currently online (from Redis).
 */
export const getGroupOnlineCount = async (req: Request, res: Response) => {
  return handleGetGroupOnlineCount(req, res);
};
