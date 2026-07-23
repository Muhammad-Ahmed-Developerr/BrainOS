'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Brain, Heart, Send, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export default function AboutContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" />
          <span>Product Philosophy & Credits</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">About BrainOS</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          BrainOS was created to redefine mental health technology from passive tracking apps to a proactive, real-time Neural Operating System.
        </p>
      </div>

      {/* MISSION CARD */}
      <GlassCard glowColor="cyan" className="space-y-4">
        <h3 className="text-xl font-bold text-white">Our Core Mission</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Mental health technology should feel like an Apple-grade, high-performance operating system—clean, predictive, ultra-responsive, and uncompromised on user privacy. BrainOS eliminates cloud servers and backend databases, placing 100% data control directly in your hands.
        </p>
      </GlassCard>

      {/* FEEDBACK & CONTACT FORM */}
      <GlassCard glowColor="purple" className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-400" />
          <span>Research Demonstration Feedback</span>
        </h3>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">Feedback Received!</div>
            <p className="text-xs text-slate-300">
              Thank you for evaluating BrainOS for the International Neuroscience Conference.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Alex Rivera"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@neuroscience.org"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Observations / Feedback</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts or research inquiries..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
