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
    default: 'bg-white border-slate-200 text-slate-800 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-800 shadow-md',
    highlight: 'bg-white border-cyan-500 text-slate-800 shadow-cyan-500/10 shadow-md ring-1 ring-cyan-500/20',
    danger: 'bg-red-50 border-red-200 text-red-900 shadow-sm ring-1 ring-red-500/20',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-1 ring-emerald-500/20 shadow-sm',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:border-slate-300 active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
