import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  retryText?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "A telemetry glitch has occurred. Re-establishing link...",
  retryText = "Retry Sync",
  onRetry
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center glassmorphism rounded-2xl border border-red-500/20 py-12">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle className="w-6 h-6 animate-pulse" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">Telemetry Sync Failed</h3>
      <p className="mt-2 text-sm text-red-200/70 max-w-sm font-mono text-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30 transition-all font-mono"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};
export default ErrorState;
