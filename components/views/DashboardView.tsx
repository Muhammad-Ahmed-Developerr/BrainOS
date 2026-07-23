'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import {
  Brain,
  Activity,
  Flame,
  Zap,
  Moon,
  Sparkles,
  CalendarCheck,
  BookOpen,
  Bot,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { generateDashboardInsight } from '@/lib/groq-service';
import { motion } from 'motion/react';

export default function DashboardView() {
  const { scores, recommendations, checkIns, setActiveView, settings } = useBrainOS();
  const [completedRecs, setCompletedRecs] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);

  const hasData = checkIns.length > 0;

  // Fetch initial live Groq AI insight
  React.useEffect(() => {
    let isMounted = true;
    async function fetchInsight() {
      setIsLoadingInsight(true);
      const res = await generateDashboardInsight(settings.groqApiKey, settings.preferredModel, scores);
      if (isMounted) {
        setAiInsight(res);
        setIsLoadingInsight(false);
      }
    }
    fetchInsight();
    return () => { isMounted = false; };
  }, [scores, settings.groqApiKey, settings.preferredModel]);

  const handleRefreshInsight = async () => {
    setIsLoadingInsight(true);
    const res = await generateDashboardInsight(settings.groqApiKey, settings.preferredModel, scores);
    setAiInsight(res);
    setIsLoadingInsight(false);
  };

  // Format historical trend data for Recharts
  const trendData = checkIns.slice(-7).map((c) => {
    const d = new Date(c.timestamp);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: dayName,
      Mood: c.mood * 10,
      Energy: c.energy * 10,
      Stress: c.stress * 10,
      Sleep: c.sleepQuality * 10,
      Productivity: c.productivity * 10,
    };
  });

  const toggleRec = (id: string) => {
    if (completedRecs.includes(id)) {
      setCompletedRecs(completedRecs.filter((r) => r !== id));
    } else {
      setCompletedRecs([...completedRecs, id]);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">
              BrainOS Command Center
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Neural Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('checkin')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Daily Check-In</span>
          </button>
          <button
            onClick={() => setActiveView('coach')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Ask Coach</span>
          </button>
        </div>
      </div>

      {/* AI INSIGHT BENTO BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/30 via-[#0a0a0c] to-purple-950/30 border border-cyan-500/20 p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-[80px] pointer-events-none" />
        <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Groq AI Neural Insight</span>
          </div>
          <p className="text-gray-200 text-sm italic leading-relaxed">
            {isLoadingInsight ? (
              <span className="text-cyan-400/80 font-mono text-xs animate-pulse">
                Analyzing recent score metrics with Groq {settings.preferredModel}...
              </span>
            ) : (
              `"${aiInsight || `Your Mental Health Index stands at ${scores.overallScore}/100. Stress risk is currently ${scores.stressRiskLevel.toLowerCase()} with burnout risk at ${scores.burnoutRisk}%.`}"`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefreshInsight}
            disabled={isLoadingInsight}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 transition-colors cursor-pointer"
            title="Recalculate AI Insight with Groq"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingInsight ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setActiveView('coach')}
            className="px-5 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Reflect
          </button>
        </div>
      </div>

      {/* BENTO GRID MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Bento Box: Personal Neural State Visualization */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-white/10 to-[#0a0a0c] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(112,0,255,0.18),transparent)] pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <h2 className="text-3xl font-light text-white tracking-tight">Personal Neural State</h2>
            <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase">
              {hasData ? `Based on ${checkIns.length} check-in${checkIns.length !== 1 ? 's' : ''}` : 'No data yet — log your first check-in'}
            </p>
          </div>

          {/* Interactive Wave Canvas / Graphic */}
          <div className="my-6 flex items-center justify-center opacity-60">
            <svg width="100%" height="160" viewBox="0 0 600 160" className="max-w-xl">
              <path d="M50,80 Q150,20 250,80 T450,80" stroke="#06b6d4" fill="none" strokeWidth="2" strokeDasharray="4 8" />
              <path d="M100,100 Q200,40 300,100 T500,100" stroke="#8b5cf6" fill="none" strokeWidth="1.5" opacity="0.6" />
              <circle cx="300" cy="80" r="50" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
              <circle cx="300" cy="80" r="75" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.1" />
              <g fill="#06b6d4">
                <circle cx="180" cy="50" r="3" />
                <circle cx="380" cy="70" r="2.5" />
                <circle cx="280" cy="110" r="3.5" />
                <circle cx="430" cy="40" r="3" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex flex-wrap justify-between items-end gap-4 border-t border-white/10 pt-4">
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Focus Index</div>
                <div className="text-base font-semibold text-white">{hasData ? `${scores.focusScore} / 100` : '—'}</div>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter font-mono">Stress Level</div>
                <div className="text-base font-semibold text-cyan-400">{hasData ? scores.stressRiskLevel : '—'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-extrabold tracking-tighter ${
                !hasData ? 'text-slate-600' :
                scores.overallScore >= 75 ? 'text-emerald-400' :
                scores.overallScore >= 50 ? 'text-cyan-400' :
                scores.overallScore >= 30 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {!hasData ? 'No Data' :
                  scores.overallScore >= 75 ? 'Optimal' :
                  scores.overallScore >= 50 ? 'Good' :
                  scores.overallScore >= 30 ? 'Fair' : 'At Risk'}
              </div>
              <div className="text-gray-500 font-mono text-xs">
                {hasData ? `Mental Index: ${scores.overallScore}/100` : 'Log a check-in to see your score'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Bento Box: Mental Score Ring */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0a0a0c] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[360px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] pointer-events-none" />
          
          <div>
            <h3 className="text-gray-400 text-xs font-mono font-medium uppercase tracking-widest mb-6">Mental Score</h3>
            <div className="relative flex items-center justify-center py-2">
              <ScoreGauge
                score={scores.overallScore}
                title="Overall Score"
                subtitle="Mental Health Index"
                size={170}
                strokeWidth={12}
                colorScheme="cyan"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400">Stress Resilience</span>
              <span className="text-cyan-400 font-bold">Above Avg</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${scores.overallScore}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              Neural resilience is peaking. A prime window for deep cognitive synthesis.
            </p>
          </div>
        </div>

        {/* Small Bento Box 1: Deep Sleep Cycle */}
        <div
          onClick={() => setActiveView('sleep')}
          className="lg:col-span-3 rounded-3xl bg-[#0a0a0c] border border-white/5 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all cursor-pointer min-h-[160px]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-cyan-400 text-xs font-mono">
              {hasData ? (checkIns[0]?.sleepHours ? `${checkIns[0].sleepHours}h last night` : 'Log sleep') : 'No data'}
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-0.5 tracking-tight">{hasData ? `${scores.sleepScore} / 100` : '—'}</div>
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Sleep Score</div>
          </div>
        </div>

        {/* Small Bento Box 2: Burnout Risk Level */}
        <div
          onClick={() => setActiveView('burnout')}
          className="lg:col-span-3 rounded-3xl bg-[#0a0a0c] border border-white/5 p-6 flex flex-col justify-between hover:border-purple-500/30 transition-all cursor-pointer min-h-[160px]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-purple-400 text-xs font-mono">
              {hasData ? scores.burnoutStatus || 'Calculating...' : 'No data'}
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-0.5 tracking-tight">{hasData ? `${scores.burnoutRisk}%` : '—'}</div>
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Burnout Risk Level</div>
          </div>
        </div>

        {/* Small Bento Box 3: Focus Hours */}
        <div
          onClick={() => setActiveView('focus')}
          className="lg:col-span-3 rounded-3xl bg-[#0a0a0c] border border-white/5 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all cursor-pointer min-h-[160px]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-emerald-400 text-xs font-mono">
              {hasData ? `Score: ${scores.focusScore}/100` : 'No data'}
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-0.5 tracking-tight">{hasData ? `${scores.deepWorkHours}h` : '—'}</div>
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Deep Work Today</div>
          </div>
        </div>

        {/* Small Bento Box 4: Stress Score */}
        <div
          onClick={() => setActiveView('stress')}
          className="lg:col-span-3 rounded-3xl bg-[#0a0a0c] border border-white/5 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-pointer min-h-[160px]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-blue-400 text-xs font-mono">{scores.stressRiskLevel}</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-0.5 tracking-tight">{scores.stressScore} / 100</div>
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Stress Score</div>
          </div>
        </div>
      </div>

      {/* TREND CHART & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Area Chart */}
        <GlassCard glowColor="cyan" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>7-Day Neural Metrics Trend</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of Mood, Stress, Energy, and Productivity.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4 flex items-center justify-center">
            {!hasData ? (
              <div className="text-center space-y-2 text-slate-500">
                <TrendingUp className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">No trend metrics to trace. Do a Check-In to start charting.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1124',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="Mood" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMood)" />
                  <Area type="monotone" dataKey="Stress" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" />
                  <Area type="monotone" dataKey="Productivity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProductivity)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Live Recommendation Feed */}
        <GlassCard glowColor="purple" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Personalized Recommendations</span>
            </h3>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Live Engine
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {recommendations.map((rec) => {
              const isDone = completedRecs.includes(rec.id);
              return (
                <div
                  key={rec.id}
                  onClick={() => toggleRec(rec.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-slate-900/30 border-white/5 opacity-50'
                      : 'bg-slate-900/60 border-white/10 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}
                      />
                      <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {rec.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed pl-6">
                    {rec.description}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard
          glowColor="cyan"
          onClick={() => setActiveView('checkin')}
          className="p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Daily Check-In</div>
            <div className="text-[11px] text-slate-400">Log today&apos;s metrics</div>
          </div>
        </GlassCard>

        <GlassCard
          glowColor="purple"
          onClick={() => setActiveView('journal')}
          className="p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Neural Journal</div>
            <div className="text-[11px] text-slate-400">AI Sentiment Analysis</div>
          </div>
        </GlassCard>

        <GlassCard
          glowColor="blue"
          onClick={() => setActiveView('coach')}
          className="p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Groq AI Coach</div>
            <div className="text-[11px] text-slate-400">Reflection & Habits</div>
          </div>
        </GlassCard>

        <GlassCard
          glowColor="emerald"
          onClick={() => setActiveView('reports')}
          className="p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Clinical Reports</div>
            <div className="text-[11px] text-slate-400">Export & Timeline</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
