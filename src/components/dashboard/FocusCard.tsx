import React from "react";
import { Compass } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const FocusCard: React.FC = () => {
  const focusScore = useBrainStore((state) => state.metrics.focusScore);
  const focusStats = useBrainStore((state) => state.focusStats);

  return (
    <Card className="relative group overflow-hidden border border-white/5 shadow-2xl hover:border-cyan-500/20 transition-all duration-300">
      {/* Ambient background blur circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-cyan-600/10 blur-2xl group-hover:bg-cyan-600/20 transition-all duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Focus Score
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold tracking-tight text-white">{focusScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-mono">
            {focusStats.totalFocusTime}m / {focusStats.dailyGoal}m Goal
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            {focusStats.streakDays}d Streak
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
export default FocusCard;
