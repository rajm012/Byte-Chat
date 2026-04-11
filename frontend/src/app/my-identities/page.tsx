'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type TabType = 'all' | 'chat' | 'group';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { getMyAnonymousIdentities, revealAnonymousIdentity, AnonymousIdentity } from '@/services/anonymous.service';
import Image from 'next/image';

export default function MyAnonymousIdentities() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const { notifications, count: notificationCount, markRead, deleteOne } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; dp_url?: string; roll_no?: string } | null>(null);

  const [identities, setIdentities] = useState<AnonymousIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TabType>('all');
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [confirmRevealId, setConfirmRevealId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch current user profile
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      }
    } catch {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw);
          setCurrentUser(parsed);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    fetchIdentities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIdentities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyAnonymousIdentities();

      if (response.success) {
        setIdentities(response.data);
      } else {
        setError(response.message || 'Failed to fetch identities');
        toast.error(response.message || 'Failed to fetch identities');
      }
    } 
    catch (err: unknown) {
      let errorMsg = 'Failed to load anonymous identities';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleRevealIdentity = async (identityId: string) => {
    // First click: Ask for confirmation
    if (confirmRevealId !== identityId) {
      setConfirmRevealId(identityId);
      toast.warning('Click reveal again to confirm. This cannot be undone!');
      // Auto-cancel after 5 seconds
      setTimeout(() => {
        setConfirmRevealId(null);
      }, 5000);
      return;
    }

    // Second click: Actually reveal
    try {
      setRevealingId(identityId);
      setConfirmRevealId(null);
      const response = await revealAnonymousIdentity(identityId);

      if (response.success) {
        toast.success('Identity revealed! Your next message will show your profile.');
        fetchIdentities(); // Refresh list
      } else {
        toast.error(response.message || 'Failed to reveal identity');
      }
    } 
    // catch (err: any) {
    //   toast.error(err.message || 'Failed to reveal identity');
    // } 
    catch (err: unknown) {
      let errorMsg = 'Failed to reveal identity';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
      toast.error(errorMsg);
    }
    finally {
      setRevealingId(null);
    }
  };

  const handleNavigateToChat = (identity: AnonymousIdentity) => {
    if (confirmRevealId) {
      setConfirmRevealId(null);
    }
    
    if (identity.conversation_id) {
      toast.info('Opening 1V1 chat...');
      router.push(`/chat?conversationId=${identity.conversation_id}`);
    } else if (identity.group_id) {
      toast.info('Opening group chat...');
      router.push(`/groups/${identity.group_id}/chat`);
    } else {
      toast.warning('Unable to navigate to chat');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    router.push('/login');
  };

  const filteredIdentities = filter === 'all'
    ? identities
    : filter === 'chat'
    ? identities.filter(i => !i.group_id)
    : identities.filter(i => i.group_id);

  // Badge counts
  const chatCount = identities.filter(i => !i.group_id).length;
  const groupCount = identities.filter(i => i.group_id).length;

  const tabLabels: Record<TabType, string> = { all: 'All', chat: '1V1 Chats', group: 'Groups' };
  const tabCounts: Record<TabType, number> = { all: identities.length, chat: chatCount, group: groupCount };

  return (
    <div className="min-h-screen bg-mesh-warm antialiased">
      {/* Gradient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-linear-to-br from-purple-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-3%] w-80 h-80 bg-linear-to-br from-pink-400/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar - Dashboard Style */}
      <header className="glass-nav fixed top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,32,32,0.06)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo + Page Title */}
          <div className="flex items-center gap-3">
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
            {/* <div className="h-6 w-px bg-outline-variant/30" />
            <h1 className="text-lg font-bold text-on-surface">My Identities</h1> */}
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
                  <span className="absolute top-1 right-1 min-w-4.5 h-4.5 flex items-center justify-center bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full px-1">
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
                        onClick={() => { markRead(); }}
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
                      notifications.map((notif) => (
                        <div
                          key={notif.notification_id || notif.timestamp}
                          className="p-3 border-b border-outline-variant/20 hover:bg-surface-container-high/50 transition-colors"
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
                                onClick={() => deleteOne(notif.notification_id!)}
                                className="p-1 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container/30 transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
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
              onClick={toggleTheme}
              className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
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

        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">Anonymous Personas</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-none">
                My <span className="text-primary italic">Identities.</span>
              </h1>
              <p className="text-sm text-on-surface-variant mt-2">
                {identities.length} active persona{identities.length !== 1 ? 's' : ''} · Click any card to open the chat
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-3">
              {[
                { label: 'Total', value: identities.length, color: 'var(--purple)' },
                { label: '1V1', value: chatCount, color: 'var(--pink)' },
                { label: 'Groups', value: groupCount, color: '#22c55e' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl px-5 py-3 text-center min-w-18">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {(['all', 'chat', 'group'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === tab
                  ? 'bg-tertiary-container text-on-tertiary-container hover:scale-105'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {tabLabels[tab]}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                filter === tab ? 'bg-on-tertiary-container/15' : 'bg-outline-variant/20'
              }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl p-4 mb-6 border border-error/30 bg-error-container/10 text-error animate-fade-in flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="skeleton h-6 w-24 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded" />
                </div>
                <div className="skeleton h-5 w-full rounded mb-2" />
                <div className="skeleton h-4 w-20 rounded mb-4" />
                <div className="glass rounded-2xl p-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="skeleton h-4 w-24 rounded mb-1" />
                      <div className="skeleton h-3 w-16 rounded" />
                    </div>
                  </div>
                </div>
                <div className="skeleton h-3 w-28 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredIdentities.length === 0 && (
          <div className="glass-strong rounded-3xl p-16 text-center animate-scale-in">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">theater_comedy</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">
              No anonymous identities yet
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Send an anonymous message or join a group anonymously to create one
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:scale-105 transition-all"
            >
              Explore Students & Groups
            </button>
          </div>
        )}

        {/* Identities Grid */}
        {!isLoading && filteredIdentities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdentities.map((identity, idx) => (
              <div
                key={identity.identity_id}
                className={`glass-card rounded-3xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-fade-in ${
                  confirmRevealId === identity.identity_id
                    ? 'ring-2 ring-error/60'
                    : ''
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => handleNavigateToChat(identity)}
                title="Click to open conversation"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    identity.group_id
                      ? 'bg-tertiary-container/30 text-on-tertiary-container'
                      : 'bg-primary-container/30 text-on-primary-container'
                  }`}>
                    <span className="material-symbols-outlined text-sm">{identity.group_id ? 'groups' : 'chat'}</span>
                    {identity.group_id ? 'Group' : '1V1 Chat'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevealIdentity(identity.identity_id);
                    }}
                    disabled={revealingId === identity.identity_id || identity.is_revealed}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                      identity.is_revealed
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                        : revealingId === identity.identity_id
                        ? 'bg-surface-container text-on-surface-variant'
                        : confirmRevealId === identity.identity_id
                        ? 'bg-error-container/30 text-error animate-pulse'
                        :
                          // Custom: Improve contrast for dark mode
                          `${theme === 'dark'
                            ? 'bg-secondary text-on-secondary hover:bg-secondary/80'
                            : 'bg-secondary-container/30 text-on-secondary-container hover:bg-secondary-container/50'}'`
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {identity.is_revealed
                        ? 'check'
                        : revealingId === identity.identity_id
                        ? 'progress_activity'
                        : confirmRevealId === identity.identity_id
                        ? 'warning'
                        : 'lock_open'}
                    </span>
                    {identity.is_revealed
                      ? 'Revealed'
                      : revealingId === identity.identity_id
                      ? 'Revealing…'
                      : confirmRevealId === identity.identity_id
                      ? 'Confirm?'
                      : 'Reveal'}
                  </button>
                </div>

                {/* Anon string */}
                <div className="mb-4">
                  <p className="font-mono text-sm font-bold mb-1 truncate text-primary">
                    {identity.random_string.substring(0, 24)}…
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {identity.display_gender?.toUpperCase() || 'UNKNOWN'}
                  </p>
                </div>

                {/* Target info */}
                <div className="rounded-2xl p-3 mb-4 bg-surface-container/50">
                  {identity.target_user_id && identity.target_user && (
                    <div className="flex items-center gap-3">
                      <Image
                        src={identity.target_user.dp_url || '/default-avatar.png'}
                        alt={identity.target_user.name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover ring-2 ring-outline-variant/30"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-on-surface">
                          {identity.target_user.name}
                        </p>
                        <p className="text-xs truncate text-on-surface-variant">
                          {identity.target_user.roll_no}
                        </p>
                      </div>
                    </div>
                  )}
                  {identity.group_id && identity.target_group && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 bg-tertiary-container">
                        <span className="material-symbols-outlined text-on-tertiary-container text-lg">groups</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-on-surface">
                          {identity.target_group.group_name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {identity.target_group.is_public ? 'Public' : 'Private'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant">
                    {new Date(identity.created_at).toLocaleDateString()}
                  </p>
                  <span className="text-xs font-medium flex items-center gap-1 text-primary">
                    Open chat <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
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
      {/* Home - Middle (not active) */}
      <Link
        href="/dashboard"
        className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
        title="Home"
      >
        <span className="material-symbols-outlined text-xl">home</span>
      </Link>
      {/* IDs - my ids (active) */}
      <Link
        href="/my-identities"
        className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full transition-all duration-300"
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
  </div>
  );
}
