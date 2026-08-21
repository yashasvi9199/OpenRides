import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'emerald' | 'red' | 'slate';
  subtext?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = React.memo(({
  label,
  value,
  unit,
  icon,
  variant = 'cyan',
  subtext,
}) => {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    red: 'text-red-400 bg-red-950/40 border-red-800/40',
    slate: 'text-slate-300 bg-slate-800/60 border-slate-700/60',
  };

  return (
    <div className={`flex flex-col p-3 rounded-xl border ${colorMap[variant]} transition-all duration-200`}>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-400">{label}</span>
        {icon && <span className="opacity-80">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-black tracking-tight font-mono text-slate-100">{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-400 uppercase">{unit}</span>}
      </div>
      {subtext && <span className="text-[10px] text-slate-500 mt-0.5 truncate">{subtext}</span>}
    </div>
  );
});

StatBadge.displayName = 'StatBadge';
