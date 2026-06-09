import React from "react";
import { ZapOff } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const BurnoutCard: React.FC = () => {
  const burnoutScore = useBrainStore((state) => state.metrics.burnoutScore);

  let riskText = "Safe Range";
  let statusColor = "text-emerald-400";
  if (burnoutScore > 60) {
    riskText = "High Risk";
    statusColor = "text-rose-400";
  } else if (burnoutScore > 30) {
    riskText = "Moderate Fatigue";
    statusColor = "text-amber-400";
  }

  return (
    <Card className="relative group overflow-hidden border border-white/5 shadow-2xl hover:border-red-500/20 transition-all duration-300">
      {/* Ambient background blur circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-red-600/5 blur-2xl group-hover:bg-red-600/10 transition-all duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Burnout Index
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ZapOff className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold tracking-tight text-white">{burnoutScore}%</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className={`w-2 h-2 rounded-full bg-current ${statusColor}`} />
            <span className={`text-xs font-semibold ${statusColor}`}>{riskText}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">AI Forecast</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default BurnoutCard;
