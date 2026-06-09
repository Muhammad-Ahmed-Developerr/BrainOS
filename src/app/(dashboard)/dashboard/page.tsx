"use client";

import React from "react";
import { motion } from "framer-motion";
import { MentalHealthCard } from "../../../components/dashboard/MentalHealthCard";
import { StressCard } from "../../../components/dashboard/StressCard";
import { BurnoutCard } from "../../../components/dashboard/BurnoutCard";
import { FocusCard } from "../../../components/dashboard/FocusCard";
import { SleepCard } from "../../../components/dashboard/SleepCard";
import { HappinessCard } from "../../../components/dashboard/HappinessCard";
import { MoodChart } from "../../../components/charts/MoodChart";
import { StressChart } from "../../../components/charts/StressChart";
import { useBrainStore } from "../../../store/useBrainStore";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DashboardPage() {
  const user = useBrainStore((s) => s.user);
  const activities = useBrainStore((s) => s.recentActivities);
  const forecast = useBrainStore((s) => s.wellnessForecast);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const typeIconMap: Record<string, string> = {
    mood: "😊",
    focus: "🎯",
    journal: "📝",
    checkin: "✅",
    habit: "🌿"
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting}, {user?.fullName?.split(" ")[0] ?? "Alex"} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {forecast.burnoutWarningZone && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Burnout warning zone detected — review forecast
          </div>
        )}
      </motion.div>

      {/* 6 Metric Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <MentalHealthCard />
        <StressCard />
        <BurnoutCard />
        <FocusCard />
        <SleepCard />
        <HappinessCard />
      </motion.div>

      {/* Main Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart />
        <StressChart />
      </motion.div>

      {/* Recent Activity + AI Insight Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 glassmorphism rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Recent Activity</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Live Feed</span>
          </div>
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{typeIconMap[act.type] ?? "🔷"}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{act.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{act.timestamp}</p>
                  </div>
                </div>
                {act.value && (
                  <span className="text-xs font-mono text-cyan-400">{act.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Quick Insight */}
        <div className="glassmorphism rounded-2xl border border-violet-500/15 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              AI Advisor — Active
            </span>
            <h3 className="text-sm font-semibold text-slate-200 mt-2">Today's Cognitive Forecast</h3>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed font-sans">
              {forecast.recommendedRecoveryAction}
            </p>

            <div className="mt-4 space-y-2">
              {forecast.triggerFactors.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      f.impact === "high"
                        ? "bg-red-400"
                        : f.impact === "medium"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 font-sans">{f.factor}</p>
                </div>
              ))}
            </div>
          </div>

          <Link href="/coach">
            <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600/15 border border-violet-500/20 text-xs font-semibold text-violet-300 hover:bg-violet-600/25 transition-all cursor-pointer">
              Open AI Coach <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
