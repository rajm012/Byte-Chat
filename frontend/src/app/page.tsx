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


// Material Symbols Icon Component (font loaded globally in globals.css)
const Icon = ({ name, className = '', filled = false }: { name: string; className?: string; filled?: boolean }) => (
  <span className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}>
    {name}
  </span>
);


export default function Home() {
  const [dark, setDark] = useDarkMode();
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
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-on-surface">
              Byte<span className="text-primary">Chat</span>
            </span>
          </div>

          {/* Nav Links and Dark/Light Toggle */}
          <div className="flex items-center gap-3">
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
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 glass border" style={{ borderColor: 'rgba(12, 103, 128, 0.2)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Exclusively for IIT Mandi Students
          </div>

          {/* Headline */}
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-on-surface">
            Your Campus.
            <br />
            <span className="text-primary">Your Rules.</span>
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-on-surface-variant">
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
        <div className="mt-20 w-full max-w-6xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video bg-surface-container-high group" style={{ minHeight: '320px' }}>
            <Image
              src="/Hero.png"
              alt="Students collaborating at IIT Mandi campus"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            {/* Half of the text on the image, bottom right */}
            <div className="absolute bottom-8 right-8 bg-white/90 rounded-2xl px-7 py-5 shadow-xl animate-fade-in hero-narrative-box-rect text-right flex flex-col items-end" style={{backdropFilter: 'blur(10px)', minWidth: '220px', maxWidth: '90%'}}>
              <span className="font-bold text-primary text-base block" style={{lineHeight: '1.5', wordBreak: 'break-word'}}>
                Connect. Chat. Share.<br/>
                Learn. Grow.
              </span>
            </div>
          </div>
          {/* The other half of the text in a normal box below the image */}
          <div className="w-full flex justify-end mt-4">
            <div className="bg-white rounded-2xl px-7 py-5 shadow-xl hero-narrative-box-rect text-right flex flex-col items-end" style={{minWidth: '220px', maxWidth: '90%'}}>
              <span className="font-bold text-primary text-base block" style={{lineHeight: '1.5', wordBreak: 'break-word'}}>
                Lead. Inspire. Enjoy.<br/>
                Build. Thrive.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Privacy & Encryption ───────────────── */}
      <section className="py-24 px-6 bg-surface-container-low" id="privacy">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-4">
              <Icon name="shield_lock" className="text-primary text-3xl" filled />
            </div>
            <h2 className="font-headline text-4xl font-bold text-on-surface">Iron-Clad Privacy. Period.</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              We believe what happens in the dorm stays in the dorm. Every message, group chat, and shared file is protected by 256-bit End-to-End Encryption. Not even ByteChat can see your secrets.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3">
                <Icon name="verified_user" className="text-primary" filled />
                <span className="font-semibold text-on-surface">Self-destructing messages for the wilder nights.</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="lock" className="text-primary" filled />
                <span className="font-semibold text-on-surface">Screenshot alerts to keep everyone honest.</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="timer" className="text-primary" filled />
                <span className="font-semibold text-on-surface">Timed chats that vanish without a trace.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="glass-card p-8 rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-surface rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                    <span className="text-on-tertiary-container font-bold">S</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface">Anonymous Squirrel</p>
                    <p className="text-sm text-on-surface-variant">Hey, anyone in the North Campus?</p>
                  </div>
                  <span className="text-xs text-primary bg-primary-container px-2 py-1 rounded-full">Ghost Mode</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface rounded-xl opacity-60">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="text-on-surface-variant font-bold">?</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface">Hidden User</p>
                    <p className="text-sm text-on-surface-variant">This message will self-destruct...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              <Image
                src="/Security.png"
                alt="Illustration of end-to-end encryption with locks and keys"
                width={400}
                height={300}
                className="object-contain mt-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Ghost Zone (Bento Grid) ─────────────── */}
      <section className="py-24 px-6 bg-surface-container-lowest" id="ghost-zone">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">
              Talk Anonymously, <span className="text-tertiary">Act Boldly.</span>
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              Express yourself without the pressure of your profile picture. Enter the &quot;Ghost Zone&quot; to share thoughts, ask questions, or just vent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Card 1 - Large */}
            <div className="md:col-span-2 bg-linear-to-br from-secondary-container to-white p-10 rounded-2xl flex flex-col justify-between min-h-100 shadow-lg">
              <div>
                <Icon name="visibility_off" className="text-5xl text-secondary mb-6" />
                <h3 className="font-headline text-3xl font-bold mb-4 text-on-surface">The Ghost Zone</h3>
                <p className="text-on-secondary-container text-lg">
                  One-click anonymity for any channel. Switch between your student identity and a mysterious alias instantly.
                </p>
              </div>
              <div className="flex gap-2 pt-8">
                <div className="flex-1 bg-surface-container-high rounded-lg p-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-xs font-bold text-on-tertiary-container">AS</div>
                  <span className="text-sm text-on-surface-variant">Anonymous Student</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-surface-container-high p-10 rounded-2xl flex flex-col justify-center text-center space-y-6 shadow-lg">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                <Icon name="theater_comedy" className="text-4xl text-tertiary" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Pseudo-Aliasing</h3>
              <p className="text-on-surface-variant">Get a unique, funny alias every time you enter a thread. &quot;Sleepy Squirrel&quot; or &quot;Coffee Dragon&quot;?</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Student Benefits ───────────────────── */}
      <section className="py-24 px-6 bg-surface-container-lowest" id="benefits">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Main Benefits Row */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 order-2 md:order-1">
              <div className="rounded-2xl shadow-2xl w-full aspect-4/3 bg-surface-container-high flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary-container/40 via-surface-container-low to-secondary-container/40" />
                <Icon name="group" className="text-9xl text-primary/30 relative z-10" />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-6">
              <h2 className="font-headline text-4xl font-bold text-on-surface">Verified Campus IDs Only</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                No bots, no recruiters, no parents. Access is restricted to users with a valid university email. It&apos;s a sanctuary for those who actually walk the halls.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <h4 className="font-black text-3xl text-primary">100%</h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Student Verified</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-3xl text-primary">24/7</h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Active Peer Mods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-surface-container rounded-xl space-y-4 border-l-4 border-primary shadow-md">
              <Icon name="local_cafe" className="text-primary text-2xl" />
              <h5 className="font-bold text-on-surface">Study Groups</h5>
              <p className="text-sm text-on-surface-variant">Instant chat rooms for every course and major.</p>
            </div>
            <div className="p-6 bg-surface-container rounded-xl space-y-4 border-l-4 border-secondary shadow-md">
              <Icon name="shopping_basket" className="text-secondary text-2xl" />
              <h5 className="font-bold text-on-surface">Campus Market</h5>
              <p className="text-sm text-on-surface-variant">Buy, sell, or swap textbooks and furniture.</p>
            </div>
            <div className="p-6 bg-surface-container rounded-xl space-y-4 border-l-4 border-tertiary shadow-md">
              <Icon name="celebration" className="text-tertiary text-2xl" />
              <h5 className="font-bold text-on-surface">Event Finder</h5>
              <p className="text-sm text-on-surface-variant">Never miss a dorm party or guest lecture again.</p>
            </div>
            <div className="p-6 bg-surface-container rounded-xl space-y-4 border-l-4 border-primary-container shadow-md">
              <Icon name="restaurant" className="text-primary text-2xl" />
              <h5 className="font-bold text-on-surface">Meal Deals</h5>
              <p className="text-sm text-on-surface-variant">Crowdsourced info on the best dining hall eats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ───────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-2xl text-center border shadow-2xl relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-container/30 rounded-full blur-3xl" />
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-8 relative text-on-surface">Ready to move in?</h2>
          <p className="text-xl text-on-surface-variant mb-12 relative max-w-xl mx-auto">
            Join the conversation and discover what your campus is really talking about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link href="/signup" className="bg-primary text-on-primary font-bold py-5 px-12 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center">
              Create Account
            </Link>
            <Link href="/login" className="bg-white text-primary border-2 border-primary font-bold py-5 px-12 rounded-full text-lg hover:bg-primary-container/20 transition-all inline-flex items-center justify-center">
              Login Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="py-16 px-6 text-center bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-on-surface">ByteChat</span>
          </div>
          <p className="text-sm mb-8 text-on-surface-variant">Made with 💙 for IIT Mandi</p>
          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-on-surface-variant">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/encryption" className="hover:text-primary transition-colors">Security</Link>
            <Link href="/impress-us" className="hover:text-primary transition-colors">✨ Impress Us</Link>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-8">© 2026 ByteChat All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
