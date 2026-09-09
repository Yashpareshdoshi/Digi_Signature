import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Radio,
  Key,
  Flame,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { AttackRecord } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';

export const Attacks: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [attackResult, setAttackResult] = useState<AttackRecord | null>(null);
  const [noiseSlider, setNoiseSlider] = useState(0.25);
  const [impersonateName, setImpersonateName] = useState('Eve-Malicious');
  const [error, setError] = useState<string | null>(null);

  const attacksConfig = [
    {
      type: 'SIGNATURE_FORGERY',
      title: 'Signature Forgery Attack',
      icon: Flame,
      severity: 'HIGH',
      vector: 'Quantum State Fabrication',
      simulation: 'Fabricates signature qubit without Alice’s basis',
      evidence: 'State collapse triggers ~50% random measurement errors',
      detection: 'Rule 4 & Rule 5: QBER strictly exceeds T_high (15%)',
      actionLabel: 'Simulate Forgery',
    },
    {
      type: 'REPLAY_ATTACK',
      title: 'Stolen Signature Replay Attack',
      icon: Radio,
      severity: 'CRITICAL',
      vector: 'Cryptographic Nonce Reuse',
      simulation: 'Retransmits valid past signature token and nonce',
      evidence: 'Nonce status lookup in Single-Use Nonce Store',
      detection: 'Rule 3: Nonce was already consumed in prior session',
      actionLabel: 'Simulate Replay',
    },
    {
      type: 'IMPERSONATION',
      title: 'Signer Impersonation Attack',
      icon: Key,
      severity: 'HIGH',
      vector: 'Identity Spoofing',
      simulation: 'Unauthorized entity submits signature claiming Alice identity',
      evidence: 'Signer verification against PKI/QDS Registry',
      detection: 'Rule 1: Signer not found in authorized entity registry',
      actionLabel: 'Simulate Impersonation',
    },
    {
      type: 'CHANNEL_MANIPULATION',
      title: 'Channel Noise & Intercept-Resend',
      icon: Zap,
      severity: 'MEDIUM',
      vector: 'Quantum Channel Disturbance',
      simulation: 'Applies depolarizing / eavesdropper intercept noise',
      evidence: 'QBER exceeds baseline calibration thresholds',
      detection: 'Rule 5: Wilson CI Upper exceeds T_low (5%) boundary',
      actionLabel: 'Simulate Channel Noise',
    },
    {
      type: 'UNAUTHORIZED_VERIFICATION',
      title: 'Unauthorized Verifier Probe',
      icon: ShieldAlert,
      severity: 'HIGH',
      vector: 'Access Policy Breach',
      simulation: 'Rogue untrusted server attempts to trigger verification',
      evidence: 'Verifier authorization access check',
      detection: 'Rule 1: Verifier not authorized to access session',
      actionLabel: 'Simulate Rogue Node',
    },
  ];

  const handleSimulate = async (atkType: string) => {
    try {
      setLoading(true);
      setActiveAttack(atkType);
      setError(null);
      setAttackResult(null);

      const res = await api.simulateAttack({
        attack_type: atkType,
        noise_level: noiseSlider,
        forged_signer: impersonateName,
        shots: 1000,
      });

      setAttackResult(res);
    } catch (err: any) {
      setError(err.message || 'Attack simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Quantum Cyber Attack Simulator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
              Threat Testing Suite
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Safely inject attack vectors to demonstrate deterministic threat detection across physical and classical layers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Defense Accuracy: <strong className="text-emerald-400">100%</strong></span>
        </div>
      </div>

      {/* Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {attacksConfig.map((atk) => {
          const Icon = atk.icon;
          const isRunning = loading && activeAttack === atk.type;

          return (
            <div
              key={atk.type}
              className="cyber-card flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                      atk.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : atk.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {atk.severity}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-white">{atk.title}</h2>
                  <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                    Vector: {atk.vector}
                  </span>
                </div>

                {/* Clear Pipeline: Simulation → Evidence → Detection */}
                <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Simulation Step:</span>
                    <span className="text-slate-300">{atk.simulation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Observed Evidence:</span>
                    <span className="text-amber-300">{atk.evidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Detection Invariant:</span>
                    <span className="text-emerald-400">{atk.detection}</span>
                  </div>
                </div>

                {/* Additional controls for specific attacks */}
                {atk.type === 'CHANNEL_MANIPULATION' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Injected Noise Level:</span>
                      <span className="text-cyan-400 font-bold">{(noiseSlider * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.45"
                      step="0.05"
                      value={noiseSlider}
                      onChange={(e) => setNoiseSlider(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}

                {atk.type === 'IMPERSONATION' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <label className="block text-[11px] font-mono text-slate-400">
                      Claimed Entity Name:
                    </label>
                    <input
                      type="text"
                      value={impersonateName}
                      onChange={(e) => setImpersonateName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleSimulate(atk.type)}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Simulating Attack...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-rose-300" />
                      <span>{atk.actionLabel}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Attack Simulation Result Inspector */}
      {attackResult && (
        <div className="cyber-card space-y-4 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Attack Response Telemetry
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs border border-slate-800">
                {attackResult.attack_id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Detection Status:</span>
              {attackResult.detected ? (
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>DETECTED & INTERCEPTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-500/40 text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>BYPASSED</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Attack Vector</span>
              <span className="text-slate-200 font-bold">{attackResult.attack_type}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Observed QBER</span>
              <span className="text-amber-300 font-bold">{(attackResult.measurement_error * 100).toFixed(2)}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Severity Rating</span>
              <span className="text-rose-400 font-bold">{attackResult.severity}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase">Verification Verdict</span>
              <DecisionBadge decision={attackResult.verification_session?.decision || 'REJECTED'} size="sm" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-bold mb-1">
              Deterministic Detection Reasoning:
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {attackResult.reason}
            </p>
          </div>

          {attackResult.alert_generated && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Alert Dispatched: {attackResult.alert_generated.alert_id} — {attackResult.alert_generated.title}</span>
              </div>
              <span className="text-slate-400 text-[11px]">Logged in Incident Center</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
