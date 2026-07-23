'use client';

import React, { useState, useEffect } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import { Moon, Sparkles, PlusCircle, History, Send, ShieldCheck, Clock } from 'lucide-react';

interface SleepLogItem {
  _id?: string;
  sleepHours: number;
  qualityRating: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  disruptions: number;
  caffeineCutoffHour?: string;
  groqSleepAdvice?: string;
  createdAt?: string;
}

export default function SleepTrackerView() {
  const { scores, settings, userId } = useBrainOS();
  const [logs, setLogs] = useState<SleepLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [sleepHours, setSleepHours] = useState(7.5);
  const [qualityRating, setQualityRating] = useState(8);
  const [deepSleepMinutes, setDeepSleepMinutes] = useState(90);
  const [remSleepMinutes, setRemSleepMinutes] = useState(90);
  const [disruptions, setDisruptions] = useState(1);
  const [caffeineCutoff, setCaffeineCutoff] = useState('14:00');
  const [latestAiAdvice, setLatestAiAdvice] = useState('');

  const loadData = React.useCallback(() => {
    fetch(`/api/sleep?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.sleepLogs) {
          setLogs(data.sleepLogs);
        }
      })
      .catch((e) => console.warn('Failed to fetch sleep logs:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sleep?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sleepHours,
          qualityRating,
          deepSleepMinutes,
          remSleepMinutes,
          disruptions,
          caffeineCutoffHour: caffeineCutoff,
          groqApiKey: settings.groqApiKey,
          preferredModel: settings.preferredModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sleepLog) {
          setLatestAiAdvice(data.sleepLog.groqSleepAdvice || '');
          loadData();
        }
      }
    } catch (err) {
      console.error('Error logging sleep session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
          <Moon className="w-3.5 h-3.5" />
          <span>MongoDB Circadian Sleep Enclave</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Sleep & Restoration Monitor</h1>
      </div>

      {/* SCORE & RESTORATION GAUGE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glowColor="purple" className="flex flex-col items-center justify-center text-center p-8">
          <ScoreGauge
            score={scores.sleepScore}
            title="Sleep Index"
            subtitle="Circadian Restoration Score"
            size={180}
            colorScheme="purple"
          />
        </GlassCard>

        <GlassCard glowColor="blue" className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Restoration Diagnostics</span>
            </h3>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Optimal Recovery
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Your current calculated sleep index is <strong className="text-indigo-300">{scores.sleepScore}/100</strong>.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Groq LLM Sleep Hygiene Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {latestAiAdvice || 'Ensure darkness in sleep quarters and avoid screen exposure 60 minutes prior to bed for maximum melatonin synthesis.'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* FORM TO LOG SLEEP */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Log Sleep Metrics (MongoDB & Groq AI)</h3>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Circadian Metrics
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Total Sleep Duration (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="16"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Restfulness Quality</span>
              <span className="text-indigo-400 font-bold">{qualityRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={qualityRating}
              onChange={(e) => setQualityRating(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-white/10 rounded-lg mt-3"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Deep Sleep (Minutes)</label>
            <input
              type="number"
              min="0"
              max="300"
              value={deepSleepMinutes}
              onChange={(e) => setDeepSleepMinutes(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">REM Sleep (Minutes)</label>
            <input
              type="number"
              min="0"
              max="300"
              value={remSleepMinutes}
              onChange={(e) => setRemSleepMinutes(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Night Awakenings / Disruptions</label>
            <input
              type="number"
              min="0"
              max="15"
              value={disruptions}
              onChange={(e) => setDisruptions(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Last Caffeine Hour</label>
            <input
              type="time"
              value={caffeineCutoff}
              onChange={(e) => setCaffeineCutoff(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              {submitting ? (
                <span className="animate-pulse">Optimizing Sleep Hygiene & Saving to MongoDB...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Log Sleep Data & Generate Groq Advice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* MONGODB HISTORICAL SLEEP LOGS */}
      <GlassCard glowColor="purple" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">MongoDB Sleep Logs History</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">{logs.length} Recorded Logs</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-indigo-400/80 font-mono animate-pulse">
            Fetching sleep logs from MongoDB...
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-500">
            No sleep logs recorded yet. Use the form above to log real circadian rest data!
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={log._id || i} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">{log.sleepHours} Hours Sleep</span>
                  <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Quality: {log.qualityRating}/10 | Deep: {log.deepSleepMinutes}m
                  </span>
                </div>
                {log.groqSleepAdvice && (
                  <p className="text-xs text-indigo-300 italic pt-2 border-t border-white/5">
                    <strong>Groq AI Sleep Advice:</strong> {log.groqSleepAdvice}
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
