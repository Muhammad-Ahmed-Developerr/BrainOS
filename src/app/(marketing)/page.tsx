"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Shield, Compass, Sparkles, Activity, Moon, Smile, 
  ArrowRight, Zap, Play, Target, Award, Cpu, BarChart3, 
  Heart, Sun, Users, Flame, RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

// Typing effect phrases
const TYPING_PHRASES = [
  "Predictive Neural Telemetry.",
  "AI-Guided Burnout Prevention.",
  "Continuous Biometric Sync.",
  "Quantified Cognitive Mastery.",
  "Real-Time Emotion Alignment."
];

// Scores definition with metadata & data points for graphs
const SCORES_DATA = [
  {
    id: "brain",
    name: "Brain Score",
    value: 84,
    color: "from-violet-500 to-indigo-500",
    glowColor: "rgba(124, 58, 237, 0.1)",
    icon: <Brain className="w-5 h-5 text-violet-600" />,
    shortDesc: "The master index of your overall cognitive capability, combining sleep, focus, and recovery indices.",
    fullDesc: "Calculated via neural network models aggregating all other 9 operational scores. A score above 80 indicates optimized executive functioning and neural plasticity.",
    chartData: [
      { name: "Mon", score: 78 }, { name: "Tue", score: 80 }, { name: "Wed", score: 81 }, 
      { name: "Thu", score: 84 }, { name: "Fri", score: 82 }, { name: "Sat", score: 86 }, { name: "Sun", score: 84 }
    ],
    alert: "Cognitive readiness is currently optimal. Perfect day for high-level strategic decisions."
  },
  {
    id: "stress",
    name: "Stress Score",
    value: 32,
    color: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.1)",
    icon: <Activity className="w-5 h-5 text-cyan-600" />,
    shortDesc: "Real-time autonomic nervous system calibration based on Heart Rate Variability (HRV).",
    fullDesc: "Monitors sympathetic nervous system dominance. Lower score denotes lower stress levels. Spikes prompt immediate guided mindfulness feedback.",
    chartData: [
      { name: "Mon", score: 45 }, { name: "Tue", score: 38 }, { name: "Wed", score: 40 }, 
      { name: "Thu", score: 32 }, { name: "Fri", score: 35 }, { name: "Sat", score: 28 }, { name: "Sun", score: 30 }
    ],
    alert: "Vagus nerve activity is balanced. Stress response systems are resting."
  },
  {
    id: "burnout",
    name: "Burnout Score",
    value: 15,
    color: "from-rose-500 to-orange-500",
    glowColor: "rgba(244, 63, 94, 0.1)",
    icon: <Flame className="w-5 h-5 text-rose-600" />,
    shortDesc: "Cumulative fatigue tracker predicting system exhaustion boundaries.",
    fullDesc: "Checks sleep debt, overtime metrics, and biometric fatigue indexes. Designed to alert you 48 hours before cognitive exhaustion occurs.",
    chartData: [
      { name: "Mon", score: 22 }, { name: "Tue", score: 20 }, { name: "Wed", score: 18 }, 
      { name: "Thu", score: 15 }, { name: "Fri", score: 17 }, { name: "Sat", score: 12 }, { name: "Sun", score: 15 }
    ],
    alert: "Burnout risk is critically low. Energy reserves are fully recharged."
  },
  {
    id: "focus",
    name: "Focus Score",
    value: 88,
    color: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.1)",
    icon: <Target className="w-5 h-5 text-emerald-600" />,
    shortDesc: "Measures length of daily deep focus blocks and multitasking context-switches.",
    fullDesc: "Aggregates focus timer durations, app distraction rates, and mental flow efficiency. Over 80 represents elite deep-work output.",
    chartData: [
      { name: "Mon", score: 70 }, { name: "Tue", score: 75 }, { name: "Wed", score: 82 }, 
      { name: "Thu", score: 88 }, { name: "Fri", score: 80 }, { name: "Sat", score: 92 }, { name: "Sun", score: 85 }
    ],
    alert: "Flow state stability is high. Uninterrupted focus blocks are highly sustainable today."
  },
  {
    id: "mood",
    name: "Mood Score",
    value: 79,
    color: "from-amber-500 to-yellow-500",
    glowColor: "rgba(245, 158, 11, 0.1)",
    icon: <Smile className="w-5 h-5 text-amber-600" />,
    shortDesc: "NLP analysis of emotional variance from your daily journal text inputs.",
    fullDesc: "Transforms raw text logs into emotional vectors, mapping optimism, anxiety, and composure. Integrates cognitive distortion warning alerts.",
    chartData: [
      { name: "Mon", score: 72 }, { name: "Tue", score: 70 }, { name: "Wed", score: 75 }, 
      { name: "Thu", score: 79 }, { name: "Fri", score: 78 }, { name: "Sat", score: 82 }, { name: "Sun", score: 80 }
    ],
    alert: "Emotional baseline shows high stability and resilience. Cognitive filters are positive."
  },
  {
    id: "sleep",
    name: "Sleep Score",
    value: 86,
    color: "from-indigo-500 to-purple-500",
    glowColor: "rgba(99, 102, 241, 0.1)",
    icon: <Moon className="w-5 h-5 text-indigo-600" />,
    shortDesc: "Biometric sync analysis of REM, Deep, and Light sleep architecture.",
    fullDesc: "Integrates sleep onset times, circadian alignments, and resting heart rates. Correlates cognitive memory consolidation with deep rest cycles.",
    chartData: [
      { name: "Mon", score: 74 }, { name: "Tue", score: 78 }, { name: "Wed", score: 80 }, 
      { name: "Thu", score: 86 }, { name: "Fri", score: 82 }, { name: "Sat", score: 90 }, { name: "Sun", score: 88 }
    ],
    alert: "Deep and REM sleep cycles hit target durations. Neuro-restoration is complete."
  },
  {
    id: "energy",
    name: "Energy Score",
    value: 91,
    color: "from-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.1)",
    icon: <Sun className="w-5 h-5 text-orange-600" />,
    shortDesc: "Dynamic tracking of metabolic resources and physical circadian charge.",
    fullDesc: "Predicts energetic peak and trough zones based on circadian rhythm phases and physical logs. Use to plan complex meetings.",
    chartData: [
      { name: "Mon", score: 80 }, { name: "Tue", score: 85 }, { name: "Wed", score: 88 }, 
      { name: "Thu", score: 91 }, { name: "Fri", score: 89 }, { name: "Sat", score: 94 }, { name: "Sun", score: 92 }
    ],
    alert: "Circadian peak occurring now. Maximum cognitive stamina available."
  },
  {
    id: "social",
    name: "Social Wellness Score",
    value: 75,
    color: "from-blue-500 to-teal-500",
    glowColor: "rgba(59, 130, 246, 0.1)",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    shortDesc: "Quantifies social interaction quality, frequency, and emotional connection logs.",
    fullDesc: "Keeps tabs on active relational check-ins, collaborative focus blocks, and social time ratios to prevent isolation-based fatigue.",
    chartData: [
      { name: "Mon", score: 68 }, { name: "Tue", score: 70 }, { name: "Wed", score: 72 }, 
      { name: "Thu", score: 75 }, { name: "Fri", score: 73 }, { name: "Sat", score: 80 }, { name: "Sun", score: 78 }
    ],
    alert: "Interpersonal communication patterns show healthy collaborative balance."
  },
  {
    id: "productivity",
    name: "Productivity Score",
    value: 92,
    color: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.1)",
    icon: <Award className="w-5 h-5 text-purple-600" />,
    shortDesc: "Measures goal completion rates, priority alignment, and checklist speed.",
    fullDesc: "Calculates output consistency by comparing checked-in checklist velocities against customizable daily focus intentions.",
    chartData: [
      { name: "Mon", score: 85 }, { name: "Tue", score: 87 }, { name: "Wed", score: 90 }, 
      { name: "Thu", score: 92 }, { name: "Fri", score: 88 }, { name: "Sat", score: 95 }, { name: "Sun", score: 90 }
    ],
    alert: "Goal velocity is highly optimized. System throughput is at maximum efficiency."
  },
  {
    id: "mental",
    name: "Mental Wellness Score",
    value: 80,
    color: "from-pink-500 to-rose-500",
    glowColor: "rgba(236, 72, 153, 0.1)",
    icon: <Heart className="w-5 h-5 text-pink-600" />,
    shortDesc: "Integrative psychological resilience index mapping stress-recovery speed.",
    fullDesc: "Measures your overall mental recovery rate after intense cognitive loads. Tracks self-regulation and therapeutic journal completions.",
    chartData: [
      { name: "Mon", score: 74 }, { name: "Tue", score: 77 }, { name: "Wed", score: 79 }, 
      { name: "Thu", score: 80 }, { name: "Fri", score: 78 }, { name: "Sat", score: 84 }, { name: "Sun", score: 81 }
    ],
    alert: "Mental reserves show high elasticity. Excellent capacity for heavy cognitive work."
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeScoreId, setActiveScoreId] = useState("brain");
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause before starting deletion
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    } else {
      timer = setTimeout(() => {
        setTypedText(
          isDeleting
            ? currentPhrase.substring(0, charIndex - 1)
            : currentPhrase.substring(0, charIndex + 1)
        );
        setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  const activeScore = SCORES_DATA.find((s) => s.id === activeScoreId) || SCORES_DATA[0];

  const benefits = [
    { title: "Reduce Insomnia", value: "34%", subtitle: "Improved sleep onset efficiency" },
    { title: "Mitigate Stress Peaks", value: "48%", subtitle: "Decrease in cognitive fatigue alerts" },
    { title: "Enhance Focus Blocks", value: "2.1h", subtitle: "Additional daily uninterrupted flow time" }
  ];

  const testimonials = [
    {
      quote: "BrainOS saved me from severe executive burnout. Tracking my cognitive load metrics let me adjust meeting densities before it was too late.",
      author: "Sarah Chen",
      role: "Engineering Director, Vercel"
    },
    {
      quote: "The integration of Oura sleep logs with AI predictions yields incredibly accurate forecasts of my day's performance.",
      author: "Marcus Vance",
      role: "Founder, PeakFlow"
    }
  ];

  const faqs = [
    {
      q: "How does BrainOS forecast stress and burnout?",
      a: "By aggregating your wearable telemetry (HRV, heart rate, sleep debt) and checking it against subjective mood logs and journal sentiment analyses, our machine learning pipeline determines cognitive thresholds and maps potential fatigue peaks."
    },
    {
      q: "Is my personal neurological data secure?",
      a: "Yes. BrainOS utilizes HIPAA-compliant end-to-end encryption. Your thoughts, logs, and biometrics belong entirely to you and are never shared or sold."
    },
    {
      q: "Can I connect my Apple Watch or Oura Ring?",
      a: "Absolutely. BrainOS supports native synchronization interfaces with Apple HealthKit, Oura Cloud, Garmin Connect, and Fitbit."
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden font-sans text-slate-900 relative">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 text-center z-10">
        
        {/* Glow ambient background sphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-violet-500/5 blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Introducing BrainOS 1.0 — Quantified Cognitive Longevity
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-tight sm:leading-[1.05]"
        >
          The Personal <span className="bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">Mental Health</span> <br /> Operating System
        </motion.h1>

        {/* Typing effect sub-hero */}
        <div className="h-8 mt-6 flex items-center justify-center">
          <p className="text-base sm:text-2xl text-slate-500 font-mono">
            Optimized through <span className="text-cyan-600 font-semibold">{typedText}</span>
            <span className="animate-pulse ml-1 text-violet-500">|</span>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-sans leading-relaxed"
        >
          Measure stress, predict fatigue, analyze sleep deep cycles, and elevate cognitive endurance. BrainOS coordinates your bio-data feeds into actionable neuro-guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <Link href="/signup">
            <Button size="lg" variant="glow" className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer font-semibold py-6 px-8 rounded-xl shadow-lg shadow-violet-500/10">
              Initialize Neural OS <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer py-6 px-8 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 bg-white">
              <Play className="w-4 h-4 text-cyan-600 fill-current" /> Explore Score Metric Catalog
            </Button>
          </Link>
        </motion.div>

        {/* 2. DYNAMIC 10-SCORE BIO-METRICS DASHBOARD PREVIEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 md:mt-24 max-w-6xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-violet-500/15 via-slate-200 to-cyan-500/15 shadow-2xl relative"
        >
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-100/40">
            {/* Top border bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">SYS_LINK // COGNITIVE_PREVIEW_INTERFACE</span>
              </div>
              <div className="flex items-center gap-2 bg-violet-600/5 border border-violet-500/10 text-violet-600 text-[9px] font-mono uppercase px-2.5 py-1 rounded-md">
                <Cpu className="w-3.5 h-3.5 animate-spin" /> Live Neural Simulation Active
              </div>
            </div>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Score Grid: 10 Scores Selector */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {SCORES_DATA.map((score) => {
                  const isSelected = score.id === activeScoreId;
                  return (
                    <button
                      key={score.id}
                      onClick={() => setActiveScoreId(score.id)}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                        isSelected 
                          ? `border-violet-500/30 bg-violet-50` 
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                      style={{
                        boxShadow: isSelected ? `0 0 20px ${score.glowColor}` : "none"
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                          {score.icon}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">INDEX</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-600 block">{score.name}</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-2xl font-black text-slate-900">{score.value}</span>
                          <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Graph & Analysis Center */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden min-h-[400px]">
                {/* Glow sphere inside details panel */}
                <div className={`absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${activeScore.color} opacity-10 blur-2xl pointer-events-none transition-all duration-500`} />

                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                        {activeScore.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{activeScore.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Score Calibration Log</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-3xl font-black text-slate-900">{activeScore.value}</span>
                        <span className="text-xs text-slate-500 font-mono">/ 100</span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-wider">Calibration Optimal</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2">
                    {activeScore.fullDesc}
                  </p>

                  {/* Recharts Area Chart representing the Score history */}
                  <div className="h-44 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeScore.chartData}>
                        <defs>
                          <linearGradient id={`gradient-${activeScore.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid rgba(0,0,0,0.06)",
                            borderRadius: "10px",
                            fontSize: "11px",
                            color: "#0f172a"
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill={`url(#gradient-${activeScore.id})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Score Alert Message */}
                <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-100 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-violet-700 font-mono leading-relaxed">
                    {activeScore.alert}
                  </p>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. BENEFITS STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-40 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Scientific Validation</h2>
          <p className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3 leading-tight">Biometric Diagnostics & Outcomes</p>
          <p className="text-slate-500 mt-4 text-sm">BrainOS integrates machine learning metrics validated by neurobiological stress biomarkers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <Card key={idx} className="border border-slate-100 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 bg-slate-50/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 text-center">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block">{b.title}</span>
                <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight my-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">{b.value}</h3>
                <p className="text-xs text-slate-500 font-sans">{b.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. DEEP CORE CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Deep Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">An Operating System built for emotional & focus longevity</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              We sync with your biosensors to calculate burnout limits. Our models analyze journal sentiment and work schedules to guide you toward peak mental performance.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <Activity className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800">10-Score Integration Pipeline</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">Each checklist item, workout log, and heart rate interval feeds our neural calibration system.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800">Preemptive Burnout Alert Warnings</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">Our algorithm flags accumulated fatigue indexes before they cross chronic stress thresholds.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800">AI Cognitive Therapy Companion</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">Contextual cognitive behavioral guidance aligned to your immediate daily daily telemetry.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-violet-500/10 to-transparent shadow-xl">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative">
              <div className="absolute top-12 left-12 w-64 h-64 rounded-full bg-cyan-600/5 blur-[80px] pointer-events-none" />
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-2">Neural Predictor // Forecast Widget</span>
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 animate-pulse" /> Burnout Warning Zone
              </h4>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 mb-6">
                <p className="text-xs text-red-700 font-mono leading-relaxed">
                  SYSTEM STATUS: A stress peak is forecast on Thursday afternoon due to consecutive meeting logs. Recommended recovery: schedule a 10m deep focus reset block.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="sm" variant="default" className="text-xs cursor-pointer w-full">Deploy System Adjustments</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Testimonials</h2>
          <p className="text-3xl font-bold text-slate-900 mt-3">Optimizing Teams Globally</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="border border-slate-100 bg-slate-50/50 p-6 md:p-8 hover:border-violet-500/20 hover:shadow-md transition-all">
              <CardContent className="space-y-4 p-0">
                <p className="text-slate-600 italic text-sm font-sans leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center text-xs font-bold text-violet-600">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{t.author}</h4>
                    <p className="text-xs text-slate-500 font-mono">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Faq</h2>
          <p className="text-3xl font-bold text-slate-900 mt-3">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden transition-all duration-300 hover:border-slate-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span className="text-sm">{faq.q}</span>
                  <span className="text-cyan-600 font-mono text-xl">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs text-slate-500 font-sans leading-relaxed border-t border-slate-200 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 z-10 relative">
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-violet-600/15 via-slate-200 to-cyan-500/15 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white rounded-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-[90px] pointer-events-none" />

          <div className="relative p-8 md:p-16 text-center space-y-6 z-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Deploy BrainOS</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
              Synchronize your wear telemetry, baseline your checklist metrics, and initiate continuous cognitive coaching logs.
            </p>
            <div className="pt-4">
              <Link href="/signup">
                <Button size="lg" variant="glow" className="cursor-pointer font-bold rounded-xl px-8 py-5">
                  Boot System Diagnostics <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
