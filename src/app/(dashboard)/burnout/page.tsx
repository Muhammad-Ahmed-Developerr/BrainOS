"use client";

import React from "react";
import { motion } from "framer-motion";
import { ZapOff, Clock, Users, Moon, AlertTriangle } from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { BurnoutChart } from "../../../components/charts/BurnoutChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export default function BurnoutPage() {
  const burnout = useBrainStore((s) => s.burnoutMetrics);
  const forecast = useBrainStore((s) => s.wellnessForecast);

  const riskColor =
    burnout.burnoutRisk > 60 ? "text-rose-400" :
    burnout.burnoutRisk > 30 ? "text-amber-400" : "text-emerald-400";

  const stats = [
    { label: "Burnout Risk",       value: `${burnout.burnoutRisk}%`,      icon: <ZapOff className="w-4 h-4" />,  color: riskColor },
    { label: "Overtime Hours",     value: `${burnout.overtimeHoursThisWeek}h`, icon: <Clock className="w-4 h-4" />,  color: "text-amber-400" },
    { label: "Meeting Density",    value: `${burnout.meetingDensityScore}/100`, icon: <Users className="w-4 h-4" />,  color: "text-cyan-400" },
    { label: "Insomnia Index",     value: `${burnout.insomniaIndex}/100`,  icon: <Moon className="w-4 h-4" />,   color: "text-indigo-400" },
    { label: "Cognitive Load",     value: `${burnout.cognitiveLoad}/100`,  icon: <AlertTriangle className="w-4 h-4" />, color: "text-violet-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-600/15 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ZapOff className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Burnout Monitor</h1>
          <p className="text-xs text-slate-400 font-mono">AI cognitive fatigue and overwork risk analysis</p>
        </div>
      </div>

      {/* Risk Banner */}
      {forecast.burnoutWarningZone && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/25">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-red-300">⚠ Burnout Warning Zone Active</p>
            <p className="text-xs text-red-200/70 mt-1 font-sans leading-relaxed">{forecast.recommendedRecoveryAction}</p>
            {forecast.upcomingStressPeakDate && (
              <p className="text-[10px] text-red-300/60 font-mono mt-2">
                Predicted stress peak: {new Date(forecast.upcomingStressPeakDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border border-white/5">
            <CardContent className="p-4 space-y-2">
              <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workload Chart */}
      <BurnoutChart />

      {/* Trigger Factors */}
      <Card className="border border-white/5">
        <CardHeader><CardTitle className="text-slate-200 text-base">AI Risk Factor Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {forecast.triggerFactors.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                f.impact === "high" ? "text-rose-400 bg-rose-500/10 border-rose-500/25" :
                f.impact === "medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/25" :
                "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
              }`}>{f.impact}</span>
              <p className="text-xs text-slate-300 font-sans">{f.factor}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
