"use client";

import React, { useState } from "react";
import { 
  Brain, Activity, Moon, Sparkles, Compass, ArrowRight, 
  Flame, Target, Smile, Sun, Users, Award, Heart, ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const SCORE_DETAILS = [
  {
    category: "Neurological & Focus",
    metrics: [
      { name: "Brain Score", icon: <Brain className="w-4 h-4 text-violet-600" />, desc: "Unified metric of overall executive functioning and neuro-plastic potential.", source: "Meta-algorithmic calculation" },
      { name: "Focus Score", icon: <Target className="w-4 h-4 text-emerald-600" />, desc: "Measures distraction resistance and deep-work duration indices.", source: "Checklists & app blocking sessions" },
      { name: "Productivity Score", icon: <Award className="w-4 h-4 text-purple-600" />, desc: "Tracks daily output consistency and priority milestone completion rate.", source: "Task execution velocities" }
    ]
  },
  {
    category: "Physiological Reserves",
    metrics: [
      { name: "Stress Score", icon: <Activity className="w-4 h-4 text-cyan-600" />, desc: "Autonomic calibration indicating parasympathetic nerve balance.", source: "Smartwatch HRV metrics" },
      { name: "Sleep Score", icon: <Moon className="w-4 h-4 text-indigo-600" />, desc: "Quality and depth rating correlating memory consolidation with sleep debt.", source: "Wearable sleep tracker data" },
      { name: "Energy Score", icon: <Sun className="w-4 h-4 text-orange-600" />, desc: "Predicts physiological circadian stamina cycles throughout the day.", source: "Circadian phases & food logs" }
    ]
  },
  {
    category: "Emotional & Resilience",
    metrics: [
      { name: "Mood Score", icon: <Smile className="w-4 h-4 text-amber-600" />, desc: "Translates journal logs into emotional valence vectors.", source: "AI Natural Language Processing" },
      { name: "Burnout Score", icon: <Flame className="w-4 h-4 text-rose-600" />, desc: "Calculates cumulative fatigue thresholds to forecast overload events.", source: "Worked hours & biometric metrics" },
      { name: "Social Wellness Score", icon: <Users className="w-4 h-4 text-blue-600" />, desc: "Evaluates conversational metrics and positive social alignment.", source: "Social check-in logs" },
      { name: "Mental Wellness Score", icon: <Heart className="w-4 h-4 text-pink-600" />, desc: "Reflects psychological elastic recovery and self-regulation stability.", source: "Guided logs & therapy indices" }
    ]
  }
];

export default function FeaturesPage() {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 font-sans text-slate-900 relative">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">System Capabilities</h1>
          <p className="text-4xl md:text-6xl font-black mt-3 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">Telemetry & Architecture</p>
          <p className="text-slate-500 mt-4 text-sm md:text-base leading-relaxed">
            BrainOS leverages a dual physiological-emotional tracking model to feed our neural forecast engine.
          </p>
        </div>

        {/* Dynamic Aggregation Pipeline visualizer */}
        <div className="mb-24 max-w-5xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-cyan-500/10 to-violet-500/10 shadow-xl relative overflow-hidden">
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 text-center shadow-lg">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">SYS_FLOW // NEURAL PROCESSING PIPELINE</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/5 border border-cyan-500/10 flex items-center justify-center text-cyan-600 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">1. Data Integration</h4>
                <p className="text-[11px] text-slate-500 mt-2">Sync smartwatch HRV, sleep periods, checklist logs, and text journals.</p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center relative">
                <div className="w-12 h-12 rounded-xl bg-violet-600/5 border border-violet-500/10 flex items-center justify-center text-violet-600 mb-4">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">2. Neural Analytics</h4>
                <p className="text-[11px] text-slate-500 mt-2">Our processing layers analyze circadian stamina indices and sentiment arrays.</p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/5 border border-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">3. Operational Outcomes</h4>
                <p className="text-[11px] text-slate-500 mt-2">Generate calibrated scores and deploy real-time burnout alerts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 10-Score Catalog Detailed Matrix */}
        <div className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-slate-900">Core Telemetry Matrix</h3>
            <p className="text-xs text-slate-400 mt-1">The 10 foundational scores mapping your mental fitness landscape</p>
          </div>

          <div className="space-y-8">
            {SCORE_DETAILS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold border-l-2 border-violet-600 pl-3">
                  {group.category}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.metrics.map((metric) => {
                    const isHovered = hoveredMetric === metric.name;
                    return (
                      <div
                        key={metric.name}
                        onMouseEnter={() => setHoveredMetric(metric.name)}
                        onMouseLeave={() => setHoveredMetric(null)}
                        className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-slate-50/50 cursor-pointer ${
                          isHovered ? "border-violet-500/30 bg-violet-50 translate-y-[-4px] shadow-md shadow-violet-500/5" : "border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                            {metric.icon}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-800">{metric.name}</h5>
                            <span className="text-[9px] font-mono text-slate-400 uppercase">{metric.source}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          {metric.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-24 text-center">
          <Link href="/signup">
            <Button size="lg" variant="glow" className="cursor-pointer font-bold rounded-xl px-8 py-5 shadow-lg shadow-violet-500/10">
              Deploy Telemetry Modules <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
