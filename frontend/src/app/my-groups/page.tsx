'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Group, Message, Poll } from '@/types/chat.types';
import { groupService } from '@/services/group.service';
import { useGroupPresence } from '@/hooks/useGroupPresence';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';
import { encryptMessageAES, decryptMessageAES, generateAESKey, encryptKeyWithPublicKey,
  decryptKeyWithPrivateKey, importPrivateKey, exportKeyToBase64, importKeyFromBase64 } from '@/utils/e2ee.utils';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
type EmojiData = { emoji: string };

interface MyGroup extends Group {
  is_admin: boolean;
  is_owner: boolean;
  is_anonymous: boolean;
  joined_at: string;
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

/** Small inline badge showing live online member count for a group */
function GroupOnlineBadge({ groupId }: { groupId: string }) {
  const { onlineCount } = useGroupPresence(groupId);
  if (onlineCount === 0) return null;
  return (
    <span className="flex items-center gap-1 font-medium" style={{ color: '#22C55E' }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {onlineCount} online
    </span>
  );
}

export default function MyGroupsPage() {
  const router = useRouter();
  const { getSocket, isConnected, joinGroup, leaveGroup, sendTyping } = useSocket();
  const toast = useToast();
  const socket = getSocket();

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Groups list state
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected group state
  const [selectedGroup, setSelectedGroup] = useState<MyGroup | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [isE2EEReady, setIsE2EEReady] = useState(false);
  const [userPrivateKey, setUserPrivateKey] = useState<CryptoKey | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showPollTypeMenu, setShowPollTypeMenu] = useState(false);
  const [selectedPollType, setSelectedPollType] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const pollMenuRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.user_id || currentUser?.userId;

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('chat-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('chat-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Fetch groups
  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const response = await groupService.getMyGroups();
      if (response.success && response.data && Array.isArray(response.data.groups)) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setError('Failed to fetch your groups');
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter(g => g.group_name.toLowerCase().includes(query));
  }, [searchQuery, groups]);

  // Handle group selection
  const handleSelectGroup = useCallback((group: MyGroup) => {
    setSelectedGroup(group);
    setShowGroupInfo(false);
    loadGroupChat(group);
  }, []);

  // Load group chat
  const loadGroupChat = async (group: MyGroup) => {
    try {
      // Load messages
      const messagesRes = await groupService.getGroupMessages(group.group_id);
      let fetchedMessages = messagesRes.data?.messages || [];

      // Initialize E2EE
      const aesKey = await fetchAndDecryptConversationKey(fetchedMessages, group.group_id);
      if (aesKey) {
        fetchedMessages = await decryptMessages(fetchedMessages, aesKey);
      }
      setMessages(fetchedMessages);

      // Load polls
      const pollsRes = await groupService.getGroupPolls(group.group_id);
      setPolls(pollsRes.data?.polls || []);

      // Join socket room
      if (isConnected && group.group_id) {
        joinGroup(group.group_id);
      }
    } catch (error) {
      console.error('Failed to load group chat:', error);
    }
  };

  // E2EE: Initialize session key
  const fetchAndDecryptConversationKey = useCallback(async (msgs: GroupMessage[], groupId: string) => {
    try {
      const storedUser = localStorage.getItem('user');
      const decryptedPrivateKeyB64 = sessionStorage.getItem('decryptedPrivateKey');

      if (!decryptedPrivateKeyB64 || !storedUser) {
        console.warn('[E2EE] Private key missing from session storage');
        return null;
      }

      let privKey = userPrivateKey;
      if (!privKey && decryptedPrivateKeyB64) {
        privKey = await importPrivateKey(decryptedPrivateKeyB64);
        setUserPrivateKey(privKey);
      }

      const msgWithKey = msgs.find(m => m.user_session_key && m.key_id);

      if (msgWithKey && msgWithKey.user_session_key && msgWithKey.key_id) {
        try {
          const aesKeyB64 = await decryptKeyWithPrivateKey(privKey, msgWithKey.user_session_key);
          const aesKey = await importKeyFromBase64(aesKeyB64);
          setSessionKey(aesKey);
          setKeyId(msgWithKey.key_id);
          setIsE2EEReady(true);
          return aesKey;
        } catch (err) {
          console.error('[E2EE] Failed to decrypt session key:', err);
        }
      }

      // Generate new key if none exists
      const newKey = await generateAESKey();
      setSessionKey(newKey);
      setIsE2EEReady(true);
      return newKey;
    } catch (err) {
      console.error('[E2EE] Key initialization failed:', err);
      return null;
    }
  }, [userPrivateKey]);

  const decryptMessages = useCallback(async (msgs: GroupMessage[], aesKey: CryptoKey) => {
    return await Promise.all(msgs.map(async (m) => {
      const decryptedMsg = { ...m };
      if (m.encrypted_content && m.content_iv && m.content_auth_tag) {
        try {
          const decrypted = await decryptMessageAES(
            m.encrypted_content,
            m.content_iv,
            m.content_auth_tag,
            aesKey
          );
          decryptedMsg.encrypted_content = decrypted;
        } catch (err) {
          console.warn(`[E2EE] Failed to decrypt message ${m.message_id}:`, err);
          decryptedMsg.encrypted_content = '[Encrypted Message]';
        }
      }
      return decryptedMsg;
    }));
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!isConnected || !socket || !selectedGroup) return;

    const handleNewMessage = (data: { message: GroupMessage }) => {
      if (data.message.group_id === selectedGroup.group_id) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    const handleTyping = (data: { userId: string; groupId: string; isTyping: boolean }) => {
      if (data.groupId === selectedGroup?.group_id && data.userId !== currentUserId) {
        if (data.isTyping) {
          setTypingUsers(prev => Array.from(new Set([...prev, data.userId])));
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      }
    };

    socket.on('group:message', handleNewMessage);
    socket.on('group:typing', handleTyping);

    return () => {
      socket.off('group:message', handleNewMessage);
      socket.off('group:typing', handleTyping);
      if (selectedGroup) {
        leaveGroup(selectedGroup.group_id);
      }
    };
  }, [isConnected, socket, selectedGroup, currentUserId, joinGroup, leaveGroup]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (selectedGroup && isConnected) {
      sendTyping(selectedGroup.group_id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(selectedGroup.group_id, false);
      }, 2000);
    }
  };

  // Handle image select
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast?.error?.('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle emoji select
  const handleEmojiSelect = (emojiData: EmojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !selectedGroup) return;

    setSending(true);
    try {
      let mediaUrl = '';
      let mediaSize = 0;
      let mediaMimeType = '';

      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        try {
          const uploadRes = await groupService.uploadImage(selectedGroup.group_id, selectedImage);
          mediaUrl = uploadRes.data?.url || '';
          mediaSize = uploadRes.data?.size || 0;
          mediaMimeType = uploadRes.data?.mimeType || '';
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          toast?.error?.('Failed to upload image');
          setSending(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Encrypt message content
      let finalContent = newMessage || 'Image';
      let contentIv = 'dummy_iv';
      let contentAuthTag = 'dummy_tag';

      if (isE2EEReady && sessionKey) {
        try {
          const { ciphertext, iv, authTag } = await encryptMessageAES(finalContent, sessionKey);
          finalContent = ciphertext;
          contentIv = iv;
          contentAuthTag = authTag;
        } catch (err) {
          console.error('[E2EE] Encryption failed:', err);
          setSending(false);
          return;
        }
      }

      // Send message
      await groupService.sendMessage(selectedGroup.group_id, {
        encryptedContent: finalContent,
        contentIv,
        contentAuthTag,
        messageType: selectedImage ? 'image' : 'text',
        mediaUrl,
        mediaSize,
        mediaMimeType,
        keyId: keyId || undefined,
        parentMessageId: replyingTo?.message_id
      });

      setNewMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      setReplyingTo(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Reload messages
      loadGroupChat(selectedGroup);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast?.error?.('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojiPicker]);

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#e2fffe] flex items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
        <div className="dark:bg-[#002020] dark:text-[#87ceeb] min-h-screen w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-4 border-[#87ceeb] dark:border-[#0c6780] border-t-transparent mx-auto mb-4 animate-spin" />
            <p className="text-sm text-[#0c6780] dark:text-[#87ceeb]">Loading groups…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen">
        {/* Background blur overlay */}
        <div className="fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4">
          {/* Groups Modal Container */}
          <div className="w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50">
            {/* Left Panel: Group List (35%) */}
            <aside className="w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']">Groups</h1>
                  <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 rounded-full transition-colors group"
                      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                      <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-[#0c6780] dark:group-hover:text-[#87ceeb]">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                      </span>
                    </button>
                    {/* Close */}
                    <Link
                      href="/dashboard"
                      className="w-10 h-10 flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                      title="Close"
                    >
                      <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-red-600">close</span>
                    </Link>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] dark:text-[#bfc8cd]">search</span>
                  <input
                    className="w-full bg-white dark:bg-[#004040] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]"
                    placeholder="Search groups..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Create Group Button */}
                <Link
                  href="/dashboard"
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#87ceeb] to-[#ffb6c1] dark:from-[#0c6780] dark:to-[#4a6368] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create New Group
                </Link>
              </div>

              {/* Group List */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {error && (
                  <div className="p-4 mb-4 rounded-xl bg-red-100/50 border border-red-400 text-red-700 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                {filteredGroups.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto">
                      <span className="material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]">groups</span>
                    </div>
                    <p className="font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">No groups yet</p>
                    <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd] mb-4">Join or create groups from the dashboard</p>
                    <Link href="/dashboard" className="text-sm font-semibold text-[#0c6780] dark:text-[#87ceeb] hover:underline">
                      Browse Groups →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredGroups.map((group) => (
                      <button
                        key={group.group_id}
                        onClick={() => handleSelectGroup(group)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                          selectedGroup?.group_id === group.group_id
                            ? 'bg-white dark:bg-[#004040] shadow-md'
                            : 'hover:bg-white/50 dark:hover:bg-[#004040]/50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          {group.group_dp_url ? (
                            <Image
                              src={group.group_dp_url}
                              alt={group.group_name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#0c6780]">
                              <span className="material-symbols-outlined">groups</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-[#002020] dark:text-[#e7fffe] truncate">
                              {group.group_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">
                              {group.member_count} members
                            </span>
                            <GroupOnlineBadge groupId={group.group_id} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* Right Panel: Group Chat or Group Info or Empty State */}
            <main className="flex-1 flex flex-col bg-white/50 dark:bg-[#003535]/30 min-h-0">
              {showGroupInfo && selectedGroup ? (
                // Group Info View
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <button
                      onClick={() => setShowGroupInfo(false)}
                      className="mb-4 flex items-center gap-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      <span className="text-sm font-medium">Back to Chat</span>
                    </button>

                    {/* Group Header */}
                    <div className="bg-white dark:bg-[#004040] rounded-2xl p-6 shadow-sm mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        {selectedGroup.group_dp_url ? (
                          <Image
                            src={selectedGroup.group_dp_url}
                            alt={selectedGroup.group_name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#0c6780]">
                            <span className="material-symbols-outlined text-3xl">groups</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-[#002020] dark:text-[#e7fffe]">{selectedGroup.group_name}</h2>
                          <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">
                            {selectedGroup.is_public ? 'Public' : 'Private'} Group • {selectedGroup.member_count} members
                          </p>
                          {selectedGroup.is_admin && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 text-[#0c6780] dark:text-[#87ceeb]">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">
                        {selectedGroup.group_desc || 'No description'}
                      </p>
                    </div>

                    {/* Group Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Link
                        href={`/groups/${selectedGroup.group_id}`}
                        className="p-4 rounded-xl bg-white dark:bg-[#004040] shadow-sm hover:shadow-md transition-shadow text-center"
                      >
                        <span className="material-symbols-outlined text-2xl text-[#0c6780] dark:text-[#87ceeb] mb-2">info</span>
                        <p className="text-sm font-medium text-[#002020] dark:text-[#e7fffe]">Full Details</p>
                      </Link>
                      <button
                        onClick={() => router.push(`/groups/${selectedGroup.group_id}/members`)}
                        className="p-4 rounded-xl bg-white dark:bg-[#004040] shadow-sm hover:shadow-md transition-shadow text-center"
                      >
                        <span className="material-symbols-outlined text-2xl text-[#0c6780] dark:text-[#87ceeb] mb-2">group</span>
                        <p className="text-sm font-medium text-[#002020] dark:text-[#e7fffe]">Members</p>
                      </button>
                    </div>

                    {/* Polls Section */}
                    <div className="bg-white dark:bg-[#004040] rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-[#002020] dark:text-[#e7fffe] mb-4">Active Polls</h3>
                      {polls.length === 0 ? (
                        <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">No active polls</p>
                      ) : (
                        <div className="space-y-3">
                          {polls.slice(0, 3).map(poll => (
                            <div key={poll.poll_id} className="p-3 rounded-xl bg-[#e2fffe] dark:bg-[#003535]">
                              <p className="font-medium text-[#002020] dark:text-[#e7fffe]">{poll.title}</p>
                              <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">{poll.poll_type}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedGroup ? (
                // Group Chat View
                <>
                  {/* Chat Header */}
                  <header className="px-6 py-4 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-b border-white/30 dark:border-[#004a4a]/30 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowGroupInfo(true)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        {selectedGroup.group_dp_url ? (
                          <Image
                            src={selectedGroup.group_dp_url}
                            alt={selectedGroup.group_name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-linear-to-br from-[#87ceeb] to-[#0c6780]">
                            <span className="material-symbols-outlined">groups</span>
                          </div>
                        )}
                        <div>
                          <h2 className="font-bold text-[#002020] dark:text-[#e7fffe]">{selectedGroup.group_name}</h2>
                          <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">
                            {selectedGroup.member_count} members • <GroupOnlineBadge groupId={selectedGroup.group_id} />
                          </p>
                        </div>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/groups/${selectedGroup.group_id}`)}
                        className="p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors"
                        title="Group Details"
                      >
                        <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]">info</span>
                      </button>
                    </div>
                  </header>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto">
                            <span className="material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]">chat</span>
                          </div>
                          <p className="font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">No messages yet</p>
                          <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.message_id}
                          className={`flex ${msg.is_my_message ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${msg.is_my_message ? 'bg-[#87ceeb] dark:bg-[#0c6780] text-white rounded-2xl rounded-br-sm' : 'bg-white dark:bg-[#004040] text-[#002020] dark:text-[#e7fffe] rounded-2xl rounded-bl-sm'} p-3 shadow-sm`}>
                            {!msg.is_my_message && msg.sender && (
                              <p className="text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]">
                                {msg.sender.name}
                              </p>
                            )}
                            {msg.message_type === 'image' && msg.media_url && (
                              <div className="mb-2">
                                <a href={msg.media_url} target="_blank" rel="noopener noreferrer">
                                  <Image
                                    src={msg.media_url}
                                    alt="Shared image"
                                    width={300}
                                    height={200}
                                    className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                    unoptimized
                                  />
                                </a>
                              </div>
                            )}
                            {msg.encrypted_content && msg.encrypted_content !== 'Image' && (
                              <p className="text-sm whitespace-pre-wrap">{msg.encrypted_content}</p>
                            )}
                            <div className={`flex items-center gap-1 mt-1 ${msg.is_my_message ? 'justify-end' : 'justify-start'}`}>
                              <span className={`text-[10px] ${msg.is_my_message ? 'text-white/70' : 'text-[#6f787d] dark:text-[#bfc8cd]'}`}>
                                {formatTime(msg.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {typingUsers.length > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-[#004040] rounded-2xl rounded-bl-sm p-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#6f787d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#6f787d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#6f787d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply Preview */}
                  {replyingTo && (
                    <div className="px-4 py-2 bg-white/50 dark:bg-[#003535]/50 border-t border-white/30 dark:border-[#004a4a]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">
                            Replying to {replyingTo.sender?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-[#002020] dark:text-[#e7fffe] truncate max-w-50">
                            {replyingTo.encrypted_content || '📷 Image'}
                          </span>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="p-1 hover:bg-red-100/50 rounded-full text-red-500"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="px-4 py-2 bg-white/50 dark:bg-[#003535]/50 border-t border-white/30 dark:border-[#004a4a]/30">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#002020] dark:text-[#e7fffe] truncate">{selectedImage?.name}</p>
                          <p className="text-[10px] text-[#6f787d] dark:text-[#bfc8cd]">Ready to upload</p>
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="p-1 hover:bg-red-100/50 rounded-full text-red-500"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                      <div className="shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                        <EmojiPicker
                          onEmojiClick={handleEmojiSelect}
                          autoFocusSearch={false}
                          theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                        />
                      </div>
                    </div>
                  )}

                  {/* Poll Menu */}
                  {showPollTypeMenu && (
                    <div ref={pollMenuRef} className="absolute bottom-20 left-4 bg-white/90 dark:bg-[#004040]/90 backdrop-blur-xl rounded-2xl p-3 w-52 shadow-xl border border-white/30 dark:border-[#004a4a]/30 z-50">
                      <p className="text-[10px] font-bold px-2 py-1 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-widest">Create Poll</p>
                      {[
                        { value: 'kick_member', label: '🚫 Kick Member', desc: 'Vote to remove someone' },
                        { value: 'make_admin', label: '⭐ Make Admin', desc: 'Promote a member' },
                        { value: 'remove_admin', label: '🔻 Remove Admin', desc: 'Demote an admin' },
                        { value: 'General', label: '🗳️ General Poll', desc: 'Ask anything' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedPollType(opt.value);
                            setShowPollTypeMenu(false);
                            setShowCreatePoll(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl transition-all hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/20 flex flex-col gap-0.5"
                        >
                          <span className="text-xs font-bold text-[#002020] dark:text-[#e7fffe]">{opt.label}</span>
                          <span className="text-[9px] text-[#6f787d] dark:text-[#bfc8cd]">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input Area */}
                  <footer className="p-0 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={sending || uploadingImage}
                          className="w-10 h-10 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center justify-center text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          disabled={sending || uploadingImage}
                          className="w-10 h-10 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center justify-center text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined">sentiment_satisfied</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPollTypeMenu(!showPollTypeMenu)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            showPollTypeMenu ? 'bg-[#87ceeb]/30 text-[#0c6780]' : 'bg-white/50 dark:bg-[#004040]/50 text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30'
                          }`}
                        >
                          <span className="material-symbols-outlined">poll</span>
                        </button>
                      </div>

                      <input
                        ref={messageInputRef}
                        type="text"
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder={uploadingImage ? 'Uploading image...' : 'Type a message...'}
                        className="flex-1 bg-white/80 dark:bg-[#004040]/80 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]"
                        disabled={sending || uploadingImage}
                      />

                      <button
                        type="submit"
                        disabled={sending || uploadingImage || (!newMessage.trim() && !selectedImage)}
                        className="w-10 h-10 rounded-xl bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] dark:from-[#0c6780] dark:via-[#4a6368] dark:to-[#0c6780] flex items-center justify-center text-[#002020] dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </form>
                  </footer>
                </>
              ) : (
                // Empty State
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-4 mx-auto">
                      <span className="material-symbols-outlined text-4xl text-[#0c6780] dark:text-[#87ceeb]">groups</span>
                    </div>
                    <p className="text-lg font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">Select a group</p>
                    <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Choose a group to start chatting</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

