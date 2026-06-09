"use client";

import React from "react";
import { Brain, Star, CheckCircle, GraduationCap, Target, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { motion } from "framer-motion";

export default function AboutPage() {
  const timeline = [
    { year: "2024", title: "Project Inception", description: "Established research guidelines with neuroscientists to map HRV telemetry against cognitive fatigue indices." },
    { year: "2025", title: "AI Modeling Beta", description: "Trained transformer sentiment model against anonymized journal text logs, securing a 94% stress peak prediction rate." },
    { year: "2026", title: "BrainOS Launch", description: "Deployed Personal Mental Health Operating System frontend and opened synchronization ports for major consumer wearables." }
  ];

  const board = [
    { name: "Dr. Elena Rostova", role: "Neuroscientist & Advisor", bio: "Former researcher at Max Planck Institute focusing on chronic workplace burnout biomarkers." },
    { name: "Devin Vance", role: "Cognitive AI Architect", bio: "Pioneered neural sentiment classification algorithms designed for clinical mental assessment tools." }
  ];

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 font-sans text-slate-900 relative">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">About Story</h1>
          <p className="text-4xl md:text-5xl font-black mt-3 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">Optimizing Cognitive Longevity</p>
          <p className="text-slate-500 mt-4 text-xs sm:text-sm md:text-base leading-relaxed">
            BrainOS was founded by a team of neuroscientists, software architects, and clinicians who set out to make mental wellness quantifiable and forecastable.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="border border-slate-100 bg-slate-50/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600/5 border border-violet-500/10 flex items-center justify-center text-violet-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Our Mission</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                To build an accessible personal operating system that empowers individuals to measure, anticipate, and manage cognitive energy levels, stress factors, and fatigue before executive burnout can occur.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 bg-slate-50/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/5 border border-cyan-500/10 flex items-center justify-center text-cyan-600">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">The Scientific Focus</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                By bridging physiological bio-telemetry patterns (HRV, sleep architecture) with cognitive sentiment logs, we capture the mind's overall operating index, shifting mental health care from reactive to predictive.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Progress Visualizer */}
        <div className="space-y-8 mb-24">
          <div className="text-center max-w-sm mx-auto mb-12">
            <h3 className="text-2xl font-bold text-slate-900">Development Milestones</h3>
            <p className="text-xs text-slate-400 mt-1">Our path to cognitive forecasting</p>
          </div>

          <div className="relative border-l border-slate-150 pl-6 space-y-8 max-w-2xl mx-auto">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Node dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-650 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" /> {item.year}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board Profiles */}
        <div className="space-y-12">
          <div className="text-center max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-slate-900">Scientific Advisory Board</h3>
            <p className="text-xs text-slate-400 mt-1">Leading neurological research guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {board.map((member, idx) => (
              <Card key={idx} className="border border-slate-100 bg-slate-50/50 p-6 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/5 border border-cyan-500/10 flex items-center justify-center text-cyan-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{member.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
