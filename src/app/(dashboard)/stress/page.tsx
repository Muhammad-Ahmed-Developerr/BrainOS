"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Wind, Play } from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { StressService } from "../../../services/stress.service";
import { StressChart } from "../../../components/charts/StressChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Slider } from "../../../components/ui/slider";
import { MOCK_MEDITATIONS } from "../../../data/mock-stress";

export default function StressPage() {
  const stressReadings = useBrainStore((s) => s.stressReadings);
  const metrics = useBrainStore((s) => s.metrics);
  const [stressInput, setStressInput] = useState(50);
  const [logging, setLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const handleLogStress = async () => {
    setLogging(true);
    await StressService.logStress(stressInput);
    setLogging(false);
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  const categoryColor: Record<string, string> = {
    calm: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    focus: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    anxiety: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    sleep: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-600/15 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Stress Monitor</h1>
          <p className="text-xs text-slate-400 font-mono">Track HRV telemetry and cortisol stress indices</p>
        </div>
      </div>

      {/* Key bio stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Current Stress", value: `${metrics.stressScore}/100`, icon: <Activity className="w-4 h-4" />, color: "text-yellow-400" },
          { label: "Latest HRV", value: `${stressReadings[0]?.hrv ?? "—"}ms`, icon: <Heart className="w-4 h-4" />, color: "text-rose-400" },
          { label: "Heart Rate", value: `${stressReadings[0]?.heartRate ?? "—"}bpm`, icon: <Wind className="w-4 h-4" />, color: "text-cyan-400" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-white/5">
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{stat.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Log */}
        <Card className="border border-white/5">
          <CardHeader><CardTitle className="text-slate-200 text-base">Log Subjective Stress</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400 font-mono">Stress Level</span>
                <span className="text-xl font-bold text-yellow-400">{stressInput}</span>
              </div>
              <Slider min={0} max={100} step={1} value={stressInput} onValueChange={setStressInput} />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>Relaxed</span><span>Critical</span>
              </div>
            </div>
            {logSuccess && <p className="text-xs text-emerald-400 font-mono text-center animate-pulse">✓ Stress reading logged</p>}
            <Button onClick={handleLogStress} disabled={logging} variant="default" className="w-full cursor-pointer">
              {logging ? "Syncing..." : "Log Reading"}
            </Button>
          </CardContent>
        </Card>

        {/* Guided Meditations */}
        <Card className="border border-white/5">
          <CardHeader><CardTitle className="text-slate-200 text-base">Guided Meditations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_MEDITATIONS.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all bg-white/3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-200">{med.title}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize ${categoryColor[med.category]}`}>{med.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{med.duration} mins</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 hover:bg-violet-600/35 transition-all cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <StressChart />
    </motion.div>
  );
}
