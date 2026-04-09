'use client';

import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { FiShield, FiUsers, FiLock, FiEye, FiServer, FiTrash2, FiMail } from 'react-icons/fi';
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

export default function PrivacyPolicy() {
  const { info: toastInfo } = useToast();
  const [dark, setDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-mesh-warm antialiased">
      {/* Navigation Header */}
      <nav className="glass-nav fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo - Link to Home */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-on-surface">
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

      <div className="max-w-4xl mx-auto pt-24 px-4 pb-12">

        <div className="glass-strong rounded-3xl p-8 sm:p-12 animate-fade-in border border-white/10 dark:border-white/5">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-primary-container to-tertiary-container mb-6 shadow-lg">
              <FiShield className="w-10 h-10 text-on-primary-container" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-on-surface">
              Privacy Policy
            </h1>
            <p className="text-sm text-on-surface-variant font-medium">Last Updated: February 10, 2026</p>
          </div>

          <div className="space-y-10">
            {/* Commitment */}
            <section className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">Our Commitment to Your Privacy</h2>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-on-surface-variant">
                At Digital Campus Psychology, we understand that your privacy is important. This Privacy Policy explains how we collect,
                use, protect, and handle your personal information. We are committed to transparency and protecting your data.
              </p>
              <div className="glass rounded-2xl p-5 border-l-4 border-primary shadow-sm">
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">Important:</strong>{' '}
                  We are a student-built platform for college students. We do not sell your data to third parties and only use your information to provide and improve our services.
                </p>
              </div>
            </section>

            {/* 1. Information We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">1. Information We Collect</h2>
              </div>

              <div className="glass rounded-2xl p-5 mb-4">
                <h3 className="text-base font-semibold mb-3 text-on-surface">1.1 Information You Provide</h3>
                <ul className="space-y-3">
                  {[
                    ['Account Information', 'Roll number, name, email, gender, branch, date of birth'],
                    ['Profile Information', 'Bio, profile picture, preferences'],
                    ['Messages & Content', 'Text messages, group chats, anonymous conversations'],
                  ].map(([k, v], i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span className="w-6 h-6 rounded-full bg-primary-container/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary text-xs font-bold">{i + 1}</span>
                      </span>
                      <span><strong className="text-on-surface">{k}:</strong> {v}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <span className="w-6 h-6 rounded-full bg-primary-container/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">4</span>
                    </span>
                    <span>
                      <strong className="text-on-surface">Settings:</strong> Privacy preferences, notification settings, theme preferences
                      <button
                        type="button"
                        onClick={() => toastInfo('You can adjust your notification and privacy settings in your profile.')}
                        className="ml-2 text-xs underline hover:opacity-80 text-primary"
                      >
                        Learn more
                      </button>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-base font-semibold mb-3 text-on-surface">1.2 Automatically Collected Information</h3>
                <ul className="space-y-3">
                  {[
                    ['Usage Data', 'Login times, features used, pages visited'],
                    ['Device Information', 'Browser type, operating system, IP address'],
                    ['Activity Data', 'Online status, last seen (if enabled)'],
                  ].map(([k, v], i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                      <span><strong className="text-on-surface">{k}:</strong> {v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 2. How We Use Information */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiEye className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">2. How We Use Your Information</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">We use the information we collect to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Provide and maintain the platform',
                  'Enable communication between students',
                  'Verify your identity and college affiliation',
                  'Personalize your experience',
                  'Improve platform features and functionality',
                  'Ensure platform security and prevent abuse',
                  'Respond to your inquiries and support requests',
                  'Comply with legal obligations',
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

            {/* 3. Information Sharing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiServer className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">3. Information Sharing &amp; Disclosure</h2>
              </div>
              <div className="glass rounded-2xl p-5 mb-5 border-l-4 border-green-500 bg-green-500/5">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  ✅ We DO NOT sell your personal information to third parties.
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-base font-semibold mb-3 text-on-surface">3.1 Public Information (visible to other users)</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Your name, roll number, branch', 'Profile picture and bio', 'Public group memberships', 'Online status (if enabled in settings)'].map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5">
                  <h3 className="text-base font-semibold mb-3 text-on-surface">3.2 We May Share Information:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      ['With Your Consent', 'When you explicitly agree to share information'],
                      ['For Legal Reasons', 'To comply with laws, court orders, or legal processes'],
                      ['Safety & Security', 'To protect users from harm, fraud, or illegal activities'],
                      ['Service Providers', 'Third-party services that help us operate'],
                    ].map(([k, v], i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface-container-low">
                        <p className="text-sm font-semibold text-on-surface mb-1">{k}</p>
                        <p className="text-xs text-on-surface-variant">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. User Responsibility */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-lg">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">4. Your Responsibility for Conversations</h2>
              </div>
              <div className="glass rounded-2xl p-5 mb-5 border-l-4 border-amber-500 bg-amber-500/5">
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">Important Disclaimer:</strong>{' '}
                  You are solely responsible for all conversations, messages, and content you create or share on this platform.
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm font-semibold mb-3 text-on-surface">We are NOT responsible for:</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'The content of your messages and conversations',
                    'How other users interpret or respond to your messages',
                    'Agreements, relationships, or conflicts arising from your interactions',
                    'Any emotional, psychological, or personal consequences of your conversations',
                    'Information you choose to share with other users',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span className="text-amber-500">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed mt-4 p-4 rounded-xl bg-surface-container-low text-on-surface-variant">
                <strong className="text-on-surface">Remember:</strong>{' '}
                All users are college students and should be mature enough to handle their own communications responsibly. Think before you send, and treat others with respect.
              </p>
            </section>

            {/* 5. Data Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">5. Data Security</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">We implement security measures to protect your information:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  'Encrypted passwords using industry-standard hashing (Argon2)',
                  'HTTPS encryption for data transmission',
                  'Secure database with access controls',
                  'Regular security audits and updates',
                  'Two-factor authentication options (where available)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <span className="text-green-500 text-xs">🔒</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
              <div className="glass rounded-2xl p-4 border-l-4 border-primary">
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">However:</strong> No system is 100% secure. We cannot guarantee absolute security, and you use the platform at your own risk.
                </p>
              </div>
            </section>

            {/* 6. Anonymous Features */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <span className="text-xl">🎭</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">6. Anonymous Features &amp; Privacy</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">
                Our anonymous chat features allow users to interact without revealing their identity. However:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'We still collect minimal data to maintain platform safety',
                  'Anonymous interactions are subject to the same code of conduct',
                  'We may reveal identities in cases of serious violations or legal requirements',
                  'Anonymity does not exempt you from legal responsibility',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-4">
                    <span className="w-6 h-6 rounded-full bg-tertiary-container/50 flex items-center justify-center shrink-0">
                      <span className="text-tertiary text-xs font-bold">{i + 1}</span>
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Your Privacy Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">7. Your Privacy Rights</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">You have the right to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Access your personal information',
                  'Correct inaccurate data',
                  'Delete your account and associated data',
                  'Opt out of certain data collection',
                  'Request data portability',
                  'Withdraw consent for data processing',
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

            {/* 8. Data Retention */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">8. Data Retention</h2>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-on-surface-variant">
                We retain your data for as long as your account is active. After account deletion:
              </p>
              <div className="glass rounded-2xl p-5">
                <div className="space-y-3">
                  {[
                    ['30 Days', 'Personal information is deleted within 30 days'],
                    ['Anonymized', 'Messages may be anonymized rather than deleted to maintain conversation context'],
                    ['Legal', 'Legal obligations may require us to retain certain data longer'],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{title}</p>
                        <p className="text-xs text-on-surface-variant">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. Third-Party Services */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                  <FiServer className="w-5 h-5 text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">9. Third-Party Services</h2>
              </div>
              <p className="text-sm mb-4 text-on-surface-variant">We use the following third-party services:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  ['Cloudinary', 'Image storage and optimization', '☁️'],
                  ['Supabase', 'Database and authentication services', '🔋'],
                ].map(([name, desc, icon], i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{icon}</span>
                      <p className="text-sm font-semibold text-on-surface">{name}</p>
                    </div>
                    <p className="text-xs text-on-surface-variant">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant">
                These services have their own privacy policies and we encourage you to review them.
              </p>
            </section>

            {/* 10. Cookies */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-xl">🍪</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">10. Cookies &amp; Local Storage</h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  We use cookies and local storage to maintain your session, remember your preferences, and improve your experience. You can disable cookies in your browser settings, but this may affect platform functionality.
                </p>
              </div>
            </section>

            {/* 11. Age Requirement */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-xl">🔞</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">11. Age Requirement</h2>
              </div>
              <div className="glass rounded-2xl p-5 border-l-4 border-red-400 bg-red-400/5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  This platform is intended for users 18 years of age or older. We do not knowingly collect information from minors. If we discover that a user under 18 has created an account, we will delete their account and associated data.
                </p>
              </div>
            </section>

            {/* 12. Changes */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">12. Changes to This Policy</h2>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notifications. Your continued use of the platform after such changes constitutes your acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* 13. Contact Us */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface">13. Contact Us</h2>
              </div>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us at{' '}
                <Link href="/contact" className="underline hover:opacity-80 text-primary">our contact page</Link>
                {' '}or email{' '}
                <a href="mailto:contact@bytechat.in" className="underline hover:opacity-80 text-primary">
                  contact@bytechat.in
                </a>.
              </p>
            </section>

            {/* In Summary */}
            <div className="glass-strong rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FiLock className="w-5 h-5 text-primary" />
                <p className="text-sm font-bold text-on-surface">In Summary</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'We collect only what we need to run the platform',
                  'We never sell your personal data',
                  'You can delete your account and data anytime',
                  'Passwords are securely hashed with Argon2',
                  'You are responsible for your own conversations',
                  'We may update this policy — check back periodically',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="text-green-500">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 flex flex-wrap items-center justify-center gap-4 text-sm border-t border-outline-variant/30">
            <Link href="/terms" className="hover:underline text-on-surface-variant">Terms &amp; Conditions</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/encryption" className="hover:underline text-on-surface-variant">Encryption</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/contact" className="hover:underline text-on-surface-variant">Contact Developers</Link>
            <span className="text-on-surface-variant">·</span>
            <Link href="/" className="hover:underline text-on-surface-variant">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
