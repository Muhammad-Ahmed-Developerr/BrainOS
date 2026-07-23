'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Cpu, ArrowDown, Activity, Sparkles, Database, Shield, Zap, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArchitectureView() {
  const [selectedNode, setSelectedNode] = useState<number>(0);

  const nodes = [
    {
      title: '1. Neural Input Stream',
      subtitle: 'Daily Check-Ins, Sleep, Screen Density, Journal Logs',
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      details: 'Collects 12+ real-time quantitative and qualitative vectors: Mood valence, Energy rating, Subjective stress, Sleep duration & quality, Water intake, Exercise minutes, Work hours, Screen density, Social interaction, Meditation, and Journal text.',
    },
    {
      title: '2. Groq AI Core',
      subtitle: 'Llama 3.3 70B & DeepSeek R1 Model Inference',
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      details: 'Executes zero-latency LLM inference via Groq SDK to parse natural language journal entries into JSON sentiment scores, primary emotion categories, and stress levels.',
    },
    {
      title: '3. Deterministic Scoring Engine',
      subtitle: 'Scientific Cognitive Load & Recovery Formulas',
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      details: 'Computes composite indexes: Overall Mental Health Score (0-100), Stress Score (0-100), Focus Index (0-100), and Sleep Recovery Index (0-100) using weighted multi-variable equations.',
    },
    {
      title: '4. Predictive Risk Engine',
      subtitle: 'Burnout Probability & Stress Threshold Rules',
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      details: 'Evaluates work-rest imbalances and sleep debt accumulation to project burnout probability % before severe cognitive fatigue occurs.',
    },
    {
      title: '5. Recommendation Engine',
      subtitle: 'Targeted Interdictions & Micro-Habits',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      details: 'Generates prioritized parasympathetic breathing exercises, screen-free downtime periods, and focus sprint protocols matched to current score vulnerabilities.',
    },
    {
      title: '6. Local Storage & Dashboard UI',
      subtitle: '100% Client-Side React Context State',
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      details: 'Renders real-time Recharts visualizers, interactive score gauges, and persistent state using LocalStorage and IndexedDB without any backend database or server.',
    },
  ];

  return (
    <div className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Pipeline Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI & System Architecture</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Explore the end-to-end data pipeline powering BrainOS&apos;s real-time mental health analytics and Groq LLM intelligence.
        </p>
      </div>

      {/* INTERACTIVE FLOW NODES */}
      <div className="space-y-4">
        {nodes.map((node, idx) => {
          const isSelected = selectedNode === idx;
          return (
            <React.Fragment key={idx}>
              <GlassCard
                glowColor={isSelected ? 'cyan' : 'blue'}
                onClick={() => setSelectedNode(idx)}
                className={`p-6 cursor-pointer border transition-all ${
                  isSelected ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.2)]' : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                    {node.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{node.title}</h3>
                    <div className="text-xs font-medium text-cyan-400">{node.subtitle}</div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2">
                      {node.details}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {idx < nodes.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className="w-5 h-5 text-cyan-400 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
