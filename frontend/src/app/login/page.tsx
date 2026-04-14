'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { DEGREE_TYPE_OPTIONS, DegreeType } from '@/types/auth.types';
import { decryptPrivateKey } from '@/utils/e2ee.utils';
import { generateUserKeyPair, encryptPrivateKey } from '@/utils/e2ee.utils';
import './auth.css';
import Image from 'next/image';

// ────────────────────────────────────────────────────────────────
// SVG Icon Components
// ────────────────────────────────────────────────────────────────
const IconId = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBranch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const IconEyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeClosed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Spinner = () => (
  <svg className="auth-spinner" fill="none" viewBox="0 0 24 24">
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);


// ────────────────────────────────────────────────────────────────
// Main Auth Page Component
// ────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTab(params.get('tab') === 'signup' ? 'signup' : 'login');
    const onPop = () => setActiveTab(new URLSearchParams(window.location.search).get('tab') === 'signup' ? 'signup' : 'login');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullRollNo, setFullRollNo] = useState('');
  const [otp, setOtp] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ rollNo: '', password: '' });
  const [signupData, setSignupData] = useState({
    degreeType: '' as DegreeType,
    rollNumber: '',
    name: '',
    gender: '' as 'male' | 'female' | 'other',
    branch: '',
    password: '',
    confirmPassword: '',
  });

  // Tab switching
  const switchTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ── Login Logic ───────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginData.rollNo || !loginData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        rollNo: loginData.rollNo.toUpperCase(),
        password: loginData.password,
      });
      if (response.success && response.data?.user) {
        const user = response.data.user;
        if (user.encryptedPrivateKey) {
          try {
            const privateKey = await decryptPrivateKey(user.encryptedPrivateKey, loginData.password);
            sessionStorage.setItem('decryptedPrivateKey', privateKey);
          } catch (decryptErr) {
            console.error('[E2EE] Failed to decrypt private key:', decryptErr);
          }
        }
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      let errorMsg = 'Login failed';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Signup Logic ──────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupData.degreeType || !signupData.rollNumber || !signupData.name ||
      !signupData.gender || !signupData.branch || !signupData.password) {
      setError('All fields are required');
      return;
    }

    if (!/^\d{1,5}$/.test(signupData.rollNumber)) {
      setError('Roll number must be 1-5 digits');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { publicKey, privateKey } = await generateUserKeyPair();
      const encryptedPrivateKey = await encryptPrivateKey(privateKey, signupData.password);
      const response = await authService.signup({
        degreeType: signupData.degreeType,
        rollNumber: signupData.rollNumber,
        name: signupData.name,
        gender: signupData.gender,
        branch: signupData.branch,
        password: signupData.password,
        publicKey,
        encryptedPrivateKey,
      });

      if (response.success && response.data?.rollNo) {
        setFullRollNo(response.data.rollNo);
        setStep('verify');
      }
    } catch (err: unknown) {
      let errorMsg = 'Sign up failed';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verification ─────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOTP({
        rollNo: fullRollNo,
        otp,
        purpose: 'signup',
      });

      if (response.success) {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      let errorMsg = 'OTP verification failed';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // OTP Verification View
  // ────────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: '76rem' }}>
          {/* Left: Illustration */}
          <IllustrationPanel />

          {/* Right: OTP Form */}
          <section className="auth-form-panel auth-form-scrollable">
            <div className="auth-form-content auth-fade-in" style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem', height: '4rem', borderRadius: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #84CC16, #22C55E)',
                boxShadow: '0 8px 24px rgba(132, 204, 22, 0.25)',
              }}>
                <IconMail />
              </div>

              <h1 className="auth-form-title auth-headline">Check your inbox ✉️</h1>
              <p className="auth-form-subtitle">OTP sent to</p>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '0.25rem', color: 'var(--auth-primary)' }}>
                {fullRollNo}@students.iitmandi.ac.in
              </p>

              <form onSubmit={handleVerifyOTP} style={{ marginTop: '2rem' }}>
                {error && <div className="auth-error" style={{ marginBottom: '1rem', textAlign: 'left' }}>{error}</div>}

                <div className="auth-field" style={{ marginBottom: '1.25rem' }}>
                  <label className="auth-label" style={{ textAlign: 'center' }}>Enter 6-digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                    className="auth-otp-input"
                    placeholder="······"
                    maxLength={6}
                    required
                  />
                  <p style={{
                    fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center',
                    color: 'var(--auth-on-surface-variant)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem'
                  }}>
                    <IconClock /> Expires in 15 minutes
                  </p>
                </div>

                <button type="submit" disabled={loading || otp.length !== 6} className="auth-submit-btn">
                  {loading ? <><Spinner /> Verifying...</> : 'Verify & Complete Signup ✓'}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem' }}>
                <button onClick={() => setStep('form')} className="auth-back-btn">
                  <IconArrowLeft /> Back to signup
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // Main Login/Signup View
  // ────────────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left: Illustration Panel */}
        <IllustrationPanel />

        {/* Right: Form Panel */}
        <section className="auth-form-panel auth-form-scrollable">
          {/* Mobile brand header */}
          <div className="auth-mobile-brand">
            <Link href="/" className="auth-brand-link">
              <span className="auth-brand-name">ByteChat</span>
            </Link>
          </div>

          <div className="auth-form-content">
            {/* Header */}
            <div className="auth-form-header">
              <h1 className="auth-form-title auth-headline">
                {activeTab === 'login' ? 'Welcome back!' : 'Join the campus 🎓'}
              </h1>
              <p className="auth-form-subtitle">
                {activeTab === 'login'
                  ? 'Sign in to your IIT Mandi campus hub and catch up with your peers.'
                  : 'Create your IIT Mandi account and start connecting.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
                onClick={() => switchTab('login')}
              >
                Login
              </button>
              <button
                className={`auth-tab ${activeTab === 'signup' ? 'auth-tab-active' : ''}`}
                onClick={() => switchTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* ── Login Form ───────────────────────────────────── */}
            {activeTab === 'login' && (
              <div className="auth-tab-content" key="login">
                <form onSubmit={handleLogin} className="auth-form">
                  {error && <div className="auth-error">{error}</div>}

                  {/* Roll Number */}
                  <div className="auth-field">
                    <label className="auth-label">Roll Number</label>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon"><IconId /></div>
                      <input
                        type="text"
                        value={loginData.rollNo}
                        onChange={(e) => { setLoginData({ ...loginData, rollNo: e.target.value }); setError(''); }}
                        className="auth-input"
                        placeholder="B23397"
                        style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="auth-field">
                    <div className="auth-label-row">
                      <label className="auth-label">Password</label>
                      <Link href="/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
                    </div>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon"><IconLock /></div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); setError(''); }}
                        className="auth-input"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-eye-toggle">
                        {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="auth-remember">
                    <input type="checkbox" id="remember" className="auth-checkbox" />
                    <label htmlFor="remember" className="auth-remember-label">Keep me signed in on this device</label>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? <><Spinner /> Signing in...</> : 'Dive In →'}
                  </button>
                </form>

                {/* Divider */}
                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">Not a student?</span>
                </div>

                {/* Impress Us */}
                <div style={{ textAlign: 'center' }}>
                  <Link href="/impress-us" className="auth-impress-link">
                    ✨ Convince us and Join ByteChat <IconArrowRight />
                  </Link>
                </div>
              </div>
            )}

            {/* ── Signup Form ──────────────────────────────────── */}
            {activeTab === 'signup' && (
              <div className="auth-tab-content" key="signup">
                <form onSubmit={handleSignup} className="auth-form">
                  {error && <div className="auth-error">{error}</div>}

                  {/* Degree + Roll Number */}
                  <div className="auth-grid-2">
                    <div className="auth-field">
                      <label className="auth-label">Degree *</label>
                      <select
                        value={signupData.degreeType}
                        onChange={(e) => { setSignupData({ ...signupData, degreeType: e.target.value as DegreeType }); setError(''); }}
                        className="auth-select"
                        required
                      >
                        <option value="">Select</option>
                        {DEGREE_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Roll No (5 digits) *</label>
                      <div className="auth-input-wrapper">
                        <input
                          type="text"
                          value={signupData.rollNumber}
                          onChange={(e) => { setSignupData({ ...signupData, rollNumber: e.target.value }); setError(''); }}
                          className="auth-input auth-input-no-icon"
                          placeholder="23428"
                          maxLength={5}
                          style={{ fontFamily: 'monospace' }}
                          required
                        />
                      </div>
                      {signupData.degreeType && signupData.rollNumber && (
                        <span className="auth-roll-preview">{signupData.degreeType}{signupData.rollNumber.padStart(5, '0')}</span>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="auth-field">
                    <label className="auth-label">Full Name *</label>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon"><IconUser /></div>
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => { setSignupData({ ...signupData, name: e.target.value }); setError(''); }}
                        className="auth-input"
                        placeholder="Thacker Vyom"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender + Branch */}
                  <div className="auth-grid-2">
                    <div className="auth-field">
                      <label className="auth-label">Gender *</label>
                      <select
                        value={signupData.gender}
                        onChange={(e) => { setSignupData({ ...signupData, gender: e.target.value as 'male' | 'female' | 'other' }); setError(''); }}
                        className="auth-select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Branch *</label>
                      <div className="auth-input-wrapper">
                        <div className="auth-input-icon"><IconBranch /></div>
                        <input
                          type="text"
                          value={signupData.branch}
                          onChange={(e) => { setSignupData({ ...signupData, branch: e.target.value }); setError(''); }}
                          className="auth-input"
                          placeholder="M&C, Mechanical"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="auth-field">
                    <label className="auth-label">Password *</label>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon"><IconLock /></div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => { setSignupData({ ...signupData, password: e.target.value }); setError(''); }}
                        className="auth-input"
                        placeholder="Choose a password"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-eye-toggle">
                        {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="auth-field">
                    <label className="auth-label">Confirm Password *</label>
                    <div className="auth-input-wrapper">
                      <div className="auth-input-icon"><IconLock /></div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => { setSignupData({ ...signupData, confirmPassword: e.target.value }); setError(''); }}
                        className="auth-input"
                        placeholder="Re-enter password"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="auth-eye-toggle">
                        {showConfirmPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? <><Spinner /> Creating Account...</> : 'Create Account →'}
                  </button>
                </form>

                {/* Divider */}
                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">Not a student?</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Link href="/impress-us" className="auth-impress-link">
                    ✨ Convince us and Join ByteChat <IconArrowRight />
                  </Link>
                </div>
              </div>
            )}

            {/* Footer nav */}
            <div className="auth-footer-links">
              <Link href="/terms" className="auth-footer-link">Terms</Link>
              <span className="auth-footer-dot">·</span>
              <Link href="/privacy" className="auth-footer-link">Privacy</Link>
              <span className="auth-footer-dot">·</span>
              <Link href="/contact" className="auth-footer-link">Contact</Link>
              <span className="auth-footer-dot">·</span>
              <Link href="/encryption" className="auth-footer-link">Security</Link>
            </div>
          </div>
        </section>
      </div>

      {/* Help floating button */}
      <Link href="/contact" className="auth-help-btn" aria-label="Help">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </Link>
    </div>
  );
}


// ────────────────────────────────────────────────────────────────
// Illustration Panel (Left Side)
// ────────────────────────────────────────────────────────────────
function IllustrationPanel() {
  return (
    <section className="auth-illustration">
      {/* Background blobs */}
      <div className="blob-1" />
      <div className="blob-2" />

      {/* Branding */}
      <div className="auth-brand">
        <Link href="/" className="auth-brand-link">
          <span className="auth-brand-name">ByteChat</span>
        </Link>
        <p className="auth-brand-tagline">Own Digital Room for IIT Mandi.</p>
      </div>

      {/* Hero Image */}
      <div className="auth-hero-section">
        <div className="auth-hero-wrapper">
          <Image
            className="auth-hero-img"
            src="/campus-hero.png"
            alt="IIT Mandi students collaborating in a study group"
            width={600}
            height={400}
            priority
          />
          {/* Floating Activity Card */}
          <div className="auth-activity-card">
            <div className="auth-activity-header">
              <IconSparkles />
              <span className="auth-activity-label">Live Activity</span>
            </div>
            <p className="auth-activity-text">300+ Students And Counting More ...</p>
          </div>
        </div>
      </div>

      {/* Bottom Narrative */}
      <div className="auth-narrative">
        <h2 className="auth-headline">
          Focus On Your Small Talks,<br />
          We&apos;ll Handle The Connections.
        </h2>
        <div className="auth-narrative-dots">
          <div className="auth-dot auth-dot-active" />
          <div className="auth-dot auth-dot-inactive" />
          <div className="auth-dot auth-dot-inactive" />
        </div>
      </div>
    </section>
  );
}
