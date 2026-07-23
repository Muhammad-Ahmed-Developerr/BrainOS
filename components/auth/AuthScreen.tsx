'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useBrainOS } from '@/context/BrainOSContext';
import {
  Brain,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup_details' | 'signup_verify' | 'forgot_email' | 'forgot_verify';

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { setActiveView } = useBrainOS();
  const [mode, setMode] = useState<AuthMode>('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // UI status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetStatus = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    resetStatus();
    setMode(newMode);
    setVerificationCode('');
  };

  // --- Step 1 for Signup: Send Code ---
  const handleRequestSignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setSuccessMsg(`Verification code sent to ${email}. Check your email.`);
      setMode('signup_verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2 for Signup: Verify Code & Register ---
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, code: verificationCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification or signup failed.');
      }

      setSuccessMsg('Profile created & verified! Entering BrainOS Dashboard...');

      if (typeof window !== 'undefined') {
        localStorage.setItem('brainos_user_authenticated', 'true');
      }

      // Auto sign in after registration
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      setActiveView('dashboard');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Sign In Handler ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('brainos_user_authenticated');
        }
        throw new Error(res.error || 'Invalid credentials provided.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('brainos_user_authenticated', 'true');
      }

      setSuccessMsg('Authentication successful! Welcome to BrainOS.');
      setActiveView('dashboard');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 1 for Forgot Password: Send Reset Code ---
  const handleRequestForgotCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'forgot-password' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset code.');
      }

      setSuccessMsg(`Security reset code sent to ${email}.`);
      setMode('forgot_verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2 for Forgot Password: Reset Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: verificationCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }

      setPassword(newPassword);
      setSuccessMsg('Password reset successfully! Entering BrainOS...');

      // Auto login after resetting password
      if (typeof window !== 'undefined') {
        localStorage.setItem('brainos_user_authenticated', 'true');
      }

      await signIn('credentials', {
        email,
        password: newPassword,
        redirect: false,
      });

      setActiveView('dashboard');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    setLoading(true);
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020203]/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md rounded-3xl bg-[#0a0a0c] border border-white/10 p-8 shadow-2xl shadow-cyan-950/40 my-auto"
      >
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 mb-1">
            <div className="w-full h-full bg-[#020203] rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Brain<span className="text-cyan-400">OS</span> Access Enclave
          </h1>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
            Personal MongoDB Neural Operating System with real-time Groq LLM intelligence.
          </p>
        </div>

        {/* Status Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5 shadow-lg shadow-rose-950/20"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-2.5 shadow-lg shadow-emerald-950/20"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{successMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SIGN IN MODE --- */}
        {mode === 'signin' && (
          <div>
            {/* OAuth Buttons */}
            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0a0a0c] px-3 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                Or Email Authentication
              </span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="neuro@brainos.ai"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot_email')}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating Enclave...</span>
                ) : (
                  <>
                    <span>Access BrainOS Enclave</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-gray-400">
              Don&apos;t have a neural account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signup_details')}
                className="text-cyan-400 font-bold hover:underline ml-1 cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* --- SIGN UP STEP 1: Details --- */}
        {mode === 'signup_details' && (
          <form onSubmit={handleRequestSignupCode} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Muhammad Ahmed"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="muhammadahmed@gmail.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 characters)"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Generating Verification Code...</span>
              ) : (
                <>
                  <span>Send Email Verification Code</span>
                  <Mail className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-4 text-center text-xs text-gray-400">
              Already have a neural account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="text-cyan-400 font-bold hover:underline ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* --- SIGN UP STEP 2: Enter Verification Code --- */}
        {mode === 'signup_verify' && (
          <form onSubmit={handleCompleteSignup} className="space-y-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">Verification sent to</span>
              <span className="text-xs font-semibold text-cyan-300">{email}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">6-Digit Security Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-white/5 border border-cyan-500/40 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono tracking-[0.25em] text-white placeholder-gray-600 outline-none transition-colors text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Verifying Security Token...</span>
              ) : (
                <>
                  <span>Verify Code & Create Profile</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => handleModeSwitch('signup_details')}
                className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>

              <button
                type="button"
                onClick={handleRequestSignupCode}
                disabled={loading}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Resend Code
              </button>
            </div>
          </form>
        )}

        {/* --- FORGOT PASSWORD STEP 1: Enter Email --- */}
        {mode === 'forgot_email' && (
          <form onSubmit={handleRequestForgotCode} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recover Password</h2>
              <p className="text-[11px] text-gray-400 mt-1">Enter your registered email address to receive a 6-digit password reset code.</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Sending Reset Code...</span>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <Mail className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* --- FORGOT PASSWORD STEP 2: Code & New Password --- */}
        {mode === 'forgot_verify' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">Reset code sent to</span>
              <span className="text-xs font-semibold text-cyan-300">{email}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">6-Digit Security Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-white/5 border border-cyan-500/40 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono tracking-[0.25em] text-white placeholder-gray-600 outline-none transition-colors text-center"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 characters)"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-purple-600 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Updating Password...</span>
              ) : (
                <>
                  <span>Reset Password & Access Enclave</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              <button
                type="button"
                onClick={handleRequestForgotCode}
                disabled={loading}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Privacy Note */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-mono text-cyan-400/80 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>MongoDB Atlas Enclave Protected</span>
        </div>
      </motion.div>
    </div>
  );
}
