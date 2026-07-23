'use client';

import React from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import { Brain, ShieldCheck, Heart, Sparkles, Cpu, Github, Globe } from 'lucide-react';

export default function Footer() {
  const { setActiveView } = useBrainOS();

  return (
    <footer className="w-full bg-[#020203] border-t border-white/5 pt-12 pb-8 px-4 lg:px-8 mt-20 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand & Philosophy */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white uppercase tracking-tight">BrainOS</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            The World&apos;s First Personal Mental Health Operating System. Powered by real-time neural scoring, local storage privacy, and Groq LLM intelligence.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Local Storage Enclave</span>
          </div>
        </div>

        {/* Col 2: Core Modules */}
        <div>
          <h5 className="font-mono font-medium text-gray-400 uppercase tracking-widest mb-3 text-[10px]">Core Operating System</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('dashboard')} className="hover:text-cyan-400 transition-colors">
                Neural Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('checkin')} className="hover:text-cyan-400 transition-colors">
                Daily Check-In
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('stress')} className="hover:text-cyan-400 transition-colors">
                Stress Analyzer
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('burnout')} className="hover:text-cyan-400 transition-colors">
                Burnout Predictor
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('focus')} className="hover:text-cyan-400 transition-colors">
                Focus Analyzer
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Intelligence & Analytics */}
        <div>
          <h5 className="font-mono font-medium text-gray-400 uppercase tracking-widest mb-3 text-[10px]">AI & Research</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveView('coach')} className="hover:text-cyan-400 transition-colors">
                Groq AI Coach
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('architecture')} className="hover:text-cyan-400 transition-colors">
                AI Pipeline Architecture
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('journal')} className="hover:text-cyan-400 transition-colors">
                Neural Journal Analysis
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('reports')} className="hover:text-cyan-400 transition-colors">
                Clinical Reports & Export
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('research')} className="hover:text-cyan-400 transition-colors">
                Neuroscience Research
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Platform Status */}
        <div>
          <h5 className="font-mono font-medium text-gray-400 uppercase tracking-widest mb-3 text-[10px]">System Telemetry</h5>
          <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 space-y-2 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
            <div className="flex justify-between items-center">
              <span>Local Node</span>
              <span className="text-cyan-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Encryption</span>
              <span className="text-purple-400">AES-256</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Neural Link</span>
              <span className="text-emerald-400">Synchronized</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-mono">
        <div>
          Local Engine: Active • AES-256 Secured
        </div>
        <div className="flex items-center gap-2">
          <span>System Health</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-cyan-500 rounded-sm"></div>
            <div className="w-1 h-3 bg-cyan-500 rounded-sm"></div>
            <div className="w-1 h-3 bg-cyan-500 rounded-sm"></div>
            <div className="w-1 h-3 bg-white/20 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
