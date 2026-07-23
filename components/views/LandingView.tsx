'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import {
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  Activity,
  Flame,
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  Bot,
  Lock,
  ChevronRight,
  BarChart2,
  Smile,
  Moon,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingView() {
  const { setActiveView, scores } = useBrainOS();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is BrainOS?',
      a: 'BrainOS is a Personal Mental Health Operating System that continuously monitors mood, stress, burnout risk, focus, sleep, and lifestyle habits using intelligent scoring algorithms and Groq LLMs. It operates entirely client-side with 100% data privacy.',
    },
    {
      q: 'How does BrainOS predict burnout?',
      a: 'BrainOS analyzes cumulative workload, screen density, sleep duration, and daily stress ratings using cognitive friction formulas to calculate your exact Burnout Risk % before severe fatigue sets in.',
    },
    {
      q: 'Is my personal mental health data private?',
      a: 'Yes! BrainOS uses no backend database or external servers. All check-ins, journal entries, and scores are stored exclusively in your browser via LocalStorage and IndexedDB.',
    },
    {
      q: 'Do I need a Groq API Key?',
      a: 'BrainOS includes built-in intelligent local scoring engines that work 100% free out of the box. Adding your free Groq API Key unlocks live Llama 3.3 and DeepSeek R1 AI Coach conversations and deep sentiment analysis.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 flex flex-col items-center text-center">
        {/* Glow badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.2)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Announcing BrainOS 1.0 — Neural Core</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.08] max-w-5xl"
        >
          Windows for Mental Health.
          <span className="block text-gradient-cyan mt-2">
            Android for the Human Mind.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg sm:text-2xl text-slate-300 max-w-3xl leading-relaxed font-light"
        >
          The world&apos;s first Personal Mental Health Operating System. Monitor stress, predict burnout, optimize deep focus, and process emotions in real time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => setActiveView('dashboard')}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            id="hero-launch-brainos-btn"
          >
            <Brain className="w-5 h-5 text-cyan-200" />
            <span>Launch BrainOS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-slate-200 font-semibold text-base backdrop-blur-xl transition-all cursor-pointer"
            id="hero-ai-pipeline-btn"
          >
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Explore AI Pipeline</span>
          </button>
        </motion.div>

        {/* 3D Brain & Floating Metric Showcase */}
        <div className="mt-16 relative w-full max-w-5xl">
          <GlassCard glowColor="cyan" className="p-8 lg:p-12 border-cyan-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Score Gauge */}
              <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
                <ScoreGauge
                  score={scores.overallScore}
                  title="Mental Health Index"
                  subtitle="Live Composite Neural Score"
                  size={190}
                  colorScheme="cyan"
                />
              </div>

              {/* Middle Metrics */}
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Stress Score</div>
                    <div className="text-xl font-extrabold text-white">{scores.stressScore} / 100</div>
                    <div className="text-[10px] text-cyan-400 font-medium">{scores.stressRiskLevel} Level</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Burnout Risk</div>
                    <div className="text-xl font-extrabold text-white">{scores.burnoutRisk}%</div>
                    <div className="text-[10px] text-purple-400 font-medium">{scores.burnoutStatus}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Focus Score</div>
                    <div className="text-xl font-extrabold text-white">{scores.focusScore} / 100</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{scores.deepWorkHours}h Deep Work</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Sleep Score</div>
                    <div className="text-xl font-extrabold text-white">{scores.sleepScore} / 100</div>
                    <div className="text-[10px] text-amber-400 font-medium">Circadian Recovery</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CORE OPERATING SYSTEM FEATURES */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold">Architecture & Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built like an Operating System, not a Simple Wellness Tracker.
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Every module works together in real time to provide predictive, non-clinical mental health insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glowColor="cyan" className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Daily Check-In & Tracking</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Log mood, stress, energy, sleep, exercise, water intake, and screen density in under 60 seconds with responsive micro-interactions.
            </p>
            <button
              onClick={() => setActiveView('checkin')}
              className="text-xs text-cyan-400 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Open Check-In</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </GlassCard>

          <GlassCard glowColor="purple" className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Burnout Prediction Engine</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent rules-based scoring calculates cumulative fatigue and alerts you before severe cognitive overload occurs.
            </p>
            <button
              onClick={() => setActiveView('burnout')}
              className="text-xs text-purple-400 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>View Predictor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </GlassCard>

          <GlassCard glowColor="blue" className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Groq AI Neural Coach</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Interactive reflection partner powered by Llama 3.3 and DeepSeek R1 models. Supportive, habit-focused, and non-diagnostic.
            </p>
            <button
              onClick={() => setActiveView('coach')}
              className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Talk to Coach</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </GlassCard>
        </div>
      </section>

      {/* PRIVACY & DATA SECURITY BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30 p-8 lg:p-12">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>100% Local Browser Storage</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">
              Your Mental Health Data Never Leaves Your Device.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              No backend servers, no cloud databases, no tracking cookies. BrainOS stores all check-ins, journal entries, and scores exclusively in your browser&apos;s LocalStorage and IndexedDB.
            </p>
          </div>
          <button
            onClick={() => setActiveView('settings')}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer whitespace-nowrap"
          >
            Configure Settings
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Everything you need to know about BrainOS.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between font-bold text-white text-base">
                <span>{faq.q}</span>
                <span className="text-cyan-400 text-xl">{activeFaq === idx ? '−' : '+'}</span>
              </div>
              {activeFaq === idx && (
                <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed pt-3 border-t border-white/5">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
