'use client';

import { useState, useEffect } from 'react';
import { groupService } from '@/services/group.service';

interface Poll {
  poll_id: string;
  poll_type: string;
  title: string;
  description: string;
  status: string;
  votes_for: number;
  votes_against: number;
  total_voters: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  executed_at?: string;
  creator_name: string;
  creator_roll_no: string;
  target_name?: string;
  target_roll_no?: string;
  has_voted: boolean;
  user_vote?: boolean;
  is_executed: boolean;
  parent_poll_id?: string;
  objection_reason?: string;
}

interface PollListProps {
  groupId: string;
  isAdmin: boolean;
  onPollExecuted?: () => void;
}

export default function PollList({ groupId, isAdmin, onPollExecuted }: PollListProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  const fetchPolls = async () => {
    try {
      const response = await groupService.getGroupPolls(groupId, filter);
      setPolls(response.data || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchPolls, 10000);
    return () => clearInterval(interval);
  }, [groupId, filter]);

  const handleVote = async (pollId: string, voteValue: boolean) => {
    setVoting(pollId);
    try {
      const response = await groupService.voteOnPoll(groupId, pollId, voteValue);
      
      // Check if poll was executed
      if (response.data?.poll?.is_executed) {
        if (onPollExecuted) {
          onPollExecuted();
        }
      }
      
      await fetchPolls();
    } catch (error: any) {
      alert(error.message || 'Failed to vote');
    } finally {
      setVoting(null);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPollTypeIcon = (type: string) => {
    switch (type) {
      case 'remove_user': return '👋';
      case 'kick_member': return '🚫';
      case 'make_admin': return '👑';
      case 'remove_admin': return '📉';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'active'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Active Polls
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          All Polls
        </button>
      </div>

      {/* Poll Cards */}
      {polls.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">📭 No {filter === 'active' ? 'active ' : ''}polls yet</p>
          {isAdmin && (
            <p className="text-sm mt-2">Create a poll to start voting</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            // Calculate vote percentages for display
            const totalVotes = poll.votes_for + poll.votes_against;
            const forPercentage = totalVotes > 0 ? (poll.votes_for / totalVotes) * 100 : 0;

            return (
              <div
                key={poll.poll_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-2xl">{getPollTypeIcon(poll.poll_type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {poll.title}
                      </h3>
                      {poll.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {poll.description}
                        </p>
                      )}
                      {poll.target_name && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <strong>Target:</strong> {poll.target_name} ({poll.target_roll_no})
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(poll.status)}`}>
                    {poll.status.toUpperCase()}
                    {poll.is_executed && ' ✓'}
                  </span>
                </div>

                {/* Vote Stats */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 font-semibold">{poll.votes_for}</span> For
                      {' • '}
                      <span className="text-red-600 dark:text-red-400 font-semibold">{poll.votes_against}</span> Against
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {poll.total_voters} voted
                      {poll.status === 'active' && poll.votes_for === poll.votes_against && poll.total_voters > 0 && (
                        <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚖️ TIE</span>
                      )}
                    </span>
                  </div>
                  
                  {/* Progress Bar - Shows FOR vs AGAINST */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${forPercentage}%` }}
                      title={`${poll.votes_for} FOR`}
                    ></div>
                    <div
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${100 - forPercentage}%` }}
                      title={`${poll.votes_against} AGAINST`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>
                      {poll.status === 'active' ? 'Majority wins when time expires' : `Result: ${Math.round(forPercentage)}% FOR`}
                    </span>
                    <span>{poll.total_voters} total voters</span>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>Created by {poll.creator_name}</span>
                  <span className={poll.status === 'active' ? 'text-orange-600 dark:text-orange-400 font-medium' : ''}>
                    {poll.status === 'active' ? getTimeRemaining(poll.expires_at) : new Date(poll.expires_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Voting Buttons */}
                {poll.status === 'active' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleVote(poll.poll_id, true)}
                      disabled={voting === poll.poll_id}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        poll.has_voted && poll.user_vote === true
                          ? 'bg-green-600 text-white border-2 border-green-700'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {poll.has_voted && poll.user_vote === true ? '✓ Voted to Remove' : '👍 Remove'}
                    </button>
                    <button
                      onClick={() => handleVote(poll.poll_id, false)}
                      disabled={voting === poll.poll_id}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        poll.has_voted && poll.user_vote === false
                          ? 'bg-red-600 text-white border-2 border-red-700'
                          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {poll.has_voted && poll.user_vote === false ? '✓ Voted to Keep' : '👎 Keep'}
                    </button>
                  </div>
                )}

                {/* Executed Message */}
                {poll.is_executed && poll.status === 'passed' && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ <strong>Poll executed on {poll.executed_at ? new Date(poll.executed_at).toLocaleString() : 'N/A'}</strong>
                      <br />
                      {poll.poll_type === 'remove_user' && `${poll.target_name} has been removed from the group`}
                      {poll.poll_type === 'kick_member' && `${poll.target_name} has been kicked and banned from the group`}
                      {poll.poll_type === 'make_admin' && `${poll.target_name} is now an admin`}
                      {poll.poll_type === 'remove_admin' && `${poll.target_name} is no longer an admin`}
                    </p>
                  </div>
                )}
                
                {poll.status === 'expired' && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ⏰ Poll expired on {new Date(poll.expires_at).toLocaleString()} - insufficient votes to pass
                    </p>
                  </div>
                )}

                {poll.status === 'failed' && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-300">
                      ❌ Poll failed - majority voted against
                    </p>
                  </div>
                )}

                {/* Objection Reason (if exists) */}
                {poll.objection_reason && poll.poll_type === 'object_removal' && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Objection Reason:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{poll.objection_reason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
