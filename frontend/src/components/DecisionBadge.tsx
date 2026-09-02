import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface DecisionBadgeProps {
  decision: string;
  threat?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, threat, size = 'md' }) => {
  const d = (decision || '').toUpperCase();
  const t = (threat || 'NONE').toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  if (d === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 ${sizeClasses}`}>
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>VERIFIED</span>
      </span>
    );
  }

  if (d === 'SUSPICIOUS') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 ${sizeClasses}`}>
        <AlertTriangle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>SUSPICIOUS {t !== 'NONE' && `(${t})`}</span>
      </span>
    );
  }

  if (d === 'REJECTED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 ${sizeClasses}`}>
        <ShieldAlert className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>REJECTED {t !== 'NONE' && `(${t})`}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 ${sizeClasses}`}>
      <CheckCircle2 className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{d || 'UNKNOWN'}</span>
    </span>
  );
};
