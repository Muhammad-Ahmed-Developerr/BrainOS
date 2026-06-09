"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain, ArrowRight, ArrowLeft, CheckCircle, Sparkles,
  Smile, ShieldAlert, Mail, Lock, KeyRound, AlertCircle, Eye, EyeOff
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Slider } from "../../../components/ui/slider";
import { Card, CardContent } from "../../../components/ui/card";
import { AuthService } from "../../../services/auth.service";

type Step = 1 | 2 | 3 | 4 | 5;

export default function SignupPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>(1);

  // Step 1: email
  const [email, setEmail] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  // Step 2: OTP + password
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Step 3: name & goals
  const [fullName, setFullName] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  // Step 4: lifestyle
  const [sleepTarget, setSleepTarget] = useState(8);
  const [workHours, setWorkHours] = useState(8);

  // Step 5: finalizing
  const [onboardingStatus, setOnboardingStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableGoals = [
    "Reduce Cognitive Burnout",
    "Track Stress Telemetry",
    "Deploy AI-Advisor Support",
    "Monitor Sleep & Heart Rate",
    "Integrate Mindful Routines",
  ];

  const handleGoalToggle = (goal: string) => {
    setGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);
  };

  // Step 1 → send OTP
  const handleSendOtp = async () => {
    setError("");
    setSendingOtp(true);
    try {
      await AuthService.sendSignupOTP(email);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2 → verify OTP + validate password
  const handleVerifyOtp = () => {
    setError("");
    if (code.length !== 6) { setError("Enter the 6-digit code from your email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setStep(3);
  };

  // Step 4 → finalize signup
  const handleFinalize = async () => {
    setLoading(true);
    setStep(5);
    const stages = [
      "Securing HIPAA encrypted databanks...",
      "Calibrating stress HRV index models...",
      "Structuring sentiment text parsers...",
      "Syncing baseline lifestyle configurations...",
      "Neural Node initialization complete!",
    ];
    for (const stage of stages) {
      setOnboardingStatus(stage);
      await new Promise((r) => setTimeout(r, 700));
    }
    try {
      await AuthService.signup({
        email, code, password, fullName, goals,
        sleepTarget, workHours, stressBaseline: 5,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
      setStep(4);
      setLoading(false);
    }
  };

  const totalSteps = 4;
  const progress = step < 5 ? ((step - 1) / totalSteps) * 100 : 100;

  return (
    <div className="bg-[#0B1020] min-h-screen flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-cyan-600/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20">
              <div className="w-full h-full bg-[#0B1020] rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">Brain<span className="text-cyan-400">OS</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">Initialize Wellness Node</h2>
          <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-widest uppercase">
            {step === 5 ? "SYSTEM COMPILING" : `STEP ${step} OF ${totalSteps}`}
          </p>

          {/* Progress bar */}
          {step < 5 && (
            <div className="mt-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <Card className="border border-white/5 bg-slate-900/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

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
                  <Mail className="w-4 h-4 text-cyan-400" /> Enter your email address
                </h3>
                <p className="text-xs text-slate-400">We'll send a 6-digit verification code to confirm your identity.</p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Email Address</label>
                  <Input
                    id="signup-email"
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
                  id="signup-send-otp"
                  variant="default"
                  disabled={!email || sendingOtp}
                  onClick={handleSendOtp}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sendingOtp ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Code...</>
                  ) : (
                    <>Send Verification Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
                <p className="text-center text-xs text-slate-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign in</Link>
                </p>
              </div>
            )}

            {/* ── STEP 2: OTP + Password ── */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-violet-400" /> Verify & set password
                </h3>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit code sent to <span className="text-cyan-400 font-mono">{email}</span>, then create your password.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Verification Code</label>
                  <Input
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-lg font-mono tracking-[0.4em]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Create Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    id="signup-confirm-password"
                    type={showPass ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[8, 12, 16].map((len, i) => (
                        <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${
                          password.length >= len
                            ? i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-400"
                            : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">
                      Strength: {password.length < 8 ? "Too short" : password.length < 12 ? "Weak" : password.length < 16 ? "Good" : "Strong"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Name & Goals ── */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Smile className="w-4 h-4 text-violet-400" /> Your identity & wellness targets
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Full Name</label>
                  <Input
                    id="signup-fullname"
                    placeholder="Alex Rivera"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 pt-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Wellness Goals
                  </label>
                  <div className="space-y-2">
                    {availableGoals.map((goal, idx) => {
                      const isSelected = goals.includes(goal);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleGoalToggle(goal)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-violet-600/10 border-violet-500/35 text-white"
                              : "bg-white/3 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/5"
                          }`}
                        >
                          <span>{goal}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Lifestyle ── */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-yellow-400" /> Lifestyle Baseline Metrics
                </h3>
                {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Target Sleep Hours</label>
                    <span className="text-xs text-cyan-400 font-mono font-bold">{sleepTarget} hrs</span>
                  </div>
                  <Slider min={4} max={10} step={0.5} value={sleepTarget} onValueChange={setSleepTarget} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Daily Work Hours</label>
                    <span className="text-xs text-violet-400 font-mono font-bold">{workHours} hrs</span>
                  </div>
                  <Slider min={4} max={14} step={0.5} value={workHours} onValueChange={setWorkHours} />
                </div>
              </div>
            )}

            {/* ── STEP 5: Compiling ── */}
            {step === 5 && (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-violet-500/10" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Compiling Your Neural OS</h3>
                <p className="text-xs text-slate-400 font-mono animate-pulse uppercase tracking-widest px-4">
                  {onboardingStatus}
                </p>
              </div>
            )}

            {/* Navigation buttons (steps 2-4) */}
            {step >= 2 && step <= 4 && (
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
                    id="signup-verify-otp"
                    variant="default"
                    size="sm"
                    onClick={handleVerifyOtp}
                    disabled={!code || !password || !confirmPassword}
                    className="flex items-center gap-1 cursor-pointer font-mono ml-auto"
                  >
                    Verify & Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    id="signup-step3-next"
                    variant="default"
                    size="sm"
                    onClick={() => { setError(""); if (!fullName) { setError("Please enter your name."); return; } setStep(4); }}
                    className="flex items-center gap-1 cursor-pointer font-mono ml-auto"
                  >
                    Proceed <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                {step === 4 && (
                  <Button
                    id="signup-deploy"
                    variant="default"
                    size="sm"
                    onClick={handleFinalize}
                    disabled={loading}
                    className="flex items-center gap-1 cursor-pointer font-mono ml-auto"
                  >
                    Deploy OS <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
