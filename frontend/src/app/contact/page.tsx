'use client';

import Link from 'next/link';
import { FiGithub, FiMail, FiCode, FiUsers, FiZap, FiDatabase, FiLayers, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Developer {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  expertise: string[];
  color: string;
}

const developers: Developer[] = [
  {
    id: 1,
    name: 'Divyansh Jain',
    role: 'Team Lead & Frontend Developer',
    avatar: 'https://ui-avatars.com/api/?name=Divyansh+Jain&background=3b82f6&color=fff&size=200&bold=true',
    bio: 'Leading the development team and crafting the user interface. Coordinating project milestones, managing workflows, and ensuring seamless integration between frontend and backend systems.',
    email: 'b23397@students.iitmandi.ac.in',
    expertise: ['Next.js', 'React', 'UI Design', 'Project Management', 'Team Coordination'],
    color: 'blue',
  },
  {
    id: 2,
    name: 'Siddhi Pogakwar',
    role: 'Frontend Developer',
    avatar: 'https://ui-avatars.com/api/?name=Siddhi+Pogakwar&background=ec4899&color=fff&size=200&bold=true',
    bio: 'Creating responsive and intuitive user interfaces with modern design principles. Focused on delivering exceptional user experiences through clean code and beautiful designs.',
    email: 'b23415@students.iitmandi.ac.in',
    expertise: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Responsive Design', 'Component Architecture'],
    color: 'pink',
  },
  {
    id: 3,
    name: 'Anamika Godara',
    role: 'Database Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Anamika+Godara&background=10b981&color=fff&size=200&bold=true',
    bio: 'Designing and optimizing database schemas for optimal performance. Managing data models, writing efficient queries, and ensuring data integrity across the platform.',
    email: 'b23428@students.iitmandi.ac.in',
    expertise: ['PostgreSQL', 'Database Design', 'Query Optimization', 'Data Modeling', 'Supabase'],
    color: 'green',
  },
  {
    id: 4,
    name: 'Thacker Vyom',
    role: 'Database Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Thacker+Vyom&background=f59e0b&color=fff&size=200&bold=true',
    bio: 'Implementing robust database solutions and cloud storage integrations. Specializing in media management, data persistence, and ensuring high availability of services.',
    email: 'b23417@students.iitmandi.ac.in',
    expertise: ['PostgreSQL', 'Cloudinary', 'Database Security', 'Cloud Storage', 'Data Migration'],
    color: 'yellow',
  },
  {
    id: 5,
    name: 'Raj Maurya',
    role: 'Backend Developer',
    avatar: 'https://ui-avatars.com/api/?name=Raj+Maurya&background=8b5cf6&color=fff&size=200&bold=true',
    bio: 'Building scalable APIs and real-time communication systems. Developing backend services, implementing WebSocket connections, and ensuring smooth server-side operations.',
    email: 'b23406@students.iitmandi.ac.in',
    expertise: ['Express.js', 'Socket.io', 'Real-time Communication'],
    color: 'purple',
  },
];

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

const techStack = [
  { name: 'Next.js', icon: FiZap, desc: 'Frontend framework', color: 'bg-surface-container-high' },
  { name: 'Node.js', icon: FiLayers, desc: 'Backend runtime', color: 'bg-green-500/10' },
  { name: 'PostgreSQL', icon: FiDatabase, desc: 'Database', color: 'bg-blue-500/10' },
  { name: 'Socket.io', icon: FiMessageSquare, desc: 'Real-time events', color: 'bg-amber-500/10' },
  { name: 'Tailwind CSS', icon: FiLayers, desc: 'Styling', color: 'bg-cyan-500/10' },
  { name: 'TypeScript', icon: FiCode, desc: 'Type safety', color: 'bg-blue-500/10' },
];

export default function ContactPage() {
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-linear-to-br from-secondary-container/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">

        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-primary-container via-secondary-container to-tertiary-container mb-6 shadow-lg">
            <FiUsers className="w-10 h-10 text-on-primary-container" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-on-surface">
            Meet Our Team
          </h1>
          <p className="text-sm max-w-lg mx-auto leading-relaxed text-on-surface-variant">
            BYTE-CHAT is built by a passionate team of IIT Mandi students. Meet the people behind the platform.
          </p>
        </div>

        {/* Developer cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {developers.map((dev) => (
            <div key={dev.id} className="glass-strong rounded-3xl p-6 flex flex-col gap-4 animate-scale-in border border-white/10 dark:border-white/5 hover:border-primary/20 transition-colors">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-outline-variant/30">
                  <Image src={dev.avatar} alt={dev.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-base text-on-surface">{dev.name}</p>
                  <p className="text-sm text-on-surface-variant">{dev.role}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm leading-relaxed text-on-surface-variant">{dev.bio}</p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-2">
                {dev.expertise.map((skill) => (
                  <span key={skill}
                    className="glass rounded-full px-3 py-1.5 text-xs font-medium text-on-surface-variant border border-outline-variant/20">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Email link */}
              <a
                href={`mailto:${dev.email}`}
                className="btn-romance flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl mt-auto"
              >
                <FiMail className="w-4 h-4" />
                {dev.email}
              </a>
            </div>
          ))}
        </div>

        {/* About + Get in Touch row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* About the Project */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <FiCode className="w-5 h-5 text-on-primary-container" />
              </div>
              <h2 className="text-xl font-bold text-on-surface">About the Project</h2>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-on-surface-variant">
              BYTE-CHAT is a campus social platform built exclusively for IIT Mandi students. It provides a safe space for students to connect, communicate, and collaborate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Secure, college-only authentication',
                'Real-time messaging and group chats',
                'Anonymous chat features',
                'Profile and group management',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs">✓</span>
                  </span>
                  <span className="text-sm text-on-surface-variant">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Get in Touch */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                <FiGithub className="w-5 h-5 text-on-secondary-container" />
              </div>
              <h2 className="text-xl font-bold text-on-surface">Get in Touch</h2>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-on-surface-variant">
              Have questions, suggestions, or want to collaborate? Reach out to us!
            </p>
            <div className="space-y-3">
              <a
                href="mailto:b23397@students.iitmandi.ac.in"
                className="btn-romance flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl"
              >
                <FiMail className="w-4 h-4" />
                Send us an Email
              </a>
              <Link href="/impress-us" className="btn-ghost flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border border-outline-variant/30">
                ✨ Impress Us
              </Link>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 mb-10 border border-white/10 dark:border-white/5">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
              <FiLayers className="w-5 h-5 text-on-tertiary-container" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className={`glass rounded-2xl p-4 flex items-center gap-3 border border-outline-variant/20 ${tech.color}`}>
                <tech.icon className="w-6 h-6 text-on-surface-variant" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{tech.name}</p>
                  <p className="text-xs text-on-surface-variant">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-on-surface-variant">
            <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>·</span>
            <Link href="/encryption" className="hover:underline">Security</Link>
            <span>·</span>
            <Link href="/" className="hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
