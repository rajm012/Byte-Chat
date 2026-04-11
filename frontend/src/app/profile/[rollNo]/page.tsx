'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlockUserButton } from '@/components/ModerationComponents';
import { checkIfBlocked } from '@/services/moderation.service';
import Image from 'next/image';
import QRCode from 'qrcode';

// Explicit types for profile and API responses
interface Profile {
  user_id: string;
  name: string;
  dp_url?: string;
  roll_no: string;
  branch?: string;
  bio?: string;
  is_verified?: boolean;
  gender?: string;
  dob?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  blocked?: boolean;
  blockMessage?: string;
}
export default function ViewProfile() {
  const params = useParams();
  const router = useRouter();
  const rollNo = params.rollNo as string;
  // need proper error handling
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [, setBlockMessage] = useState<string>('');
  const [, setBlockedByOther] = useState<boolean>(false);
  const [navigating, setNavigating] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchProfile = useCallback(async () => {
    try {
      // Fetch current user's profile to check if it's their own profile
      const { API_BASE_URL } = await import('../../../services/apiBase');
      const myProfileResponse = await fetch(`${API_BASE_URL}/api/profile/me`, {
        credentials: 'include'
      });
      const myProfileData = await myProfileResponse.json() as ApiResponse<{ roll_no: string }>;
      if (myProfileData.success) {
        setIsOwnProfile(myProfileData.data.roll_no.toUpperCase() === rollNo.toUpperCase());
      }

      // Fetch the requested profile
      const response = await fetch(`${API_BASE_URL}/api/profile/${rollNo}`, {
        credentials: 'include'
      });

      const data = await response.json() as ApiResponse<Profile> & { blocked?: boolean; blockMessage?: string };

      if (response.status === 403) {
        // User is blocked by the profile owner
        setBlockedByOther(true);
        setError(data.message || 'This user has blocked you');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setProfile(data.data);

        // Check if current user blocked this profile
        if (data.blocked) {
          setBlockMessage(data.blockMessage || 'You have blocked this user');
        }

        // Check block status if not own profile
        if (!isOwnProfile && data.data.user_id) {
          try {
            const blockStatus = await checkIfBlocked(data.data.user_id);
            setIsBlocked(blockStatus.data.isBlocked);
          } catch (err) {
            console.error('Failed to check block status:', err);
          }
        }
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    }
    catch (err) {
      setError('Failed to load profile');
      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  }, [rollNo, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  const handleBlockStatusChange = () => {
    fetchProfile(); // Refresh profile after blocking/unblocking
  };

  const handleStartChat = (userId: string, isAnonymous: boolean = false) => {
    if (navigating) return; // Prevent double-clicks
    setNavigating(true);
    router.push(`/chat/new?userId=${userId}&anonymous=${isAnonymous}`);
  };

  const handleShareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${rollNo}`;
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1a1a2e',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      setQrCodeUrl(qrDataUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-4 border-[#87ceeb] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm shadow-2xl">
          <div className="text-4xl mb-4">😕</div>
          <p className="font-semibold mb-6 text-[#002020]">{error || 'Profile not found'}</p>
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
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[75vh] md:h-160 bg-surface-container-lowest dark:bg-surface-container rounded-3xl shadow-[0_40px_80px_rgba(0,32,32,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#002020] hover:bg-gray-100 transition-all duration-300 shadow-lg active:scale-90 dark:bg-[#004a4a] dark:text-white dark:hover:bg-[#005555]"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Content Canvas */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Visual Profile */}
          <div className="w-full md:w-5/12 relative h-64 md:h-full bg-surface-container-low overflow-hidden">
            {profile.dp_url ? (
              <Image 
                src={profile.dp_url} 
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-secondary-container">
                <span className="text-6xl font-bold text-white">{profile.name?.charAt(0).toUpperCase() || '?'}</span>
              </div>
            )}
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg" />
                <span className="text-white font-medium text-xs uppercase tracking-widest">{profile.is_verified ? 'Verified' : 'Member'}</span>
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mt-2 tracking-tight">{profile.name}</h2>
              <p className="text-white/80 text-lg">{profile.roll_no}</p>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="w-full md:w-7/12 p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto">
            <div className="space-y-8">
              {/* Metadata Bento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-5 rounded-2xl dark:bg-surface-container-high">
                  <span className="text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]">Roll Number</span>
                  <p className="text-on-surface font-bold text-xl mt-1">{profile.roll_no}</p>
                </div>
                <div className="bg-surface-container p-5 rounded-2xl dark:bg-surface-container-high">
                  <span className="text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]">Branch</span>
                  <p className="text-on-surface font-bold text-xl mt-1">{profile.branch?.toUpperCase() || 'N/A'}</p>
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="space-y-3">
                  <h3 className="text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    About
                  </h3>
                  <p className="text-on-surface text-lg leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Interests / Tags */}
              <div className="flex flex-wrap gap-3">
                {profile.gender && (
                  <span className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-sm uppercase">
                    {profile.gender}
                  </span>
                )}
                {profile.is_verified && (
                  <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Verified
                  </span>
                )}
                {profile.dob && (
                  <span className="px-4 py-2 rounded-full bg-[#f9b1bc] text-[#331019] font-medium text-sm dark:bg-[#7f4e52] dark:text-white">
                    🎂 {new Date(profile.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Social Links */}
              {(profile.instagram_url || profile.twitter_url || profile.linkedin_url) && (
                <div className="space-y-3">
                  <h3 className="text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.instagram_url && (
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {profile.twitter_url && (
                      <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065z"/></svg>
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isOwnProfile ? (
                <>
                  <Link href="/profile/edit" className="sm:col-span-2">
                    <button className="w-full bg-linear-to-r from-primary via-secondary-container to-tertiary-container h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-on-primary font-bold text-lg">
                      <span className="material-symbols-outlined">edit</span>
                      Edit Profile
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartChat(profile.user_id, false)}
                    disabled={isBlocked || navigating}
                    className="bg-[#0c6780] h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg dark:bg-[#87ceeb] dark:text-[#002020]"
                  >
                    <span className="material-symbols-outlined">chat_bubble</span>
                    Chat
                  </button>
                  <button
                    onClick={() => handleStartChat(profile.user_id, true)}
                    disabled={isBlocked || navigating}
                    className="bg-surface-container h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-surface-container-high hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-on-surface font-bold text-lg border-2 border-outline-variant/30 dark:bg-surface-container-high dark:hover:bg-surface-container-highest"
                  >
                    <span className="material-symbols-outlined">visibility_off</span>
                    Anonymous
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="bg-secondary-container h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary-fixed-dim hover:shadow-md active:scale-95 text-on-secondary-container font-semibold"
                  >
                    <span className="material-symbols-outlined">qr_code</span>
                    Share QR
                  </button>
                  <div className="flex items-center justify-center">
                    <BlockUserButton 
                      userId={profile.user_id} 
                      userName={profile.name}
                      isBlocked={isBlocked} 
                      onBlockStatusChange={handleBlockStatusChange} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Dock Navigation - Icons Only */}
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 rounded-full backdrop-blur-md border shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-white/90 border-[#d2f5f4] dark:bg-[#003535]/90 dark:border-[#004a4a] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        {/* Chats */}
        <Link
          href="/chat"
          className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]"
          title="Chats"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </Link>
        {/* Groups */}
        <Link
          href="/my-groups"
          className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]"
          title="Groups"
        >
          <span className="material-symbols-outlined text-xl">group</span>
        </Link>
        {/* Home */}
        <Link
          href="/dashboard"
          className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]"
          title="Home"
        >
          <span className="material-symbols-outlined text-xl">home</span>
        </Link>
        {/* IDs */}
        <Link
          href="/my-identities"
          className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]"
          title="IDs"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
        </Link>
        {/* Settings */}
        <Link
          href="/profile/edit"
          className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]"
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
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
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: 'var(--grad-romance)' }}></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: 'var(--grad-ocean)' }}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--heading)' }}>Share Profile</h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Scan to connect</p>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-all"
                  style={{ color: 'var(--muted)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* QR Code with profile info */}
              <div className="relative mb-6">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 rounded-3xl blur-sm opacity-75" style={{ background: 'var(--grad-romance)' }}></div>

                <div className="relative bg-white rounded-3xl p-6">
                  {/* Profile info at top */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    {profile.dp_url ? (
                      <Image
                        src={profile.dp_url}
                        alt={profile.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: 'var(--grad-romance)' }}>
                        {profile.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{profile.name}</p>
                      <p className="text-sm text-gray-500">{profile.roll_no}</p>
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
                        />
                        {/* Center logo overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ background: 'var(--grad-romance)' }}>
                            {profile.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer text */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-500 font-medium">
                      Scan with camera to view profile
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${rollNo}-profile-qr.png`;
                    link.href = qrCodeUrl;
                    link.click();
                  }}
                  className="btn-romance flex-1 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR
                </button>
                <button
                  onClick={() => {
                    const profileUrl = `${window.location.origin}/profile/${rollNo}`;
                    navigator.clipboard.writeText(profileUrl);
                  }}
                  className="btn-ghost px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
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
