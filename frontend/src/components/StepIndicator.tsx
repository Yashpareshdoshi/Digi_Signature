import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Cpu, Zap, CheckCircle2, Scale, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1 to 5
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Message', desc: 'Payload & Signer', path: '/simulator', icon: FileText },
    { num: 2, label: 'Signature', desc: 'SHA-256 + Nonce', path: '/simulator', icon: Cpu },
    { num: 3, label: 'Teleportation', desc: 'Bell Pair Transfer', path: '/simulator', icon: Zap },
    { num: 4, label: 'Verification', desc: 'QBER & Sifting', path: '/verification', icon: CheckCircle2 },
    { num: 5, label: 'Decision', desc: 'Ledger Audit Chain', path: '/verification', icon: Scale },
  ];

  return (
    <div className="bg-white border border-[#CBD5E1] shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:border-[#0891B2] hover:shadow-[0_4px_16px_rgba(8,145,178,0.10)] dark:bg-[#0b0f19] dark:border-slate-800 rounded-xl p-3.5 sm:p-4 mb-6 transition-all">
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto">
        {steps.map((step, idx) => {
          const isCurrent = step.num === currentStep;
          const isCompleted = step.num < currentStep;

          return (
            <React.Fragment key={step.num}>
              <NavLink
                to={step.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all min-w-max ${
                  isCurrent
                    ? 'bg-[#ECFEFF] border border-[#A5F3FC] text-[#0891B2] dark:bg-cyan-950/70 dark:border-cyan-500/40 dark:text-cyan-300 shadow-xs'
                    : isCompleted
                    ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] hover:bg-[#DCFCE7] dark:bg-slate-900/60 dark:border-slate-800 dark:text-emerald-400 dark:hover:bg-slate-900'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                    isCurrent
                      ? 'bg-[#0891B2] text-white'
                      : isCompleted
                      ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                      : 'bg-[#E2E8F0] text-[#64748B] dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : `0${step.num}`}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#0F172A] dark:text-white' : 'text-[#475569] dark:text-slate-300'}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-slate-400 hidden md:block">
                    {step.desc}
                  </div>
                </div>
              </NavLink>

              {idx < steps.length - 1 && (
                <div className="text-[#CBD5E1] dark:text-slate-700 hidden sm:block">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
