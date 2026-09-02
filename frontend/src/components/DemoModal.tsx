import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, ShieldAlert, RefreshCw, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../services/api';
import { DemoResponse, DemoTraceStep } from '../types';
import { DecisionBadge } from './DecisionBadge';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [running, setRunning] = useState(false);
  const [scenario, setScenario] = useState('SIGNATURE_FORGERY');
  const [messageText, setMessageText] = useState('Transfer ₹5000 to Account X');
  const [bellState, setBellState] = useState('Phi+');
  const [demoResult, setDemoResult] = useState<DemoResponse | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunDemo = async () => {
    setRunning(true);
    setError(null);
    setDemoResult(null);
    setActiveStep(0);

    try {
      const res = await api.runCompleteDemo({
        message: messageText,
        bell_state: bellState,
        quantum_state: '|0>',
        attack_type: scenario,
      });

      setDemoResult(res);

      // Animate progress through 12 steps
      for (let i = 1; i <= res.trace.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        setActiveStep(i);
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo execution failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1422] border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/50 overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                1-Click Complete Academic Research Demo
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
                  12-Step Protocol
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Executes QDS creation, Bell entanglement, teleportation, measurement, verification, attack injection & deterministic detection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls Config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                Target Message
              </label>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                Bell State EPR Pair
              </label>
              <select
                value={bellState}
                onChange={(e) => setBellState(e.target.value)}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Phi+">|Φ+⟩ = (|00⟩ + |11⟩)/√2</option>
                <option value="Phi-">|Φ-⟩ = (|00⟩ - |11⟩)/√2</option>
                <option value="Psi+">|Ψ+⟩ = (|01⟩ + |10⟩)/√2</option>
                <option value="Psi-">|Ψ-⟩ = (|01⟩ - |10⟩)/√2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                Simulated Attack Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="SIGNATURE_FORGERY">Scenario B: Signature Forgery (Eve fabricated state)</option>
                <option value="REPLAY_ATTACK">Scenario C: Replay Attack (Consumed nonce reuse)</option>
                <option value="IMPERSONATION">Scenario D: Signer Impersonation (Mismatched identity)</option>
                <option value="CHANNEL_MANIPULATION">Scenario E: Channel Manipulation (30% noise)</option>
              </select>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleRunDemo}
              disabled={running}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold flex items-center gap-2.5 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing 12-Step Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Run Live Demonstration</span>
                </>
              )}
            </button>

            {demoResult && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Signature:</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                  {demoResult.signature_id}
                </span>
                <DecisionBadge
                  decision={demoResult.simulated_attack.severity === 'CRITICAL' ? 'REJECTED' : 'REJECTED'}
                  threat={demoResult.simulated_attack.attack_type}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-sm flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 12-Step Progress Timeline */}
          {demoResult && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Execution Trace & Telemetry Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {demoResult.trace.map((t, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep - 1;

                  return (
                    <div
                      key={t.step}
                      className={`p-3 rounded-xl border text-xs transition-all duration-200 flex items-start gap-3 ${
                        isDone
                          ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                          : 'bg-slate-950/40 border-slate-900/60 text-slate-600 opacity-60'
                      } ${isCurrent ? 'border-cyan-500/80 bg-cyan-950/30 ring-1 ring-cyan-500/50' : ''}`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono">
                            {t.step}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-100">
                            {t.step}. {t.title}
                          </span>
                          {t.decision && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              {t.decision}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono leading-tight">{t.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Security Model: Deterministic Quantum Measurement Statistics (Zero AI/ML)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close & Review Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
