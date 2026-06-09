"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { AuthService } from "../../../services/auth.service";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState("");

  // Handle OAuth errors passed back via query param
  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      const messages: Record<string, string> = {
        google_oauth_cancelled: "Google sign-in was cancelled.",
        github_oauth_cancelled: "GitHub sign-in was cancelled.",
        google_token_failed: "Google authentication failed. Please try again.",
        github_token_failed: "GitHub authentication failed. Please try again.",
        google_no_email: "Google account has no email. Please use email/password login.",
        github_no_email: "GitHub account has no public email. Please use email/password login.",
        google_callback_failed: "Google sign-in failed. Please try again.",
        github_callback_failed: "GitHub sign-in failed. Please try again.",
      };
      setError(messages[err] || "Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await AuthService.login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setOauthLoading("google");
    window.location.href = "/api/auth/oauth/google";
  };

  const handleGitHub = () => {
    setOauthLoading("github");
    window.location.href = "/api/auth/oauth/github";
  };

  return (
    <div className="bg-[#0B1020] min-h-screen flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-600/6 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/25 group-hover:shadow-cyan-500/25 transition-all duration-300">
              <div className="w-full h-full bg-[#0B1020] rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Brain<span className="text-cyan-400">OS</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">Access Operating Console</h2>
          <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-widest uppercase">Authorized Personnel Only</p>
        </div>

        <Card className="border border-white/5 bg-slate-900/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

          <CardContent className="p-6">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 mb-5 rounded-lg bg-red-500/8 border border-red-500/20 text-xs text-red-400 font-mono">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email + Password form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Button
                id="login-submit"
                type="submit"
                variant="default"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>Boot BrainOS <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <span className="relative px-3 bg-slate-900 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                id="login-google"
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGoogle}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-2 text-xs cursor-pointer font-mono relative"
              >
                {oauthLoading === "google" ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.133 1 1.18 5.925 1.18 12s4.953 11 11.06 11c6.373 0 10.596-4.477 10.596-10.756 0-.723-.078-1.275-.172-1.826H12.24z"/>
                  </svg>
                )}
                Google
              </Button>
              <Button
                id="login-github"
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGitHub}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-2 text-xs cursor-pointer font-mono"
              >
                {oauthLoading === "github" ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                )}
                GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-0 px-6 pb-6 pt-4 border-t border-white/5 flex flex-col space-y-2 text-center">
            <p className="text-xs text-slate-400">
              New neural node?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Register System
              </Link>
            </p>
            <Link href="/" className="text-[10px] text-slate-600 hover:text-slate-400 font-mono transition-colors">
              ← Return to Landing Site
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#0B1020] min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-md text-center">
          <span className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin inline-block" />
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
