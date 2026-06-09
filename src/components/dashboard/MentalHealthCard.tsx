import React from "react";
import { Brain } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const MentalHealthCard: React.FC = () => {
  const mentalScore = useBrainStore((state) => state.metrics.mentalHealthScore);

  let healthStatus = "Optimal";
  let statusColor = "text-emerald-400";
  if (mentalScore < 50) {
    healthStatus = "Needs Attention";
    statusColor = "text-rose-400";
  } else if (mentalScore < 75) {
    healthStatus = "Moderate Balance";
    statusColor = "text-cyan-400";
  }

  return (
    <Card className="relative group overflow-hidden border border-white/5 shadow-2xl hover:border-violet-500/20 transition-all duration-300">
      {/* Ambient background blur circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-violet-600/10 blur-2xl group-hover:bg-violet-600/20 transition-all duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Mental Health Index
          </span>
          <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Brain className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold tracking-tight text-white">{mentalScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className={`w-2 h-2 rounded-full bg-current ${statusColor}`} />
            <span className={`text-xs font-semibold ${statusColor}`}>{healthStatus}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">AI Synced</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default MentalHealthCard;
