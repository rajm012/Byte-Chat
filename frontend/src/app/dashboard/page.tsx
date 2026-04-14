'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Group } from '@/types/chat.types';
import { groupService } from '@/services/group.service';
import { uploadGroupPicture } from '@/services/image.service';
import { useToast } from '@/contexts/ToastContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Image from 'next/image';
import './dashboard.css';
import type { AppNotification } from '@/services/notification.service';

// Helper to resolve notification navigation link
function resolveNotificationLink(notification: AppNotification): string | undefined {
  const n = notification as Record<string, unknown>;
  const type = typeof n.type === 'string' ? n.type : 'notification';
  const conversationId =
    (typeof n.conversationId === 'string' ? n.conversationId : undefined) ||
    (typeof n.conversation_id === 'string' ? n.conversation_id : undefined) ||
    (typeof n.chatId === 'string' ? n.chatId : undefined) ||
    (typeof n.chat_id === 'string' ? n.chat_id : undefined);
  const groupId =
    (typeof n.groupId === 'string' ? n.groupId : undefined) ||
    (typeof n.group_id === 'string' ? n.group_id : undefined);
  const pollId =
    (typeof n.pollId === 'string' ? n.pollId : undefined) ||
    (typeof n.poll_id === 'string' ? n.poll_id : undefined);

  if (type === 'group_invite') {
    return groupId ? `/groups/${groupId}/chat` : '/my-groups';
  }
  if (type === 'admin_promoted') {
    return groupId ? `/groups/${groupId}` : '/my-groups';
  }
  if (type === 'poll_created') {
    return groupId ? `/groups/${groupId}/chat${pollId ? `?pollId=${pollId}` : ''}` : '/my-groups';
  }
  if (conversationId) {
    return `/chat/${conversationId}`;
  }
  if (groupId) {
    return `/groups/${groupId}`;
  }
  return undefined;
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark] as const;
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { notifications, count: notificationCount, markRead, deleteOne, refresh } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useDarkMode();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);
  const [, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, ] = useState('all');
  const [filterGender, ] = useState('all');
  const [filterYear, ] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; dp_url?: string; roll_no?: string } | null>(null);

  const normalizeCurrentUser = useCallback((raw: unknown) => {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    const name =
      (typeof data.name === 'string' && data.name) ||
      (typeof data.full_name === 'string' && data.full_name) ||
      'Profile';
    const dpUrl =
      (typeof data.dp_url === 'string' && data.dp_url) ||
      (typeof data.avatar_url === 'string' && data.avatar_url) ||
      (typeof data.profile_image_url === 'string' && data.profile_image_url) ||
      undefined;
    const rollNo =
      (typeof data.roll_no === 'string' && data.roll_no) ||
      (typeof data.rollNo === 'string' && data.rollNo) ||
      undefined;

    return {
      name,
      dp_url: dpUrl,
      roll_no: rollNo,
    };
  }, []);

  // Fetch current user profile with dp_url from API
  const fetchCurrentUser = useCallback(async () => {
    const userRaw = localStorage.getItem('user');
    let fallbackUser: { name: string; dp_url?: string; roll_no?: string } | null = null;
    if (userRaw) {
      try {
        fallbackUser = normalizeCurrentUser(JSON.parse(userRaw));
      } catch {
        fallbackUser = null;
      }
    }

    try {
      const { API_BASE_URL } = await import('../../services/apiBase');
      const token = localStorage.getItem('token');
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
        credentials: 'include',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const normalized = normalizeCurrentUser(data.data);
          setCurrentUser(normalized || fallbackUser);
          return;
        }
      }
    } catch {
      // Use fallback below.
    }

    if (fallbackUser) {
      setCurrentUser(fallbackUser);
    }
  }, [normalizeCurrentUser]);

  useEffect(() => {
    setMounted(true);
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const fetchData = useCallback(async () => {
    try {
      const userRaw = localStorage.getItem('user');
      let currentUserId: string | null = null;
      let currentUserRollNo: string | null = null;

      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw) as Record<string, unknown>;
          currentUserId =
            (typeof parsed.user_id === 'string' && parsed.user_id) ||
            (typeof parsed.userId === 'string' && parsed.userId) ||
            null;
          currentUserRollNo =
            (typeof parsed.roll_no === 'string' && parsed.roll_no) ||
            (typeof parsed.rollNo === 'string' && parsed.rollNo) ||
            null;
        } catch {
          // Ignore malformed local user payload and continue without self-filter fallback.
        }
      }

      // Fetch users
      const { API_BASE_URL } = await import('../../services/apiBase');
      const usersResponse = await fetch(`${API_BASE_URL}/api/profile/all`, {
        credentials: 'include',
      });

      if (usersResponse.status === 401) {
        setError('Please login to continue');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      const usersData = await usersResponse.json();
      if (usersData.success && usersData.data && Array.isArray(usersData.data.users)) {
        const visibleUsers = usersData.data.users.filter((user: User) => {
          if (currentUserId && user.user_id === currentUserId) return false;
          if (currentUserRollNo && user.roll_no.toLowerCase() === currentUserRollNo.toLowerCase()) return false;
          return true;
        });
        setUsers(visibleUsers);
      }

      // Fetch my groups to filter them out from public groups
      const myGroupsData = await groupService.getMyGroups();
      const myGroupIds = new Set<string>();
      if (myGroupsData.success && myGroupsData.data && Array.isArray(myGroupsData.data.groups)) {
        setMyGroups(myGroupsData.data.groups);
        myGroupsData.data.groups.forEach((g: Group) => myGroupIds.add(g.group_id));
      }

      // Fetch public groups and filter out groups user is already a member of
      const groupsData = await groupService.getPublicGroups();
      if (groupsData.success && groupsData.data && Array.isArray(groupsData.data.groups)) {
        // Only show groups user hasn't joined yet
        const nonMemberGroups = groupsData.data.groups.filter((g: Group) => !myGroupIds.has(g.group_id));
        setGroups(nonMemberGroups);
      }
    }
    catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to connect to server');
    }
    finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roll_no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === 'all' || user.branch === filterBranch;
    const matchesGender = filterGender === 'all' || user.gender === filterGender;
    const matchesYear = filterYear === 'all' || user.roll_no?.toLowerCase().includes(filterYear.toLowerCase());
    return matchesSearch && matchesBranch && matchesGender && matchesYear;
  });

  const filteredGroups = groups.filter((group) => {
    return group.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.group_desc && group.group_desc.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleStartChat = (userId: string, isAnonymous: boolean = false) => {
    if (navigating) return;
    setNavigating(true);
    router.push(`/chat/new?userId=${userId}&anonymous=${isAnonymous}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    router.push('/login');
  };

  const handleJoinGroup = async (groupId: string, isAnonymous: boolean = false) => {
    try {
      await groupService.joinGroup(groupId, isAnonymous);
      toast.success('Joined group successfully!');
      fetchData();
    }
    catch (err: unknown) {
      let errorMsg = 'Failed to join group';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      // setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh-warm antialiased pb-28">
        {/* Fixed blobs - keep for visual consistency */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-linear-to-br from-primary-container/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-linear-to-br from-tertiary-container/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header - keep navigation visible */}
        <header className="glass-nav fixed top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,32,32,0.06)]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-black text-on-surface tracking-tight">
                Byte<span className="text-primary">chat</span>
              </span>
            </Link>

            {/* Search Bar Center - disabled */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  type="text"
                  placeholder="Search batchmates..."
                  value=""
                  disabled
                  className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary text-sm text-on-surface opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Right Actions - skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-surface-container-high animate-pulse" />
            </div>
          </div>
        </header>

        {/* Skeleton Content */}
        <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-12">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-10 w-48 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-10 w-32 bg-surface-container-high rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-surface-container-high rounded-full animate-pulse" />
                <div className="h-10 w-24 bg-surface-container-high rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="h-10 w-full bg-surface-container-high rounded-full animate-pulse" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="group relative flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden"
              >
                {/* Image area */}
                <div className="aspect-square bg-surface-container-high animate-pulse" />
                {/* Info area */}
                <div className="p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="h-3.5 w-3/4 bg-surface-container-high rounded animate-pulse" />
                      <div className="h-2.5 w-1/2 bg-surface-container-high rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-10 bg-surface-container-high rounded shrink-0 animate-pulse" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 flex-1 bg-surface-container-high rounded animate-pulse" />
                    <div className="h-6 flex-1 bg-surface-container-high rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Floating Bottom Dock - keep visible */}
        <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 bg-surface-container-high/90 dark:bg-surface-container/90 rounded-full backdrop-blur-md border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <Link href="/chat" className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300">
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
          </Link>
          <Link href="/my-groups" className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300">
            <span className="material-symbols-outlined text-xl">group</span>
          </Link>
          <Link href="/dashboard" className="w-14 h-14 flex items-center justify-center text-white rounded-full bg-primary hover:scale-110 transition-all duration-300 shadow-lg">
            <span className="material-symbols-outlined text-2xl">home</span>
          </Link>
          <Link href="/profile/edit" className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300">
            <span className="material-symbols-outlined text-xl">person</span>
          </Link>
        </nav>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-mesh-warm flex items-center justify-center px-5">
        <div className="glass-strong rounded-3xl p-8 text-center max-w-sm animate-scale-in">
          <p className="text-lg font-bold mb-2 text-on-surface">{error}</p>
          <p className="text-sm text-on-surface-variant">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-warm antialiased pb-28">
      {/* Fixed blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-linear-to-br from-primary-container/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-linear-to-br from-tertiary-container/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar - CampusHub Style */}
      <header className="glass-nav fixed top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,32,32,0.06)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-black text-on-surface tracking-tight">
              Byte<span className="text-primary">chat</span>
            </span>
          </Link>

          {/* Search Bar Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder={activeTab === 'users' ? 'Search batchmates...' : 'Search groups...'}
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary text-sm text-on-surface"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Icon with Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full relative"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-red-600 text-white text-[11px] font-bold rounded-full px-1.5 shadow-lg ring-2 ring-white dark:ring-gray-900 animate-pulse z-50">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,32,32,0.15)] border border-outline-variant/30 overflow-hidden z-50">
                  <div className="p-3 border-b border-outline-variant/30 flex items-center justify-between">
                    <span className="font-semibold text-sm text-on-surface">Notifications</span>
                    {notificationCount > 0 && (
                      <button
                        onClick={async () => { await markRead(); await refresh(); }}
                        className="text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">notifications_off</span>
                        <p className="text-sm text-on-surface-variant">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const href = resolveNotificationLink(notif);
                        return (
                          <div
                            key={notif.notification_id || notif.timestamp}
                            onClick={async () => {
                              if (notif.notification_id) {
                                await deleteOne(notif.notification_id);
                              }
                              if (href) {
                                setShowNotifications(false);
                                router.push(href);
                              }
                            }}
                            className={`p-3 border-b border-outline-variant/20 hover:bg-surface-container-high/50 transition-colors cursor-pointer ${href ? '' : 'pointer-events-none opacity-70'}`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-on-surface truncate">{notif.message}</p>
                                <p className="text-[10px] text-on-surface-variant mt-1">
                                  {notif.timestamp ? new Date(notif.timestamp).toLocaleDateString() : ''}
                                </p>
                              </div>
                              {notif.notification_id && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteOne(notif.notification_id!); }}
                                  className="p-1 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-2 border-t border-outline-variant/30 bg-surface-container-high/30">
                    <button
                      onClick={() => { setShowNotifications(false); router.push('/chat'); }}
                      className="w-full py-2 text-xs font-semibold text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
                    >
                      View all chats
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Dark Mode */}
            <button
              onClick={() => setDark(d => !d)}
              className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-1" />
            {/* Profile + Logout */}
            <div className="flex items-center gap-2">
              <Link
                href="/profile/edit"
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shadow-sm hover:scale-105 transition-transform"
              >
                {currentUser?.dp_url ? (
                  <Image
                    src={currentUser.dp_url}
                    alt={currentUser.name || 'Profile'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary to-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">person</span>
                  </div>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full scale-95 active:scale-90"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-12">
        {/* Header Section with Editorial Layout */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">Dorm Directory</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-none">
                Meet your <span className="text-primary italic">batchmates.</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeTab === 'users'
                    ? 'bg-tertiary-container text-on-tertiary-container hover:scale-105'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeTab === 'groups'
                    ? 'bg-tertiary-container text-on-tertiary-container hover:scale-105'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                Groups
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Search (visible only on small screens) */}
        <div className="md:hidden mb-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder={activeTab === 'users' ? 'Search batchmates...' : 'Search groups...'}
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary text-sm text-on-surface"
            />
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-32 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl -z-10 animate-pulse" />
        <div className="absolute top-48 right-20 w-32 h-32 bg-tertiary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="hidden lg:block absolute top-64 left-1/4 w-16 h-16 bg-secondary/5 rounded-full blur-xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {activeTab === 'groups' && (
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-on-surface-variant">
              {filteredGroups.length} public groups available
            </p>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="px-5 py-2 rounded-full bg-primary text-on-primary font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Create Group
            </button>
          </div>
        )}

        {/* Staggered Grid of Profile Cards - Compact with 3 Buttons */}
        {activeTab === 'users' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.user_id}
                  className="group relative flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,32,32,0.15)] hover:-translate-y-1"
                >
                  {/* Image - Shorter aspect ratio */}
                  <div className="aspect-square overflow-hidden relative">
                    {user.dp_url ? (
                      <Image
                        src={user.dp_url}
                        alt={user.name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={index < 6}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-primary-container to-tertiary-container flex items-center justify-center">
                        <span className="text-3xl font-bold text-on-primary-container">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    {/* Random decorative overlay on some cards */}
                    {index % 5 === 0 && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-tertiary/30 rounded-full blur-sm" />
                    )}
                    {index % 7 === 3 && (
                      <div className="absolute bottom-2 left-2 w-3 h-3 bg-primary/40 rounded-full" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-2.5 flex flex-col gap-1.5">
                    {/* Row 1: Name/Roll + View button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-on-surface truncate">{user.name}</h3>
                        <p className="text-[9px] font-bold text-secondary tracking-wider uppercase">#{user.roll_no}</p>
                      </div>
                      <Link
                        href={`/profile/${user.roll_no}`}
                        className="px-2 py-1 rounded-md text-[9px] font-semibold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors shrink-0"
                      >
                        View
                      </Link>
                    </div>
                    {/* Row 2: Chat and Anon buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleStartChat(user.user_id, false)}
                        disabled={navigating}
                        className="flex-1 py-1 rounded-md text-[9px] font-semibold bg-primary text-on-primary hover:scale-105 transition-transform disabled:opacity-60"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => handleStartChat(user.user_id, true)}
                        disabled={navigating}
                        className="flex-1 py-1 rounded-md text-[9px] font-semibold bg-tertiary-container text-on-tertiary-container hover:scale-105 transition-transform disabled:opacity-60"
                        title="Anonymous Chat"
                      >
                        Anon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredUsers.length === 0 && (
              <div className="glass-strong rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-on-surface">No students found</p>
                <p className="text-sm mt-1 text-on-surface-variant">Try a different search</p>
              </div>
            )}
          </>
        )}

        {/* Group Cards - Compact with 3 Buttons */}
        {activeTab === 'groups' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredGroups.map((group, index) => (
                <div
                  key={group.group_id}
                  className="group relative flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,32,32,0.15)] hover:-translate-y-1"
                >
                  {/* Group Image - Shorter aspect ratio */}
                  <div className="aspect-square overflow-hidden relative">
                    {group.group_dp_url ? (
                      <Image
                        src={group.group_dp_url}
                        alt={group.group_name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={index < 6}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-secondary-container to-primary-container flex items-center justify-center">
                        <span className="text-3xl font-bold text-on-secondary-container">{group.group_name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    {/* Random decorative overlay */}
                    {index % 5 === 2 && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-tertiary/30 rounded-full blur-sm" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-2.5 flex flex-col gap-1.5">
                    <div>
                      <h3 className="text-xs font-bold text-on-surface truncate">{group.group_name}</h3>
                      <p className="text-[9px] font-bold text-secondary tracking-wider uppercase">{group.member_count}/{group.max_members} members</p>
                    </div>
                    {/* 3 Action Buttons in a row */}
                    <div className="flex gap-1 mt-auto">
                      <Link
                        href={`/groups/${group.group_id}`}
                        className="flex-1 py-1 rounded-md text-[9px] font-semibold text-center bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleJoinGroup(group.group_id, false)}
                        className="flex-1 py-1 rounded-md text-[9px] font-semibold bg-primary text-on-primary hover:scale-105 transition-transform"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => handleJoinGroup(group.group_id, true)}
                        className="flex-1 py-1 rounded-md text-[9px] font-semibold bg-tertiary-container text-on-tertiary-container hover:scale-105 transition-transform"
                        title="Anonymous Join"
                      >
                        Anon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredGroups.length === 0 && (
              <div className="glass-strong rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="font-semibold text-on-surface">No groups found</p>
                <p className="text-sm mt-1 text-on-surface-variant">Create the first group!</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Dock Navigation - Icons Only */}
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 bg-surface-container-high/90 dark:bg-surface-container/90 rounded-full backdrop-blur-md border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        {/* Chats */}
        <Link
          href="/chat"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="Chats"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </Link>
        {/* Groups */}
        <Link
          href="/my-groups"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="Groups"
        >
          <span className="material-symbols-outlined text-xl">group</span>
        </Link>
        {/* Home - Middle */}
        <Link
          href="/dashboard"
          className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full transition-all duration-300"
          title="Home"
        >
          <span className="material-symbols-outlined text-xl">home</span>
        </Link>
        {/* IDs - my ids */}
        <Link
          href="/my-identities"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="IDs"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
        </Link>
        {/* Settings */}
        <Link
          href="/profile/edit"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </Link>
      </nav>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onSuccess={() => {
            setShowCreateGroup(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Create Group Modal Component
function CreateGroupModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    group_name: '',
    group_desc: '',
    is_public: true,
    max_members: 500
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create group first without image
      const result = await groupService.createGroup(formData);
      const groupId = result.data?.group?.group_id;
      
      // Upload image if selected
      if (groupId && selectedImage) {
        try {
          await uploadGroupPicture(groupId, selectedImage);
        } catch (uploadError) {
          console.error('Failed to upload group image:', uploadError);
          // Don't fail group creation if image upload fails
        }
      }
      
      onSuccess();
    } catch (error: unknown) {
      console.error('Failed to create group', error);
      let message = 'Failed to create group';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-strong rounded-3xl p-8 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold" style={{ color: 'var(--heading)' }}>Create Group ✨</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform" style={{ color: 'var(--muted)' }}>✕</button>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--heading)' }}>Group Name *</label>
            <input type="text" required value={formData.group_name} onChange={(e) => setFormData({ ...formData, group_name: e.target.value })} className="input-romance" placeholder="e.g. CSE 2024" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--heading)' }}>Description</label>
            <textarea value={formData.group_desc} onChange={(e) => setFormData({ ...formData, group_desc: e.target.value })} className="input-romance resize-none" placeholder="What's this group about?" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--heading)' }}>Cover Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Group preview"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">add_photo_alternate</span>
                  <span className="text-xs text-on-surface-variant">Add Image</span>
                </button>
              )}
              <div className="flex-1">
                <p className="text-xs text-on-surface-variant">
                  {selectedImage ? selectedImage.name : 'Select an image for your group'}
                </p>
                <p className="text-[10px] text-muted mt-1">Max size: 5MB</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--heading)' }}>Max Members</label>
              <input type="number" required min={2} max={500} value={formData.max_members} onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })} className="input-romance" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={formData.is_public} onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })} className="w-5 h-5 rounded accent-pink-500" />
                <span className="text-sm font-semibold" style={{ color: 'var(--heading)' }}>Public</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-semibold glass transition-all hover:scale-105" style={{ color: 'var(--body)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-2xl text-sm font-semibold btn-romance disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating…</> : 'Create Group →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
