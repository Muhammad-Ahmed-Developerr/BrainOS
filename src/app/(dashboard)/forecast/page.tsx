"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, AlertTriangle, Brain, Shield, Zap } from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { SleepChart } from "../../../components/charts/SleepChart";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ForecastPage() {
  const forecast = useBrainStore((s) => s.wellnessForecast);
  const metrics = useBrainStore((s) => s.metrics);

  const weeklyPredictions = [
    { day: "Monday",    mentalScore: 82, stress: 35, burnout: 22, mood: "Good" },
    { day: "Tuesday",   mentalScore: 78, stress: 42, burnout: 28, mood: "Neutral" },
    { day: "Wednesday", mentalScore: 71, stress: 55, burnout: 38, mood: "Low" },
    { day: "Thursday",  mentalScore: 65, stress: 62, burnout: 45, mood: "Low" },
    { day: "Friday",    mentalScore: 60, stress: 70, burnout: 52, mood: "Bad" },
    { day: "Saturday",  mentalScore: 74, stress: 38, burnout: 30, mood: "Good" },
    { day: "Sunday",    mentalScore: 85, stress: 25, burnout: 18, mood: "Great" },
  ];

  const moodColor = (mood: string) => {
    if (mood === "Great") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
    if (mood === "Good")  return "text-cyan-400 bg-cyan-500/10 border-cyan-500/25";
    if (mood === "Neutral") return "text-slate-400 bg-slate-500/10 border-slate-500/25";
    if (mood === "Low")   return "text-amber-400 bg-amber-500/10 border-amber-500/25";
    return "text-rose-400 bg-rose-500/10 border-rose-500/25";
  };

  const scoreBarColor = (v: number) =>
    v >= 75 ? "from-emerald-500 to-emerald-400" :
    v >= 50 ? "from-cyan-500 to-blue-400" :
    v >= 30 ? "from-amber-500 to-yellow-400" :
    "from-rose-500 to-red-400";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Wellness Forecast</h1>
          <p className="text-xs text-slate-400 font-mono">AI-powered 7-day cognitive & emotional predictions</p>
        </div>
      </motion.div>

      {/* Top-Level Forecast Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Predicted Trend",
            value: forecast.projectedTrend === "improving" ? "↗ Improving" : forecast.projectedTrend === "declining" ? "↘ Declining" : "→ Stable",
            icon: <TrendingUp className="w-4 h-4" />,
            color: forecast.projectedTrend === "improving" ? "text-emerald-400" : forecast.projectedTrend === "declining" ? "text-rose-400" : "text-cyan-400",
          },
          {
            label: "Burnout Risk",
            value: forecast.burnoutWarningZone ? "⚠ HIGH" : "✓ LOW",
            icon: <Zap className="w-4 h-4" />,
            color: forecast.burnoutWarningZone ? "text-rose-400" : "text-emerald-400",
          },
          {
            label: "Resilience",
            value: `${metrics.mentalHealthScore}/100`,
            icon: <Shield className="w-4 h-4" />,
            color: "text-violet-400",
          },
          {
            label: "Next Stress Peak",
            value: forecast.upcomingStressPeakDate
              ? new Date(forecast.upcomingStressPeakDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "None",
            icon: <Calendar className="w-4 h-4" />,
            color: "text-amber-400",
          },
        ].map((s) => (
          <Card key={s.label} className="border border-white/5">
            <CardContent className="p-5 space-y-2">
              <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* 7-Day Table */}
      <motion.div variants={itemVariants}>
        <Card className="border border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200 text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" /> 7-Day Predictive Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Day", "Mental Score", "Stress", "Burnout Risk", "Predicted Mood"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-mono uppercase text-[10px] tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeklyPredictions.map((row, i) => (
                    <tr key={row.day} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`}>
                      <td className="px-4 py-3 font-semibold text-slate-200">{row.day}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-mono font-bold w-8">{row.mentalScore}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                            <div className={`h-full rounded-full bg-gradient-to-r ${scoreBarColor(row.mentalScore)}`} style={{ width: `${row.mentalScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-mono font-bold w-8">{row.stress}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                            <div className={`h-full rounded-full bg-gradient-to-r ${scoreBarColor(100 - row.stress)}`} style={{ width: `${row.stress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-bold ${row.burnout > 40 ? "text-rose-400" : row.burnout > 25 ? "text-amber-400" : "text-emerald-400"}`}>
                          {row.burnout}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border capitalize ${moodColor(row.mood)}`}>
                          {row.mood}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trigger Factors */}
      <motion.div variants={itemVariants}>
        <Card className="border border-white/5">
          <CardHeader>
            <CardTitle className="text-slate-200 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Contributing Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forecast.triggerFactors.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                  f.impact === "high" ? "text-rose-400 bg-rose-500/10 border-rose-500/25" :
                  f.impact === "medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/25" :
                  "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                }`}>{f.impact}</span>
                <p className="text-xs text-slate-300 font-sans flex-1">{f.factor}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recovery Recommendation */}
      <motion.div variants={itemVariants}>
        <div className="glassmorphism rounded-2xl border border-violet-500/15 p-6">
          <span className="text-[10px] font-mono tracking-widest text-violet-400/70 uppercase">AI Recovery Protocol</span>
          <p className="text-sm text-slate-200 mt-3 leading-relaxed font-sans">{forecast.recommendedRecoveryAction}</p>
        </div>
      </motion.div>

      {/* Sleep Chart as predictor baseline */}
      <motion.div variants={itemVariants}>
        <SleepChart />
      </motion.div>
    </motion.div>
  );
}
