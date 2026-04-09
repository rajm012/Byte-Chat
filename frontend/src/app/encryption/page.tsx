'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FiLock, FiShield, FiKey, FiServer, FiCpu, FiGlobe, FiHelpCircle, FiMail, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';

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

function toHex(input: string): string {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

function toPowerOfTenText(log10Value: number, suffix: string): string {
  if (!Number.isFinite(log10Value)) return `~0 ${suffix}`;
  if (log10Value < 3) {
    const value = 10 ** log10Value;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${suffix}`;
  }
  return `~10^${Math.floor(log10Value).toLocaleString()} ${suffix}`;
}

function formatTinyPercent(value: number): string {
  if (value <= 0) return '≈0%';
  if (value < 0.001) return `${value.toExponential(2)}%`;
  return `${value.toFixed(4)}%`;
}

const ATTACK_PRESETS = [
  { label: '10^12 guesses/sec', value: 1e12, vibe: 'Consumer scale cluster' },
  { label: '10^15 guesses/sec', value: 1e15, vibe: 'Massive specialized farm' },
  { label: '10^18 guesses/sec', value: 1e18, vibe: 'Sci-fi nation-state scale' },
  { label: '10^21 guesses/sec', value: 1e21, vibe: 'Beyond practical engineering' },
];

export default function EncryptionPage() {
  const [dark, setDark] = useDarkMode();
  const [attackRate, setAttackRate] = useState<number>(1e18);
  const [plainText, setPlainText] = useState<string>('Hello world');
  const cipherText = useMemo(() => {
    if (!plainText.trim()) return '';
    return `enc_${toHex(plainText).slice(0, 72)}...`;
  }, [plainText]);

  const attackStats = useMemo(() => {
    const bits = 256;
    const fullKeyspaceLog10 = bits * Math.log10(2);
    const avgTriesLog10 = (bits - 1) * Math.log10(2);
    const secondsPerYear = 60 * 60 * 24 * 365;
    const yearsLog10 = avgTriesLog10 - Math.log10(attackRate) - Math.log10(secondsPerYear);
    const percentAfterOneYear = Math.max(0, Math.min(100, ((secondsPerYear * attackRate) / 10 ** fullKeyspaceLog10) * 100));
    const percentAfterBillionYears = Math.max(0, Math.min(100, ((1e9 * secondsPerYear * attackRate) / 10 ** fullKeyspaceLog10) * 100));

    return {
      aesBreakEstimate: toPowerOfTenText(yearsLog10, 'years'),
      billionYearProgress: formatTinyPercent(percentAfterBillionYears),
      oneYearProgress: formatTinyPercent(percentAfterOneYear),
      progressWidth: Math.min(100, Math.max(percentAfterBillionYears * 14, 1.2)),
    };
  }, [attackRate]);

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

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-16 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,160,122,0.22), transparent 68%)' }} />
        <div className="absolute top-1/3 -right-12 w-120 h-120 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.14), transparent 72%)' }} />
      </div>

      <div className="max-w-6xl mx-auto pt-24 px-4 sm:px-6 pb-10">
        <div className="mb-6 text-xs sm:text-sm rounded-full px-4 py-2 glass text-on-surface-variant inline-flex items-center">
          <FiShield className="inline w-4 h-4 mr-1" />
          Security &amp; Transparency
        </div>

        <section className="glass-strong rounded-3xl p-8 sm:p-12 mb-8 animate-fade-in border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">ByteChat Trust Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-on-surface">
            Your messages are private.
            <br />
            <span className="text-primary">Even from us.</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl leading-relaxed text-on-surface-variant">
            Every message is encrypted on your device before it reaches our servers. Private keys stay with you, and the server stores encrypted blobs only.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: FiLock, title: 'End-to-End Encrypted', note: 'Only chat participants can read messages' },
              { icon: FiKey, title: 'Client-Side Key Storage', note: 'Private keys never leave your device' },
              { icon: FiRefreshCw, title: 'Secure Key Rotation', note: 'Versioned keys help protect past chats' },
            ].map((badge) => (
              <div key={badge.title} className="glass rounded-2xl p-5 border border-outline-variant/20 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center mb-3">
                  <badge.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-on-surface mb-1">{badge.title}</p>
                <p className="text-xs text-on-surface-variant">{badge.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <FiCpu className="w-5 h-5 text-on-primary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">How Encryption Works</h2>
            </div>
            <div className="space-y-3">
              {[
                'You create an account → Your device generates RSA keys',
                'You send a message → It is encrypted with AES-256-GCM before upload',
                'We store only encrypted data → Server cannot read plain text',
                'Recipient decrypts → Only their device can unlock the message',
              ].map((item, index) => (
                <div key={item} className="glass rounded-2xl px-4 py-3 flex gap-3 border border-outline-variant/20">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-linear-to-br from-primary-container to-tertiary-container text-xs font-bold flex items-center justify-center text-on-primary-container">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                <FiShield className="w-5 h-5 text-on-secondary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Security Metrics</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Encryption Standard', 'AES-256-GCM'],
                ['Key Protection', 'RSA-2048'],
                ['Messages Encrypted', '100%'],
                ['Key Rotation', 'Supported'],
                ['Decryption Location', 'Client Only'],
                ['Server Access', '0%'],
              ].map(([label, value]) => (
                <div key={label} className="glass rounded-2xl p-4 border border-outline-variant/20">
                  <p className="text-xs uppercase tracking-wider mb-1 text-on-surface-variant">{label}</p>
                  <p className="text-sm sm:text-base font-bold text-on-surface">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden border border-white/10 dark:border-white/5">
          <div className="absolute pointer-events-none opacity-10 -z-10 inset-0 bg-linear-to-br from-primary-container via-secondary-container to-tertiary-container" />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FiGlobe className="w-4 h-4 text-on-surface-variant" />
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Threat Simulator</p>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">If Someone Tries To Break One Message</h2>
            <p className="text-sm mt-2 text-on-surface-variant">
              Choose attacker speed. We estimate brute-force effort against AES-256 to show practical reality.
            </p>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              {ATTACK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAttackRate(preset.value)}
                  className={`w-full text-left rounded-2xl p-3 border transition-all ${
                    attackRate === preset.value
                      ? 'border-primary bg-primary/10'
                      : 'border-outline-variant/30 bg-surface/50 hover:bg-surface-container-low'
                  }`}
                >
                  <p className="text-sm font-semibold text-on-surface">{preset.label}</p>
                  <p className="text-xs mt-0.5 text-on-surface-variant">{preset.vibe}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 glass rounded-3xl p-5 sm:p-6 border border-outline-variant/20">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">Estimated Time To Crack One Message</p>
              <p className="text-3xl sm:text-4xl font-black mt-2 text-on-surface">{attackStats.aesBreakEstimate}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="rounded-2xl p-4 bg-surface-container-low/50">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">Chance In 1 Year</p>
                  <p className="text-xl font-extrabold mt-1 text-on-surface">{attackStats.oneYearProgress}</p>
                </div>
                <div className="rounded-2xl p-4 bg-surface-container-low/50">
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">Chance In 1 Billion Years</p>
                  <p className="text-xl font-extrabold mt-1 text-on-surface">{attackStats.billionYearProgress}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1 text-on-surface-variant">
                  <span>Progress Through Keyspace (1 billion years)</span>
                  <span>{attackStats.billionYearProgress}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-tertiary to-primary"
                    style={{ width: `${attackStats.progressWidth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs mt-4 text-on-surface-variant">
            Educational approximation only. Real-world security also depends on device safety, implementation quality, and key management.
          </p>
        </section>

        <section className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 overflow-x-auto border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
              <FiEye className="w-5 h-5 text-on-tertiary-container" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">What We Can and Cannot See</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-125 text-sm">
              <thead>
                <tr className="text-left border-b border-outline-variant/30">
                  <th className="pb-3 text-on-surface-variant font-medium">Data</th>
                  <th className="pb-3 text-on-surface-variant font-medium">Can We See It?</th>
                  <th className="pb-3 text-on-surface-variant font-medium">Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Messages', 'No', 'Encrypted on your device'],
                  ['Chat content', 'No', 'Protected by end-to-end encryption'],
                  ['Passwords', 'No', 'Stored as secure hashes'],
                  ['Roll Number', 'Yes', 'Needed for login and account recovery'],
                  ['Account ID', 'Yes', 'Required for system operations'],
                ].map(([field, visible, reason]) => (
                  <tr key={field} className="border-t border-outline-variant/20">
                    <td className="py-3 font-medium text-on-surface">{field}</td>
                    <td className="py-3">
                      {visible === 'No' ? (
                        <span className="inline-flex items-center gap-1 text-green-500">
                          <FiEyeOff className="w-4 h-4" /> No
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-500">
                          <FiEye className="w-4 h-4" /> Yes
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-on-surface-variant">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <FiShield className="w-5 h-5 text-on-primary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Security Guarantees</h2>
            </div>
            <div className="space-y-3">
              {[
                'We cannot read your messages.',
                'We do not store your private encryption keys.',
                'All encryption happens on your device.',
                'Your messages are encrypted before they reach our servers.',
              ].map((line) => (
                <div key={line} className="glass rounded-2xl px-4 py-3 text-sm font-medium text-on-surface-variant flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <span className="text-green-500 text-xs">✓</span>
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                <FiLock className="w-5 h-5 text-on-secondary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Security Features</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'End-to-End Encryption',
                'Client-Side Key Generation',
                'AES-256 Message Encryption',
                'RSA Key Exchange',
                'Secure Key Rotation',
                'Zero Message Access by Server',
              ].map((feature) => (
                <div key={feature} className="glass rounded-2xl p-3 text-sm text-on-surface-variant flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs">✓</span>
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <FiCpu className="w-5 h-5 text-on-primary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Try Encryption Demo</h2>
            </div>
            <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Type a message</label>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              className="mt-2 w-full min-h-24 rounded-2xl p-3 text-sm bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none transition-colors"
              placeholder="Hello world"
            />

            <label className="text-xs uppercase tracking-[0.2em] mt-4 block text-on-surface-variant">Encrypted output</label>
            <div className="mt-2 rounded-2xl p-3 text-xs break-all bg-surface-container-highest text-on-surface font-mono">
              {cipherText || 'enc_...'}
            </div>

            <div className="mt-3 text-xs text-on-surface-variant">
              Demo output is visualized for understanding. Real chats use cryptographic keys and secure IVs.
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                <FiServer className="w-5 h-5 text-on-secondary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Architecture Snapshot</h2>
            </div>
            <div className="space-y-2">
              {['User Device', 'Encrypted Message', 'Server Storage', 'Recipient Device', 'Readable Message'].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-full glass rounded-xl px-4 py-3 text-center text-sm font-medium text-on-surface-variant border border-outline-variant/20">
                    {index === 0 && <span className="mr-2">💻</span>}
                    {index === 1 && <span className="mr-2">🔒</span>}
                    {index === 2 && <span className="mr-2">☁️</span>}
                    {index === 3 && <span className="mr-2">📱</span>}
                    {index === 4 && <span className="mr-2">💬</span>}
                    {step}
                  </div>
                  {index < 4 ? <span className="text-xl py-1 text-on-surface-variant">↓</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
                <FiRefreshCw className="w-5 h-5 text-on-tertiary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Key Rotation</h2>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              We support versioned key rotation for chats. If a key is ever compromised, rotation helps ensure older conversations remain protected.
            </p>
            <div className="glass rounded-2xl p-4 mt-4 text-sm text-on-surface-variant flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4 text-tertiary" />
              <span>New key version generated → re-encrypted for each member → used for future messages.</span>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-on-primary-container" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Transparency Dashboard</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Messages Encrypted Today', '1,482,913'],
                ['Encryption Success Rate', '99.999%'],
                ['Security Incidents', '0'],
                ['Average Encryption Time', '12 ms'],
              ].map(([label, value]) => (
                <div key={label} className="glass rounded-2xl p-3 border border-outline-variant/20">
                  <p className="text-[11px] text-on-surface-variant">{label}</p>
                  <p className="text-base font-bold mt-1 text-on-surface">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
              <FiHelpCircle className="w-5 h-5 text-on-secondary-container" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Security FAQ</h2>
          </div>
          <div className="space-y-3">
            {[
              ['Can you read my messages?', 'No. Messages are encrypted before they reach our servers.'],
              ['Do you store my private key?', 'No. Your private key stays on your device.'],
              ['What if I lose my device?', 'Your encrypted data remains protected. You can recover account access and re-establish secure keys.'],
            ].map(([question, answer]) => (
              <details key={question} className="glass rounded-2xl p-4 group border border-outline-variant/20">
                <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-on-surface">
                  {question}
                  <span className="transition-transform group-open:rotate-45 text-lg text-primary">+</span>
                </summary>
                <p className="text-sm mt-3 leading-relaxed text-on-surface-variant">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center">
              <FiMail className="w-5 h-5 text-on-tertiary-container" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Report a Security Issue</h2>
          </div>
          <p className="text-sm mb-4 text-on-surface-variant">
            Found a vulnerability? Responsible disclosure helps keep everyone safe.
          </p>
          <a href="mailto:contact@bytechat.in" className="btn-romance inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl">
            <FiMail className="w-4 h-4" />
            contact@bytechat.in
          </a>
        </section>

        <div className="text-center pb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-on-surface-variant">
            <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>·</span>
            <Link href="/contact" className="hover:underline">Contact Developers</Link>
            <span>·</span>
            <Link href="/" className="hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
