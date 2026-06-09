import React from "react";

interface LoadingStateProps {
  message?: string;
  height?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Syncing neural interfaces...", 
  height = "min-h-[200px]" 
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center p-6 ${height}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest text-slate-400 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};
export default LoadingState;
