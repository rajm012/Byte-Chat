'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileImageManager from '@/components/ProfileImageManager';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';
import { useTheme } from '@/contexts/ThemeContext';
import QRCode from 'qrcode';
import '../profile.css';

interface UserProfile {
  user_id: string;
  roll_no: string;
  name: string;
  gender: string;
  branch: string;
  dob: string | null;
  bio: string | null;
  dp_url: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  created_at: string;
  is_verified: boolean;
}

interface UserSettings {
  theme_mode: string;
  email_notifications: boolean;
  push_notifications: boolean;
  privacy_profile_public: boolean;
  privacy_show_online_status: boolean;
  privacy_show_last_seen: boolean;
}

interface BlockedUser {
  blocked_id: string;
  roll_no: string | null;
  name: string;
  gender: string;
  dp_url: string | null;
  block_reason: string | null;
  created_at: string;
  is_anonymous_block: boolean;
}

const { API_BASE_URL } = await import('../../../services/apiBase');

export default function ProfileEditPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setSettings] = useState<UserSettings | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'settings' | 'privacy' | 'blocks' | 'security'>('personal');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  // Remove message state, use toast instead
  const { success: toastSuccess, error: toastError, info: toastInfo, warning: toastWarning } = useToast();

  // Form states
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [dpUrl, setDpUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [, setPrivacyProfilePublic] = useState(true);
  const [, setPrivacyShowOnlineStatus] = useState(true);
  const [, setPrivacyAllowAnonymousChats] = useState(true);
  const [deletePassword, setDeletePassword] = useState('');

  // Sync dob state with profile.dob when profile changes (after save)
  useEffect(() => {
    if (profile && profile.dob) {
      // If dob is ISO string (with T and Z), convert to local yyyy-MM-dd
      if (profile.dob.length > 10 && profile.dob.includes('T')) {
        const date = new Date(profile.dob);
        // Get local date in yyyy-MM-dd
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDob(`${year}-${month}-${day}`);
      } else {
        setDob(profile.dob);
      }
    }
  }, [profile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (!localStorage.getItem('user')) {
        router.push('/login');
        return;
      }

      // Fetch profile
      const { API_BASE_URL } = await import('../../../services/apiBase');
      const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
        credentials: 'include'
      });
      const profileData = await profileRes.json();

      if (profileData.success) {
        const p = profileData.data;
        setProfile(p);
        setBio(p.bio || '');
        // Set dob as plain string (no Date conversion)
        setDob(p.dob || '');
        setDpUrl(p.dp_url || '');
        setInstagramUrl(p.instagram_url || '');
        setTwitterUrl(p.twitter_url || '');
        setLinkedinUrl(p.linkedin_url || '');
      }

      // Fetch settings
      const settingsRes = await fetch(`${API_BASE_URL}/api/settings/settings`, {
        credentials: 'include'
      });
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        const s = settingsData.data;
        setSettings(s);
        setEmailNotifications(s.email_notifications ?? true);
        setNotificationEnabled(s.notification_enabled ?? true);
        setPrivacyProfilePublic(s.privacy_profile_public ?? true);
        setPrivacyShowOnlineStatus(s.privacy_show_online_status ?? true);
        setPrivacyAllowAnonymousChats(s.privacy_allow_anonymous_chats ?? true);
      }

      // Fetch blocked users
      const blockedRes = await fetch(`${API_BASE_URL}/api/settings/blocked`, {
        credentials: 'include'
      });
      const blockedData = await blockedRes.json();

      if (blockedData.success) {
        setBlockedUsers(blockedData.data);
      }
    } 
    catch (error) {
      console.error('Failed to fetch data:', error);
      toastError('Failed to load profile data');
    } 
    finally {
      setLoading(false);
    }
  }, [router, toastError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          bio, 
          dob: dob || null, 
          dpUrl: dpUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
          linkedinUrl: linkedinUrl || null
        })
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess('Profile updated successfully!');
        setProfile(data.data);
      } else {
        toastError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toastError('Failed to update profile');
      console.log(error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    //

    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          theme: theme,
          email_notifications: emailNotifications,
          notification_enabled: notificationEnabled
        })
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess('Settings updated successfully!');
        setSettings(data.data);
      } else {
        toastError(data.message || 'Failed to update settings');
      }
    } 
    catch (error) {
      toastError('Failed to update settings');
      console.log(error);
    }
  };

  const handleUnblockUser = async (blockedUserId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/unblock/${blockedUserId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        toastSuccess('User unblocked successfully!');
        setBlockedUsers(blockedUsers.filter(u => u.blocked_id !== blockedUserId));
      } else {
        toastError(data.message || 'Failed to unblock user');
      }
    } 
    catch (error) {
      toastError('Failed to unblock user');
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Replace confirm with toast and a custom confirmation
    toastInfo('Logout is not undoable. Logging out...');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleShareProfile = async () => {
    if (!profile) return;
    try {
      const profileUrl = `${window.location.origin}/profile/${profile.roll_no}`;
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0c6780',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
      setQrCodeUrl(qrDataUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toastError('Failed to generate QR code');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    //
    // Remove confirm, just show a warning toast
    toastWarning('Deleting your account is permanent.');

    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await res.json();
      if (data.success) {
        toastSuccess('Account deleted successfully.');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        toastError(data.message || 'Failed to delete account');
      }
    } 
    catch (error) {
      toastError('Failed to delete account');
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface overflow-hidden">
        {/* TopNavBar Skeleton */}
        <nav className="flex justify-between items-center px-8 h-16 w-full fixed top-0 z-40 glass-nav">
          <div className="flex items-center gap-8">
            <div className="h-8 w-40 bg-surface-container-high rounded animate-pulse" />
            <div className="hidden md:flex gap-6">
              <div className="h-4 w-16 bg-surface-container-high rounded animate-pulse" />
              <div className="h-4 w-16 bg-surface-container-high rounded animate-pulse" />
              <div className="h-4 w-20 bg-surface-container-high rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-48 bg-surface-container-high rounded-full animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
          </div>
        </nav>

        {/* Main Content Background */}
        <main className="pt-24 pb-32 px-8 grid grid-cols-12 gap-8 opacity-40 blur-sm pointer-events-none">
          <div className="col-span-8 flex flex-col gap-12">
            <div className="h-64 signature-gradient rounded-lg w-full flex items-end p-8">
              <div className="h-12 w-48 bg-white/30 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg h-80" />
              <div className="bg-white p-8 rounded-lg h-80" />
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-8">
            <div className="bg-surface-container p-6 rounded-lg h-96" />
            <div className="bg-surface-container p-6 rounded-lg h-48" />
          </div>
        </main>

        {/* Modal Overlay Skeleton */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/10 dark:bg-on-background/30 backdrop-blur-md p-2 sm:p-4 md:p-6">
          <div className="w-full h-full md:w-[90%] md:h-[90%] lg:w-[85%] lg:h-[85%] bg-surface rounded-lg shadow-[0px_20px_60px_rgba(0,32,32,0.1)] flex flex-col md:flex-row overflow-hidden">
            {/* SideNavBar Skeleton */}
            <aside className="flex flex-col w-full md:w-64 lg:w-72 md:h-full py-4 md:py-8 px-3 md:px-4 bg-surface-container-low/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-outline-variant/15 shrink-0">
              <div className="px-2 md:px-4 mb-4 md:mb-10 space-y-2">
                <div className="h-6 md:h-8 w-24 bg-surface-container-high rounded animate-pulse" />
                <div className="h-3 md:h-4 w-32 bg-surface-container-high rounded animate-pulse" />
              </div>
              <nav className="flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 shrink-0">
                    <div className="w-5 h-5 rounded bg-surface-container-high animate-pulse" />
                    <div className="h-4 w-16 md:w-24 bg-surface-container-high rounded animate-pulse" />
                  </div>
                ))}
              </nav>
              <div className="hidden md:block mt-auto px-4">
                <div className="flex items-center justify-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
                  <div className="w-10 h-10 rounded-full bg-surface-container-high animate-pulse" />
                </div>
              </div>
            </aside>

            {/* Right Content Area Skeleton */}
            <div className="flex-1 overflow-y-auto bg-surface-container-lowest p-4 sm:p-6 md:p-8 lg:p-12 pb-24 md:pb-28">
              {/* Profile Header Card Skeleton */}
              <div className="relative bg-surface-container-low rounded-lg p-4 sm:p-6 md:p-8 mb-6 md:mb-12 flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface-container shadow-lg bg-surface-container-high animate-pulse shrink-0" />
                <div className="flex-1 space-y-4 w-full">
                  <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-10 w-full bg-surface-container-high rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Form Skeleton */}
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-surface-container-high rounded animate-pulse" />
                    <div className="h-12 w-full bg-surface-container-high rounded-lg animate-pulse" />
                  </div>
                ))}
                <div className="h-12 w-32 bg-surface-container-high rounded-xl animate-pulse mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface text-on-surface overflow-hidden flex items-center justify-center p-6">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md animate-scale-in">
          <span className="material-symbols-outlined text-5xl text-error mb-4 block">warning</span>
          <h2 className="text-xl font-bold mb-2 text-on-surface">Failed to load profile</h2>
          <p className="text-sm mb-6 text-on-surface-variant">Unable to load your profile data. Please try again.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-md font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity">Retry</button>
            <Link href="/dashboard" className="btn-ghost px-5 py-2.5">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-hidden">
      {/* TopNavBar */}
      <nav className="flex justify-between items-center px-8 h-16 w-full fixed top-0 z-40 glass-nav transition-all duration-300">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tight text-primary">The Digital Dorm</span>
          <div className="hidden md:flex gap-6">
            <a className="font-bold uppercase tracking-widest text-xs text-primary" href="#">Explore</a>
            <a className="uppercase tracking-widest text-xs text-on-surface-variant hover:bg-surface-container p-1 rounded transition-all" href="#">Events</a>
            <a className="uppercase tracking-widest text-xs text-on-surface-variant hover:bg-surface-container p-1 rounded transition-all" href="#">Marketplace</a>
          </div>
        </div>
          <div className="flex items-center gap-4">
          <div className="bg-surface-container rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface" placeholder="Search campus..." type="text"/>
          </div>
          <button onClick={() => toggleTheme()} className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full" aria-label="Toggle theme">
            <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={handleLogout} className="material-symbols-outlined p-2 rounded-full transition-all hover:bg-surface-container text-primary">logout</button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            {profile?.dp_url ? (
              <Image
                src={profile.dp_url}
                alt={profile.name || 'Profile'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-lg">person</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Background (Dimmed/Blurred) */}
      <main className="pt-24 pb-32 px-8 grid grid-cols-12 gap-8 opacity-40 blur-sm pointer-events-none dark:opacity-20 dark:blur-none">
        <div className="col-span-8 flex flex-col gap-12">
          <div className="h-64 signature-gradient rounded-lg w-full flex items-end p-8">
            <h1 className="text-white text-5xl font-extrabold tracking-tight headline">Campus Feed</h1>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg h-80"></div>
            <div className="bg-white p-8 rounded-lg h-80"></div>
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container p-6 rounded-lg h-96"></div>
          <div className="bg-surface-container p-6 rounded-lg h-48"></div>
        </div>
      </main>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/10 dark:bg-on-background/30 backdrop-blur-md p-2 sm:p-4 md:p-6">
        <div className="w-full h-full md:w-[90%] md:h-[90%] lg:w-[85%] lg:h-[85%] bg-surface rounded-lg shadow-[0px_20px_60px_rgba(0,32,32,0.1)] flex flex-col md:flex-row overflow-hidden">
          {/* SideNavBar */}
            <aside className="flex flex-col w-full md:w-64 lg:w-72 md:h-full py-4 md:py-8 px-3 md:px-4 bg-surface-container-low/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-outline-variant/15 shrink-0">
            <div className="px-2 md:px-4 mb-4 md:mb-10">
              <h2 className="text-xl md:text-2xl font-extrabold text-primary">Settings</h2>
              <p className="text-xs md:text-sm font-medium text-on-surface-variant">Student Account</p>
            </div>
            <nav className="flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'text-on-surface font-bold border-b-2 md:border-b-0 md:border-r-4 border-primary bg-primary-container/20 rounded-t-lg md:rounded-t-none md:rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg md:rounded-r-lg group'
                }`}
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span className="hidden sm:inline">Profile Info</span>
                <span className="sm:hidden">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'text-on-surface font-bold border-b-2 md:border-b-0 md:border-r-4 border-primary bg-primary-container/20 rounded-t-lg md:rounded-t-none md:rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg md:rounded-r-lg group'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'privacy'
                    ? 'text-on-surface font-bold border-b-2 md:border-b-0 md:border-r-4 border-primary bg-primary-container/20 rounded-t-lg md:rounded-t-none md:rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg md:rounded-r-lg group'
                }`}
              >
                <span className="material-symbols-outlined text-sm">notifications</span>
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </button>
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'blocks'
                    ? 'text-on-surface font-bold border-b-2 md:border-b-0 md:border-r-4 border-primary bg-primary-container/20 rounded-t-lg md:rounded-t-none md:rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg md:rounded-r-lg group'
                }`}
              >
                <span className="material-symbols-outlined text-sm">block</span>
                <span className="hidden sm:inline">Blocked IDs</span>
                <span className="sm:hidden">Blocked</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-4 transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'text-on-surface font-bold border-b-2 md:border-b-0 md:border-r-4 border-primary bg-primary-container/20 rounded-t-lg md:rounded-t-none md:rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 rounded-lg md:rounded-r-lg group'
                }`}
              >
                <span className="material-symbols-outlined text-sm">security</span>
                <span>Security</span>
              </button>
            </nav>
            <div className="hidden md:block mt-auto px-4">
              <div className="flex items-center justify-center gap-3 py-3">
                <button onClick={() => toggleTheme()} className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full shadow hover:opacity-90 transition" aria-label="Toggle theme">
                  <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                </button>
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full shadow hover:opacity-90 transition" aria-label="Close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto bg-surface-container-lowest p-4 sm:p-6 md:p-8 lg:p-12 pb-24 md:pb-28">
            {/* Profile Header Card */}
            <div className="relative bg-surface-container-low rounded-lg p-4 sm:p-6 md:p-8 mb-6 md:mb-12 flex flex-col md:flex-row items-center gap-4 md:gap-10">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface-container shadow-lg overflow-hidden">
                  {profile?.dp_url ? (
                    <Image
                      src={profile.dp_url}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl">person</span>
                    </div>
                  )}
                </div>
                {/* camera overlay removed per user request */}
              </div>
              <div className="text-center md:text-left flex-1 min-w-0">
                <h3 className="text-xl md:text-3xl font-extrabold text-primary mb-1 truncate">{profile.name}</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">ID: {profile.roll_no}</span>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">{profile.branch}</span>
                </div>
                <p className="text-secondary body max-w-lg leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
              </div>
              <div className="md:absolute md:top-8 md:right-8 mt-4 md:mt-0">
                <button
                  onClick={handleShareProfile}
                  className="bg-primary text-white px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  <span className="hidden sm:inline">Share Profile</span>
                  <span className="sm:hidden">Share</span>
                </button>
              </div>
            </div>

            {/* Profile Info Grid (Active Tab Content) */}
            <div className="space-y-10">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-primary">Personal Details</h4>
                    <span className="text-xs font-bold text-outline uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-6 md:gap-y-10">
                    <div className="group">
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">Full Name</label>
                      <p className="text-lg font-semibold text-on-surface border-b border-surface-variant pb-2 group-hover:border-primary transition-colors">{profile.name}</p>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">Roll Number</label>
                      <p className="text-lg font-semibold text-on-surface border-b border-surface-variant pb-2 group-hover:border-primary transition-colors">{profile.roll_no}</p>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">Branch/Department</label>
                      <p className="text-lg font-semibold text-on-surface border-b border-surface-variant pb-2 group-hover:border-primary transition-colors">{profile.branch}</p>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">Student ID Card</label>
                      <div className="flex items-center gap-3 border-b border-surface-variant pb-2 group-hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        <p className="text-lg font-semibold text-on-surface">{profile.is_verified ? 'Verified ID Status' : 'Unverified'}</p>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2 transition-colors group-focus-within:text-primary">Account Created</label>
                      <p className="text-lg font-semibold text-on-surface border-b border-surface-variant pb-2 group-hover:border-primary transition-colors">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Contributor section removed per design request */}
                </>
              )}

              {/* Edit Profile Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h4 className="text-xl font-bold mb-6 text-primary">Edit Profile</h4>
                  <form onSubmit={handleUpdatePersonal} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-on-surface">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:ring-0 resize-none bg-surface-container text-on-surface"
                        placeholder="Tell us about yourself…"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-on-surface">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full py-2.5 px-3 border border-outline rounded-xl focus:border-primary focus:ring-0 shadow-sm bg-surface-container text-on-surface"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-lg text-primary">photo_camera</span>
                        <h3 className="text-sm font-bold text-on-surface">Profile Picture</h3>
                      </div>
                      <ProfileImageManager
                        currentImageUrl={profile?.dp_url || undefined}
                        onUploadSuccess={(url: string) => {
                          setDpUrl(url);
                          if (profile) setProfile({ ...profile, dp_url: url });
                          toastSuccess('Profile picture updated!');
                        }}
                        onDeleteSuccess={() => {
                          setDpUrl('');
                          if (profile) setProfile({ ...profile, dp_url: null });
                          toastSuccess('Profile picture removed!');
                        }}
                      />
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-surface-container rounded-lg p-5 space-y-4">
                      <p className="text-sm font-semibold uppercase mb-1 text-on-surface">Social Media Links</p>
                      <p className="text-xs mb-4 text-on-surface-variant">Add links to your social media profiles</p>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-on-surface">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:ring-0 bg-surface-container text-on-surface"
                          placeholder="https://instagram.com/username"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-on-surface">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Twitter / X
                        </label>
                        <input
                          type="url"
                          value={twitterUrl}
                          onChange={(e) => setTwitterUrl(e.target.value)}
                          className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:ring-0 bg-surface-container text-on-surface"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-on-surface">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:ring-0 bg-surface-container text-on-surface"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-md">Save Changes</button>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h4 className="text-xl font-bold mb-6 text-primary">Notifications</h4>
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div className="bg-surface-container rounded-lg p-5">
                      <h5 className="font-semibold mb-4 text-on-surface">Notification Preferences</h5>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-on-surface">Email Notifications</label>
                            <p className="text-xs text-on-surface-variant">Receive updates via email</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-on-surface">Push Notifications</label>
                            <p className="text-xs text-on-surface-variant">Receive push notifications</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationEnabled}
                            onChange={(e) => setNotificationEnabled(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity">Save Settings</button>
                  </form>
                </div>
              )}

              {/* Blocked IDs Tab */}
              {activeTab === 'blocks' && (
                <div>
                  <h4 className="text-xl font-bold mb-6 text-primary">Blocked IDs</h4>
                  {blockedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">block</span>
                      <p className="text-sm text-on-surface-variant">You haven&apos;t blocked any users yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blockedUsers.map((user) => (
                        <div key={user.blocked_id} className="bg-surface-container rounded-lg p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {user.is_anonymous_block ? (
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-on-secondary-container font-bold text-sm bg-secondary-container">
                                ?
                              </div>
                            ) : (
                              <Image
                                src={user.dp_url || '/default-avatar.png'}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-sm text-on-surface">
                                {user.name}
                                {user.is_anonymous_block && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-tertiary-container text-on-tertiary-container">Anon</span>
                                )}
                              </p>
                              <p className="text-xs text-on-surface-variant">
                                {user.is_anonymous_block ? user.gender : user.roll_no}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnblockUser(user.blocked_id)}
                            className="px-3 py-1.5 rounded-lg font-medium text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary">Security</h4>

                  {/* Logout */}
                  <div className="bg-surface-container rounded-lg p-5 border border-outline-variant">
                    <h5 className="font-semibold text-on-surface mb-1">Logout</h5>
                    <p className="text-sm mb-4 text-on-surface-variant">Sign out from your account on this device.</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Logout from Account
                    </button>
                  </div>

                  {/* Reset password */}
                  <div className="bg-primary-container/30 rounded-lg p-5 border border-primary/30">
                    <h5 className="font-semibold text-on-primary-container mb-1">Change Password</h5>
                    <p className="text-sm mb-4 text-on-surface-variant">Reset your password via OTP on the login page.</p>
                    <Link
                      href="/forgot-password"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-primary text-on-primary hover:opacity-90 transition-colors"
                    >
                      Reset Password
                    </Link>
                  </div>

                  {/* Delete account */}
                  <div className="bg-error-container rounded-lg p-5 border border-error">
                    <h5 className="font-semibold text-error mb-1">Danger Zone</h5>
                    <p className="text-sm mb-4 text-on-surface-variant">Deleting your account is permanent and cannot be undone.</p>
                    <form onSubmit={handleDeleteAccount} className="space-y-3">
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password to confirm"
                        required
                        className="w-full p-3 border border-outline rounded-lg focus:border-error focus:ring-0 bg-surface text-on-surface"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                      >
                        Delete Account Permanently
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Bottom-left quick actions: theme toggle and cut (close) */}
          
        </div>
      </div>

      {/* BottomNavBar */}
      {/* Floating Bottom Dock (matches dashboard style) */}
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
        {/* Home */}
        <Link
          href="/dashboard"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="Home"
        >
          <span className="material-symbols-outlined text-xl">home</span>
        </Link>
        {/* IDs */}
        <Link
          href="/my-identities"
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300"
          title="IDs"
        >
          <span className="material-symbols-outlined text-xl">badge</span>
        </Link>
        {/* Settings - active */}
        <Link
          href="/profile/edit"
          className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full transition-all duration-300"
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
        </Link>
      </nav>

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="glass-strong rounded-3xl p-8 max-w-md w-full animate-scale-in relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-on-surface">Share Profile</h2>
                  <p className="text-sm text-on-surface-variant">Scan to connect</p>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-all text-on-surface-variant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* QR Code with profile info */}
              <div className="relative mb-6">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 rounded-3xl blur-sm opacity-75 bg-linear-to-br from-primary to-secondary-container" />

                <div className="relative bg-surface-container-low rounded-2xl p-6">
                  {/* Profile mini header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                      {profile?.dp_url ? (
                        <Image
                          src={profile.dp_url}
                          alt={profile.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-primary-container">person</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{profile?.name}</h3>
                      <p className="text-sm text-on-surface-variant">{profile?.roll_no}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex items-center justify-center">
                    {qrCodeUrl && (
                      <div className="relative">
                        <Image
                          src={qrCodeUrl}
                          alt="Profile QR Code"
                          width={280}
                          height={280}
                          className="w-full h-auto"
                          style={{ maxWidth: '280px' }}
                        />
                        {/* Logo overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-surface rounded-full p-2 shadow-lg">
                            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-on-primary text-sm">school</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${profile?.roll_no}-profile-qr.png`;
                    link.href = qrCodeUrl;
                    link.click();
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${profile?.roll_no}`);
                    toastSuccess('Profile link copied!');
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 bg-surface-container text-on-surface rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
