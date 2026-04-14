'use client';

import Link from 'next/link';
import Image from 'next/image';
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

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-64 bg-surface shadow-2xl p-6 flex flex-col gap-4">
        <button onClick={onClose} className="self-end p-2 rounded-full hover:bg-surface-container-high">
          <Icon name="close" className="text-2xl" />
        </button>
        <Link href="/login" className="py-3 px-4 rounded-xl font-semibold hover:bg-surface-container-high transition-colors" onClick={onClose}>
          Sign in
        </Link>
        <Link href="/signup" className="py-3 px-4 rounded-xl font-semibold bg-primary text-on-primary text-center" onClick={onClose}>
          Get Started
        </Link>
      </div>
    </div>
  );
}


// Material Symbols Icon Component (font loaded globally in globals.css)
const Icon = ({ name, className = '', filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}>
    {name}
  </span>
);


export default function Home() {
  const [dark, setDark] = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-mesh-warm antialiased overflow-x-hidden font-headline">

      {/* ── Floating Blob Decorations ─────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-150 h-150 rounded-full blur-3xl" style={{ background: 'rgba(135, 206, 235, 0.2)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full blur-3xl" style={{ background: 'rgba(180, 225, 228, 0.15)' }} />
        <div className="absolute top-[40%] right-[10%] w-100 h-100 rounded-full blur-3xl" style={{ background: 'rgba(249, 177, 188, 0.1)' }} />
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="glass-nav fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-on-surface">
              Byte<span className="text-primary">Chat</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark/Light Mode Toggle Button */}
            <button
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="dark-toggle-btn flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setDark(d => !d)}
              style={{ marginRight: 8, width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--outline)', background: 'var(--surface-container)' }}
            >
              <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--primary)' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-surface-container"
              style={{ color: 'var(--on-surface)' }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="btn-romance px-5 py-2.5 text-sm rounded-xl font-bold"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              onClick={() => setDark(d => !d)}
              style={{ border: '2px solid var(--outline)', background: 'var(--surface-container)' }}
            >
              <span className="material-symbols-outlined text-xl" style={{ color: 'var(--primary)' }}>
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-surface-container-high transition-colors"
              aria-label="Open menu"
            >
              <Icon name="menu" className="text-2xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 glass border" style={{ borderColor: 'rgba(12, 103, 128, 0.2)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Exclusively for IIT Mandi Students
          </div>

          {/* Headline */}
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-4 sm:mb-6 tracking-tight text-on-surface">
            Your Campus.
            <br />
            <span className="text-primary">Your Rules.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto text-on-surface-variant px-2 sm:px-0">
            Organize with your peers in a space built exclusively for your university life. No outsiders, No noise, just Campus Vibes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup" className="btn-sky inline-flex items-center justify-center gap-2">
              Join Now
            </Link>
            <Link href="/login" className="btn-outline-cozy inline-flex items-center justify-center gap-2">
              Visit Campus
            </Link>
          </div>
        </div>

        {/* Hero Image Preview */}
        <div className="mt-12 sm:mt-20 w-full max-w-6xl mx-auto px-2 sm:px-0">
          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video bg-surface-container-high group" style={{ minHeight: '200px' }}>
            <Image
              src="/Hero.png"
              alt="Students collaborating at IIT Mandi campus"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            </div>
        </div>
      </section>

      {/* ── Section 2: Privacy & Encryption ───────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-low" id="privacy">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          <div className="flex-1 space-y-4 sm:space-y-6 w-full">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                <Icon name="shield_lock" className="text-primary text-2xl sm:text-3xl" filled />
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">Secured Connections</h2>
            </div>
            <ul className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <li className="flex items-center gap-3">
                <Icon name="chat" className="text-primary text-lg sm:text-xl" filled />
                <span className="font-semibold text-on-surface text-sm sm:text-base">Real-Time, End-to-End Encrypted.</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="groups" className="text-primary text-lg sm:text-xl" filled />
                <span className="font-semibold text-on-surface text-sm sm:text-base">Groups with no Monitoring.</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="visibility_off" className="text-primary text-lg sm:text-xl" filled />
                <span className="font-semibold text-on-surface text-sm sm:text-base">Anonymous chats to hide your identity.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="glass-card p-4 sm:p-8 rounded-2xl">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                    <span className="text-on-tertiary-container font-bold text-sm sm:text-base">S</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm sm:text-base truncate">anon_er23jrh0bjea2hbj43</p>
                    <p className="text-xs sm:text-sm text-on-surface-variant">Hey, anyone in the North Campus?</p>
                  </div>
                  <span className="text-xs text-primary bg-primary-container px-2 py-1 rounded-full shrink-0">Ghost</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-xl opacity-60">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="text-on-surface-variant font-bold text-sm sm:text-base">?</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm sm:text-base">Hidden User</p>
                    <p className="text-xs sm:text-sm text-on-surface-variant truncate">This message is encrypted...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Ghost Zone (Bento Grid) ─────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="ghost-zone">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-on-surface">
              Talk Anonymously, <span className="text-tertiary">Act Boldly.</span>
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-base sm:text-lg px-2">
              Express yourself without the pressure of your profile picture. Enter the &quot;Ghost Zone&quot; to share thoughts, ask questions, or just vent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Bento Card 1 - Large */}
            <div className="md:col-span-2 bg-linear-to-br from-secondary-container to-white p-6 sm:p-10 rounded-2xl flex flex-col justify-between min-h-75 sm:min-h-100 shadow-lg">
              <div>
                <Icon name="visibility_off" className="text-4xl sm:text-5xl text-secondary mb-4 sm:mb-6" />
                <h3 className="font-headline text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-on-surface">The Ghost Zone</h3>
                <p className="text-on-secondary-container text-base sm:text-lg">
                  One-click anonymity for any channel. Switch between your student identity and a mysterious alias instantly.
                </p>
              </div>
              <div className="flex gap-2 pt-6 sm:pt-8">
                <div className="flex-1 bg-surface-container-high rounded-lg p-3 sm:p-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-xs font-bold text-on-tertiary-container">AS</div>
                  <span className="text-sm text-on-surface-variant">Anonymous Student</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-surface-container-high p-6 sm:p-10 rounded-2xl flex flex-col justify-center text-center space-y-4 sm:space-y-6 shadow-lg">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                <Icon name="theater_comedy" className="text-3xl sm:text-4xl text-tertiary" />
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">Pseudo-Aliasing</h3>
              <p className="text-on-surface-variant text-sm sm:text-base">Get a unique, funny alias every time you enter a thread. &quot;Sleepy Squirrel&quot; or &quot;Coffee Dragon&quot;?</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Student Benefits ───────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="benefits">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
          {/* Main Benefits Row */}
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
            <div className="flex-1 order-2 md:order-1 w-full">
              <div className="rounded-2xl shadow-2xl w-full aspect-4/3 bg-surface-container-high flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/IITMandi.jpeg"
                  alt="IIT Mandi Campus"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23e0f2fe'/%3E%3C/svg%3E"
                />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-4 sm:space-y-6">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">Verified Campus IDs Only</h2>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                No bots, no recruiters, no parents. Access is restricted to users with a valid university email. It&apos;s a sanctuary for those who actually walk the halls.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="font-black text-2xl sm:text-3xl text-primary">100%</h4>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-on-surface-variant">Student Verified</p>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="font-black text-2xl sm:text-3xl text-primary">24/7</h4>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-on-surface-variant">Active Peer Mods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-4 sm:p-6 bg-surface-container rounded-xl space-y-3 sm:space-y-4 border-l-4 border-primary shadow-md">
              <Icon name="local_cafe" className="text-primary text-xl sm:text-2xl" />
              <h5 className="font-bold text-on-surface text-base sm:text-lg">Quick Tea</h5>
              <p className="text-xs sm:text-sm text-on-surface-variant">Instant chat rooms for snacks.</p>
            </div>
            <div className="p-4 sm:p-6 bg-surface-container rounded-xl space-y-3 sm:space-y-4 border-l-4 border-secondary shadow-md">
              <Icon name="shopping_basket" className="text-secondary text-xl sm:text-2xl" />
              <h5 className="font-bold text-on-surface text-base sm:text-lg">Campus Market</h5>
              <p className="text-xs sm:text-sm text-on-surface-variant">Buy, sell, or swap textbooks and furniture.</p>
            </div>
            <div className="p-4 sm:p-6 bg-surface-container rounded-xl space-y-3 sm:space-y-4 border-l-4 border-tertiary shadow-md">
              <Icon name="celebration" className="text-tertiary text-xl sm:text-2xl" />
              <h5 className="font-bold text-on-surface text-base sm:text-lg">Event Finder</h5>
              <p className="text-xs sm:text-sm text-on-surface-variant">Never miss any event or guest lecture again.</p>
            </div>
            <div className="p-4 sm:p-6 bg-surface-container rounded-xl space-y-3 sm:space-y-4 border-l-4 border-primary-container shadow-md">
              <Icon name="restaurant" className="text-primary text-xl sm:text-2xl" />
              <h5 className="font-bold text-on-surface text-base sm:text-lg">Meal Deals</h5>
              <p className="text-xs sm:text-sm text-on-surface-variant">Crowdsourced info on the best dining hall eats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ───────────────────────────────── */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 md:p-20 rounded-2xl text-center border shadow-2xl relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-container/30 rounded-full blur-3xl" />
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 relative text-on-surface">Ready to move in?</h2>
          <p className="text-lg sm:text-xl text-on-surface-variant mb-8 sm:mb-12 relative max-w-xl mx-auto px-2">
            Join the conversation and discover what your campus is really talking about.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative">
            <Link href="/signup" className="bg-primary text-on-primary font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-full text-base sm:text-lg shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center">
              Create Account
            </Link>
            <Link href="/login" className="bg-white text-primary border-2 border-primary font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-full text-base sm:text-lg hover:bg-primary-container/20 transition-all inline-flex items-center justify-center">
              Login Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 text-center bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-bold text-lg sm:text-xl text-on-surface">ByteChat</span>
          </div>
          <p className="text-xs sm:text-sm mb-6 sm:mb-8 text-on-surface-variant">Made with 💙 for IIT Mandi</p>
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-on-surface-variant">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/encryption" className="hover:text-primary transition-colors">Security</Link>
            <Link href="/impress-us" className="hover:text-primary transition-colors">✨ Impress Us</Link>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-6 sm:mt-8">© 2026 ByteChat All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
