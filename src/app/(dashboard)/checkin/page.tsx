"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle } from "lucide-react";
import { Slider } from "../../../components/ui/slider";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useBrainStore } from "../../../store/useBrainStore";

export default function CheckInPage() {
  const addStressReading = useBrainStore((s) => s.addStressReading);
  const [energy, setEnergy] = useState(70);
  const [sleep, setSleep] = useState(75);
  const [stress, setStress] = useState(40);
  const [focus, setFocus] = useState(65);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    addStressReading(stress);
    setSubmitted(true);
  };

  const metrics = [
    { label: "Energy Level", value: energy, onChange: setEnergy, color: "from-amber-500 to-yellow-400", emoji: "⚡" },
    { label: "Sleep Quality", value: sleep, onChange: setSleep, color: "from-indigo-500 to-violet-400", emoji: "🌙" },
    { label: "Stress Index", value: stress, onChange: setStress, color: "from-red-500 to-rose-400", emoji: "📊" },
    { label: "Focus Clarity", value: focus, onChange: setFocus, color: "from-cyan-500 to-blue-400", emoji: "🎯" },
  ];

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Check-In Synced</h2>
          <p className="text-slate-400 text-sm font-sans leading-relaxed">
            Your neural baseline has been updated. AI models are recalibrating your stress forecast and burnout indicators.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="cursor-pointer">
            Run Another Check-In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Daily Neural Check-In</h1>
          <p className="text-xs text-slate-400 font-mono">Calibrate today's biological baseline</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {metrics.map((m) => (
          <Card key={m.label} className="border border-white/5 hover:border-white/10 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-sm font-semibold text-slate-200">{m.label}</span>
                </div>
                <span className={`text-2xl font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                  {m.value}
                </span>
              </div>
              <Slider min={0} max={100} step={1} value={m.value} onValueChange={m.onChange} />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Critical</span><span>Optimal</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} variant="default" size="lg" className="w-full cursor-pointer">
        Sync Neural Baseline <CheckCircle className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
