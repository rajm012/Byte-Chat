'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { groupService } from '@/services/group.service';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/contexts/ToastContext';
import type { Message, Poll, Group } from '@/types/chat.types';
import { Theme } from 'emoji-picker-react';
import Image from 'next/image';
// import { messageManagementService } from '@/services/message-management.service';
import { encryptMessageAES, decryptMessageAES, generateAESKey, encryptKeyWithPublicKey,
  decryptKeyWithPrivateKey, importPrivateKey, exportKeyToBase64, importKeyFromBase64 } from '@/utils/e2ee.utils';
import { chatService } from '@/services/chat.service';
import { useGroupPresence } from '@/hooks/useGroupPresence';

// Dynamic import for emoji picker (client-side only)
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
type EmojiData = { emoji: string };

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

export default function GroupChatPage() {
  const params = useParams();
  // const router = useRouter();
  const groupId = params.groupId as string;
  const { getSocket, isConnected, joinGroup, leaveGroup, sendTyping } = useSocket();
  const toast = useToast();
  const socket = getSocket();

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [selectedPollType, setSelectedPollType] = useState<string | null>(null);
  const [showPollTypeMenu, setShowPollTypeMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [, setIsE2EEReady] = useState(false);
  const [userPrivateKey, setUserPrivateKey] = useState<CryptoKey | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const pollMenuRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.user_id || currentUser?.userId;
  
  // Filter messages based on search
  const displayedMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const query = searchQuery.toLowerCase();
    return messages.filter(m => 
      (m.encrypted_content || '').toLowerCase().includes(query) ||
      (m.sender?.name || '').toLowerCase().includes(query)
    );
  }, [searchQuery, messages]);

  // Real-time online member count for this group
  const { onlineCount, totalMembers } = useGroupPresence(groupId);

  // E2EE: Initialize session key
  const fetchAndDecryptConversationKey = useCallback(async (msgs: GroupMessage[]) => {
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

      if (!privKey) return null;

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

      const info = await groupService.getGroupParticipantPublicKeys(groupId);
      const participants = info.data.participants;

      const newAesKey = await generateAESKey();
      const aesKeyB64 = await exportKeyToBase64(newAesKey);

      const encryptedKeys = await Promise.all(participants.map(async (p: GroupParticipant) => {
        const encrypted = await encryptKeyWithPublicKey(aesKeyB64, p.public_key);
        return { userId: p.user_id, encryptedKey: encrypted, keyVersion: 1 };
      }));

      const { keyId: newKeyId } = await chatService.storeSessionKeys({
        groupId,
        keys: encryptedKeys
      });

      setSessionKey(newAesKey);
      setKeyId(newKeyId);
      setIsE2EEReady(true);
      return newAesKey;
    } catch (error) {
      console.error('[E2EE] Session initialization failed:', error);
    }
  }, [groupId, userPrivateKey]);

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
    } finally {
      setLoading(false);
    }
  }, [groupId, fetchAndDecryptConversationKey, decryptMessages]);

  const fetchGroup = useCallback(async () => {
    try {
      const response = await groupService.getGroupDetails(groupId);
      const groupData = response.data?.group || response.data;
      if (groupData) setGroup(groupData);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    }
  }, [groupId]);

  const fetchPolls = useCallback(async () => {
    try {
      const response = await groupService.getGroupPolls(groupId, 'active');
      if (response.success && response.data) {
        setPolls(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    }
  }, [groupId]);

  useEffect(() => {
    fetchPolls();
    fetchGroup();
    if (groupId) {
      fetchMessages();
      if (isConnected) joinGroup(groupId);
      return () => {
        if (isConnected) leaveGroup(groupId);
      };
    }
  }, [groupId, isConnected, fetchMessages, fetchPolls, fetchGroup, joinGroup, leaveGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Close poll menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pollMenuRef.current && !pollMenuRef.current.contains(event.target as Node)) {
        setShowPollTypeMenu(false);
      }
    };
    if (showPollTypeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPollTypeMenu]);

  // Refs to access latest values in socket handlers without re-registering listeners
  const sessionKeyRef = useRef(sessionKey);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    sessionKeyRef.current = sessionKey;
  }, [sessionKey]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewGroupMessage = async (message: GroupMessage) => {
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const userId = currentUser?.user_id || currentUser?.userId;

      const processedMessage = { ...message };

      // Use ref to get latest sessionKey
      const currentSessionKey = sessionKeyRef.current;
      if (currentSessionKey && message.encrypted_content) {
        try {
          const decrypted = await decryptMessageAES(
            message.encrypted_content,
            message.content_iv || '',
            message.content_auth_tag || '',
            currentSessionKey
          );
          processedMessage.encrypted_content = decrypted;
        } catch (err) {
          console.warn('[E2EE] Failed to decrypt real-time message:', err);
        }
      }

      setMessages((prev) => [...prev, {
        ...processedMessage,
        is_my_message: message.sender_id === userId || (message.sender?.user_id === userId),
      }]);
    };

    const handleNewPoll = (poll: Poll) => {
      setPolls((prev) => [poll, ...prev]);
    };

    const handlePollUpdated = (poll: Poll) => {
      setPolls((prev) => prev.map((existing) => {
        if (existing.poll_id !== poll.poll_id) return existing;
        return { ...existing, ...poll };
      }));
    };

    const handlePollCancelled = (data: { poll_id: string }) => {
      setPolls(prev => prev.filter(p => p.poll_id !== data.poll_id));
    };

    const handleTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      // Use ref to get latest currentUserId
      if (userId === currentUserIdRef.current) return;
      setTypingUsers(prev => {
        if (isTyping) {
          if (!prev.includes(userId)) return [...prev, userId];
          return prev;
        } else {
          return prev.filter(id => id !== userId);
        }
      });
    };

    socket.on('new-group-message', handleNewGroupMessage);
    socket.on('new-poll', handleNewPoll);
    socket.on('poll-updated', handlePollUpdated);
    socket.on('poll-cancelled', handlePollCancelled);
    socket.on('user-typing', handleTyping);

    return () => {
      socket.off('new-group-message', handleNewGroupMessage);
      socket.off('new-poll', handleNewPoll);
      socket.off('poll-updated', handlePollUpdated);
      socket.off('poll-cancelled', handlePollCancelled);
      socket.off('user-typing', handleTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || sending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(groupId, 'group', false);

    try {
      setSending(true);

      let mediaUrl = '';
      let mediaSize = 0;
      let mediaMimeType = '';

      if (selectedImage) {
        setUploadingImage(true);
        try {
          const uploadResult = await groupService.uploadImage(groupId, selectedImage);
          mediaUrl = uploadResult.data.url;
          mediaSize = uploadResult.data.size;
          mediaMimeType = uploadResult.data.mimeType;
        } catch (uploadError) {
          toast.error('Failed to upload image');
          console.error('Image upload failed:', uploadError);
          setUploadingImage(false);
          setSending(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      let encryptedContent = newMessage.trim() || (selectedImage ? 'Image' : '');
      let contentIv = '';
      let contentAuthTag = '';

      if (sessionKey && encryptedContent) {
        try {
          const encrypted = await encryptMessageAES(encryptedContent, sessionKey);
          encryptedContent = encrypted.ciphertext;
          contentIv = encrypted.iv;
          contentAuthTag = encrypted.authTag;
        } catch (err) {
          console.error('[E2EE] Encryption failed:', err);
          toast.error('Failed to encrypt message');
          setSending(false);
          return;
        }
      }

      await groupService.sendGroupMessage(groupId, {
        encryptedContent,
        contentIv,
        contentAuthTag,
        messageType: selectedImage ? 'image' : 'text',
        keyId: keyId || undefined,
        ...(mediaUrl && { mediaUrl, mediaSize, mediaMimeType }),
        ...(replyingTo && { parentMessageId: replyingTo.message_id }),
      });

      setNewMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      setReplyingTo(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('Failed to send message');
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEmojiSelect = (emojiData: EmojiData) => {
    const emoji = emojiData.emoji;
    const input = messageInputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentMessage = newMessage;
      const newText = currentMessage.substring(0, start) + emoji + currentMessage.substring(end);
      setNewMessage(newText);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (isConnected) {
      sendTyping(groupId, 'group', true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(groupId, 'group', false);
      }, 2000);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) return 'Today';
    if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // const handleReply = useCallback((message: Message) => {
  //   setReplyingTo(message as Message);
  //   messageInputRef.current?.focus();
  // }, []);

  // const handleEdit = useCallback(async (messageId: string, newContent: string) => {
  //   try {
  //     if (!localStorage.getItem('user')) {
  //       toast.error('Authentication required');
  //       return;
  //     }
  //     let encryptedContent = newContent;
  //     let contentIv = '';
  //     let contentAuthTag = '';

  //     if (sessionKey) {
  //       try {
  //         const encrypted = await encryptMessageAES(newContent, sessionKey);
  //         encryptedContent = encrypted.ciphertext;
  //         contentIv = encrypted.iv;
  //         contentAuthTag = encrypted.authTag;
  //       } catch (err) {
  //         console.error('[E2EE] Edit encryption failed:', err);
  //         toast.error('Failed to encrypt edit');
  //         return;
  //       }
  //     }

  //     await messageManagementService.editMessage(messageId, encryptedContent, contentIv, contentAuthTag, '');
  //     toast.success('Message edited');
  //     fetchMessages();
  //   } catch (error) {
  //     console.error('Failed to edit message:', error);
  //     toast.error('Failed to edit message');
  //   }
  // }, [fetchMessages, toast, sessionKey]);

  // const handleDelete = useCallback(async (messageId: string, deleteForEveryone: boolean) => {
  //   try {
  //     if (!localStorage.getItem('user')) {
  //       toast.error('Authentication required');
  //       return;
  //     }
  //     await messageManagementService.deleteMessage(messageId, deleteForEveryone, '');
  //     toast.success(deleteForEveryone ? 'Message deleted for everyone' : 'Message deleted for you');
  //     fetchMessages();
  //   } catch (error) {
  //     console.error('Failed to delete message:', error);
  //     toast.error('Failed to delete message');
  //   }
  // }, [fetchMessages, toast]);

  const handleVote = async (pollId: string, voteValue: boolean) => {
    try {
      const response = await groupService.voteOnPoll(groupId, pollId, voteValue);
      const updatedPoll = response?.data?.poll as Poll | undefined;
      if (updatedPoll) {
        setPolls((prev) => prev.map((poll) => {
          if (poll.poll_id !== pollId) return poll;
          return { ...poll, ...updatedPoll, has_voted: true, user_vote: voteValue };
        }));
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleCancelPoll = async (pollId: string) => {
    if (!window.confirm('Are you sure you want to cancel this poll?')) return;
    try {
      await groupService.cancelPoll(groupId, pollId);
      toast.success('Poll cancelled');
      fetchPolls();
    } catch (err) {
      toast.error('Failed to cancel poll');
      console.error('Failed to cancel poll:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e2fffe] font-sans text-[#002020]">
        {/* Background blur overlay */}
        <div className="fixed inset-0 bg-[#002020]/20 backdrop-blur-md z-40 flex items-center justify-center p-4">
          {/* Chat Modal Container */}
          <div className="w-full h-full md:w-[90%] md:h-[85%] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] relative overflow-hidden flex flex-col border border-white/50">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-50 p-2 hover:bg-red-100/50 rounded-full transition-colors group">
              <span className="material-symbols-outlined text-[#6f787d] group-hover:text-red-600">close</span>
            </div>

            {/* Header Skeleton */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/50 bg-white/60 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#87ceeb]/30 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-[#87ceeb]/30 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-[#87ceeb]/20 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#87ceeb]/20 animate-pulse" />
                <div className="w-9 h-9 rounded-full bg-[#87ceeb]/20 animate-pulse" />
              </div>
            </header>

            {/* Messages Skeleton */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { isMyMessage: false, width: 'w-2/3' },
                { isMyMessage: true, width: 'w-1/2' },
                { isMyMessage: false, width: 'w-3/4' },
                { isMyMessage: true, width: 'w-2/5' },
                { isMyMessage: false, width: 'w-1/2' },
                { isMyMessage: true, width: 'w-3/5' },
              ].map((item, i) => (
                <div key={i} className={`flex ${item.isMyMessage ? 'justify-end' : 'justify-start'} animate-pulse`}>
                  {!item.isMyMessage && <div className="w-8 h-8 rounded-full bg-[#87ceeb]/20 mr-2 self-end" />}
                  <div className={`${item.width} h-14 bg-[#87ceeb]/20 rounded-2xl ${item.isMyMessage ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
                </div>
              ))}
            </div>

            {/* Input Skeleton */}
            <div className="px-4 py-3 bg-white/60 backdrop-blur-sm border-t border-white/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 animate-pulse" />
                <div className="flex-1 h-11 bg-[#87ceeb]/20 rounded-full animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 animate-pulse" />
                <div className="w-11 h-11 rounded-full bg-[#87ceeb]/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e2fffe] font-sans text-[#002020]">
      {/* Background blur overlay */}
      <div className="fixed inset-0 bg-[#002020]/20 backdrop-blur-md z-40 flex items-center justify-center p-4">
        {/* Chat Modal Container */}
        <div className="w-full h-full md:w-[90%] md:h-[85%] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] relative overflow-hidden flex flex-col border border-white/50">
          {/* Close Button */}
          <Link 
            href="/my-groups" 
            className="absolute top-4 right-4 z-50 p-2 hover:bg-red-100/50 rounded-full transition-colors group"
          >
            <span className="material-symbols-outlined text-[#6f787d] group-hover:text-red-600">close</span>
          </Link>

          {/* Header */}
          <header className="h-16 px-6 flex items-center justify-between border-b border-white/50 bg-white/60 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#5c5d6e]">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <h2 className="font-bold text-[#002020] leading-tight">{group?.group_name || 'Group Chat'}</h2>
                <p className="text-xs text-[#0c6780] flex items-center gap-1">
                  {onlineCount > 0 && (
                    <>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-600">{onlineCount} online</span>
                      <span className="text-[#6f787d]">·</span>
                    </>
                  )}
                  <span className="text-[#6f787d]">{totalMembers || 0} members</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {searchQuery && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="h-8 text-xs w-40 bg-white/80 border-none rounded-full px-3 focus:ring-2 focus:ring-[#87ceeb] outline-none"
                  />
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded hover:bg-white/50 transition-colors text-[#6f787d]"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setSearchQuery(searchQuery ? '' : ' ')}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[#6f787d]">{searchQuery ? 'close' : 'search'}</span>
              </button>
              <Link href={`/groups/${groupId}`} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[#6f787d]">info</span>
              </Link>
            </div>
          </header>

          {/* Active Polls */}
          {polls.length > 0 && (
            <div className="px-4 py-2 bg-white/30 border-b border-white/30 flex gap-2 overflow-x-auto shrink-0">
              {polls.map((poll) => (
                <div key={poll.poll_id} className="bg-white/60 rounded-xl p-3 shadow-sm border border-white/30 min-w-50 max-w-75">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm">📊 {poll.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      poll.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>{poll.status}</span>
                  </div>
                  {poll.status === 'active' ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVote(poll.poll_id, true)}
                        disabled={poll.has_voted}
                        className="flex-1 py-1 px-2 rounded-lg text-xs font-semibold bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50"
                      >
                        ✓ For
                      </button>
                      <button 
                        onClick={() => handleVote(poll.poll_id, false)}
                        disabled={poll.has_voted}
                        className="flex-1 py-1 px-2 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                      >
                        ✗ Against
                      </button>
                      {(group?.user_is_admin || group?.user_is_owner) && (
                        <button
                          onClick={() => handleCancelPoll(poll.poll_id)}
                          className="p-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-[#6f787d]">
                      For: {poll.votes_for} · Against: {poll.votes_against}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {searchQuery.trim() && (
              <div className="text-xs text-[#6f787d] px-2">
                {displayedMessages.length} result(s) for &quot;{searchQuery.trim()}&quot;
              </div>
            )}
            {displayedMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 flex items-center justify-center mb-3 mx-auto">
                    <span className="material-symbols-outlined text-3xl text-[#0c6780]">chat</span>
                  </div>
                  <p className="font-semibold text-[#002020] mb-1">
                    {searchQuery.trim() ? 'No matching messages' : 'No messages yet'}
                  </p>
                  <p className="text-sm text-[#6f787d]">
                    {searchQuery.trim() ? 'Try a different search' : 'Start the conversation!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(() => {
                  let lastDate = "";
                  return displayedMessages.map((msg) => {
                    const isMyMessage = !!msg.is_my_message;
                    const messageDate = new Date(msg.created_at).toDateString();
                    const showDateHeader = messageDate !== lastDate;
                    lastDate = messageDate;

                    return (
                      <div key={msg.message_id} className="flex flex-col gap-2">
                        {showDateHeader && (
                          <div className="flex justify-center my-2">
                            <span className="px-4 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/60 text-[#6f787d] shadow-sm">
                              {formatDateHeader(String(msg.created_at))}
                            </span>
                          </div>
                        )}
                        
                        {isMyMessage ? (
                          <div className="flex flex-row-reverse gap-3 max-w-[85%] ml-auto">
                            <div className="flex flex-col items-end">
                              <div className="bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] p-3 rounded-2xl rounded-br-md shadow-sm">
                                {replyingTo && replyingTo.message_id === msg.parent_message?.message_id && (
                                  <div className="bg-white/30 rounded-lg p-2 mb-2 text-xs">
                                    <p className="font-semibold opacity-70">Replying to {replyingTo.sender?.name}</p>
                                    <p className="truncate opacity-60">{replyingTo.encrypted_content}</p>
                                  </div>
                                )}
                                <p className="text-sm">{msg.encrypted_content}</p>
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-[#6f787d] mt-1 block mr-1">
                                {formatTime(String(msg.created_at))}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3 max-w-[85%]">
                            {msg.sender?.dp_url ? (
                              <Image 
                                src={msg.sender.dp_url} 
                                alt={msg.sender.name || 'Unknown'} 
                                width={32} 
                                height={32} 
                                className="w-8 h-8 rounded-full object-cover mt-auto" 
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-linear-to-br from-[#6a7fa8] to-[#1f5b74] mt-auto shrink-0">
                                {(msg.sender?.name || '?').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="bg-[#e1e1f5] text-[#5c5d6e] p-3 rounded-2xl rounded-bl-md">
                                <p className="text-xs font-semibold mb-1 text-[#0c6780]">{msg.sender?.name}</p>
                                {msg.parent_message && (
                                  <div className="bg-white/50 rounded-lg p-2 mb-2 text-xs">
                                    <p className="truncate opacity-70">{msg.parent_message.encrypted_content}</p>
                                  </div>
                                )}
                                <p className="text-sm">{msg.encrypted_content}</p>
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-[#6f787d] mt-1 block ml-1">
                                {formatTime(String(msg.created_at))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
            {typingUsers.length > 0 && (
              <div className="flex animate-fade-in my-2">
                <div className="bg-white/60 rounded-2xl px-4 py-2 flex gap-2 items-center w-fit">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#87ceeb] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#87ceeb] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-1.5 bg-[#87ceeb] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-[#6f787d]">
                    {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply/Image Preview */}
          {(replyingTo || imagePreview) && (
            <div className="px-4 py-2 bg-white/30 border-t border-white/30">
              {replyingTo && (
                <div className="flex items-start gap-3 p-2 rounded-xl bg-[#87ceeb]/20 border-l-4 border-[#87ceeb] mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-[#0c6780]">
                      Replying to {replyingTo.sender?.name || 'Unknown'}
                    </p>
                    <p className="text-sm truncate text-[#002020]">{replyingTo.encrypted_content}</p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
              {imagePreview && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#002020]">Attachment</p>
                    <p className="text-[10px] text-[#6f787d]">Ready to upload</p>
                  </div>
                  <button 
                    onClick={handleRemoveImage} 
                    className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-24 left-4 z-50">
              <div className="shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                <EmojiPicker 
                  onEmojiClick={handleEmojiSelect} 
                  autoFocusSearch={false}
                  theme={Theme.LIGHT}
                />
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="px-4 py-3 bg-white/60 backdrop-blur-md border-t border-white/30 shrink-0">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            
            {/* Poll Menu */}
            {showPollTypeMenu && (
              <div ref={pollMenuRef} className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-xl rounded-2xl p-3 w-52 shadow-xl border border-white/30 z-50">
                <p className="text-[10px] font-bold px-2 py-1 text-[#6f787d] uppercase tracking-widest">Create Poll</p>
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
                    className="w-full text-left px-3 py-2 rounded-xl transition-all hover:bg-[#87ceeb]/20 flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-bold text-[#002020]">{opt.label}</span>
                    <span className="text-[9px] text-[#6f787d]">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Create Poll Modal */}
            {showCreatePoll && (
              <div className="absolute bottom-20 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-white/30 z-50 max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[#002020]">Create {selectedPollType?.replace('_', ' ')} Poll</h3>
                  <button 
                    onClick={() => setShowCreatePoll(false)}
                    className="p-1 rounded-full hover:bg-red-100 text-red-400"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <p className="text-xs text-[#6f787d] mb-2">Poll creation coming soon...</p>
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="w-full py-2 rounded-xl bg-linear-to-r from-[#87ceeb] to-[#ffb6c1] text-white font-semibold"
                >
                  Close
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={sending || uploadingImage}
                  className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center text-[#6f787d] hover:bg-[#87ceeb]/20 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  disabled={sending || uploadingImage}
                  className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center text-[#6f787d] hover:bg-[#87ceeb]/20 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">sentiment_satisfied</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPollTypeMenu(!showPollTypeMenu)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    showPollTypeMenu ? 'bg-[#87ceeb]/30 text-[#0c6780]' : 'bg-white/50 text-[#6f787d] hover:bg-[#87ceeb]/20'
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
                placeholder="Type a message..." 
                className="flex-1 bg-white/80 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#87ceeb] outline-none"
                disabled={sending || uploadingImage}
              />

              <button 
                type="submit" 
                disabled={sending || uploadingImage || (!newMessage.trim() && !selectedImage)}
                className="w-10 h-10 rounded-xl bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] flex items-center justify-center text-[#002020] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Bottom Dock Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-2xl rounded-full px-6 py-3 shadow-[0_20px_40px_rgba(0,32,32,0.06)] flex gap-2 items-center">
        <Link href="/dashboard" className="text-slate-500 px-4 py-2 flex items-center gap-2 hover:bg-cyan-50 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link href="/chat" className="text-slate-500 px-4 py-2 flex items-center gap-2 hover:bg-cyan-50 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined">chat_bubble</span>
        </Link>
        <Link href="/my-groups" className="bg-cyan-100 text-cyan-900 rounded-full px-4 py-2 flex items-center gap-2 hover:-translate-y-1 transition-transform">
          <span className="material-symbols-outlined">group</span>
          <span className="font-semibold text-sm">Groups</span>
        </Link>
        <Link href="/my-identities" className="text-slate-500 px-4 py-2 flex items-center gap-2 hover:bg-cyan-50 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined">badge</span>
        </Link>
        <Link href="/profile/edit" className="text-slate-500 px-4 py-2 flex items-center gap-2 hover:bg-cyan-50 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined">person</span>
        </Link>
      </nav>
    </div>
  );
}
