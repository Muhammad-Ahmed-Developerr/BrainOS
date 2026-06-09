import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full glassmorphism rounded-2xl p-6 border border-white/5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-700/50 rounded w-1/3"></div>
        <div className="h-6 w-6 bg-slate-700/50 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-slate-700/50 rounded w-1/4"></div>
        <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
      </div>
      <div className="h-2 bg-slate-700/50 rounded w-full"></div>
    </div>
  );
};
export default SkeletonCard;
