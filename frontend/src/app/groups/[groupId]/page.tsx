'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { groupService } from '@/services/group.service';
import GroupImageManager from '@/components/GroupImageManager';
import { ReportGroupButton } from '@/components/ModerationComponents';
import { useToast } from '@/contexts/ToastContext';
import { useSocket } from '@/contexts/SocketContext';
import Image from 'next/image';
import type { Message } from '@/types/chat.types';
import { decryptMessageAES, generateAESKey, encryptKeyWithPublicKey, decryptKeyWithPrivateKey, 
  importPrivateKey, exportKeyToBase64, importKeyFromBase64 } from '@/utils/e2ee.utils';
import { chatService } from '@/services/chat.service';

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

interface GroupMessage extends Message {
  sender?: {
    user_id: string;
    name: string;
    display_gender?: string;
    dp_url?: string;
    is_anonymous: boolean;
  };
}

interface GroupParticipant {
  user_id: string;
  public_key: string;
}

interface GroupDetails {
  group_id: string;
  group_name: string;
  group_desc: string;
  group_dp_url?: string;
  is_public: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  creator_name: string;
  creator_roll_no: string;
  member_count: number;
  is_member: boolean;
  user_is_admin: boolean;
  user_is_owner: boolean;
}

export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const toast = useToast();
  const { getSocket, isConnected, joinGroup, leaveGroup } = useSocket();
  const socket = getSocket();

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'chat'>('info');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [, setKeyId] = useState<string | null>(null);
  const [, setIsE2EEReady] = useState(false);
  const [userPrivateKey, setUserPrivateKey] = useState<CryptoKey | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.user_id || currentUser?.userId;

  const fetchGroupData = useCallback(async () => {
    try {
      const groupResponse = await groupService.getGroupDetails(groupId);
      if (groupResponse.success && groupResponse.data) {
        setGroup(groupResponse.data.group);
        if (groupResponse.data.group.is_member) {
          const membersResponse = await groupService.getGroupMembers(groupId);
          if (membersResponse.success && membersResponse.data) {
            setMembers(membersResponse.data.members);
          }
        }
      }
    }
    catch (err: unknown) {
      let errorMsg = 'Failed to fetch group data';
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
    fetchGroupData();
  }, [fetchGroupData]);

  const handleJoinGroup = async (isAnonymous: boolean) => {
    try {
      await groupService.joinGroup(groupId, isAnonymous);
      fetchGroupData();
      toast.success(isAnonymous ? 'Joined anonymously!' : 'Joined group!');
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to join group';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await groupService.leaveGroup(groupId);
      router.push('/my-groups');
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to leave group';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      toast.error(errorMsg);
    }
  };

  // Chat functions
  const fetchAndDecryptConversationKey = useCallback(async (msgs: GroupMessage[]) => {
    try {
      const decryptedPrivateKeyB64 = sessionStorage.getItem('decryptedPrivateKey');
      if (!decryptedPrivateKeyB64 || !userStr) {
        console.warn('[E2EE] Private key missing from session storage');
        return null;
      }

      let privKey = userPrivateKey;
      if (!privKey && decryptedPrivateKeyB64) {
        privKey = await importPrivateKey(decryptedPrivateKeyB64);
        setUserPrivateKey(privKey);
      }

      if (!privKey) return null;
      const msgWithKey = msgs.find(m => m.user_session_key && m.key_id);

      if (msgWithKey?.user_session_key && msgWithKey?.key_id) {
        try {
          const aesKeyB64 = await decryptKeyWithPrivateKey(privKey, msgWithKey.user_session_key);
          const aesKey = await importKeyFromBase64(aesKeyB64);
          setSessionKey(aesKey);
          setKeyId(msgWithKey.key_id);
          setIsE2EEReady(true);
          return aesKey;
        }
        catch (err) {
          console.error('[E2EE] Failed to decrypt session key:', err);
          return null;
        }
      }

      // Check if there are existing encrypted messages that need decryption
      const hasEncryptedMessages = msgs.some(m => m.encrypted_content && m.content_iv && m.content_auth_tag);
      if (hasEncryptedMessages) {
        console.warn('[E2EE] Existing encrypted messages found but no session key available. Messages will remain encrypted.');
        return null;
      }

      const info = await groupService.getGroupParticipantPublicKeys(groupId);
      const participants = info.data.participants;
      const newAesKey = await generateAESKey();
      const aesKeyB64 = await exportKeyToBase64(newAesKey);
      const encryptedKeys = await Promise.all(participants.map(async (p: GroupParticipant) => {
        const encrypted = await encryptKeyWithPublicKey(aesKeyB64, p.public_key);
        return { userId: p.user_id, encryptedKey: encrypted, keyVersion: 1 };
      }));

      const { keyId: newKeyId } = await chatService.storeSessionKeys({ groupId, keys: encryptedKeys });
      setSessionKey(newAesKey);
      setKeyId(newKeyId);
      setIsE2EEReady(true);
      return newAesKey;
    } 
    catch (error) {
      console.error('[E2EE] Session initialization failed:', error);
    }
  }, [groupId, userPrivateKey, userStr]);

  const decryptMessages = useCallback(async (msgs: GroupMessage[], aesKey: CryptoKey) => {
    return await Promise.all(msgs.map(async (m) => {
      const decryptedMsg = { ...m };
      if (m.encrypted_content && m.content_iv && m.content_auth_tag) {
        try {
          const decrypted = await decryptMessageAES(m.encrypted_content, m.content_iv, m.content_auth_tag, aesKey);
          decryptedMsg.encrypted_content = decrypted;
        } 
        catch (err) {
          console.warn(`[E2EE] Failed to decrypt message ${m.message_id}:`, err);
          decryptedMsg.encrypted_content = '[Encrypted Message]';
        }
      }
      return decryptedMsg;
    }));
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await groupService.getGroupMessages(groupId);
      let fetchedMessages = response.data.messages || [];
      const aesKey = await fetchAndDecryptConversationKey(fetchedMessages);
      if (aesKey) {
        fetchedMessages = await decryptMessages(fetchedMessages, aesKey);
      }
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
    }
  }, [groupId, fetchAndDecryptConversationKey, decryptMessages]);

  useEffect(() => {
    if (!socket || activeTab !== 'chat') return;
    const handleNewGroupMessage = async (message: GroupMessage) => {
      const processedMessage = { ...message };
      // Only decrypt if we have all required fields
      if (sessionKey && message.encrypted_content && message.content_iv && message.content_auth_tag) {
        try {
          const decrypted = await decryptMessageAES(
            message.encrypted_content,
            message.content_iv,
            message.content_auth_tag,
            sessionKey
          );
          processedMessage.encrypted_content = decrypted;
        } catch (err) {
          console.warn('[E2EE] Failed to decrypt real-time message:', err);
          processedMessage.encrypted_content = '[Encrypted Message]';
        }
      }
      setMessages((prev) => [...prev, { ...processedMessage, is_my_message: message.sender_id === currentUserId || (message.sender?.user_id === currentUserId) }]);
    };

    socket.on('new-group-message', handleNewGroupMessage);
    return () => { socket.off('new-group-message', handleNewGroupMessage); };
  }, [socket, sessionKey, currentUserId, activeTab]);

  // Join group socket room when on chat tab
  useEffect(() => {
    if (activeTab === 'chat' && groupId && isConnected) {
      joinGroup(groupId);
      fetchMessages();
      return () => { if (isConnected) leaveGroup(groupId); };
    }
  }, [activeTab, groupId, isConnected, joinGroup, leaveGroup, fetchMessages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-4 border-[#87ceeb] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md p-4">
        <div className="bg-white dark:bg-[#003535] rounded-3xl p-8 text-center max-w-sm shadow-2xl">
          <div className="text-4xl mb-4">😕</div>
          <p className="font-semibold mb-6 text-[#002020] dark:text-[#e7fffe]">{error || 'Group not found'}</p>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2.5 bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/40 backdrop-blur-md dark:bg-black/60">
      <div className="relative w-full max-w-5xl h-[85vh] md:h-[75vh] bg-white dark:bg-[#003535] rounded-3xl shadow-[0_40px_80px_rgba(0,32,32,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#002020] hover:bg-gray-100 transition-all duration-300 shadow-lg active:scale-90 dark:bg-[#004a4a] dark:text-white dark:hover:bg-[#005555]"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-5/12 relative h-64 md:h-full bg-[#e2fffe] dark:bg-[#002020] overflow-hidden">
            {group.group_dp_url ? (
              <Image 
                src={group.group_dp_url} 
                alt={group.group_name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#87ceeb] to-[#0c6780]">
                <span className="text-6xl font-bold text-white">{group.group_name?.charAt(0).toUpperCase() || 'G'}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full border border-white/60 ${group.is_public ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                <span className="text-white/90 text-[10px] font-medium uppercase tracking-wider">
                  {group.is_public ? 'Public Group' : 'Private Group'}
                </span>
              </div>
              <h2 className="text-white text-xl md:text-2xl font-bold mt-1">{group.group_name}</h2>
              <p className="text-white/70 text-sm">by {group.creator_name}</p>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-[#004a4a]">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'info' 
                    ? 'text-[#0c6780] dark:text-[#87ceeb] border-b-2 border-[#87ceeb]' 
                    : 'text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780]'
                }`}
              >
                <span className="material-symbols-outlined mr-2">info</span>
                Info
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'members' 
                    ? 'text-[#0c6780] dark:text-[#87ceeb] border-b-2 border-[#87ceeb]' 
                    : 'text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780]'
                }`}
              >
                <span className="material-symbols-outlined mr-2">group</span>
                Members ({group.member_count})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {activeTab === 'info' ? (
                <div className="space-y-5">
                  {group.group_desc && (
                    <div className="space-y-2">
                      <h3 className="text-[#6f787d] dark:text-[#bfc8cd] text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">description</span>
                        About
                      </h3>
                      <p className="text-[#002020] dark:text-[#e7fffe] text-sm leading-relaxed">{group.group_desc}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-[#e2fffe]/50 dark:bg-[#004040]/50 px-3 py-2.5 rounded-xl text-center">
                      <p className="text-[#002020] dark:text-[#e7fffe] font-semibold text-sm">{group.member_count}/{group.max_members}</p>
                      <span className="text-[#6f787d] dark:text-[#bfc8cd] text-[10px]">Members</span>
                    </div>
                    <div className="bg-[#e2fffe]/50 dark:bg-[#004040]/50 px-3 py-2.5 rounded-xl text-center">
                      <p className="text-[#002020] dark:text-[#e7fffe] font-semibold text-sm">{new Date(group.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                      <span className="text-[#6f787d] dark:text-[#bfc8cd] text-[10px]">Created</span>
                    </div>
                    <div className="bg-[#e2fffe]/50 dark:bg-[#004040]/50 px-3 py-2.5 rounded-xl text-center">
                      <p className="text-[#002020] dark:text-[#e7fffe] font-semibold text-sm truncate">{group.creator_roll_no}</p>
                      <span className="text-[#6f787d] dark:text-[#bfc8cd] text-[10px]">Creator</span>
                    </div>
                    <div className="bg-[#e2fffe]/50 dark:bg-[#004040]/50 px-3 py-2.5 rounded-xl text-center">
                      <p className="text-[#002020] dark:text-[#e7fffe] font-semibold text-sm">
                        {group.user_is_owner ? 'Owner' : group.user_is_admin ? 'Admin' : group.is_member ? 'Member' : 'Guest'}
                      </p>
                      <span className="text-[#6f787d] dark:text-[#bfc8cd] text-[10px]">Your Role</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.is_public ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">public</span>
                        Public
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        Private
                      </span>
                    )}
                    {group.user_is_owner && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">crown</span>
                        Owner
                      </span>
                    )}
                    {group.user_is_admin && !group.user_is_owner && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">shield</span>
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-3xl text-[#6f787d] dark:text-[#bfc8cd] mb-1">group_off</span>
                      <p className="text-[#6f787d] dark:text-[#bfc8cd] text-sm">No members to display</p>
                    </div>
                  ) : (
                    members.map((member) => (
                      <div key={member.member_id} className="flex items-center gap-3 p-2.5 bg-[#f5f5f5] dark:bg-[#004040] rounded-xl">
                        {member.dp_url && !member.is_anonymous ? (
                          <Image 
                            src={member.dp_url} 
                            alt={member.name} 
                            width={36} 
                            height={36}
                            className="w-9 h-9 rounded-full object-cover" 
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            member.is_anonymous 
                              ? 'bg-linear-to-br from-gray-500 to-gray-700' 
                              : 'bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]'
                          }`}>
                            {(member.is_anonymous ? member.anonymous_name : member.name)?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-sm text-[#002020] dark:text-[#e7fffe] truncate">
                              {member.is_anonymous ? member.anonymous_name : member.name}
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
                          <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">
                            {member.is_anonymous 
                              ? member.anonymous_gender 
                              : `${member.roll_no} · ${member.branch}`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-[#004a4a]">
              {!group.is_member && group.is_public && (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleJoinGroup(false)}
                    className="bg-[#0c6780] h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-white font-bold text-lg dark:bg-[#87ceeb] dark:text-[#002020]"
                  >
                    <span className="material-symbols-outlined">login</span>
                    Join
                  </button>
                  <button 
                    onClick={() => handleJoinGroup(true)}
                    className="bg-[#e2fffe] dark:bg-[#004040] h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-[#002020] dark:text-[#e7fffe] font-bold text-lg border-2 border-[#87ceeb]"
                  >
                    <span className="material-symbols-outlined">incognito</span>
                    Anonymous
                  </button>
                </div>
              )}
              
              {group.is_member && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/my-groups')}
                    className="bg-[#0c6780] dark:bg-[#87ceeb] h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-white dark:text-[#002020] font-bold text-lg"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Chat
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    className="bg-red-100 dark:bg-red-900/30 h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-red-600 dark:text-red-400 font-bold text-lg"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Leave
                  </button>
                </div>
              )}

              {!group.is_member && !group.is_public && (
                <div className="text-center py-4">
                  <p className="text-[#6f787d] dark:text-[#bfc8cd]">
                    This is a private group. You need an invitation to join.
                  </p>
                </div>
              )}

              {/* Admin Actions */}
              {group.is_member && (group.user_is_admin || group.user_is_owner) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#004a4a] grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="bg-[#e2fffe] dark:bg-[#004040] h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md text-[#0c6780] dark:text-[#87ceeb] font-semibold"
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Edit Group
                  </button>
                  <Link href={`/groups/${groupId}/manage`} className="w-full">
                    <button className="w-full bg-[#e2fffe] dark:bg-[#004040] h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md text-[#0c6780] dark:text-[#87ceeb] font-semibold">
                      <span className="material-symbols-outlined">settings</span>
                      Manage
                    </button>
                  </Link>
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <ReportGroupButton groupId={group.group_id} groupName={group.group_name} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Dock Navigation */}
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 rounded-full backdrop-blur-md border shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-white/90 border-[#d2f5f4] dark:bg-[#003535]/90 dark:border-[#004a4a] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <Link href="/chat" className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]" title="Chats">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </Link>
        <Link href="/my-groups" className="w-12 h-12 flex items-center justify-center bg-[#87ceeb]/20 text-[#0c6780] rounded-full transition-all duration-300 ring-2 ring-[#87ceeb]/40 dark:bg-[#0c6780]/20 dark:text-[#87ceeb] dark:ring-[#0c6780]/40" title="Groups">
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

      {showEditModal && group && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setShowEditModal(false); fetchGroupData(); }}
        />
      )}
    </div>
  );
}

// Edit Group Modal
function EditGroupModal({group, onClose, onSuccess}: {
  group: GroupDetails; onClose: () => void; onSuccess: () => void; }) {
  const [formData, setFormData] = useState({
    group_name: group.group_name,
    group_desc: group.group_desc || '',
    group_dp_url: group.group_dp_url || '',
    max_members: group.max_members
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await groupService.updateGroup(group.group_id, formData);
      onSuccess();
    } catch (err: unknown) {
      let errorMsg = 'Failed to update group';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-white dark:bg-[#003535] rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#004a4a] shrink-0">
          <h2 className="font-bold text-[#002020] dark:text-[#e7fffe]">Edit Group</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#004040] transition-colors"
          >
            <span className="material-symbols-outlined text-[#6f787d]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="rounded-xl p-3 mb-4 border border-red-400/30 bg-red-500/10 text-red-400 text-sm">{error}</div>
          )}
          <form id="editGroupForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-wider">Group Name*</label>
              <input 
                type="text" 
                required 
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f5f5f5] dark:bg-[#004040] border-none text-sm text-[#002020] dark:text-[#e7fffe] focus:ring-2 focus:ring-[#87ceeb] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-wider">Description</label>
              <textarea 
                value={formData.group_desc}
                onChange={(e) => setFormData({ ...formData, group_desc: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f5f5f5] dark:bg-[#004040] border-none text-sm text-[#002020] dark:text-[#e7fffe] focus:ring-2 focus:ring-[#87ceeb] outline-none resize-none" 
                rows={2} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-wider">Group Picture</label>
              <GroupImageManager
                groupId={group.group_id}
                isAdmin={group.user_is_admin || group.user_is_owner}
                currentImageUrl={formData.group_dp_url || undefined}
                onUploadSuccess={(url: string) => setFormData({ ...formData, group_dp_url: url })}
                onDeleteSuccess={() => setFormData({ ...formData, group_dp_url: '' })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-wider">
                Max Members
              </label>
              <input 
                type="number" 
                required 
                min={group.member_count} 
                max={500} 
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f5f5f5] dark:bg-[#004040] border-none text-sm text-[#002020] dark:text-[#e7fffe] focus:ring-2 focus:ring-[#87ceeb] outline-none"
              />
              <p className="text-xs mt-1 text-[#6f787d] dark:text-[#bfc8cd]">{group.member_count} current members</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-[#004a4a] shrink-0">
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-[#004040] text-[#6f787d] dark:text-[#bfc8cd] text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#005555] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="editGroupForm"
              disabled={loading} 
              className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-[#87ceeb] to-[#ffb6c1] text-[#002020] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

