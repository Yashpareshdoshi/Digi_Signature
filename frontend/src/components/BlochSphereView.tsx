import React from 'react';
import { StatevectorData } from '../types';

interface BlochSphereViewProps {
  statevector?: StatevectorData;
  label?: string;
}

export const BlochSphereView: React.FC<BlochSphereViewProps> = ({ statevector, label = 'Quantum State' }) => {
  if (!statevector) {
    return (
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-center text-xs text-slate-500">
        No statevector data available.
      </div>
    );
  }

  const bloch = statevector.bloch;

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 flex flex-col gap-3 font-mono transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">{label}</span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Dim: {statevector.dimension} ({statevector.num_qubits} Qubit{statevector.num_qubits > 1 ? 's' : ''})</span>
      </div>

      {/* Basis Amplitudes Bars */}
      <div className="space-y-2">
        {statevector.basis_states.map((basis, idx) => {
          const prob = statevector.probabilities[idx];
          const amp = statevector.amplitudes[idx];
          const pct = Math.round(prob * 100);

          return (
            <div key={basis} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-800 dark:text-slate-300 font-bold">|{basis}⟩</span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                  p = {pct}% &nbsp;({amp.real >= 0 ? '+' : ''}{amp.real.toFixed(3)} {amp.imag >= 0 ? '+' : ''}{amp.imag.toFixed(3)}i)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bloch Coordinates if 1-qubit */}
      {bloch && (
        <div className="mt-2 pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="p-2 rounded bg-white border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 shadow-sm">
            <span className="text-slate-500 block text-[10px]">θ (Theta)</span>
            <span className="text-cyan-700 dark:text-cyan-300 font-bold">{bloch.theta_deg.toFixed(1)}°</span>
          </div>
          <div className="p-2 rounded bg-white border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 shadow-sm">
            <span className="text-slate-500 block text-[10px]">φ (Phi)</span>
            <span className="text-purple-700 dark:text-purple-300 font-bold">{bloch.phi_deg.toFixed(1)}°</span>
          </div>
          <div className="p-2 rounded bg-white border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 shadow-sm">
            <span className="text-slate-500 block text-[10px]">Bloch Vector</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">({bloch.x.toFixed(2)}, {bloch.y.toFixed(2)}, {bloch.z.toFixed(2)})</span>
          </div>
        </div>
      )}
    </div>
  );
};
