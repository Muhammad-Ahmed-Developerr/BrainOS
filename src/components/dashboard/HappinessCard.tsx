import React from "react";
import { Smile } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const HappinessCard: React.FC = () => {
  const happinessScore = useBrainStore((state) => state.metrics.happinessScore);

  let emotionalState = "Serene";
  let statusColor = "text-emerald-400";
  if (happinessScore < 50) {
    emotionalState = "Low Frequency";
    statusColor = "text-amber-400";
  } else if (happinessScore < 75) {
    emotionalState = "Steady";
    statusColor = "text-cyan-400";
  }

  return (
    <Card className="relative group overflow-hidden border border-white/5 shadow-2xl hover:border-emerald-500/20 transition-all duration-300">
      {/* Ambient background blur circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-emerald-600/5 blur-2xl group-hover:bg-emerald-600/10 transition-all duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Happiness Rating
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Smile className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold tracking-tight text-white">{happinessScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className={`w-2 h-2 rounded-full bg-current ${statusColor}`} />
            <span className={`text-xs font-semibold ${statusColor}`}>{emotionalState}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Weekly Avg</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default HappinessCard;
