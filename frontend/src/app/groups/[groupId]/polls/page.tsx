'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { groupService } from '@/services/group.service';
import CreateRemovalPoll from '@/components/CreateRemovalPoll';
import PollList from '@/components/PollList';
import { useToast } from '@/contexts/ToastContext';

interface GroupMember {
  member_id: string;
  user_id: string;
  is_admin: boolean;
  is_owner: boolean;
  is_anonymous: boolean;
  name: string;
  roll_no: string;
}

export default function GroupPollsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const toast = useToast();

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    try {
      // Fetch group details
      const groupDetails = await groupService.getGroupDetails(groupId);
      if (groupDetails.success && groupDetails.data) {
        setIsAdmin(groupDetails.data.group.user_is_admin || false);
        setCurrentUserId(groupDetails.data.group.current_user_id || '');
        setGroupName(groupDetails.data.group.group_name || 'Group');
      }

      // Fetch group members
      const membersResponse = await groupService.getGroupMembers(groupId);
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data.members);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePollCreated = () => {
    setShowCreatePoll(false);
    toast.success('Poll created successfully!');
    // Refresh will happen automatically via PollList component
  };

  const handlePollExecuted = () => {
    toast.success('Poll executed! Member has been removed from group.');
    fetchData(); // Refresh members list
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 rounded-sm animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400 font-mono">LOADING POLLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b-4 border-neutral-900 dark:border-neutral-100 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                [GROUP POLLS]
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400 font-mono">
                {groupName}
              </p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <button
                  onClick={() => setShowCreatePoll(true)}
                  className="px-6 py-3 bg-red-600 dark:bg-red-500 text-white font-mono font-bold border-2 border-neutral-900 dark:border-neutral-100 hover:bg-red-700 transition-colors"
                >
                  + CREATE REMOVAL POLL
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono font-bold border-2 border-neutral-900 dark:border-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                ← BACK
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Box */}
        <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900 border-4 border-blue-600 dark:border-blue-400">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 font-mono mb-2">
            ℹ️ HOW POLLS WORK
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 font-mono text-sm">
            <li>• Admins can create polls to remove members from the group</li>
            <li>• All members can vote FOR or AGAINST removal</li>
            <li>• Majority vote (50%+) automatically removes the member</li>
            <li>• Polls expire after the set duration</li>
            <li>• Removed members can be re-invited later</li>
          </ul>
        </div>

        {/* Poll List */}
        <div className="bg-white dark:bg-black border-4 border-neutral-900 dark:border-neutral-100 p-6">
          <PollList 
            groupId={groupId} 
            isAdmin={isAdmin}
            onPollExecuted={handlePollExecuted}
          />
        </div>
      </main>

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <CreateRemovalPoll
          groupId={groupId}
          members={members}
          currentUserId={currentUserId}
          onSuccess={handlePollCreated}
          onCancel={() => setShowCreatePoll(false)}
        />
      )}
    </div>
  );
}
