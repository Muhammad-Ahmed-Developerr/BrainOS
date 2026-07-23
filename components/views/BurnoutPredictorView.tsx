'use client';

import React, { useState, useEffect } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import { Flame, AlertTriangle, ShieldCheck, PlusCircle, History, Send, Sparkles } from 'lucide-react';

interface BurnoutLogItem {
  _id?: string;
  exhaustion: number;
  cynicism: number;
  inefficacy: number;
  overtimeHours: number;
  calculatedRisk: number;
  groqRecommendation?: string;
  createdAt?: string;
}

export default function BurnoutPredictorView() {
  const { scores, settings, userId } = useBrainOS();
  const [logs, setLogs] = useState<BurnoutLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [exhaustion, setExhaustion] = useState(4);
  const [cynicism, setCynicism] = useState(3);
  const [inefficacy, setInefficacy] = useState(3);
  const [overtimeHours, setOvertimeHours] = useState(2);
  const [latestAiRecommendation, setLatestAiRecommendation] = useState('');

  const loadData = React.useCallback(() => {
    fetch(`/api/burnout?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.burnoutMetrics) {
          setLogs(data.burnoutMetrics);
        }
      })
      .catch((e) => console.warn('Failed to fetch burnout logs:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/burnout?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exhaustion,
          cynicism,
          inefficacy,
          overtimeHours,
          groqApiKey: settings.groqApiKey,
          preferredModel: settings.preferredModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.burnoutMetric) {
          setLatestAiRecommendation(data.burnoutMetric.groqRecommendation || '');
          loadData();
        }
      }
    } catch (err) {
      console.error('Error logging burnout metric:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5" />
          <span>MongoDB Occupational Exhaustion Enclave</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Burnout Risk Predictor</h1>
      </div>

      {/* SCORE & RISK STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glowColor="purple" className="flex flex-col items-center justify-center text-center p-8">
          <ScoreGauge
            score={scores.burnoutRisk}
            title="Burnout Index"
            subtitle="Calculated Cumulative Risk"
            size={180}
            colorScheme="rose"
          />
        </GlassCard>

        <GlassCard glowColor="purple" className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Burnout Status & Groq Protocol</span>
            </h3>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
              {scores.burnoutStatus} Status
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Your current burnout risk level is evaluated at <strong className="text-rose-400">{scores.burnoutRisk}%</strong>.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Groq LLM Recovery Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {latestAiRecommendation || 'Establish firm boundaries around evening work hours and schedule a mandatory 30-minute cognitive decompression window before sleep.'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* FORM TO LOG BURNOUT METRICS */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">Log Burnout Metrics (MongoDB & Groq AI)</h3>
          </div>
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            Maslach Inventory Metrics
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Emotional Exhaustion</span>
              <span className="text-rose-400 font-bold">{exhaustion}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={exhaustion}
              onChange={(e) => setExhaustion(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Depersonalization / Cynicism</span>
              <span className="text-rose-400 font-bold">{cynicism}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={cynicism}
              onChange={(e) => setCynicism(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Reduced Personal Efficacy</span>
              <span className="text-rose-400 font-bold">{inefficacy}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={inefficacy}
              onChange={(e) => setInefficacy(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Weekly Overtime Hours</span>
              <span className="text-rose-400 font-bold">{overtimeHours} hrs</span>
            </div>
            <input
              type="number"
              min="0"
              max="60"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-rose-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20"
            >
              {submitting ? (
                <span className="animate-pulse">Computing Burnout Risk & Saving to MongoDB...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Log Burnout Metrics & Predict Recovery Strategy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* MONGODB HISTORICAL BURNOUT LOGS */}
      <GlassCard glowColor="purple" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">MongoDB Burnout Metrics History</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">{logs.length} Recorded Metrics</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-rose-400/80 font-mono animate-pulse">
            Fetching burnout metrics from MongoDB...
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-500">
            No burnout metrics logged yet. Use the form above to record real burnout indicators!
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={log._id || i} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">
                    Risk Assessment: <strong className="text-rose-400">{log.calculatedRisk}%</strong>
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    Exhaustion: {log.exhaustion}/10 | Cynicism: {log.cynicism}/10 | OT: {log.overtimeHours}h
                  </span>
                </div>
                {log.groqRecommendation && (
                  <p className="text-xs text-rose-300 italic pt-2 border-t border-white/5">
                    <strong>Groq AI Protocol:</strong> {log.groqRecommendation}
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
