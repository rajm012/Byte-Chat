import { redisClient } from '../../lib/redis.js';

// =====================================================
// SEARCH & DISCOVERY REDIS SERVICES (2 structures)
// =====================================================

/**
 * 27. user_search_index - Searchable user data
 * Sorted Set with timestamp as score
 */
export const UserSearchService = {
  // Add user to search index
  async addUserToIndex(userId: string, rollNo: string, name: string): Promise<void> {
    const member = `user:${userId}:${rollNo}:${name}`;
    const score = Date.now();
    await redisClient.zAdd('user_search_index', { score, value: member });
  },

  // Remove user from search index
  async removeUserFromIndex(userId: string): Promise<void> {
    const pattern = `user:${userId}:*`;
    const allMembers = await redisClient.zRange('user_search_index', 0, -1);
    
    for (const member of allMembers) {
      if (member.startsWith(`user:${userId}:`)) {
        await redisClient.zRem('user_search_index', member);
      }
    }
  },

  // Search users by roll number or name
  async searchUsers(query: string, limit: number = 20): Promise<Array<{ userId: string; rollNo: string; name: string }>> {
    const allMembers = await redisClient.zRange('user_search_index', 0, -1);
    const lowerQuery = query.toLowerCase();
    
    const results = allMembers
      .filter(member => {
        const parts = member.split(':');
        const rollNo = parts[2]?.toLowerCase() || '';
        const name = parts[3]?.toLowerCase() || '';
        return rollNo.includes(lowerQuery) || name.includes(lowerQuery);
      })
      .slice(0, limit)
      .map(member => {
        const parts = member.split(':');
        return {
          userId: parts[1] || '',
          rollNo: parts[2] || '',
          name: parts[3] || ''
        };
      });
    
    return results;
  },

  // Get all users in index
  async getAllIndexedUsers(): Promise<Array<{ userId: string; rollNo: string; name: string }>> {
    const members = await redisClient.zRange('user_search_index', 0, -1);
    return members.map(member => {
      const parts = member.split(':');
      return {
        userId: parts[1] || '',
        rollNo: parts[2] || '',
        name: parts[3] || ''
      };
    });
  },

  // Get user count in index
  async getUserIndexCount(): Promise<number> {
    return await redisClient.zCard('user_search_index');
  },

  // Clear user search index
  async clearUserIndex(): Promise<void> {
    await redisClient.del('user_search_index');
  },

  // Update user in index
  async updateUserInIndex(userId: string, rollNo: string, name: string): Promise<void> {
    await this.removeUserFromIndex(userId);
    await this.addUserToIndex(userId, rollNo, name);
  }
};

/**
 * 28. group_search_index - Searchable group data
 * Sorted Set with member count as score
 */
export const GroupSearchService = {
  // Add group to search index
  async addGroupToIndex(groupId: string, groupName: string, memberCount: number = 0): Promise<void> {
    const member = `group:${groupId}:${groupName}`;
    const score = memberCount;
    await redisClient.zAdd('group_search_index', { score, value: member });
  },

  // Remove group from search index
  async removeGroupFromIndex(groupId: string): Promise<void> {
    const allMembers = await redisClient.zRange('group_search_index', 0, -1);
    
    for (const member of allMembers) {
      if (member.startsWith(`group:${groupId}:`)) {
        await redisClient.zRem('group_search_index', member);
      }
    }
  },

  // Search groups by name
  async searchGroups(query: string, limit: number = 20): Promise<Array<{ groupId: string; groupName: string; memberCount: number }>> {
    const allMembers = await redisClient.zRangeWithScores('group_search_index', 0, -1);
    const lowerQuery = query.toLowerCase();
    
    const results = allMembers
      .filter(item => {
        const parts = item.value.split(':');
        const groupName = parts[2]?.toLowerCase() || '';
        return groupName.includes(lowerQuery);
      })
      .slice(0, limit)
      .map(item => {
        const parts = item.value.split(':');
        return {
          groupId: parts[1] || '',
          groupName: parts[2] || '',
          memberCount: item.score
        };
      });
    
    return results;
  },

  // Get popular groups (sorted by member count)
  async getPopularGroups(limit: number = 10): Promise<Array<{ groupId: string; groupName: string; memberCount: number }>> {
    const members = await redisClient.zRangeWithScores('group_search_index', 0, limit - 1, { REV: true });
    
    return members.map(item => {
      const parts = item.value.split(':');
      return {
        groupId: parts[1] || '',
        groupName: parts[2] || '',
        memberCount: item.score
      };
    });
  },

  // Update group member count
  async updateGroupMemberCount(groupId: string, groupName: string, memberCount: number): Promise<void> {
    await this.removeGroupFromIndex(groupId);
    await this.addGroupToIndex(groupId, groupName, memberCount);
  },

  // Get all groups in index
  async getAllIndexedGroups(): Promise<Array<{ groupId: string; groupName: string; memberCount: number }>> {
    const members = await redisClient.zRangeWithScores('group_search_index', 0, -1);
    return members.map(item => {
      const parts = item.value.split(':');
      return {
        groupId: parts[1] || '',
        groupName: parts[2] || '',
        memberCount: item.score
      };
    });
  },

  // Get group count in index
  async getGroupIndexCount(): Promise<number> {
    return await redisClient.zCard('group_search_index');
  },

  // Clear group search index
  async clearGroupIndex(): Promise<void> {
    await redisClient.del('group_search_index');
  }
};
