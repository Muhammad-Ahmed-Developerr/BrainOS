"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, KeyRound, Lock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { AuthService } from "../../../services/auth.service";

type Step = 1 | 2 | 3 | 4;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 → Send OTP
  const handleSendOtp = async () => {
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await AuthService.sendForgotPasswordOTP(email);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify code
  const handleVerifyCode = () => {
    setError("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setStep(3);
  };

  // Step 3 → Reset password
  const handleResetPassword = async () => {
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.resetPassword(email, code, newPassword);
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const stepProgress = { 1: 0, 2: 33, 3: 66, 4: 100 }[step];

  return (
    <div className="bg-[#0B1020] min-h-screen flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20">
              <div className="w-full h-full bg-[#0B1020] rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">Brain<span className="text-cyan-400">OS</span></span>
          </Link>

          {step < 4 ? (
            <>
              <h2 className="text-xl font-bold text-slate-200">System Recovery Protocol</h2>
              <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-widest uppercase">Password Reset</p>
              {/* Progress bar */}
              <div className="mt-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-200">Password Updated!</h2>
              <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-widest uppercase">Recovery Complete</p>
            </>
          )}
        </div>

        <Card className="border border-white/5 bg-slate-900/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-violet-500/5 blur-2xl pointer-events-none" />

          <CardContent className="p-6 md:p-8">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-500/8 border border-red-500/20 text-xs text-red-400 font-mono">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" /> Enter your registered email
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We'll send a 6-digit recovery code to your email address. The code expires in 10 minutes.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Email Address</label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && email && handleSendOtp()}
                    autoComplete="email"
                  />
                </div>
                <Button
                  id="forgot-send-otp"
                  variant="default"
                  disabled={!email || loading}
                  onClick={handleSendOtp}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <>Send Recovery Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-violet-400" /> Enter recovery code
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A 6-digit code was sent to{" "}
                  <span className="text-cyan-400 font-mono">{email}</span>. Check your inbox and spam.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Recovery Code</label>
                  <Input
                    id="forgot-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-xl font-mono tracking-[0.5em]"
                  />
                </div>

                {/* Resend link */}
                <p className="text-center text-xs text-slate-500">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
                  >
                    Resend code
                  </button>
                </p>
              </div>
            )}

            {/* ── STEP 3: New password ── */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-400" /> Create new password
                </h3>
                <p className="text-xs text-slate-400">Choose a strong password for your BrainOS account.</p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">New Password</label>
                  <div className="relative">
                    <Input
                      id="forgot-new-password"
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Confirm Password</label>
                  <Input
                    id="forgot-confirm-password"
                    type={showPass ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {/* Strength bar */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[8, 12, 16].map((len, i) => (
                        <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${
                          newPassword.length >= len
                            ? i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-400"
                            : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">
                      {newPassword.length < 8 ? "Too short" : newPassword.length < 12 ? "Weak" : newPassword.length < 16 ? "Good" : "Strong"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && (
              <div className="text-center py-8 space-y-5 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200 mb-1">Password Reset Successful</h3>
                  <p className="text-xs text-slate-400 font-mono">Your neural access credentials have been updated.</p>
                </div>
                <Button
                  id="forgot-go-login"
                  variant="default"
                  onClick={() => router.push("/login")}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign in to BrainOS <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Navigation */}
            {step >= 2 && step <= 3 && (
              <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setError(""); setStep((step - 1) as Step); }}
                  className="flex items-center gap-1 cursor-pointer font-mono"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                {step === 2 && (
                  <Button
                    id="forgot-verify-code"
                    variant="default"
                    size="sm"
                    onClick={handleVerifyCode}
                    disabled={code.length !== 6}
                    className="flex items-center gap-1 cursor-pointer font-mono ml-auto"
                  >
                    Verify Code <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    id="forgot-reset-submit"
                    variant="default"
                    size="sm"
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    className="flex items-center gap-1 cursor-pointer font-mono ml-auto"
                  >
                    {loading ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                    ) : (
                      <>Update Password <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Back to login link on step 1 */}
            {step === 1 && (
              <div className="mt-5 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
