import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AutoFillBadge({ count, onClick }) {
  if (!count || count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs rounded-lg border border-emerald-500/30 transition-colors"
    >
      <Sparkles className="w-3 h-3" />
      <span>{count} auto-fill{count > 1 ? 's' : ''}</span>
    </button>
  );
}

export function SectionProgress({ filled, total }) {
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 font-mono">
        {filled}/{total}
      </span>
    </div>
  );
}

export function CompletionIndicator({ isComplete }) {
  if (isComplete) {
    return (
      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
        Complete
      </span>
    );
  }
  return null;
}
