// * StatBadge Component: Telemetry badge display.
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
    cyan: 'bg-cyan-50/90 border-cyan-200 text-cyan-800',
    amber: 'bg-amber-50/90 border-amber-200 text-amber-800',
    emerald: 'bg-emerald-50/90 border-emerald-200 text-emerald-800',
    red: 'bg-red-50/90 border-red-200 text-red-800',
    slate: 'bg-slate-100/90 border-slate-200 text-slate-700',
  };

  return (
    <div className={`flex flex-col p-3 rounded-xl border ${colorMap[variant]} transition-all duration-200 shadow-sm`}>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600">{label}</span>
        {icon && <span className="opacity-90">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-black tracking-tight font-mono text-slate-900">{value}</span>
        {unit && <span className="text-xs font-bold text-slate-600 uppercase">{unit}</span>}
      </div>
      {subtext && <span className="text-[10px] font-medium text-slate-600 mt-0.5 truncate">{subtext}</span>}
    </div>
  );
});

StatBadge.displayName = 'StatBadge';
