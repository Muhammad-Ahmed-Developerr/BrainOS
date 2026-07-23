'use client';

import React from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { FileBarChart, Printer, Sparkles, CalendarCheck } from 'lucide-react';

export default function ReportsView() {
  const { scores, checkIns, journals, setActiveView } = useBrainOS();

  const handlePrint = () => {
    window.print();
  };

  const avgMood = checkIns.length > 0
    ? (checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length).toFixed(1)
    : null;

  const avgSleep = checkIns.length > 0
    ? (checkIns.reduce((s, c) => s + c.sleepHours, 0) / checkIns.length).toFixed(1)
    : null;

  const avgStress = checkIns.length > 0
    ? (checkIns.reduce((s, c) => s + c.stress, 0) / checkIns.length).toFixed(1)
    : null;

  // Empty state — no data yet
  if (checkIns.length === 0) {
    return (
      <div className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Clinical-Grade Progress Summary</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Mental Health Reports</h1>
        </div>

        <GlassCard glowColor="emerald" className="p-12 text-center space-y-5">
          <div className="p-4 w-fit mx-auto rounded-full bg-emerald-500/10 text-emerald-400">
            <CalendarCheck className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-white">No Data Yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Your clinical report will be generated here once you log your first check-in.
            Complete at least one Daily Check-In to unlock your personalized mental health report.
          </p>
          <button
            onClick={() => setActiveView('checkin')}
            className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm cursor-pointer hover:opacity-90 transition-all"
          >
            Start Daily Check-In →
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-8 print:p-0 print:m-0">
      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Clinical-Grade Progress Summary</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Mental Health Reports</h1>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Report</span>
        </button>
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <GlassCard glowColor="emerald" className="p-8 space-y-6 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-6 print:border-gray-300">
          <div>
            <h2 className="text-2xl font-extrabold text-white print:text-black">BrainOS Cognitive &amp; Neural Report</h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              BrainOS v2.0 Client Report
            </span>
          </div>
        </div>

        {/* Score Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Mental Health Index</div>
            <div className="text-2xl font-black text-cyan-400 print:text-black mt-1">{scores.overallScore} / 100</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Stress Score</div>
            <div className="text-2xl font-black text-blue-400 print:text-black mt-1">{scores.stressScore} / 100</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Burnout Probability</div>
            <div className="text-2xl font-black text-purple-400 print:text-black mt-1">{scores.burnoutRisk}%</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Focus Index</div>
            <div className="text-2xl font-black text-emerald-400 print:text-black mt-1">{scores.focusScore} / 100</div>
          </div>
        </div>

        {/* Averages Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Avg Mood ({checkIns.length} entries)</div>
            <div className="text-2xl font-black text-cyan-300 print:text-black mt-1">{avgMood} / 10</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Avg Sleep</div>
            <div className="text-2xl font-black text-indigo-400 print:text-black mt-1">{avgSleep}h</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 print:border-gray-200 print:bg-gray-50">
            <div className="text-xs text-slate-400 print:text-gray-500">Avg Stress</div>
            <div className="text-2xl font-black text-rose-400 print:text-black mt-1">{avgStress} / 10</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white print:text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Executive Neural Assessment
          </h3>
          <p className="text-xs text-slate-300 print:text-gray-700 leading-relaxed">
            Over {checkIns.length} logged check-in{checkIns.length !== 1 ? 's' : ''}, your average mood score is {avgMood}/10
            with a Mental Health Index of {scores.overallScore}/100. Stress levels are rated {scores.stressRiskLevel?.toLowerCase()},
            with sleep averaging {avgSleep} hours per night (Sleep Index: {scores.sleepScore}/100).
            Focus capacity is measured at {scores.focusScore}/100 and burnout risk is assessed at {scores.burnoutRisk}%.
          </p>
        </div>

        {/* Journal Summary */}
        {journals.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-white/10 print:border-gray-300">
            <h3 className="text-base font-bold text-white print:text-black">Recent Journal Entries</h3>
            <div className="space-y-2">
              {journals.slice(0, 3).map((j) => (
                <div key={j.id} className="p-3 rounded-lg bg-slate-900/40 border border-white/5 print:border-gray-200 text-xs">
                  <div className="font-bold text-white print:text-black">{j.title}</div>
                  <div className="text-[11px] text-slate-400 print:text-gray-600 mt-0.5">{j.content.slice(0, 120)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
