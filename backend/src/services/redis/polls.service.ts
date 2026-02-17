import { redisClient } from '../../lib/redis.js';

// =====================================================
// POLL & VOTING CACHE REDIS SERVICES (2 structures)
// =====================================================

interface PollVoteData {
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
}

/**
 * 16. poll_live:{pollId} - Live vote counts
 * TTL: 6 hours
 */
export const PollLiveService = {
  // Initialize poll
  async initializePoll(pollId: string): Promise<void> {
    const key = `poll_live:${pollId}`;
    const initialData: PollVoteData = {
      votesFor: 0,
      votesAgainst: 0,
      totalVoters: 0
    };
    
    await redisClient.hSet(key, {
      votesFor: initialData.votesFor.toString(),
      votesAgainst: initialData.votesAgainst.toString(),
      totalVoters: initialData.totalVoters.toString()
    });
    
    // Set TTL to 6 hours
    await redisClient.expire(key, 6 * 60 * 60);
  },

  // Increment vote for
  async voteFor(pollId: string): Promise<PollVoteData> {
    const key = `poll_live:${pollId}`;
    await redisClient.hIncrBy(key, 'votesFor', 1);
    await redisClient.hIncrBy(key, 'totalVoters', 1);
    
    return await this.getPollResults(pollId);
  },

  // Increment vote against
  async voteAgainst(pollId: string): Promise<PollVoteData> {
    const key = `poll_live:${pollId}`;
    await redisClient.hIncrBy(key, 'votesAgainst', 1);
    await redisClient.hIncrBy(key, 'totalVoters', 1);
    
    return await this.getPollResults(pollId);
  },

  // Get poll results
  async getPollResults(pollId: string): Promise<PollVoteData> {
    const key = `poll_live:${pollId}`;
    const data = await redisClient.hGetAll(key);
    
    if (!data || Object.keys(data).length === 0) {
      return { votesFor: 0, votesAgainst: 0, totalVoters: 0 };
    }
    
    return {
      votesFor: parseInt(data.votesFor || '0'),
      votesAgainst: parseInt(data.votesAgainst || '0'),
      totalVoters: parseInt(data.totalVoters || '0')
    };
  },

  // Update poll results (batch update)
  async updatePollResults(pollId: string, data: PollVoteData): Promise<void> {
    const key = `poll_live:${pollId}`;
    await redisClient.hSet(key, {
      votesFor: data.votesFor.toString(),
      votesAgainst: data.votesAgainst.toString(),
      totalVoters: data.totalVoters.toString()
    });
    
    await redisClient.expire(key, 6 * 60 * 60);
  },

  // Delete poll
  async deletePoll(pollId: string): Promise<void> {
    const key = `poll_live:${pollId}`;
    await redisClient.del(key);
  },

  // Check if poll exists
  async pollExists(pollId: string): Promise<boolean> {
    const key = `poll_live:${pollId}`;
    return await redisClient.exists(key) === 1;
  },

  // Extend poll TTL
  async extendPollTTL(pollId: string, hours: number = 6): Promise<void> {
    const key = `poll_live:${pollId}`;
    await redisClient.expire(key, hours * 60 * 60);
  }
};

/**
 * 17. user_voted:{pollId} - Set of users who voted
 * TTL: 6 hours
 */
export const UserVotedService = {
  // Mark user as voted
  async markUserVoted(pollId: string, userId: string): Promise<void> {
    const key = `user_voted:${pollId}`;
    await redisClient.sAdd(key, userId);
    
    // Set TTL to 6 hours
    await redisClient.expire(key, 6 * 60 * 60);
  },

  // Check if user voted
  async hasUserVoted(pollId: string, userId: string): Promise<boolean> {
    const key = `user_voted:${pollId}`;
    // return await redisClient.sIsMember(key, userId);
    return (await redisClient.sIsMember(key, userId)) === 1;
  },

  // Get all voters
  async getAllVoters(pollId: string): Promise<string[]> {
    const key = `user_voted:${pollId}`;
    return await redisClient.sMembers(key);
  },

  // Get voter count
  async getVoterCount(pollId: string): Promise<number> {
    const key = `user_voted:${pollId}`;
    return await redisClient.sCard(key);
  },

  // Remove user vote (for vote changes)
  async removeUserVote(pollId: string, userId: string): Promise<void> {
    const key = `user_voted:${pollId}`;
    await redisClient.sRem(key, userId);
  },

  // Clear all votes
  async clearAllVotes(pollId: string): Promise<void> {
    const key = `user_voted:${pollId}`;
    await redisClient.del(key);
  },

  // Batch check if users voted
  async haveUsersVoted(pollId: string, userIds: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};
    
    for (const userId of userIds) {
      result[userId] = await this.hasUserVoted(pollId, userId);
    }
    
    return result;
  }
};
