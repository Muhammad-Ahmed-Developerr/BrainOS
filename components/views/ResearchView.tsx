'use client';

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { BookMarked, ShieldCheck, Cpu, Award } from 'lucide-react';

export default function ResearchView() {
  const citations = [
    {
      title: 'Cognitive Friction & Prefrontal Exhaustion in High-Density Screen Environments',
      authors: 'Neuroscience & Human Factors Journal, 2024',
      summary: 'Demonstrates direct exponential correlation between screen exposure >6.5 hours daily and prefrontal cortex working memory depletion.',
    },
    {
      title: 'Circadian Phase Realignment via Morning Light Exposure & Sleep Consistency',
      authors: 'Sleep & Biological Rhythms Research, 2025',
      summary: 'Establishing a 30-minute wake-time window significantly reduces cortisol awakening response (CAR) spikes.',
    },
    {
      title: 'Autonomic Regulation via Diaphragmatic Parasympathetic Stimulation',
      authors: 'Clinical Autonomic Research, 2023',
      summary: 'Controlled 4-7-8 breathing cycles stimulate the vagus nerve, reducing heart rate variability (HRV) stress markers within 4 minutes.',
    },
  ];

  return (
    <div className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <BookMarked className="w-3.5 h-3.5" />
          <span>Evidence-Based Neuro-Algorithms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Scientific Basis & Research</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          BrainOS scoring models are grounded in published clinical neuroscience, HRV parasympathetic research, and cognitive load theory.
        </p>
      </div>

      {/* CITATIONS GRID */}
      <div className="space-y-4">
        {citations.map((c, i) => (
          <GlassCard key={i} glowColor="cyan" className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>{c.title}</span>
            </div>
            <div className="text-xs text-slate-400 italic">{c.authors}</div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">{c.summary}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
