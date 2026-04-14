'use client';

import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { FiFileText, FiUsers, FiShield, FiMessageCircle, FiLock, FiGrid, FiCpu, FiUserX, FiAlertTriangle, FiMail } from 'react-icons/fi';
import { useEffect, useState } from 'react';

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

export default function TermsAndConditions() {
  const { info: toastInfo } = useToast();
  const [dark, setDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-mesh-warm antialiased">
      {/* Navigation Header */}
      <nav className="glass-nav fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo - Link to Home */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-on-surface">
              Byte<span className="text-primary">Chat</span>
            </span>
          </Link>

          {/* Dark/Light Mode Toggle */}
          <button
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setDark(d => !d)}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--outline)', background: 'var(--surface-container)' }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--primary)' }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </nav>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-linear-to-br from-primary-container/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-linear-to-tr from-tertiary-container/15 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto pt-20 sm:pt-24 px-4 pb-12">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-linear-to-br from-primary-container via-secondary-container to-tertiary-container opacity-30" />
          <div className="relative glass-strong p-8 sm:p-12 text-center border border-white/20 dark:border-white/10">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-surface mb-6 shadow-xl">
              <FiFileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 text-on-surface">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
              The rules that keep our campus community safe, respectful, and awesome.
            </p>
            <p className="text-xs text-on-surface-variant/70 mt-4">Last Updated: February 10, 2026</p>
          </div>
        </div>

        <div className="space-y-8">
            {/* Welcome Card */}
            <section className="glass-strong rounded-2xl p-6 sm:p-8 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                  <span className="text-2xl">👋</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-3">Welcome to BYTE-CHAT</h2>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    By accessing or using this application, you agree to be bound by these Terms and Conditions.
                    This platform is designed exclusively for college students to connect, communicate, and build a supportive campus community.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { num: '12', label: 'Sections', color: 'primary' },
                { num: '18+', label: 'Age Required', color: 'secondary' },
                { num: '100%', label: 'Student Verified', color: 'tertiary' },
                { num: '0', label: 'Tolerance for Abuse', color: 'error' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                  <p className={`text-2xl sm:text-3xl font-black text-${stat.color}`}>{stat.num}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* 1. User Eligibility */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">1. User Eligibility</h2>
              </div>
              <div className="glass rounded-2xl p-5 mb-4 border-l-4 border-primary bg-primary/5">
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">College Students Only:</strong>{' '}
                  This platform is exclusively for currently enrolled college students. You must use your official college email for registration.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'You must be at least 18 years of age',
                  'You must be currently enrolled in a recognized educational institution',
                  'You must verify your identity through your college email',
                  'You agree to provide accurate and up-to-date information',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs">✓</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. User Conduct */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">2. User Conduct &amp; Responsibilities</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">As a member of our campus community, you agree to:</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Treat all users with respect and courtesy",
                  "Use appropriate language in all communications",
                  "Respect other's privacy and personal boundaries",
                  "Not engage in harassment, bullying, or hate speech",
                  "Not share inappropriate or offensive content",
                  "Not impersonate others or create fake accounts",
                  "Not use the platform for commercial or promotional purposes",
                  "Report any violations of these terms to administrators",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-tertiary-container/50 flex items-center justify-center shrink-0">
                      <span className="text-tertiary text-xs font-bold">{i + 1}</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Content Disclaimer */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">3. Content Disclaimer</h2>
              </div>
              <div className="glass rounded-2xl p-5 mb-4 border-l-4 border-amber-500 bg-amber-500/5">
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">Important:</strong>{' '}
                  All conversations, messages, and content shared on this platform are the sole responsibility of the users who create them.
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm font-semibold mb-3 text-on-surface">We are NOT responsible for:</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Any conversations, messages, or content shared between users",
                    "The accuracy, completeness, or reliability of user-generated content",
                    "Any agreements, arrangements, or relationships formed through the platform",
                    "Any disputes, conflicts, or issues arising from user interactions",
                    "Any emotional, psychological, or physical consequences of using the platform",
                    "Loss of data, messages, or content due to technical issues",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span className="text-amber-500">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Privacy & Data */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">4. Privacy &amp; Data</h2>
              </div>
              <div className="glass rounded-2xl p-5 mb-4">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Your privacy is important to us. Please review our{' '}
                  <Link href="/privacy" className="underline hover:opacity-80 text-primary">Privacy Policy</Link>{' '}
                  to understand how we collect, use, and protect your information.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "We collect only necessary information for platform functionality",
                  "We do not sell your personal information to third parties",
                  "You can delete your account and data at any time",
                  "Messages may be monitored for safety and security purposes",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs">✓</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Anonymous Features */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <FiMessageCircle className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">5. Anonymous Features</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">
                Our platform offers anonymous chat features. While we respect your desire for anonymity:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Anonymity does not grant permission to abuse, harass, or harm others",
                  "We reserve the right to reveal identities in cases of serious violations",
                  "Illegal activities will be reported to appropriate authorities",
                  "Repeated violations may result in permanent account suspension",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-4">
                    <span className="w-6 h-6 rounded-full bg-secondary-container/50 flex items-center justify-center shrink-0">
                      <span className="text-secondary text-xs font-bold">{i + 1}</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Groups & Communities */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiGrid className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">6. Groups &amp; Communities</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Group creators and admins are responsible for moderating their groups",
                  "We may remove groups that violate our policies",
                  "Public groups are visible to all platform users",
                  "Private groups require invitation to join",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                      <span className="text-tertiary text-xs">✓</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Intellectual Property */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiCpu className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">7. Intellectual Property</h2>
              </div>
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">Y</span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Your Content</p>
                    <p className="text-xs text-on-surface-variant">You retain ownership of any content you create and share on the platform.</p>
                  </div>
                </div>
                <div className="border-t border-outline-variant/30" />
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-tertiary text-xs font-bold">P</span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Platform Content</p>
                    <p className="text-xs text-on-surface-variant">All platform features, design, and functionality are owned by Digital Campus Psychology and protected by copyright and intellectual property laws.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Account Termination */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FiUserX className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">8. Account Termination</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">We reserve the right to suspend or terminate accounts that:</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Violate these Terms and Conditions",
                  "Engage in abusive or harmful behavior",
                  "Share inappropriate or illegal content",
                  "Attempt to hack, spam, or disrupt the platform",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <span className="text-red-500 text-xs">•</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3 glass rounded-xl p-3">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-xs">•</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-on-surface-variant">Are inactive for extended periods (after notification)</span>
                    <button
                      type="button"
                      onClick={() => toastInfo('You will be notified if your account is inactive for a long period.')}
                      className="text-xs underline hover:opacity-80 text-primary"
                    >
                      What does this mean?
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. Limitation of Liability */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 text-on-surface-variant" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">9. Limitation of Liability</h2>
              </div>
              <div className="glass rounded-2xl p-5 border-l-4 border-tertiary">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  This platform is provided &quot;as-is&quot; without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform, including but not limited to loss of data, missed connections, relationship outcomes, or academic consequences.
                </p>
              </div>
            </section>

            {/* 10. Changes to Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">10. Changes to Terms</h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or in-app notifications. Continued use of the platform after changes constitutes acceptance of the updated terms.
                </p>
              </div>
            </section>

            {/* 11. Governing Law */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">11. Governing Law</h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  These terms are governed by the applicable laws of India. Any disputes will be resolved through appropriate legal channels in accordance with Indian law.
                </p>
              </div>
            </section>

            {/* 12. Contact Us */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">12. Contact Us</h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  If you have any questions about these Terms and Conditions, please contact us at{' '}
                  <Link href="/contact" className="underline hover:opacity-80 text-primary">our contact page</Link>
                  {' '}or email us at{' '}
                  <a href="mailto:contact@bytechat.in" className="underline hover:opacity-80 text-primary">
                    contact@bytechat.in
                  </a>.
                </p>
              </div>
            </section>

            {/* Acceptance box */}
            <div className="glass-strong rounded-2xl p-6 text-center border border-green-500/20 bg-green-500/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-green-500 text-xl">✓</span>
                <p className="text-sm font-semibold text-on-surface">By using BYTE-CHAT, you accept these terms</p>
              </div>
              <p className="text-xs text-on-surface-variant">
                If you do not agree, please discontinue use of the platform.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 flex flex-wrap items-center justify-center gap-4 text-sm border-t border-outline-variant/30">
            <Link href="/privacy" className="hover:underline text-on-surface-variant">Privacy Policy</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/encryption" className="hover:underline text-on-surface-variant">Encryption</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/contact" className="hover:underline text-on-surface-variant">Contact Developers</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/" className="hover:underline text-on-surface-variant">Back to Home</Link>
          </div>
        </div>
      </div>
    // </div>
  );
}
