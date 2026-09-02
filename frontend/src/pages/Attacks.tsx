import React, { useState } from 'react';
import { ShieldAlert, Play, AlertTriangle, CheckCircle, RefreshCw, Radio, Key, Flame, Zap } from 'lucide-react';
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
      description: 'Attacker fabricates quantum signature data without knowing Alice’s Pauli basis or entangled state. Results in random projective measurement collapse (~50% error).',
      actionLabel: 'Simulate Forgery',
    },
    {
      type: 'IMPERSONATION',
      title: 'Signer Impersonation Attack',
      icon: Key,
      severity: 'HIGH',
      description: 'Unauthorized entity submits signature claiming identity of legitimate signer. Caught deterministically via registry identity verification checks.',
      actionLabel: 'Simulate Impersonation',
    },
    {
      type: 'REPLAY_ATTACK',
      title: 'Replay Attack',
      icon: Radio,
      severity: 'CRITICAL',
      description: 'Attacker intercepts and retransmits a previously verified signature and nonce. System detects nonce consumption status and invalidates session.',
      actionLabel: 'Simulate Replay',
    },
    {
      type: 'CHANNEL_MANIPULATION',
      title: 'Quantum Channel Manipulation',
      icon: Zap,
      severity: 'MEDIUM',
      description: 'Simulates physical quantum channel disturbance, bit/phase flip noise, or eavesdropper intercept-resend measurements. Evaluates noise thresholds.',
      actionLabel: 'Simulate Channel Noise',
    },
    {
      type: 'UNAUTHORIZED_VERIFICATION',
      title: 'Unauthorized Verifier Attack',
      icon: ShieldAlert,
      severity: 'HIGH',
      description: 'Attempt to execute verification from an unauthorized node or revoked session token. Checked via verifier authorization policy.',
      actionLabel: 'Simulate Unauthorized Access',
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
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Quantum Cyber Attack Simulator & Defense Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Safely test protocol resilience against signature forgery, identity impersonation, nonce replay, channel noise, and unauthorized access in software simulation.
        </p>
      </div>

      {/* Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {attacksConfig.map((atk) => {
          const Icon = atk.icon;
          const isRunning = loading && activeAttack === atk.type;

          return (
            <div
              key={atk.type}
              className="cyber-card flex flex-col justify-between hover:border-rose-500/50 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                      atk.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : atk.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {atk.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{atk.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {atk.description}
                  </p>
                </div>

                {/* Additional controls for specific attacks */}
                {atk.type === 'CHANNEL_MANIPULATION' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Simulated Noise Level:</span>
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
                      Attacker Entity Name:
                    </label>
                    <input
                      type="text"
                      value={impersonateName}
                      onChange={(e) => setImpersonateName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleSimulate(atk.type)}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Attack Simulation Outcome Inspector */}
      {attackResult && (
        <div className="cyber-card space-y-4 font-mono animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Attack Response Telemetry
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                {attackResult.attack_id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Detection Status:</span>
              {attackResult.detected ? (
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>DETECTED & BLOCKED</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-500/40 text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>BYPASSED</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Attack Vector</span>
              <span className="text-slate-200 font-bold">{attackResult.attack_type}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Observed Error Rate</span>
              <span className="text-amber-300 font-bold">{(attackResult.measurement_error * 100).toFixed(2)}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Severity Rating</span>
              <span className="text-rose-400 font-bold">{attackResult.severity}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Verification Decision</span>
              <DecisionBadge decision={attackResult.verification_session?.decision || 'REJECTED'} size="sm" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 text-[11px] block font-bold mb-1">Detection Logic & Scientific Reason:</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {attackResult.reason}
            </p>
          </div>

          {attackResult.alert_generated && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Security Alert Dispatched: {attackResult.alert_generated.alert_id} ({attackResult.alert_generated.title})</span>
              </div>
              <span className="text-slate-400 text-[11px]">Logged to Incident Response Center</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
