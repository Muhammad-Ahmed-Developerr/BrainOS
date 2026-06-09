import React from "react";
import { Moon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const SleepCard: React.FC = () => {
  const sleepScore = useBrainStore((state) => state.metrics.sleepScore);

  let sleepLevel = "Optimal";
  let statusColor = "text-emerald-400";
  if (sleepScore < 60) {
    sleepLevel = "Restless";
    statusColor = "text-rose-400";
  } else if (sleepScore < 80) {
    sleepLevel = "Suboptimal";
    statusColor = "text-indigo-300";
  }

  return (
    <Card className="relative group overflow-hidden border border-white/5 shadow-2xl hover:border-indigo-500/20 transition-all duration-300">
      {/* Ambient background blur circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-indigo-600/5 blur-2xl group-hover:bg-indigo-600/10 transition-all duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Sleep Quality
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Moon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold tracking-tight text-white">{sleepScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className={`w-2 h-2 rounded-full bg-current ${statusColor}`} />
            <span className={`text-xs font-semibold ${statusColor}`}>{sleepLevel}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Oura Sync</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default SleepCard;
