// * Card Component: Layout card panel.
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'highlight' | 'danger' | 'success';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = React.memo(({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl',
    glass: 'bg-slate-900/70 backdrop-blur-md border-slate-800/80 text-slate-100 shadow-2xl',
    highlight: 'bg-slate-900 border-cyan-500/40 text-slate-100 shadow-cyan-500/10 shadow-lg ring-1 ring-cyan-500/20',
    danger: 'bg-red-950/40 border-red-800/60 text-red-100 shadow-red-950/40 shadow-xl ring-1 ring-red-500/30',
    success: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100 ring-1 ring-emerald-500/30 shadow-lg',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:border-slate-700 active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
