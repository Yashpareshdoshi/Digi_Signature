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
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 sm:p-4 mb-6">
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.num === currentStep;
          const isCompleted = step.num < currentStep;

          return (
            <React.Fragment key={step.num}>
              <NavLink
                to={step.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all min-w-max ${
                  isCurrent
                    ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                    : isCompleted
                    ? 'bg-slate-900/60 border border-slate-800 text-emerald-400 hover:bg-slate-900'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : `0${step.num}`}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : ''}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden md:block">
                    {step.desc}
                  </div>
                </div>
              </NavLink>

              {idx < steps.length - 1 && (
                <div className="text-slate-700 hidden sm:block">
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
