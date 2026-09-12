import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Activity,
  Scale,
  Percent,
  Lock,
  Database,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Signature, VerificationSession } from '../types';
import { DecisionBadge } from '../components/DecisionBadge';
import { DecisionLedgerView } from '../components/DecisionLedgerView';
import { StepIndicator } from '../components/StepIndicator';

export const Verification: React.FC = () => {
  const location = useLocation();
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

      const preselected = (location.state as any)?.selectedSignatureId;
      if (preselected && data.some((s) => s.signature_id === preselected)) {
        setSelectedSigId(preselected);
        const found = data.find((s) => s.signature_id === preselected);
        if (found) setClaimedSignerId(found.signer_id);
      } else if (data.length > 0) {
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

  // Primary verification call
  const handleVerify = async () => {
    if (!selectedSigId) {
      setError('Please select a signature to verify.');
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

  // 1-Click Judge Demonstrations
  const handleJudgeDemo = async (demoType: 'legitimate' | 'tamper' | 'replay') => {
    if (!selectedSigId) return;
    try {
      setLoading(true);
      setError(null);
      let res: VerificationSession;

      if (demoType === 'legitimate') {
        setTamperedMessage('');
        setSimulateReplay(false);
        setNoiseRate(0.0);
        res = await api.startVerification({
          signature_id: selectedSigId,
          verifier_id: 'Verifier-Bob',
          shots,
          noise_rate: 0.0,
        });
      } else if (demoType === 'tamper') {
        const fakeMsg = 'Tampered Payload: Wire Transfer $50,000 to Unauthorized Node';
        setTamperedMessage(fakeMsg);
        setSimulateReplay(false);
        res = await api.startVerification({
          signature_id: selectedSigId,
          verifier_id: 'Verifier-Bob',
          custom_message: fakeMsg,
          shots,
        });
      } else {
        setSimulateReplay(true);
        setTamperedMessage('');
        res = await api.startVerification({
          signature_id: selectedSigId,
          verifier_id: 'Verifier-Bob',
          shots,
          simulate_nonce_reuse: true,
        });
      }
      setVerificationResult(res);
    } catch (err: any) {
      setError(err.message || 'Judge demonstration execution failed');
    } finally {
      setLoading(false);
    }
  };

  // Derive verification checks status from actual backend response
  const getVerificationChecks = () => {
    if (!verificationResult) return [];

    const isMessageTampered = verificationResult.threat_detected === 'MESSAGE_TAMPERING';
    const isReplay = verificationResult.threat_detected === 'REPLAY_ATTACK';
    const isImpersonation = verificationResult.threat_detected === 'IMPERSONATION';
    const isForgery = verificationResult.threat_detected === 'SIGNATURE_FORGERY';
    const isVerified = verificationResult.decision === 'VERIFIED';

    return [
      {
        name: 'Signer Identity',
        desc: 'Verified in Authorization Registry',
        status: isImpersonation ? 'FAIL' : 'PASS',
      },
      {
        name: 'SHA-256 Integrity',
        desc: 'Message Content Digest Check',
        status: isMessageTampered ? 'FAIL' : 'PASS',
      },
      {
        name: 'Nonce Freshness',
        desc: 'Single-Use Replay Protection',
        status: isReplay ? 'FAIL' : 'PASS',
      },
      {
        name: 'Quantum Error Threshold',
        desc: 'QBER ≤ T_high (15%) Bound',
        status: isForgery || verificationResult.error_rate > 0.15 ? 'FAIL' : (isMessageTampered || isReplay ? 'NOT REACHED' : 'PASS'),
      },
      {
        name: 'Statistical Confidence',
        desc: 'Wilson 95% CI ≤ T_low (5%)',
        status: isVerified ? 'PASS' : (verificationResult.error_rate <= 0.05 && !isMessageTampered && !isReplay && !isImpersonation ? 'PASS' : 'FAIL'),
      },
    ];
  };

  const checks = getVerificationChecks();

  return (
    <div className="space-y-6">
      {/* Workflow Step Indicator: Steps 4 & 5 */}
      <StepIndicator currentStep={verificationResult ? 5 : 4} />

      {/* Top Banner */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-wide">
              Signature Verification
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold">
              Bob's Verifier Node
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            Evaluate classical digest integrity, cryptographic nonce freshness, and quantum measurement statistics.
          </p>
        </div>

        {/* Quick Demo Buttons for Judges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-semibold hidden sm:inline">Judge Demos:</span>
          <button
            onClick={() => handleJudgeDemo('legitimate')}
            disabled={loading || !selectedSigId}
            className="px-2.5 py-1.5 rounded-lg bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] hover:bg-[#DCFCE7] dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40 dark:hover:bg-emerald-900 text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
          >
            DEMO 1: Legitimate
          </button>
          <button
            onClick={() => handleJudgeDemo('tamper')}
            disabled={loading || !selectedSigId}
            className="px-2.5 py-1.5 rounded-lg bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] hover:bg-[#FFEDD5] dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40 dark:hover:bg-amber-900 text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
          >
            DEMO 2: Tampering
          </button>
          <button
            onClick={() => handleJudgeDemo('replay')}
            disabled={loading || !selectedSigId}
            className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40 dark:hover:bg-purple-900 text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
          >
            DEMO 3: Replay
          </button>
        </div>
      </div>

      {/* Verification Parameters Card */}
      <div className="cyber-card space-y-4">
        <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider border-b border-[#E2E8F0] dark:border-slate-800/80 pb-2.5">
          Select Signature & Test Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Signature Selector */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Select Signature to Verify
            </label>
            <select
              value={selectedSigId}
              onChange={(e) => handleSelectSignature(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            >
              {signatures.map((s) => (
                <option key={s.signature_id} value={s.signature_id}>
                  {s.signature_id} — "{s.message}" ({s.signer_id})
                </option>
              ))}
            </select>
          </div>

          {/* Verifier ID */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Verifier Identity
            </label>
            <select
              value={verifierId}
              onChange={(e) => setVerifierId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            >
              <option value="Verifier-Bob">Verifier-Bob (Authorized Node)</option>
              <option value="Verifier-Dave">Verifier-Dave (Secondary Auditor)</option>
              <option value="Unknown-Entity">Unknown-Entity (Unauthorized)</option>
            </select>
          </div>

          {/* Claimed Signer Identity */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Claimed Signer
            </label>
            <input
              type="text"
              value={claimedSignerId}
              onChange={(e) => setClaimedSignerId(e.target.value)}
              placeholder="Signer-Alice"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
          </div>

          {/* Message Tamper Simulator */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Tamper Test (Leave empty to test original message)
            </label>
            <input
              type="text"
              value={tamperedMessage}
              onChange={(e) => setTamperedMessage(e.target.value)}
              placeholder="Leave empty to use original signature message"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
          </div>

          {/* Channel Disturbance Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              <span>Channel Disturbance</span>
              <span className="text-[#0891B2] dark:text-cyan-400 font-mono">{(noiseRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.02"
              value={noiseRate}
              onChange={(e) => setNoiseRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2E8F0] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0891B2] dark:accent-cyan-500 mt-2"
            />
          </div>

          {/* Replay Test Checkbox */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="replayCheck"
              checked={simulateReplay}
              onChange={(e) => setSimulateReplay(e.target.checked)}
              className="w-4 h-4 rounded bg-white border-[#CBD5E1] text-[#0891B2] focus:ring-[#0891B2] accent-[#0891B2] dark:bg-slate-900 dark:border-slate-700"
            />
            <label htmlFor="replayCheck" className="text-xs text-[#0F172A] dark:text-slate-300 select-none cursor-pointer font-medium">
              Simulate Stolen Nonce Replay
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950"
          >
            <Play className="w-4 h-4 fill-white dark:fill-slate-950" />
            <span>Execute Verification Check</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Prominent Verification Result */}
      {verificationResult && (
        <div className="space-y-6">
          {/* Prominent Result Banner */}
          <div
            className={`p-6 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono shadow-sm transition-colors ${
              verificationResult.decision === 'VERIFIED'
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D] dark:bg-emerald-950/30 dark:border-emerald-500/60 dark:text-emerald-100'
                : verificationResult.decision === 'SUSPICIOUS'
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#78350F] dark:bg-amber-950/30 dark:border-amber-500/60 dark:text-amber-100'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D] dark:bg-rose-950/30 dark:border-rose-500/60 dark:text-rose-100'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xl font-black px-3.5 py-1 rounded-md uppercase tracking-wider ${
                    verificationResult.decision === 'VERIFIED'
                      ? 'bg-[#16A34A] text-white dark:bg-emerald-500 dark:text-slate-950'
                      : verificationResult.decision === 'SUSPICIOUS'
                      ? 'bg-[#D97706] text-white dark:bg-amber-500 dark:text-slate-950'
                      : 'bg-[#DC2626] text-white dark:bg-rose-500 dark:text-slate-950'
                  }`}
                >
                  {verificationResult.decision}
                </span>

                {verificationResult.threat_detected !== 'NONE' && (
                  <span className="text-xs px-2.5 py-1 rounded bg-white border border-[#FECACA] text-[#DC2626] dark:bg-slate-900 dark:border-slate-700 dark:text-rose-300 font-bold shadow-xs">
                    Threat: {verificationResult.threat_detected}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#475569] dark:text-slate-300 font-sans leading-relaxed">
                {verificationResult.reason}
              </p>
            </div>

            <div className="text-right text-xs text-[#64748B] dark:text-slate-400">
              <span className="block text-[10px] text-[#64748B]">Processing Latency</span>
              <span className="font-bold text-[#0891B2] dark:text-cyan-300 text-sm">{verificationResult.latency_ms.toFixed(2)} ms</span>
            </div>
          </div>

          {/* Verification Checks Grid */}
          <div className="cyber-card space-y-3">
            <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider">
              Cryptographic & Quantum Invariant Checks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {checks.map((chk) => (
                <div
                  key={chk.name}
                  className={`p-3 rounded-lg border flex flex-col justify-between shadow-xs ${
                    chk.status === 'FAIL'
                      ? 'bg-[#FEF2F2] border-[#FECACA] dark:bg-rose-950/20 dark:border-rose-500/50'
                      : chk.status === 'PASS'
                      ? 'bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#0891B2] hover:bg-[#F0FDFF] transition-all dark:bg-slate-950/70 dark:border-slate-800'
                      : 'bg-slate-50 border-[#CBD5E1] dark:bg-slate-950/40 dark:border-slate-800/60 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">{chk.name}</span>
                      {chk.status === 'PASS' && (
                        <span className="text-[10px] font-bold text-[#16A34A] dark:text-emerald-400 font-mono">✓ PASS</span>
                      )}
                      {chk.status === 'FAIL' && (
                        <span className="text-[10px] font-bold text-[#DC2626] dark:text-rose-400 font-mono animate-pulse">✕ FAIL</span>
                      )}
                      {chk.status === 'NOT REACHED' && (
                        <span className="text-[10px] font-medium text-[#64748B] dark:text-slate-500 font-mono">— NOT REACHED</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400">{chk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QBER / Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card text-center font-mono">
              <span className="text-[11px] text-[#64748B] dark:text-slate-400 uppercase block mb-1">QBER (Error Rate)</span>
              <span className="text-2xl font-bold text-[#0891B2] dark:text-cyan-300">
                {(verificationResult.error_rate * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1">
                {verificationResult.error_count} / {verificationResult.measurement_count} Shots
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-[11px] text-[#64748B] dark:text-slate-400 uppercase block mb-1">Wilson 95% CI</span>
              <span className="text-lg font-bold text-[#D97706] dark:text-amber-300">
                [{(verificationResult.confidence_lower * 100).toFixed(2)}%, {(verificationResult.confidence_upper * 100).toFixed(2)}%]
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1">
                Confidence Bound
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-[11px] text-[#64748B] dark:text-slate-400 uppercase block mb-1">Estimated Forgery Prob</span>
              <span className={`text-2xl font-bold ${verificationResult.forgery_probability > 0.5 ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'}`}>
                {(verificationResult.forgery_probability * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1">
                Likelihood vs Guessing
              </span>
            </div>

            <div className="cyber-card text-center font-mono">
              <span className="text-[11px] text-[#64748B] dark:text-slate-400 uppercase block mb-1">Safety Classification</span>
              <span className="text-sm font-bold text-[#0F172A] dark:text-slate-200 mt-1 block">
                {verificationResult.error_rate <= 0.05
                  ? 'E ≤ 5% (Verified Safe)'
                  : verificationResult.error_rate <= 0.15
                  ? '5% < E ≤ 15% (Suspicious)'
                  : 'E > 15% (High Risk Attack)'}
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1">
                Threshold: T_low=5%, T_high=15%
              </span>
            </div>
          </div>

          {/* Decision Ledger View */}
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
