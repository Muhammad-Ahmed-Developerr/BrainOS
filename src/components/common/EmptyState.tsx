import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center glassmorphism rounded-2xl border border-white/5 py-12">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-cyan-400">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all text-white font-mono"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
export default EmptyState;
