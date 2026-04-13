'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { groupService } from '@/services/group.service';
import type { User } from '@/types/chat.types';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';

interface GroupMember {
  member_id: string;
  user_id: string;
  is_admin: boolean;
  is_owner: boolean;
  is_anonymous: boolean;
  joined_at: string;
  name: string;
  roll_no: string;
  dp_url: string | null;
  branch: string;
  anonymous_name: string | null;
  anonymous_gender: string | null;
}

interface GroupDetails {
  group_id: string;
  group_name: string;
  group_desc: string;
  group_dp_url?: string;
  is_public: boolean;
  max_members: number;
  member_count: number;
  user_is_owner: boolean;
  user_is_admin: boolean;
}

export default function ManageGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const toast = useToast();

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'pending'>('members');

  const fetchData = useCallback(async () => {
    try {
      const groupDetails = await groupService.getGroupDetails(groupId);
      if (groupDetails.success && groupDetails.data) {
        setGroup(groupDetails.data.group);
      }

      const membersResponse = await groupService.getGroupMembers(groupId);
      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data.members);
      }

      const { API_BASE_URL } = await import('../../../../services/apiBase');
      const usersResponse = await fetch(`${API_BASE_URL}/api/profile/all`, {
        credentials: 'include',
      });
    
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success && usersData.data) {
          setAllUsers(usersData.data.users);
        }
      }
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to fetch data';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } 
    finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = async (userId: string, isAnonymous: boolean) => {
    try {
      await groupService.addMemberToGroup(groupId, userId, isAnonymous);
      setShowAddMember(false);
      setSearchQuery('');
      fetchData();
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to add member';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName}?`)) {
      return;
    }
    try {
      await groupService.removeMemberFromGroup(groupId, memberId);
      fetchData();
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to remove member';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  const handlePromoteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to promote ${memberName} to admin?`)) {
      return;
    }
    
    try {
      await groupService.promoteMemberToAdmin(groupId, memberId);
      fetchData();
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to promote member';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  const availableUsers = allUsers.filter(
    user => !members.find(m => m.user_id === user.user_id)
  );

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-4 border-[#87ceeb] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-md dark:bg-black/60">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#003535] rounded-3xl shadow-[0_40px_80px_rgba(0,32,32,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
        <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#002020] hover:bg-gray-100 transition-all shadow-lg dark:bg-[#004a4a] dark:text-white dark:hover:bg-[#005555]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-4 p-5 border-b border-gray-200 dark:border-[#004a4a]">
          {group?.group_dp_url ? (
            <Image src={group.group_dp_url} alt={group.group_name} width={48} height={48}
              className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#0c6780]">
              {group?.group_name?.charAt(0).toUpperCase() || 'G'}
            </div>
          )}
          <div className="flex-1 min-w-0 pr-12">
            <h2 className="text-lg font-bold text-[#002020] dark:text-[#e7fffe] truncate">{group?.group_name}</h2>
            <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">
              {members.length} members · {group?.is_public ? 'Public' : 'Private'}
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-[#004a4a]">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'members' 
                ? 'text-[#0c6780] dark:text-[#87ceeb] border-b-2 border-[#87ceeb]' 
                : 'text-[#6f787d] dark:text-[#bfc8cd]'
            }`}
          >
            <span className="material-symbols-outlined mr-1 text-sm">group</span>
            Members ({members.length})
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-3 rounded-xl p-3 bg-red-500/10 border border-red-400/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {members.map((member) => (
            <div key={member.member_id} className="flex items-center gap-3 p-3 bg-[#f5f5f5] dark:bg-[#004040] rounded-xl">
              {member.dp_url && !member.is_anonymous ? (
                <Image src={member.dp_url} alt={member.name} width={40} height={40}
                  className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shrink-0 ${
                  member.is_anonymous 
                    ? 'bg-linear-to-br from-gray-500 to-gray-700' 
                    : 'bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]'
                }`}>
                  {member.is_anonymous ? '🎭' : (member.name?.charAt(0).toUpperCase() || '?')}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-sm text-[#002020] dark:text-[#e7fffe] truncate">
                    {member.is_anonymous ? (member.anonymous_name || 'Anonymous') : member.name}
                  </span>
                  {member.is_owner && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">crown</span>
                      Owner
                    </span>
                  )}
                  {member.is_admin && !member.is_owner && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">shield</span>
                      Admin
                    </span>
                  )}
                  {member.is_anonymous && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      Anonymous
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd] truncate">
                  {member.is_anonymous
                    ? `${member.anonymous_gender || 'Unknown'}`
                    : `${member.roll_no} · ${member.branch}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {group?.user_is_owner && !member.is_admin && !member.is_owner && (
                  <button 
                    onClick={() => handlePromoteMember(member.member_id, member.is_anonymous ? (member.anonymous_name || 'Anonymous') : member.name)}
                    className="p-2 rounded-lg hover:bg-[#e2fffe] dark:hover:bg-[#005555] text-[#0c6780] dark:text-[#87ceeb] transition-colors"
                    title="Make Admin"
                  >
                    <span className="material-symbols-outlined text-sm">upgrade</span>
                  </button>
                )}
                {!member.is_owner && !group?.is_public && (
                  <button 
                    onClick={() => handleRemoveMember(member.member_id, member.is_anonymous ? (member.anonymous_name || 'Anonymous') : member.name)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-[#6f787d] dark:text-[#bfc8cd] mb-2">group_off</span>
              <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">No members yet.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-[#004a4a] shrink-0">
          <button 
            onClick={() => setShowAddMember(true)} 
            className="w-full py-3 rounded-xl bg-[#0c6780] text-white text-sm font-medium hover:opacity-90 transition-opacity dark:bg-[#87ceeb] dark:text-[#002020] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add Member
          </button>
        </div>
      </div>
      {showAddMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-[#003535] rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#004a4a]">
              <h2 className="font-bold text-[#002020] dark:text-[#e7fffe]">Add Member</h2>
              <button 
                onClick={() => { setShowAddMember(false); setSearchQuery(''); }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#004040] transition-colors"
              >
                <span className="material-symbols-outlined text-[#6f787d]">close</span>
              </button>
            </div>
            <div className="p-4 pb-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search by name or roll number..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f5f5f5] dark:bg-[#004040] border-none text-sm text-[#002020] dark:text-[#e7fffe] focus:ring-2 focus:ring-[#87ceeb] outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {filteredAvailableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-3xl text-[#6f787d] dark:text-[#bfc8cd] mb-1">search_off</span>
                  <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">No users found</p>
                </div>
              ) : (
                filteredAvailableUsers.map((user) => (
                  <div key={user.user_id} className="flex items-center gap-3 p-2.5 bg-[#f5f5f5] dark:bg-[#004040] rounded-xl">
                    {user.dp_url ? (
                      <Image src={user.dp_url} alt={user.name} width={36} height={36}
                        className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold shrink-0 bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#002020] dark:text-[#e7fffe] truncate">{user.name}</p>
                      <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd] truncate">{user.roll_no} · {user.branch}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleAddMember(user.user_id, false)}
                        className="w-9 h-9 rounded-lg bg-[#0c6780] text-white flex items-center justify-center hover:opacity-90 transition-opacity dark:bg-[#87ceeb] dark:text-[#002020]"
                        title="Add member"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                      </button>
                      <button
                        onClick={() => handleAddMember(user.user_id, true)}
                        className="w-9 h-9 rounded-lg bg-[#e2fffe] text-[#002020] flex items-center justify-center border border-[#87ceeb] hover:bg-[#d2f5f4] transition-colors dark:bg-[#004040] dark:text-[#e7fffe] dark:border-[#004a4a]"
                        title="Add anonymously"
                      >
                        <span className="material-symbols-outlined text-sm">visibility_off</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 rounded-full backdrop-blur-md border shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-white/90 border-[#d2f5f4] dark:bg-[#003535]/90 dark:border-[#004a4a] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <Link href="/chat" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="Chats">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </Link>
        <Link href="/my-groups" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="Groups">
          <span className="material-symbols-outlined text-xl">group</span>
        </Link>
        <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="Home">
          <span className="material-symbols-outlined text-xl">home</span>
        </Link>
        <Link href="/my-identities" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="IDs">
          <span className="material-symbols-outlined text-xl">badge</span>
        </Link>
        <Link href="/profile/edit" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="Settings">
          <span className="material-symbols-outlined text-xl">settings</span>
        </Link>
      </nav>
    </div>
  );
}
