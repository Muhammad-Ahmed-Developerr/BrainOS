'use client';

import React from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundView() {
  const { setActiveView } = useBrainOS();

  return (
    <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-6">
      <GlassCard glowColor="purple" className="p-8 space-y-4">
        <div className="p-3 w-fit mx-auto rounded-full bg-purple-500/10 text-purple-400">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white">404 — Signal Lost</h1>
        <p className="text-xs text-slate-400">
          The requested neural view coordinate does not exist in BrainOS memory.
        </p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </GlassCard>
    </div>
  );
}
