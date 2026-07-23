'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { Smile, TrendingUp, Calendar, Clock, Plus, CalendarCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function MoodTrackerView() {
  const { checkIns, addCheckIn, setActiveView } = useBrainOS();

  // Quick log form — real user input, not hardcoded values
  const [quickMood, setQuickMood] = useState<number>(5);
  const [quickEnergy, setQuickEnergy] = useState<number>(5);
  const [quickStress, setQuickStress] = useState<number>(5);
  const [quickLogged, setQuickLogged] = useState(false);

  const moodEmojis: { [key: number]: string } = {
    1: '😭', 2: '😔', 3: '🙁', 4: '😐', 5: '🙂',
    6: '😊', 7: '😄', 8: '🚀', 9: '🌟', 10: '✨',
  };

  const moodData = checkIns.slice(-14).map((c) => ({
    date: new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Mood: c.mood,
    Energy: c.energy,
  }));

  const handleQuickLog = () => {
    addCheckIn({
      date: new Date().toISOString().split('T')[0],
      mood: quickMood,
      moodLabel: `${moodEmojis[quickMood]} Quick Log`,
      energy: quickEnergy,
      stress: quickStress,
      sleepHours: 7,
      sleepQuality: 7,
      waterIntakeLiters: 2.0,
      exerciseMinutes: 0,
      workHours: 0,
      studyHours: 0,
      screenTimeHours: 0,
      socialMinutes: 0,
      meditationMinutes: 0,
      productivity: Math.round((quickMood + quickEnergy) / 2),
      tags: ['Quick Mood Log'],
      customNotes: `Quick mood log: Mood ${quickMood}/10, Energy ${quickEnergy}/10, Stress ${quickStress}/10.`,
    });
    setQuickLogged(true);
    setTimeout(() => setQuickLogged(false), 2500);
  };

  const avgMood = checkIns.length > 0
    ? (checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length).toFixed(1)
    : '—';

  const avgEnergy = checkIns.length > 0
    ? (checkIns.reduce((s, c) => s + (c.energy ?? 5), 0) / checkIns.length).toFixed(1)
    : '—';

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <Smile className="w-3.5 h-3.5" />
            <span>Emotional Spectrum Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Mood &amp; Valence Tracker</h1>
        </div>

        <button
          onClick={() => setActiveView('checkin')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Full Check-In</span>
        </button>
      </div>

      {/* QUICK MOOD LOG & CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Log Box */}
        <GlassCard glowColor="cyan" className="space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Smile className="w-5 h-5 text-cyan-400" />
            <span>Quick Mood Log</span>
          </h3>
          <p className="text-xs text-slate-400">
            Log your current mood, energy and stress. This creates a check-in entry in your history.
          </p>

          {/* Mood Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Mood: {quickMood}/10</span>
              <span className="text-xl">{moodEmojis[quickMood]}</span>
            </div>
            <input
              type="range" min="1" max="10" value={quickMood}
              onChange={(e) => setQuickMood(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Energy Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Energy: {quickEnergy}/10</span>
              <span className="text-amber-400 font-bold text-xs">
                {quickEnergy >= 7 ? 'High' : quickEnergy >= 4 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <input
              type="range" min="1" max="10" value={quickEnergy}
              onChange={(e) => setQuickEnergy(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Stress Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Stress: {quickStress}/10</span>
              <span className="text-blue-400 font-bold text-xs">
                {quickStress >= 7 ? 'Elevated' : quickStress >= 4 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <input
              type="range" min="1" max="10" value={quickStress}
              onChange={(e) => setQuickStress(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleQuickLog}
            disabled={quickLogged}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {quickLogged ? '✓ Logged!' : 'Log Now'}
          </button>

          {/* Averages summary */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="text-xl font-extrabold text-cyan-400">{avgMood}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Mood</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-amber-400">{avgEnergy}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Energy</div>
            </div>
          </div>
        </GlassCard>

        {/* 14-Day Mood Chart */}
        <GlassCard glowColor="blue" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>14-Day Mood &amp; Energy Curve</span>
            </h3>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              {checkIns.length} Entries
            </span>
          </div>

          {checkIns.length === 0 ? (
            <div className="h-60 w-full flex flex-col items-center justify-center gap-3 text-slate-500">
              <CalendarCheck className="w-10 h-10 text-slate-700" />
              <p className="text-sm text-center">No check-ins yet.<br/>Log your first mood above or do a full Check-In.</p>
            </div>
          ) : (
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[1, 10]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1124',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="Mood" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} />
                  <Line type="monotone" dataKey="Energy" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* HISTORICAL TIMELINE */}
      <GlassCard glowColor="purple" className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Mood Log History ({checkIns.length} entries)</span>
        </h3>

        {checkIns.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-600">
            <Smile className="w-12 h-12 text-slate-800" />
            <p className="text-sm text-center text-slate-500">
              No mood logs yet. Use the Quick Log above or complete a full Daily Check-In.
            </p>
            <button
              onClick={() => setActiveView('checkin')}
              className="mt-2 px-5 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              Start Daily Check-In →
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {checkIns.slice().reverse().map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-extrabold text-base">
                    {c.mood}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{c.moodLabel || `Mood: ${c.mood}/10`}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{c.date}</span>
                      <span>•</span>
                      <span>Energy: {c.energy ?? '—'}/10</span>
                      <span>•</span>
                      <span>Stress: {c.stress ?? '—'}/10</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.tags?.map((t) => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
