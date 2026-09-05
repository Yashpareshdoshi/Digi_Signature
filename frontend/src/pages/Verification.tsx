import React, { useState, useEffect } from 'react';
import { CheckCircle, ShieldCheck, ShieldAlert, AlertTriangle, Play, HelpCircle, Activity, Scale } from 'lucide-react';
import { api } from '../services/api';
import { Signature, VerificationSession } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';
import { DecisionLedgerView } from '../components/DecisionLedgerView';

export const Verification: React.FC = () => {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedSigId, setSelectedSigId] = useState('');
  const [verifierId, setVerifierId] = useState('Verifier-Bob');
  const [claimedSignerId, setClaimedSignerId] = useState('');
  const [tamperedMessage, setTamperedMessage] = useState('');
  const [simulateReplay, setSimulateReplay] = useState(false);
  const [noiseRate, setNoiseRate] = useState(0.0);
  const [shots, setShots] = useState(1000);

  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    try {
      const data = await api.listSignatures();
      setSignatures(data);
      if (data.length > 0) {
        setSelectedSigId(data[0].signature_id);
        setClaimedSignerId(data[0].signer_id);
      }
    } catch (err) {
      console.error('Failed to load signatures:', err);
    }
  };

  const handleSelectSignature = (sigId: string) => {
    setSelectedSigId(sigId);
    const found = signatures.find((s) => s.signature_id === sigId);
    if (found) {
      setClaimedSignerId(found.signer_id);
      setTamperedMessage('');
    }
  };

  const handleVerify = async () => {
    if (!selectedSigId) {
      setError('Please select a signature.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.startVerification({
        signature_id: selectedSigId,
        verifier_id: verifierId,
        claimed_signer_id: claimedSignerId || undefined,
        custom_message: tamperedMessage || undefined,
        shots,
        noise_rate: noiseRate,
        simulate_nonce_reuse: simulateReplay,
      });
      setVerificationResult(res);
    } catch (err: any) {
      setError(err.message || 'Verification process failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedSignature = signatures.find((s) => s.signature_id === selectedSigId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Deterministic Quantum Digital Signature Verification Center</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Rigorous statistical and protocol-aware threat evaluation based on measurement error rates, Wilson confidence intervals, and cryptographic nonces (Zero AI/ML).
        </p>
      </div>

      {/* Verification Control Console */}
      <div className="cyber-card space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Verification Parameters & Test Injections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Signature Selector */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Select Signature to Verify
            </label>
            <select
              value={selectedSigId}
              onChange={(e) => handleSelectSignature(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            >
              {signatures.map((s) => (
                <option key={s.signature_id} value={s.signature_id}>
                  {s.signature_id} — "{s.message}" ({s.signer_id}, {s.status})
                </option>
              ))}
            </select>
          </div>

          {/* Verifier ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Verifier Identity
            </label>
            <select
              value={verifierId}
              onChange={(e) => setVerifierId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            >
              <option value="Verifier-Bob">Verifier-Bob (Authorized)</option>
              <option value="Verifier-Dave">Verifier-Dave (Authorized)</option>
              <option value="Unknown-Entity">Unknown-Entity (Unauthorized)</option>
            </select>
          </div>

          {/* Claimed Signer Identity */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Claimed Signer Identity
            </label>
            <input
              type="text"
              value={claimedSignerId}
              onChange={(e) => setClaimedSignerId(e.target.value)}
              placeholder="Signer-Alice"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Message Tamper Simulator */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Tampered Message Test (Optional - Test SHA-256 Integrity)
            </label>
            <input
              type="text"
              value={tamperedMessage}
              onChange={(e) => setTamperedMessage(e.target.value)}
              placeholder="Leave empty to use original message"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Noise Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-1">
              <span>Channel Noise</span>
              <span className="text-cyan-400 font-mono">{(noiseRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.02"
              value={noiseRate}
              onChange={(e) => setNoiseRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Replay Test Checkbox */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="replayCheck"
              checked={simulateReplay}
              onChange={(e) => setSimulateReplay(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="replayCheck" className="text-xs text-slate-300 select-none cursor-pointer">
              Simulate Nonce Reuse / Replay
            </label>
          </div>
        </div>

        {/* Execute Verification Button */}
        <div className="pt-2">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Execute Deterministic Verification</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Verification Decision & Statistical Breakdown */}
      {verificationResult && (
        <div className="space-y-6">
          {/* Main Decision Banner */}
          <div
            className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono ${
              verificationResult.decision === 'VERIFIED'
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : verificationResult.decision === 'SUSPICIOUS'
                ? 'bg-amber-950/40 border-amber-500/60'
                : 'bg-rose-950/40 border-rose-500/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <DecisionBadge decision={verificationResult.decision} threat={verificationResult.threat_detected} size="lg" />
                <span className="text-sm font-semibold text-slate-200">
                  Session ID: {verificationResult.session_id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                {verificationResult.reason}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[11px]">Processing Latency</span>
              <span className="text-cyan-300 font-bold">{verificationResult.latency_ms.toFixed(2)} ms</span>
            </div>
          </div>

          {/* 4 Quantitative Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="cyber-card text-center font-mono">
              <span className="text-xs text-slate-400 uppercase block mb-1">Observed Error Rate (E)</span>
              <span className="text-2xl font-extrabold text-cyan-300">
                {(verificationResult.error_rate * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {verificationResult.error_count} / {verificationResult.measurement_count} Unexpected Shots
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-xs text-slate-400 uppercase block mb-1">Wilson 95% CI</span>
              <span className="text-xl font-bold text-amber-300">
                [{(verificationResult.confidence_lower * 100).toFixed(2)}%, {(verificationResult.confidence_upper * 100).toFixed(2)}%]
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Binomial Proportion Bound
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-xs text-slate-400 uppercase block mb-1">Estimated Forgery Prob</span>
              <span className={`text-2xl font-extrabold ${verificationResult.forgery_probability > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {(verificationResult.forgery_probability * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Likelihood Ratio vs Guessing
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-xs text-slate-400 uppercase block mb-1">Threshold Classification</span>
              <span className="text-base font-bold text-slate-200">
                {verificationResult.error_rate <= 0.05
                  ? 'E ≤ 5% (Verified)'
                  : verificationResult.error_rate <= 0.15
                  ? '5% < E ≤ 15% (Suspicious)'
                  : 'E > 15% (High Risk / Reject)'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Configured T_low=5%, T_high=15%
              </span>
            </div>
          </div>

          {/* Deterministic Decision Ledger & QDS Sifted Measurement Breakdown */}
          <DecisionLedgerView
            decisionLedger={verificationResult.decision_ledger}
            qdsDetails={verificationResult.qds_details}
            statisticalDetails={verificationResult.statistical_details}
            ruleDetails={verificationResult.rule_details}
          />
        </div>
      )}
    </div>
  );
};
