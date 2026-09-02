import React from 'react';
import { QuantumStep } from '../types';

interface QuantumCircuitViewProps {
  steps?: QuantumStep[];
  currentStepIndex?: number;
  bellState?: string;
  measuredBits?: string;
  pauliCorrection?: string;
}

export const QuantumCircuitView: React.FC<QuantumCircuitViewProps> = ({
  steps,
  currentStepIndex,
  bellState = 'Phi+',
  measuredBits = '00',
  pauliCorrection = 'I',
}) => {
  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-cyan-400 font-mono tracking-wider uppercase">
            3-Qubit Quantum Teleportation Circuit
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Alice: Message Qubit (q0) & Entangled Half (q1) | Bob: Entangled Half (q2)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            Bell Pair: |{bellState}⟩
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
            Alice Bits: [{measuredBits}]
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            Bob Correction: {pauliCorrection}
          </span>
        </div>
      </div>

      {/* SVG Circuit Schematic */}
      <div className="min-w-[650px] relative py-4 font-mono select-none">
        {/* Wire 0: Alice's Message |psi> */}
        <div className="flex items-center h-14 relative">
          <div className="w-28 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="text-cyan-400">q₀</span>
            <span className="text-slate-400 text-[11px]">|ψ⟩ Alice</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center">
            {/* Gate placeholder markers along wire */}
            <div className="absolute left-[20%] -top-4 w-9 h-9 rounded bg-slate-800 border border-cyan-500/60 flex items-center justify-center text-xs font-bold text-cyan-300 shadow-md">
              ●
            </div>
            <div className="absolute left-[38%] -top-4 w-9 h-9 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-200 shadow-lg shadow-cyan-950/50">
              H
            </div>
            <div className="absolute left-[56%] -top-4 w-9 h-9 rounded bg-amber-950 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-200">
              M₀
            </div>
            {/* Classical line for b0 */}
            <div className="absolute left-[58%] top-5 w-[38%] h-0.5 border-b border-dashed border-purple-400"></div>
          </div>
        </div>

        {/* Vertical line for CNOT between q0 and q1 */}
        <div className="absolute left-[calc(7rem+20%+17px)] top-[2.2rem] h-[3.4rem] w-0.5 bg-cyan-500 z-0"></div>

        {/* Wire 1: Alice's Bell Half */}
        <div className="flex items-center h-14 relative">
          <div className="w-28 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="text-purple-400">q₁</span>
            <span className="text-slate-400 text-[11px]">|0⟩ EPR_A</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center">
            <div className="absolute left-[6%] -top-4 w-9 h-9 rounded bg-purple-950 border border-purple-500 flex items-center justify-center text-xs font-bold text-purple-200">
              H
            </div>
            <div className="absolute left-[20%] -top-4 w-9 h-9 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center text-sm font-bold text-cyan-300">
              ⊕
            </div>
            <div className="absolute left-[56%] -top-4 w-9 h-9 rounded bg-amber-950 border border-amber-500 flex items-center justify-center text-xs font-bold text-amber-200">
              M₁
            </div>
            {/* Classical line for b1 */}
            <div className="absolute left-[58%] top-5 w-[38%] h-0.5 border-b border-dashed border-purple-400"></div>
          </div>
        </div>

        {/* Wire 2: Bob's Bell Half & Recovery */}
        <div className="flex items-center h-14 relative mt-2">
          <div className="w-28 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="text-emerald-400">q₂</span>
            <span className="text-slate-400 text-[11px]">|0⟩ Bob</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center">
            {/* CNOT between q1 and q2 for EPR prep */}
            <div className="absolute left-[6%] -top-4 w-9 h-9 rounded-full bg-slate-900 border border-purple-400 flex items-center justify-center text-sm font-bold text-purple-300">
              ⊕
            </div>
            {/* Bob's Pauli Correction Unitary */}
            <div className="absolute left-[80%] -top-5 w-20 h-11 rounded-lg bg-emerald-950 border border-emerald-400 flex flex-col items-center justify-center text-xs font-bold text-emerald-200 shadow-lg shadow-emerald-950/60">
              <span>{pauliCorrection}</span>
              <span className="text-[9px] font-normal text-emerald-400/80">Z^{measuredBits[0]}·X^{measuredBits[1]}</span>
            </div>
            {/* Bob's recovered state arrow */}
            <div className="absolute right-0 -top-3 text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span>|ψ'⟩ ≈ |ψ⟩</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Trace Details if available */}
      {steps && steps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5">
          {steps.slice(0, 4).map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs ${
                currentStepIndex === idx
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="font-semibold text-slate-200 mb-1 flex items-center justify-between">
                <span>Step {s.step}: {s.name}</span>
                <span className="font-mono text-[10px] text-cyan-400">{s.circuit_gate}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
