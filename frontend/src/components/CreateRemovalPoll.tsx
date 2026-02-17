'use client';

import { useState } from 'react';
import { groupService } from '@/services/group.service';

interface Member {
  user_id: string;
  name: string;
  roll_no: string;
  is_admin: boolean;
  is_owner: boolean;
}

interface CreateRemovalPollProps {
  groupId: string;
  members: Member[];
  currentUserId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateRemovalPoll({ 
  groupId, 
  members, 
  currentUserId,
  onSuccess, 
  onCancel 
}: CreateRemovalPollProps) {
  const [targetUserId, setTargetUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter out current user and owners
  const removableMembers = members.filter(m => 
    m.user_id !== currentUserId && !m.is_owner
  );

  const handleMemberSelect = (userId: string) => {
    const member = members.find(m => m.user_id === userId);
    if (member) {
      setTargetUserId(userId);
      setTitle(`Remove ${member.name} from group`);
      setDescription(`Vote to remove ${member.name} (${member.roll_no}) from the group`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!targetUserId) {
      setError('Please select a member to remove');
      return;
    }

    if (!title.trim()) {
      setError('Poll title is required');
      return;
    }

    setLoading(true);

    try {
      await groupService.createPoll(groupId, {
        poll_type: 'remove_user',
        target_user_id: targetUserId,
        title: title.trim(),
        description: description.trim() || undefined,
        expires_in_hours: durationHours
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Create Removal Poll
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Member Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Member to Remove
            </label>
            <select
              value={targetUserId}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">-- Select a member --</option>
              {removableMembers.map(member => (
                <option key={member.user_id} value={member.user_id}>
                  {member.name} ({member.roll_no}) {member.is_admin ? '👑' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Poll Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Poll Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter poll title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Explain why this member should be removed"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Poll Duration
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>2 days</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm">
            <p className="font-semibold mb-1">ℹ️ How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Members vote to remove or keep the user</li>
              <li>When time expires, simple majority wins</li>
              <li>If votes tie, a coin flip decides (fair random)</li>
              <li>User is removed <strong>automatically</strong> when poll passes</li>
              <li>They can rejoin if invited again later</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !targetUserId}
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
