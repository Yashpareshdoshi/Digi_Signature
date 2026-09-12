import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface DecisionBadgeProps {
  decision: string;
  threat?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, threat, size = 'md' }) => {
  const d = (decision || '').toUpperCase();
  const t = (threat || 'NONE').toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  if (d === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] dark:bg-emerald-950/80 dark:border-emerald-500/40 dark:text-emerald-400 font-semibold shadow-xs ${sizeClasses}`}>
        <ShieldCheck className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>VERIFIED</span>
      </span>
    );
  }

  if (d === 'SUSPICIOUS') {
    return (
      <span className={`inline-flex items-center rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] dark:bg-amber-950/80 dark:border-amber-500/40 dark:text-amber-400 font-semibold shadow-xs ${sizeClasses}`}>
        <AlertTriangle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>SUSPICIOUS {t !== 'NONE' && `(${t})`}</span>
      </span>
    );
  }

  if (d === 'REJECTED') {
    return (
      <span className={`inline-flex items-center rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/80 dark:border-rose-500/40 dark:text-rose-400 font-semibold shadow-xs ${sizeClasses}`}>
        <ShieldAlert className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>REJECTED {t !== 'NONE' && `(${t})`}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-medium shadow-xs ${sizeClasses}`}>
      <CheckCircle2 className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{d || 'UNKNOWN'}</span>
    </span>
  );
};
