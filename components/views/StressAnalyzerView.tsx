'use client';

import React, { useState, useEffect } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import { Activity, ShieldAlert, Zap, ArrowUpRight, PlusCircle, Sparkles, History, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface StressLogItem {
  _id?: string;
  trigger: string;
  intensity: number;
  symptoms: string[];
  copingStrategy?: string;
  groqAnalysis?: string;
  createdAt?: string;
}

export default function StressAnalyzerView() {
  const { scores, setActiveView, settings, userId } = useBrainOS();
  const [logs, setLogs] = useState<StressLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [trigger, setTrigger] = useState('');
  const [intensity, setIntensity] = useState(6);
  const [symptomsInput, setSymptomsInput] = useState('');
  const [coping, setCoping] = useState('');
  const [latestAiResponse, setLatestAiResponse] = useState<string>('');

  // Fetch stress logs from MongoDB
  const loadData = React.useCallback(() => {
    fetch(`/api/stress?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stressLogs) {
          setLogs(data.stressLogs);
        }
      })
      .catch((e) => console.warn('Failed to fetch stress logs:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim()) return;

    setSubmitting(true);
    try {
      const symptomsArray = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`/api/stress?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger,
          intensity,
          symptoms: symptomsArray,
          copingStrategy: coping,
          groqApiKey: settings.groqApiKey,
          preferredModel: settings.preferredModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.stressLog) {
          setLatestAiResponse(data.stressLog.groqAnalysis || '');
          setTrigger('');
          setSymptomsInput('');
          setCoping('');
          loadData();
        }
      }
    } catch (err) {
      console.error('Error logging stress trigger:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>MongoDB Autonomic Nervous System Enclave</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Stress & Cortisol Analyzer</h1>
      </div>

      {/* SCORE GAUGE & RISK LEVEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glowColor="blue" className="flex flex-col items-center justify-center text-center p-8">
          <ScoreGauge
            score={scores.stressScore}
            title="Stress Index"
            subtitle="Calculated Physiological Load"
            size={180}
            colorScheme="blue"
          />
        </GlassCard>

        <GlassCard glowColor="cyan" className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              <span>Risk Assessment & Status</span>
            </h3>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
              {scores.stressRiskLevel} Level
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Your current calculated stress score is <strong className="text-blue-300">{scores.stressScore}/100</strong> based on real user check-ins.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Groq LLM Parasympathetic Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {latestAiResponse || 'Conduct 5 minutes of box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) to activate vagal tone and reduce circulating cortisol markers.'}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setActiveView('coach')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Consult AI Coach</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* FORM TO LOG REAL STRESS TRIGGER TO MONGODB */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Log Real Stress Trigger (MongoDB & Groq AI)</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            Real-Time Neural Processing
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Trigger Event / Catalyst</label>
            <input
              type="text"
              required
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g., Heavy workload deadline, loud noise, high caffeine"
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Intensity Level</span>
              <span className="text-purple-400 font-bold">{intensity}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-white/10 rounded-lg mt-3"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Physiological Symptoms (comma-separated)</label>
            <input
              type="text"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="e.g., Elevated heart rate, muscle tension, shallow breathing"
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Coping Strategy Used</label>
            <input
              type="text"
              value={coping}
              onChange={(e) => setCoping(e.target.value)}
              placeholder="e.g., Took a 10-min walk, drank water, meditation"
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 outline-none"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
            >
              {submitting ? (
                <span className="animate-pulse">Analyzing with Groq AI & Saving to MongoDB...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Log Stress Event & Compute AI Coping Strategy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* MONGODB HISTORICAL STRESS LOGS */}
      <GlassCard glowColor="cyan" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">MongoDB Stress Logs History</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">{logs.length} Recorded Entries</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-cyan-400/80 font-mono animate-pulse">
            Fetching stress logs from MongoDB...
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-500">
            No stress logs recorded yet. Use the form above to log real stress triggers!
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={log._id || i} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">{log.trigger}</span>
                  <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Intensity: {log.intensity}/10
                  </span>
                </div>
                {log.symptoms && log.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {log.symptoms.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-300 border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {log.groqAnalysis && (
                  <p className="text-xs text-cyan-300 italic pt-2 border-t border-white/5">
                    <strong>Groq AI Advice:</strong> {log.groqAnalysis}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
