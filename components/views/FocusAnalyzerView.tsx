'use client';

import React, { useState, useEffect } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import ScoreGauge from '@/components/ui/ScoreGauge';
import { Zap, Clock, PlusCircle, History, Send, Sparkles, Target } from 'lucide-react';

interface FocusSessionItem {
  _id?: string;
  taskTitle: string;
  durationMinutes: number;
  distractions: number;
  flowStateRating: number;
  groqFocusTip?: string;
  createdAt?: string;
}

export default function FocusAnalyzerView() {
  const { scores, settings, userId } = useBrainOS();
  const [sessions, setSessions] = useState<FocusSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [distractions, setDistractions] = useState(1);
  const [flowStateRating, setFlowStateRating] = useState(8);
  const [latestAiTip, setLatestAiTip] = useState('');

  const loadData = React.useCallback(() => {
    fetch(`/api/focus?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.focusSessions) {
          setSessions(data.focusSessions);
        }
      })
      .catch((e) => console.warn('Failed to fetch focus sessions:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/focus?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle,
          durationMinutes,
          distractions,
          flowStateRating,
          groqApiKey: settings.groqApiKey,
          preferredModel: settings.preferredModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.focusSession) {
          setLatestAiTip(data.focusSession.groqFocusTip || '');
          setTaskTitle('');
          loadData();
        }
      }
    } catch (err) {
      console.error('Error logging focus session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>MongoDB Flow State & Attention Enclave</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Deep Work & Focus Analyzer</h1>
      </div>

      {/* SCORE & FLOW STATE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glowColor="cyan" className="flex flex-col items-center justify-center text-center p-8">
          <ScoreGauge
            score={scores.focusScore}
            title="Focus Index"
            subtitle="Cognitive Clarity & Flow Score"
            size={180}
            colorScheme="cyan"
          />
        </GlassCard>

        <GlassCard glowColor="blue" className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Flow State Architecture</span>
            </h3>
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {scores.deepWorkHours}h Deep Work Today
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Your current calculated focus score is <strong className="text-cyan-400">{scores.focusScore}/100</strong>.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Groq LLM Cognitive Focus Advice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {latestAiTip || 'Block notifications during your next 50-minute ultradian rhythm cycle to eliminate task-switching context debt.'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* FORM TO LOG FOCUS SESSION */}
      <GlassCard glowColor="cyan" className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Log Focus Session (MongoDB & Groq AI)</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            Ultradian Deep Work Sync
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Task / Project Title</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., Quantum Algorithm Implementation, Writing Research Abstract"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Duration (Minutes)</label>
            <input
              type="number"
              min="5"
              max="240"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-gray-400">Distractions Count</label>
            <input
              type="number"
              min="0"
              max="20"
              value={distractions}
              onChange={(e) => setDistractions(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span>Flow State Rating</span>
              <span className="text-cyan-400 font-bold">{flowStateRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={flowStateRating}
              onChange={(e) => setFlowStateRating(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-white/10 rounded-lg mt-3"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {submitting ? (
                <span className="animate-pulse">Optimizing Focus & Saving to MongoDB...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Log Focus Session & Generate Groq Strategy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* MONGODB HISTORICAL FOCUS LOGS */}
      <GlassCard glowColor="purple" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">MongoDB Focus Sessions History</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">{sessions.length} Logged Sessions</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-cyan-400/80 font-mono animate-pulse">
            Fetching focus sessions from MongoDB...
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-500">
            No focus sessions recorded yet. Use the form above to log real deep work sessions!
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <div key={session._id || i} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">{session.taskTitle}</span>
                  <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {session.durationMinutes} mins | Flow: {session.flowStateRating}/10
                  </span>
                </div>
                {session.groqFocusTip && (
                  <p className="text-xs text-cyan-300 italic pt-2 border-t border-white/5">
                    <strong>Groq AI Strategy:</strong> {session.groqFocusTip}
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
