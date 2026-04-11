'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chat.service';
import anonymousChatService from '@/services/anonymous-chat.service';
import { messageManagementService } from '@/services/message-management.service';
import type { Conversation, ChatRequest } from '@/types/chat.types';
import Image from 'next/image';
import { usePresence } from '@/hooks/usePresence';
import { useSocket } from '@/contexts/SocketContext';
import { encryptMessageAES, decryptMessageAES, generateAESKey, encryptKeyWithPublicKey,
  decryptKeyWithPrivateKey, importPrivateKey, exportKeyToBase64, importKeyFromBase64 } from '@/utils/e2ee.utils';

type RealtimeNotificationPayload = {
  notification?: {
    type?: string;
    conversationId?: string;
    conversation_id?: string;
    chatId?: string;
    chat_id?: string;
    timestamp?: number;
  };
};

type ReportType =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "impersonating"
  | "fake_profile"
  | "other";

interface User{
  user_id: string;
  roll_no: string;
}

interface Participant {
  user_id: string;
  public_key: string;
}

interface MessageSender {
  user_id: string;
  name: string;
  is_anonymous: boolean;
  display_gender?: string;
  avatar_url?: string;
}

interface MessageReaction {
  emoji: string;
  count: number;
  users?: Array<{ user_id: string; name: string }>;
}

interface Message {
  message_id: string;
  conversation_id?: string;
  group_id?: string;
  sender_id: string;
  sender_name: string;
  sender_gender: string;
  sender_dp?: string;
  message_type: 'text' | 'image';
  encrypted_content: string;
  content_iv: string;
  content_auth_tag: string;
  user_session_key?: string;
  key_id?: string;
  media_url?: string;
  media_size?: number;
  media_mime_type?: string;
  parent_message_id?: string;
  parent_message?: {
    message_id: string;
    encrypted_content: string;
    content_iv: string;
    content_auth_tag: string;
    sender_name?: string;
    sender?: { name: string };
  };
  reactions?: MessageReaction[];
  is_anonymous: boolean;
  is_my_message: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  my_status?: 'sent' | 'delivered' | 'read';
  delivered_at?: Date;
  sender?: MessageSender;
  read_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const formatDateHeader = (dateString: string | Date) => {
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

const formatTimeCompact = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

interface MessageItemProps {
  msg: Message;
  onReply?: (msg: Message) => void;
  onEdit?: (msgId: string, content: string) => void;
  onDelete?: (msgId: string, forEveryone: boolean) => void;
  onReact?: (msgId: string, emoji: string) => void;
  formatTime: (date: string | Date) => string;
}

function MessageItem({ msg, onReply, onEdit, onDelete, onReact, formatTime }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.encrypted_content || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isMyMessage = msg.is_my_message;
  const [messageAge, setMessageAge] = useState(() => Date.now() - new Date(msg.created_at).getTime());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageAge(Date.now() - new Date(msg.created_at).getTime());
    }, 1000); // update every second, or adjust as needed

    return () => clearInterval(interval);
  }, [msg.created_at]);

  const canDeleteForEveryone = isMyMessage && messageAge <= 48 * 60 * 60 * 1000;
  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== msg.encrypted_content) {
      onEdit?.(msg.message_id, editContent);
    }
    setIsEditing(false);
  };

  const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥'];

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <>
      <div
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} group relative mb-1`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => { setShowActions(false); }}
      >
        {/* Action Bar - appears on hover */}
        <div
          className={`flex items-center gap-0.5 self-center shrink-0 transition-all duration-150
            ${showActions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            ${isMyMessage ? 'order-first mr-1.5' : 'order-last ml-1.5'}`}
        >
          {/* React */}
          <div className="relative group">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[14px] text-[#6f787d]">sentiment_satisfied</span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none">
              React
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          {/* Reply */}
          <div className="relative group">
            <button
              onClick={() => onReply?.(msg)}
              className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[14px] text-[#6f787d]">reply</span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none">
              Reply
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          {/* Edit - own messages only */}
          {isMyMessage && (
            <div className="relative group">
              <button
                onClick={() => setIsEditing(true)}
                className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[14px] text-[#6f787d]">edit</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none">
                Edit
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}

          {/* Delete - own messages only */}
          {isMyMessage && (
            <div className="relative group">
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[14px] text-red-500">delete</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none">
                Delete
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className={`absolute z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 animate-scale-in ${isMyMessage ? 'right-0' : 'left-0'}`}
            style={{ bottom: '100%', marginBottom: '8px' }}
            onMouseEnter={(e) => e.stopPropagation()}
          >
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  onReact?.(msg.message_id, emoji);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Message Bubble */}
        <div className="relative flex flex-col max-w-[75%] md:max-w-[60%]">
          <div className={`${isMyMessage
            ? 'bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] rounded-2xl rounded-br-md'
            : 'bg-[#e1e1f5] dark:bg-[#004a4a] text-[#5c5d6e] dark:text-[#e7fffe] rounded-2xl rounded-bl-md'} p-3 shadow-sm`}>

            {/* Sender name for received messages */}
            {!isMyMessage && msg.sender_name && (
              <p className="text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]">{msg.sender_name}</p>
            )}

            {/* Reply Quote - WhatsApp style */}
            {msg.parent_message_id && msg.parent_message && (
              <div className={`mb-2 px-3 py-2 rounded-lg text-xs cursor-pointer ${isMyMessage ? 'bg-white/20 border-l-[3px] border-white/60' : 'bg-black/5 border-l-[3px] border-[#0c6780]'}`}>
                <p className={`font-bold mb-0.5 ${isMyMessage ? 'text-white/90' : 'text-[#0c6780]'}`}>
                  {msg.parent_message.sender_name || msg.parent_message.sender?.name || 'Unknown'}
                </p>
                <p className={`line-clamp-2 ${isMyMessage ? 'text-white/75' : 'text-[#5c5d6e]'}`}>
                  {msg.parent_message.encrypted_content || '📷 Image'}
                </p>
              </div>
            )}

            {/* Edit Mode */}
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSubmit();
                    if (e.key === 'Escape') { setIsEditing(false); setEditContent(msg.encrypted_content || ''); }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white/80 text-sm outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleEditSubmit} className="flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#87ceeb] text-white">Save</button>
                  <button onClick={() => { setIsEditing(false); setEditContent(msg.encrypted_content || ''); }} className="flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-white/60 text-[#6f787d]">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {/* Image Display */}
                {msg.message_type === 'image' && msg.media_url && (
                  <div className="mb-2 -mx-1">
                    <a href={msg.media_url} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={msg.media_url}
                        alt="Shared image"
                        width={300}
                        height={200}
                        className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ objectFit: 'contain', height: 'auto', maxHeight: '300px' }}
                        loading="lazy"
                        unoptimized
                      />
                    </a>
                  </div>
                )}
                {/* Text Content (if any, or if not an image message) */}
                {msg.encrypted_content && msg.encrypted_content !== 'Image' && (
                  <p className="text-sm whitespace-pre-wrap">{msg.encrypted_content}</p>
                )}
                {/* Timestamp + Edited badge inside bubble */}
                <div className={`flex items-center gap-1.5 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-[10px] ${isMyMessage ? 'text-[#005870]/70' : 'text-[#6f787d]'}`}>
                    {formatTime(msg.created_at)}
                  </span>
                  {msg.is_edited && (
                    <span className={`text-[9px] ${isMyMessage ? 'text-[#005870]/50' : 'text-[#6f787d]/60'}`}>(edited)</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Reactions display - below the bubble */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              {msg.reactions.map(reaction => {
                const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                const currentUserId = userStr ? JSON.parse(userStr).user_id : null;
                const iReacted = reaction.users?.some(u => u.user_id === currentUserId);
                const hasUsers = reaction.users && reaction.users.length > 0;
                const reactedNames = hasUsers
                  ? reaction.users?.map(u => u.name || 'Unknown').join(', ')
                  : `${reaction.count} reaction${reaction.count !== 1 ? 's' : ''}`;
                return (
                  <div key={reaction.emoji} className="relative group">
                    <button
                      onClick={() => onReact?.(msg.message_id, reaction.emoji)}
                      className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
                      style={{
                        background: iReacted ? 'rgba(135, 206, 235, 0.3)' : 'rgba(255,255,255,0.6)',
                        border: `1px solid ${iReacted ? 'rgba(135, 206, 235, 0.6)' : 'rgba(0,0,0,0.1)'}`,
                      }}
                    >
                      <span>{reaction.emoji}</span>
                      <span className="font-semibold text-[#6f787d]">{reaction.count}</span>
                    </button>
                    {/* Custom tooltip showing who reacted */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none shadow-lg min-w-max">
                      {reactedNames}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2 text-[#002020]">Delete Message</h3>
            <p className="text-sm mb-4 text-[#6f787d]">How would you like to delete this message?</p>
            <div className="space-y-2">
              <button
                onClick={() => { onDelete?.(msg.message_id, false); setShowDeleteDialog(false); }}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-left hover:bg-gray-200 transition-colors"
              >
                <p className="font-semibold text-sm text-[#002020]">Delete for me</p>
                <p className="text-xs text-[#6f787d] mt-0.5">Only you won&apos;t see this message</p>
              </button>
              {canDeleteForEveryone && (
                <button
                  onClick={() => { onDelete?.(msg.message_id, true); setShowDeleteDialog(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-red-50 text-left hover:bg-red-100 transition-colors"
                >
                  <p className="font-semibold text-sm text-red-600">Delete for everyone</p>
                  <p className="text-xs text-[#6f787d] mt-0.5">Removes for all participants (within 48 hrs)</p>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-[#6f787d] hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'requests'>('conversations');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageSearchResults, setMessageSearchResults] = useState<Message[]>([]);
  const [, setMessageSearching] = useState(false);
  const messageSearchInputRef = useRef<HTMLInputElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("spam");
  const [decryptedPreviews, setDecryptedPreviews] = useState<Record<string, string>>({});
  const [reportDescription, setReportDescription] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isBlocked, ] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPickerInput, setShowEmojiPickerInput] = useState(false);
  const emojiPickerInputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥', '👏', '😊'];
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('chat-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [isE2EEReady, setIsE2EEReady] = useState(false);
  const [userPrivateKey, setUserPrivateKey] = useState<CryptoKey | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getSocket, isConnected } = useSocket();
  const conversationsRef = useRef<Conversation[]>([]);
  const pendingRealtimeUpdatesRef = useRef<Map<string, { incrementBy: number; timestamp?: number }>>(new Map());
  const flushTimerRef = useRef<number | null>(null);
  const flushDelayRef = useRef<number>(80);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv =>
      conv.other_user_name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const otherUserIds = useMemo(
    () => conversations
      .filter(c => !c.is_anonymous && c.other_user_id)
      .map(c => c.other_user_id as string),
    [conversations]
  );
  const onlineUsers = usePresence(otherUserIds);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    if (!showEmojiPickerInput) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerInputRef.current && !emojiPickerInputRef.current.contains(e.target as Node)) {
        setShowEmojiPickerInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPickerInput]);

  useEffect(() => {
    if (showMessageSearch) {
      setTimeout(() => messageSearchInputRef.current?.focus(), 50);
    }
  }, [showMessageSearch]);

  useEffect(() => {
    const q = messageSearchQuery.trim();
    if (!q) {
      setMessageSearchResults([]);
      setMessageSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setMessageSearching(true);
      try {
        const lowered = q.toLowerCase();
        const filtered = messages.filter(m => {
          const body = (m.encrypted_content || '').toLowerCase();
          const senderName = (m.sender?.name || m.sender_name || '').toLowerCase();
          return body.includes(lowered) || senderName.includes(lowered);
        });
        setMessageSearchResults(filtered);
      } catch (err) {
        console.error('[SEARCH] message search failed', err);
      } finally {
        setMessageSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [messageSearchQuery, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const navigateToProfileByUserId = async (userId?: string | null) => {
    if (!userId) return;
    try {
      const { API_BASE_URL } = await import('../../services/apiBase');
      const res = await fetch(`${API_BASE_URL}/api/profile/all`, { credentials: 'include' });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      console.log('Fetched all profiles for navigation:', data);
      if (data.success && Array.isArray(data.data.users)) {
        const found = data.data.users.find((u: User) => u.user_id === userId);
        if (found && found.roll_no) {
          router.push(`/profile/${found.roll_no}`);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to navigate to profile by user id', err);
    }
  };

  const fetchAndDecryptConversationKey = useCallback(async (msgs: Message[], conversationId: string) => {
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

      // If no key found, try to initialize a new one
      const info = await chatService.getParticipantPublicKeys(conversationId);
      const participants = info.participants;

      const newAesKey = await generateAESKey();
      const aesKeyB64 = await exportKeyToBase64(newAesKey);

      const encryptedKeys = await Promise.all(participants.map(async (p: Participant) => {
        const encrypted = await encryptKeyWithPublicKey(aesKeyB64, p.public_key);
        return { userId: p.user_id, encryptedKey: encrypted, keyVersion: 1 };
      }));

      const { keyId: newKeyId } = await chatService.storeSessionKeys({
        conversationId,
        keys: encryptedKeys
      });

      setSessionKey(newAesKey);
      setKeyId(newKeyId);
      setIsE2EEReady(true);
      return newAesKey;
    } catch (error) {
      console.error('[E2EE] Session initialization failed:', error);
    }
  }, [userPrivateKey]);

  const decryptMessages = useCallback(async (msgs: Message[], aesKey: CryptoKey) => {
    return await Promise.all(msgs.map(async (m) => {
      const decryptedMsg = { ...m };

      // Decrypt main message content
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

      // Decrypt parent_message content if present
      if (m.parent_message && m.parent_message.encrypted_content &&
          m.parent_message.content_iv && m.parent_message.content_auth_tag) {
        try {
          const decryptedParent = await decryptMessageAES(
            m.parent_message.encrypted_content,
            m.parent_message.content_iv,
            m.parent_message.content_auth_tag,
            aesKey
          );
          decryptedMsg.parent_message = {
            ...m.parent_message,
            encrypted_content: decryptedParent
          };
        } catch (err) {
          console.warn(`[E2EE] Failed to decrypt parent message ${m.parent_message.message_id}:`, err);
          decryptedMsg.parent_message = {
            ...m.parent_message,
            encrypted_content: '[Encrypted Message]'
          };
        }
      }

      return decryptedMsg;
    }));
  }, []);

  const loadMessages = useCallback(async (conversation: Conversation) => {
    if (!conversation) return;
    
    setLoadingMessages(true);
    try {
      let response;
      let conversationType: 'regular' | 'anonymous' = 'regular';

      try {
        const info = await chatService.getParticipantPublicKeys(conversation.conversation_id);
        conversationType = info.isAnonymous ? 'anonymous' : 'regular';

        if (conversationType === 'anonymous') {
          response = await anonymousChatService.getAnonymousMessages(conversation.conversation_id);
        } else {
          response = await chatService.getMessages(conversation.conversation_id);
        }
      } catch (fetchError) {
        console.error('[ERROR] Initial fetch failed:', fetchError);
        throw fetchError;
      }

      let fetchedMessages = Array.isArray(response) ? response : (response.messages || response.data || []);
      setIsAnonymous(conversationType === 'anonymous');

      // Initialize E2EE and decrypt messages
      const aesKey = await fetchAndDecryptConversationKey(fetchedMessages, conversation.conversation_id);
      if (aesKey) {
        fetchedMessages = await decryptMessages(fetchedMessages, aesKey);
      }

      // Update decrypted preview for conversation list (use most recent message)
      if (fetchedMessages.length > 0) {
        const lastMsg = fetchedMessages[fetchedMessages.length - 1];
        const previewText = lastMsg.message_type === 'image'
          ? '📷 Image'
          : (lastMsg.encrypted_content || '');
        setDecryptedPreviews(prev => ({
          ...prev,
          [conversation.conversation_id]: previewText
        }));
      }

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [fetchAndDecryptConversationKey, decryptMessages]);

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversations(prev => prev.map(conv =>
      conv.conversation_id === conversation.conversation_id
        ? { ...conv, unread_count: 0 }
        : conv
    ));
    loadMessages(conversation);
  }, [loadMessages]);

  const fetchConversations = useCallback(async () => {
    try {
      const [regularData, anonymousData] = await Promise.all([
        chatService.getConversations(),
        anonymousChatService.getAnonymousConversations()
      ]);

      const combined = [...regularData, ...anonymousData].sort((a, b) => {
        const dateA = new Date(a.last_message_at || a.created_at).getTime();
        const dateB = new Date(b.last_message_at || b.created_at).getTime();
        return dateB - dateA;
      });

      setConversations(combined);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    const content = messageInput.trim();
    // Allow sending if there's either text content OR a selected image
    if ((!content && !selectedImage) || !selectedConversation || sending || isBlocked) return;

    try {
      setSending(true);

      let mediaUrl = '';
      let mediaSize = 0;
      let mediaMimeType = '';

      // Upload image if selected
      if (selectedImage) {
        try {
          const uploadResult = isAnonymous
            ? await anonymousChatService.uploadAnonymousImage(selectedImage)
            : await chatService.uploadImage(selectedImage);

          mediaUrl = uploadResult.data.url;
          mediaSize = uploadResult.data.size;
          mediaMimeType = uploadResult.data.mimeType;
        } catch (uploadError: unknown) {
          let errorMsg = 'Failed to upload image';
          if (
            typeof uploadError === 'object' &&
            uploadError !== null &&
            'response' in uploadError &&
            typeof (uploadError as { response?: { data?: { message?: string } } }).response === 'object'
          ) {
            errorMsg = (uploadError as { response: { data?: { message?: string } } }).response.data?.message || errorMsg;
          }
          console.error('[ERROR] Failed to upload image:', uploadError);
          alert(errorMsg);
          setSending(false);
          return;
        }
      }

      // Use 'Image' as placeholder content if no text is provided but an image is being sent
      let finalContent = content || 'Image';
      let contentIv = 'dummy_iv';
      let contentAuthTag = 'dummy_tag';

      // E2EE: Encrypt message content
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

      const messageData = {
        conversationId: selectedConversation.conversation_id,
        encryptedContent: finalContent,
        contentIv,
        contentAuthTag,
        messageType: selectedImage ? 'image' : 'text',
        ...(mediaUrl && {
          mediaUrl,
          mediaSize,
          mediaMimeType,
        }),
        keyId: keyId || undefined,
        ...(replyingTo && { parentMessageId: replyingTo.message_id })
      };

      if (isAnonymous) {
        await anonymousChatService.sendAnonymousMessage(messageData);
      } else {
        await chatService.sendMessage(messageData);
      }

      setMessageInput('');
      setSelectedImage(null);
      setReplyingTo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reload messages
      loadMessages(selectedConversation);
      // Refresh conversations list
      fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }, [messageInput, selectedImage, selectedConversation, sending, isBlocked, isE2EEReady, sessionKey, keyId, isAnonymous, loadMessages, fetchConversations, replyingTo]);

  const fetchChatRequests = useCallback(async () => {
    try {
      const data = await chatService.getChatRequests();
      setChatRequests(data);
    } catch (error) {
      console.error('Failed to fetch chat requests:', error);
    }
  }, []);

  const handleAcceptRequest = useCallback(async (requestId: string) => {
    try {
      await chatService.respondToChatRequest(requestId, 'accept');
      fetchChatRequests();
      fetchConversations();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  }, [fetchChatRequests, fetchConversations]);

  const handleRejectRequest = useCallback(async (requestId: string) => {
    try {
      await chatService.respondToChatRequest(requestId, 'reject');
      fetchChatRequests();
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  }, [fetchChatRequests]);

  const handleReply = useCallback((msg: Message) => {
    setReplyingTo(msg);
    // Focus the input after a small delay to ensure render
    setTimeout(() => messageInputRef.current?.focus(), 50);
  }, []);

  const handleReact = useCallback(async (messageId: string, emoji: string) => {
    try {
      await messageManagementService.addReaction(messageId, emoji, '');
      // Refresh messages to show updated reactions
      if (selectedConversation) {
        loadMessages(selectedConversation);
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }, [selectedConversation, loadMessages]);

  const handleEdit = useCallback(async (messageId: string, newContent: string) => {
    try {
      let finalContent = newContent;
      let contentIv = 'dummy_iv';
      let contentAuthTag = 'dummy_tag';

      // E2EE: Encrypt edited content
      if (isE2EEReady && sessionKey) {
        try {
          const { ciphertext, iv, authTag } = await encryptMessageAES(newContent, sessionKey);
          finalContent = ciphertext;
          contentIv = iv;
          contentAuthTag = authTag;
        } catch (err) {
          console.error('[E2EE] Edit encryption failed:', err);
          return;
        }
      }

      await messageManagementService.editMessage(messageId, finalContent, contentIv, contentAuthTag, '');
      // Refresh messages to show updated content
      if (selectedConversation) {
        loadMessages(selectedConversation);
      }
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  }, [isE2EEReady, sessionKey, selectedConversation, loadMessages]);

  const handleDelete = useCallback(async (messageId: string, deleteForEveryone: boolean) => {
    try {
      await chatService.deleteMessage(messageId, deleteForEveryone ? 'everyone' : 'me');
      // Remove from local state immediately for better UX
      setMessages(prev => prev.filter(m => m.message_id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, []);

  const handleBlockSelectedUser = useCallback(async () => {
    if (!selectedConversation || !selectedConversation.conversation_id) return;
    setShowBlockConfirm(false);
    setBlocking(true);
    try {
      await chatService.blockUser(selectedConversation.conversation_id);
      // refresh conversations to reflect blocked state
      void fetchConversations();
      alert('User blocked successfully');
    } catch (err) {
      console.error('Failed to block user', err);
      alert('Failed to block user');
    } finally {
      setBlocking(false);
    }
  }, [selectedConversation, fetchConversations]);

  const handleSubmitReport = useCallback(async () => {
    if (!selectedConversation || !selectedConversation.other_user_id) return;
    if (!reportDescription.trim()) {
      alert('Please provide a description for the report.');
      return;
    }
    setReporting(true);
    try {
      await chatService.reportUser({
        reportedUserId: selectedConversation.other_user_id,
        conversationId: selectedConversation.conversation_id,
        reportType: reportType,
        description: reportDescription,
        evidenceUrls: [],
      });
      setShowReportDialog(false);
      setReportDescription('');
      alert('Report submitted. Our team will review it.');
    } catch (err) {
      console.error('Failed to submit report', err);
      alert('Failed to submit report');
    } finally {
      setReporting(false);
    }
  }, [selectedConversation, reportDescription, reportType]);

  const handleMessageReaction = useCallback((data: { messageId: string }) => {
    // Refresh messages to show updated reactions
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
    console.log('[Socket] Message reaction received:', data);
  }, [selectedConversation, loadMessages]);

  useEffect(() => {
    fetchConversations();
    fetchChatRequests();
  }, [fetchConversations, fetchChatRequests]);

  useEffect(() => {
    if (!isConnected) return;
    const socket = getSocket();
    if (!socket) return;
    const pendingMap = pendingRealtimeUpdatesRef.current;

    const flushRealtimeConversationUpdates = () => {
      const updates = Array.from(pendingMap.entries());
      if (updates.length === 0) return;

      const next = [...conversationsRef.current];
      let changed = false;
      let missingConversation = false;

      for (const [conversationId, update] of updates) {
        const index = next.findIndex((c) => c.conversation_id === conversationId);
        if (index === -1) {
          missingConversation = true;
          continue;
        }

        changed = true;
        const target = next[index];
        const updatedConversation: Conversation = {
          ...target,
          unread_count: (target.unread_count || 0) + update.incrementBy,
          last_message_time: update.timestamp ? new Date(update.timestamp) : target.last_message_time,
        };

        next.splice(index, 1);
        next.unshift(updatedConversation);
      }

      pendingMap.clear();

      if (changed) {
        conversationsRef.current = next;
        setConversations(next);
      }

      if (missingConversation) {
        void fetchConversations();
      }
    };

    const scheduleRealtimeFlush = () => {
      const pendingCount = pendingMap.size;
      const targetDelay = pendingCount > 6 ? 150 : 80;

      if (flushTimerRef.current !== null) {
        if (targetDelay === flushDelayRef.current) return;
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }

      flushDelayRef.current = targetDelay;

      flushTimerRef.current = window.setTimeout(() => {
        flushTimerRef.current = null;
        flushRealtimeConversationUpdates();
      }, targetDelay);
    };

    const handleNewNotification = (payload: RealtimeNotificationPayload) => {
      const notification = payload.notification;
      if (!notification || notification.type !== 'new_message') return;

      const conversationId =
        notification.conversationId ||
        notification.conversation_id ||
        notification.chatId ||
        notification.chat_id;

      if (!conversationId) return;

      const existing = pendingMap.get(conversationId) || { incrementBy: 0 };
      const nextTimestamp =
        typeof notification.timestamp === 'number'
          ? Math.max(existing.timestamp || 0, notification.timestamp)
          : existing.timestamp;

      pendingMap.set(conversationId, {
        incrementBy: existing.incrementBy + 1,
        timestamp: nextTimestamp,
      });

      scheduleRealtimeFlush();
    };

    socket.on('new-notification', handleNewNotification);
    socket.on('message:reaction', handleMessageReaction);

    return () => {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      pendingMap.clear();
      socket.off('new-notification', handleNewNotification);
      socket.off('message:reaction', handleMessageReaction);
    };
  }, [isConnected, getSocket, fetchConversations, handleMessageReaction]);

  useEffect(() => {
    localStorage.setItem('chat-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

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
            <p className="text-sm text-[#0c6780] dark:text-[#87ceeb]">Loading messages…</p>
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
        {/* Chat Modal Container */}
        <div className="w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50">
          {/* Left Panel: Chat List (35%) */}
          <aside className="w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative">
            {/* Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']">Messages</h1>
                <div className="flex items-center gap-2">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 rounded-full transition-colors group"
                    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-[#0c6780] dark:group-hover:text-[#87ceeb]">
                      {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                  </button>
                  {/* Close Button */}
                  <Link
                    href="/dashboard"
                    className="w-10 h-10 flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                    title="Close"
                  >
                    <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-red-600">close</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] dark:text-[#bfc8cd]">search</span>
                <input 
                  className="w-full bg-white dark:bg-[#004040] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]" 
                  placeholder="Search conversations..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pb-2 flex gap-2">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'conversations'
                    ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]'
                    : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'
                }`}
              >
                Chats ({conversations.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all relative ${
                  activeTab === 'requests'
                    ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]'
                    : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'
                }`}
              >
                Requests ({chatRequests.length})
                {chatRequests.length > 0 && activeTab !== 'requests' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f9b1bc] text-white text-[10px] flex items-center justify-center font-bold">
                    {chatRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Chat List Items */}
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              {activeTab === 'conversations' && (
                <>
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto">
                        <span className="material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]">chat_bubble</span>
                      </div>
                      <p className="font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">No conversations yet</p>
                      <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd] mb-4">Start chatting with someone!</p>
                      <Link href="/dashboard" className="text-sm font-semibold text-[#0c6780] dark:text-[#87ceeb] hover:underline">
                        Find people →
                      </Link>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.conversation_id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                          selectedConversation?.conversation_id === conv.conversation_id
                            ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30'
                            : 'hover:bg-white/50 dark:hover:bg-[#004040]/50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          {conv.other_user_dp ? (
                              !conv.is_anonymous ? (
                              <button onClick={(e) => { e.stopPropagation(); void navigateToProfileByUserId(conv.other_user_id); }} className="w-12 h-12 rounded-full overflow-hidden">
                                <Image 
                                  src={conv.other_user_dp} 
                                  alt={conv.other_user_name} 
                                  width={48} 
                                  height={48} 
                                  className="w-12 h-12 rounded-full object-cover" 
                                />
                              </button>
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]">
                                {conv.is_anonymous ? '?' : conv.other_user_name.charAt(0).toUpperCase()}
                              </div>
                            )
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]">
                              {conv.is_anonymous ? '?' : conv.other_user_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {!conv.is_anonymous && conv.other_user_id && onlineUsers.has(conv.other_user_id) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#005870] dark:text-[#87ceeb] truncate">{conv.other_user_name}</span>
                            <span className="text-[10px] uppercase tracking-wider text-[#6f787d] dark:text-[#bfc8cd]">
                              {formatTime(conv.last_message_time || conv.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-[#0c6780] dark:text-[#bfc8cd] truncate">
                            {decryptedPreviews[conv.conversation_id]
                              ? decryptedPreviews[conv.conversation_id]
                              : conv.last_message_preview
                                ? (conv.last_message_type === 'image' ? '📷 Image' : '🔒 Encrypted')
                                : 'No messages yet'
                            }
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <div className="w-5 h-5 bg-[#f9b1bc] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-white">{conv.unread_count > 99 ? '99+' : conv.unread_count}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'requests' && (
                <>
                  {chatRequests.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto">
                        <span className="material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]">mail</span>
                      </div>
                      <p className="font-semibold text-[#002020] dark:text-[#e7fffe]">No pending requests</p>
                      <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">You&apos;re all caught up!</p>
                    </div>
                  ) : (
                    chatRequests.map((request) => (
                      <div key={request.request_id} className="p-4 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center gap-4">
                        <div className="shrink-0">
                          {request.sender_dp_url ? (
                            <Image 
                              src={request.sender_dp_url} 
                              alt={request.sender_display_name} 
                              width={48} 
                              height={48} 
                              className="w-12 h-12 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]">
                              {request.sender_display_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-[#002020] dark:text-[#e7fffe]">{request.sender_display_name}</span>
                            {request.request_type === 'anonymous' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">Anon</span>
                            )}
                          </div>
                          <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">{formatTime(request.created_at)}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleAcceptRequest(request.request_id)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.request_id)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Right Panel: Conversation (65%) */}
          <main className="hidden md:flex md:w-[65%] flex-col bg-white/40 dark:bg-[#002020]/40">
            {selectedConversation ? (
              <>
                {/* Active Chat Top Bar */}
                <header className="h-20 px-6 flex items-center justify-between border-b border-white/50 dark:border-[#004a4a]/50 bg-white/60 dark:bg-[#003535]/60 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                        {selectedConversation.other_user_dp ? (
                      !selectedConversation.is_anonymous ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); void navigateToProfileByUserId(selectedConversation.other_user_id); }}
                          className="w-10 h-10 rounded-full overflow-hidden"
                          title={`View ${selectedConversation.other_user_name} profile`}
                        >
                          <Image
                            src={selectedConversation.other_user_dp}
                            alt={selectedConversation.other_user_name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]">
                          {selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]">
                        {selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-[#002020] dark:text-[#e7fffe] leading-tight cursor-pointer" onClick={() => { if (!selectedConversation.is_anonymous) void navigateToProfileByUserId(selectedConversation.other_user_id); }}>{selectedConversation.other_user_name}</h2>
                      {!selectedConversation.is_anonymous && selectedConversation.other_user_id && onlineUsers.has(selectedConversation.other_user_id) && (
                        <p className="text-xs text-green-500 font-medium">Online now</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    {!showMessageSearch ? (
                      <>
                        <button onClick={() => setShowMessageSearch(true)} className="p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors">
                          <span className="material-symbols-outlined text-[#6f787d]">search</span>
                        </button>
                        <button onClick={() => setShowMenu(s => !s)} className="p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors">
                          <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]">more_vert</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          ref={messageSearchInputRef}
                          value={messageSearchQuery}
                          onChange={(e) => setMessageSearchQuery(e.target.value)}
                          placeholder="Search messages..."
                          className="px-3 py-2 rounded-full border border-white/40 dark:border-[#004a4a]/40 outline-none w-56 dark:bg-[#004040] dark:text-[#e7fffe]"
                        />
                        <button onClick={() => { setShowMessageSearch(false); setMessageSearchQuery(''); }} className="p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors">
                          <span className="material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]">close</span>
                        </button>
                      </div>
                    )}

                    {/* Menu dropdown */}
                    {showMenu && (
                      <div className="absolute right-0 mt-12 w-44 bg-white dark:bg-[#004040] rounded-xl shadow-lg p-2 z-50 border border-white/30 dark:border-[#004a4a]/30">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            if (!selectedConversation?.is_anonymous) void navigateToProfileByUserId(selectedConversation?.other_user_id);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]"
                        >
                          View profile
                        </button>
                        <button onClick={() => { setShowMenu(false); setShowBlockConfirm(true); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]">Block</button>
                        <button onClick={() => { setShowMenu(false); setShowReportDialog(true); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]">Report</button>
                      </div>
                    )}
                  </div>
                </header>

                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                  {(() => {
                    const shownMessages = messageSearchQuery.trim() ? messageSearchResults : messages;
                    if (loadingMessages) {
                      return (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-2 border-[#0c6780] dark:border-[#87ceeb] border-t-transparent animate-spin" />
                        </div>
                      );
                    }

                    if (shownMessages.length === 0) {
                      return (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto">
                              <span className="material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]">chat_bubble</span>
                            </div>
                            <p className="font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">No messages yet</p>
                            <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Start the conversation!</p>
                          </div>
                        </div>
                      );
                    }

                    let lastDate = '';
                    return shownMessages.map((msg) => {
                      const msgDate = new Date(msg.created_at).toDateString();
                      const showDateHeader = msgDate !== lastDate;
                      lastDate = msgDate;
                      return (
                        <div key={msg.message_id} className="flex flex-col">
                          {/* Date Header */}
                          {showDateHeader && (
                            <div className="flex justify-center my-4">
                              <span className="px-4 py-1.5 rounded-full text-[11px] font-semibold bg-white/60 text-[#6f787d] shadow-sm">
                                {formatDateHeader(msg.created_at)}
                              </span>
                            </div>
                          )}
                          {/* Message Bubble with Actions */}
                          <MessageItem
                            msg={msg}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReact={handleReact}
                            formatTime={formatTimeCompact}
                          />
                        </div>
                      );
                    });
                  })()}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Area */}
                <footer className="p-0 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30">
                  {/* Reply Preview */}
                  {replyingTo && (
                    <div className="mb-3 flex items-start gap-2 p-3 rounded-xl bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 border-l-[3px] border-[#0c6780] dark:border-[#87ceeb]">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]">
                          Replying to {replyingTo.sender_name || 'Unknown'}
                        </p>
                        <p className="text-sm truncate text-[#6f787d] dark:text-[#bfc8cd]">
                          {replyingTo.encrypted_content || '📷 Image'}
                        </p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="w-6 h-6 rounded-full bg-white/60 dark:bg-[#004040]/60 flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-[#004040] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px] text-[#6f787d] dark:text-[#bfc8cd]">close</span>
                      </button>
                    </div>
                  )}
                  {/* Selected Image Preview */}
                  {selectedImage && (
                    <div className="mb-3 p-3 rounded-xl bg-[#87ceeb]/10 dark:bg-[#0c6780]/10 flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0c6780] dark:text-[#87ceeb] font-medium truncate">{selectedImage.name}</p>
                        <p className="text-xs text-[#6f787d] dark:text-[#bfc8cd]">{(selectedImage.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  )}
                  <div className="bg-white dark:bg-[#004040] rounded-xl flex items-center p-2 gap-2 shadow-sm border border-white/50 dark:border-[#004a4a]/50 relative">
                    {/* Emoji Picker Popup */}
                    {showEmojiPickerInput && (
                      <div
                        ref={emojiPickerInputRef}
                        className="absolute bottom-full left-2 mb-2 z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 flex-wrap max-w-70"
                      >
                        {EMOJI_OPTIONS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessageInput(prev => prev + emoji);
                              setShowEmojiPickerInput(false);
                              messageInputRef.current?.focus();
                            }}
                            className="w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowEmojiPickerInput(!showEmojiPickerInput)}
                      className="p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors"
                    >
                      <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedImage(file);
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors"
                    >
                      <span className="material-symbols-outlined">attach_file</span>
                    </button>
                    <input
                      ref={messageInputRef}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]"
                      placeholder={isBlocked ? "Cannot send message - user is blocked" : "Type a message..."}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                      disabled={sending || isBlocked}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={(!messageInput.trim() && !selectedImage) || sending || isBlocked}
                      className="bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] dark:from-[#0c6780] dark:via-[#4a6368] dark:to-[#0c6780] w-10 h-10 rounded-lg flex items-center justify-center text-[#002020] dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-4 mx-auto">
                    <span className="material-symbols-outlined text-4xl text-[#0c6780] dark:text-[#87ceeb]">chat</span>
                  </div>
                  <p className="text-lg font-semibold text-[#002020] dark:text-[#e7fffe] mb-1">Select a conversation</p>
                  <p className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Bottom Dock Navigation - Icons Only */}
      {/* Block confirmation modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowBlockConfirm(false)}>
          <div className="bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]">Block user</h3>
            <p className="text-sm mb-4 text-[#6f787d] dark:text-[#bfc8cd]">Are you sure you want to block {selectedConversation?.other_user_name}? You will not be able to send or receive messages from this user.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowBlockConfirm(false)} className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]">Cancel</button>
              <button onClick={() => void handleBlockSelectedUser()} disabled={blocking} className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50">{blocking ? 'Blocking...' : 'Block'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Report dialog modal */}
      {showReportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowReportDialog(false)}>
          <div className="bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]">Report user</h3>
            <p className="text-sm mb-3 text-[#6f787d] dark:text-[#bfc8cd]">Tell us why you are reporting {selectedConversation?.other_user_name}. Our team will review it.</p>
            <div className="space-y-2 mb-4">
              <label className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Reason</label>
              {/* Define the type for reportType */}
              {/* Place this type at the top-level of your file or near your state declarations: */}
              <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className="w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]">
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="inappropriate_content">Inappropriate content</option>
                <option value="impersonating">Impersonating</option>
                <option value="fake_profile">Fake profile</option>
                <option value="other">Other</option>
              </select>
              <label className="text-sm text-[#6f787d] dark:text-[#bfc8cd]">Description</label>
              <textarea value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} rows={4} className="w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowReportDialog(false)} className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]">Cancel</button>
              <button onClick={() => void handleSubmitReport()} disabled={reporting} className="flex-1 px-4 py-2 rounded-xl bg-primary-container dark:bg-[#0c6780] text-sm font-semibold text-on-primary-container dark:text-white hover:opacity-90 disabled:opacity-50">{reporting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
