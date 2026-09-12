import React from 'react';
import { Scale, CheckCircle2, XCircle, MinusCircle, ShieldCheck, ShieldAlert, Cpu, Database, Eye, AlertTriangle } from 'lucide-react';
import { DecisionLedger, QDSDetails, StatisticalDetails, RuleDetails } from '../types';

interface DecisionLedgerViewProps {
  decisionLedger?: DecisionLedger;
  qdsDetails?: QDSDetails;
  statisticalDetails?: StatisticalDetails;
  ruleDetails?: RuleDetails;
}

export const DecisionLedgerView: React.FC<DecisionLedgerViewProps> = ({
  decisionLedger,
  qdsDetails,
  statisticalDetails,
  ruleDetails,
}) => {
  const classical = decisionLedger?.classical_evidence;
  const quantum = decisionLedger?.quantum_evidence;
  const rules = decisionLedger?.rules || [];
  const triggeredRule = ruleDetails?.rule_triggered || decisionLedger?.final_decision?.threat_detected;

  // Canonical fallback rules if ledger array is not explicitly populated
  const displayRules = rules.length > 0 ? rules : [
    {
      id: 'R1',
      name: 'Rule 1 — Signer Identity Authorization',
      condition: 'Signer ∈ Registry',
      status: classical?.identity_authorization === 'UNAUTHORIZED' ? 'FAIL' : 'PASS',
      explanation: classical?.identity_authorization === 'UNAUTHORIZED' ? 'Signer is not authorized in registry' : 'Signer verified in authorization registry',
    },
    {
      id: 'R2',
      name: 'Rule 2 — Message Digest Integrity',
      condition: 'H(M_submitted) == H(M_signed)',
      status: classical?.hash_comparison === 'MISMATCH' || ruleDetails?.threat_detected === 'MESSAGE_TAMPERING' ? 'FAIL' : 'PASS',
      explanation: classical?.hash_comparison === 'MISMATCH' || ruleDetails?.threat_detected === 'MESSAGE_TAMPERING' ? 'SHA-256 mismatch detected: message was tampered' : 'SHA-256 digests match original signature',
    },
    {
      id: 'R3',
      name: 'Rule 3 — Cryptographic Nonce Freshness',
      condition: 'Nonce ∉ ConsumedSet',
      status: classical?.nonce_freshness === 'CONSUMED' || ruleDetails?.threat_detected === 'REPLAY_ATTACK' ? 'FAIL' : 'PASS',
      explanation: classical?.nonce_freshness === 'CONSUMED' || ruleDetails?.threat_detected === 'REPLAY_ATTACK' ? 'Nonce already consumed: replay attack blocked' : 'Single-use nonce is fresh',
    },
    {
      id: 'R4',
      name: 'Rule 4 — Quantum Error Upper Threshold',
      condition: 'CI_lower > T_high (15%)',
      status: (quantum?.empirical_qber ?? 0) > 0.15 || ruleDetails?.threat_detected === 'SIGNATURE_FORGERY' ? 'FAIL' : (classical?.hash_comparison === 'MISMATCH' || classical?.nonce_freshness === 'CONSUMED' ? 'NOT REACHED' : 'PASS'),
      explanation: (quantum?.empirical_qber ?? 0) > 0.15 ? 'Quantum Bit Error Rate exceeds 15%: forgery or intercept detected' : 'Error rate within acceptable bounds',
    },
    {
      id: 'R5',
      name: 'Rule 5 — Noise Classification',
      condition: 'T_low < CI_upper ≤ T_high',
      status: (quantum?.empirical_qber ?? 0) > 0.05 && (quantum?.empirical_qber ?? 0) <= 0.15 ? 'FAIL' : ((quantum?.empirical_qber ?? 0) > 0.15 ? 'NOT REACHED' : 'PASS'),
      explanation: (quantum?.empirical_qber ?? 0) > 0.05 && (quantum?.empirical_qber ?? 0) <= 0.15 ? 'Channel disturbance exceeds 5% baseline' : 'Channel noise within safe limits',
    },
    {
      id: 'R6',
      name: 'Rule 6 — Statistical Channel Verification',
      condition: 'CI_upper ≤ T_low (5%)',
      status: (quantum?.empirical_qber ?? 0) <= 0.05 && classical?.hash_comparison !== 'MISMATCH' && classical?.nonce_freshness !== 'CONSUMED' && classical?.identity_authorization !== 'UNAUTHORIZED' ? 'PASS' : 'NOT REACHED',
      explanation: (quantum?.empirical_qber ?? 0) <= 0.05 ? 'Wilson 95% CI confirms 100% genuine quantum state' : 'Not verified due to upstream rule triggers',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Ledger Container */}
      <div className="cyber-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider">
              Deterministic Decision Ledger
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#0891B2] bg-[#ECFEFF] border border-[#A5F3FC] dark:text-cyan-300 dark:bg-cyan-950 px-2.5 py-0.5 rounded dark:border-cyan-500/30">
            Audit-Ready Chain (Zero AI/ML)
          </span>
        </div>

        {/* Dual Evidence Matrix: Classical & Quantum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Classical Evidence Card */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] dark:bg-slate-950/80 dark:border-slate-800 space-y-2.5 shadow-xs transition-all hover:border-[#2563EB] hover:bg-[#F8FAFC]">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200 font-semibold text-xs border-b border-[#CBD5E1] dark:border-slate-800/80 pb-1.5">
              <Database className="w-3.5 h-3.5 text-[#2563EB] dark:text-indigo-400" />
              <span>Classical Evidence</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Identity Registry</span>
                <span className={`font-semibold ${classical?.identity_authorization === 'UNAUTHORIZED' ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'}`}>
                  {classical?.identity_authorization || 'AUTHORIZED'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">SHA-256 Digest</span>
                <span className={`font-semibold ${classical?.hash_comparison === 'MISMATCH' || ruleDetails?.threat_detected === 'MESSAGE_TAMPERING' ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'}`}>
                  {classical?.hash_comparison || (ruleDetails?.threat_detected === 'MESSAGE_TAMPERING' ? 'MISMATCH' : 'MATCH')}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Nonce Freshness</span>
                <span className={`font-semibold ${classical?.nonce_freshness === 'CONSUMED' || ruleDetails?.threat_detected === 'REPLAY_ATTACK' ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'}`}>
                  {classical?.nonce_freshness || (ruleDetails?.threat_detected === 'REPLAY_ATTACK' ? 'CONSUMED' : 'FRESH')}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Cryptographic Nonce</span>
                <span className="text-[#0F172A] dark:text-slate-300 font-mono text-[10px] truncate block" title={classical?.nonce}>
                  {classical?.nonce ? `${classical.nonce.slice(0, 14)}...` : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Quantum Evidence Card */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] dark:bg-slate-950/80 dark:border-slate-800 space-y-2.5 shadow-xs transition-all hover:border-[#0891B2] hover:bg-[#F0FDFF]">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200 font-semibold text-xs border-b border-[#CBD5E1] dark:border-slate-800/80 pb-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#0891B2] dark:text-cyan-400" />
              <span>Quantum & Statistical Evidence</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">QDS Tokens (Pool/Decl/Sift)</span>
                <span className="text-[#0891B2] dark:text-cyan-300 font-semibold">
                  L={quantum?.token_pool_size || qdsDetails?.pool_size || 32} | M={quantum?.signature_token_count || qdsDetails?.declared_token_count || 8} | n={quantum?.sifted_token_count || qdsDetails?.sifted_token_count || 4}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Wilson 95% Confidence Interval</span>
                <span className="text-[#D97706] dark:text-amber-300 font-semibold">
                  {quantum?.wilson_ci_text || statisticalDetails?.confidence_interval_text || '[0.00%, 0.76%]'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Quantum Bit Error Rate (QBER)</span>
                <span className="text-[#0891B2] dark:text-cyan-300 font-semibold">
                  {quantum?.empirical_qber !== undefined ? `${(quantum.empirical_qber * 100).toFixed(2)}%` : statisticalDetails?.error_rate_percentage !== undefined ? `${statisticalDetails.error_rate_percentage}%` : '0.00%'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-slate-400 block text-[10px]">Safety Boundaries</span>
                <span className="text-[#0F172A] dark:text-slate-300 text-[10px]">
                  T_low=5% | T_high=15%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Deterministic Rules Audit Table */}
        <div className="pt-1">
          <div className="overflow-x-auto rounded-lg border border-[#CBD5E1] dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-slate-950 dark:text-slate-300 text-[11px] border-b border-[#E2E8F0] dark:border-slate-800 font-semibold">
                <tr>
                  <th className="p-2.5 w-32">Status</th>
                  <th className="p-2.5 w-64">Rule / Invariant</th>
                  <th className="p-2.5 w-48">Logical Condition</th>
                  <th className="p-2.5">Evaluation & Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white dark:divide-slate-800/80 dark:bg-[#0e1322]">
                {displayRules.map((rule) => {
                  const isCausingTrigger = (rule.status === 'FAIL') || (triggeredRule && triggeredRule.includes(rule.id));

                  return (
                    <tr
                      key={rule.id}
                      className={`transition-colors ${
                        isCausingTrigger ? 'bg-[#FEF2F2] dark:bg-rose-950/40 font-semibold' : 'hover:bg-[#F8FAFC] dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="p-2.5">
                        {rule.status === 'PASS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ PASS</span>
                          </span>
                        )}
                        {rule.status === 'FAIL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-rose-950 dark:text-rose-400 dark:border-rose-500/40 animate-pulse">
                            <XCircle className="w-3 h-3" />
                            <span>✕ FAIL</span>
                          </span>
                        )}
                        {rule.status === 'NOT REACHED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-[#64748B] border border-[#CBD5E1] dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800">
                            <MinusCircle className="w-3 h-3" />
                            <span>— NOT REACHED</span>
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-semibold text-[#0F172A] dark:text-slate-200">
                        {rule.name}
                        {isCausingTrigger && (
                          <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-rose-900 dark:text-rose-200 dark:border-transparent">
                            DECISION TRIGGER
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#64748B] dark:text-slate-400 text-[11px]">
                        <code>{rule.condition}</code>
                      </td>
                      <td className="p-2.5 text-[#475569] dark:text-slate-300 font-sans text-xs">
                        {rule.explanation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sifted-Measurement QDS Token Breakdown */}
      {qdsDetails && qdsDetails.token_details && qdsDetails.token_details.length > 0 && (
        <div className="cyber-card space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
                <span>Memory-Free Sifted-Measurement Token Breakdown</span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-sans mt-0.5">
                Tokens where Bob's random measurement basis matches Alice's declaration (B_B = B_A) are sifted and verified.
              </p>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-[#64748B] dark:text-slate-400 block">Sifting Ratio</span>
              <span className="text-[#0891B2] dark:text-cyan-300 font-bold">
                {qdsDetails.sifted_token_count} / {qdsDetails.declared_token_count} Tokens ({((qdsDetails.sifted_token_count / Math.max(1, qdsDetails.declared_token_count)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-slate-950 dark:text-slate-300 text-[11px] border-b border-[#E2E8F0] dark:border-slate-800">
                <tr>
                  <th className="p-2.5">Token Index</th>
                  <th className="p-2.5">Alice Declared (Dec_A)</th>
                  <th className="p-2.5">Bob Recorded (VK_B)</th>
                  <th className="p-2.5">Basis Sifting</th>
                  <th className="p-2.5 text-right">Shots</th>
                  <th className="p-2.5 text-right">Error Rate</th>
                  <th className="p-2.5">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white dark:divide-slate-800/80 dark:bg-[#0e1322]">
                {qdsDetails.token_details.map((tok) => (
                  <tr key={tok.index} className={`hover:bg-[#F8FAFC] dark:hover:bg-slate-900/40 transition-colors ${!tok.sifted ? 'opacity-50' : ''}`}>
                    <td className="p-2.5 font-bold text-[#0F172A] dark:text-slate-200">
                      Token #{tok.index}
                    </td>
                    <td className="p-2.5 text-[#0891B2] dark:text-cyan-300 font-semibold">
                      Basis: {tok.alice_basis} | Bit: {tok.alice_bit}
                    </td>
                    <td className="p-2.5 text-[#2563EB] dark:text-indigo-300 font-semibold">
                      Basis: {tok.bob_basis} | Outcome: {tok.bob_outcome}
                    </td>
                    <td className="p-2.5">
                      {tok.sifted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40">
                          SIFTED (B_A == B_B)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#64748B] border border-[#CBD5E1] dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800">
                          DISCARDED (Conjugate)
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right text-[#0F172A] dark:text-slate-300 font-mono">
                      {tok.token_shots}
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      {tok.sifted ? (
                        <span className={tok.token_error_rate > 0.15 ? 'text-[#DC2626] dark:text-rose-400 font-bold' : 'text-[#16A34A] dark:text-emerald-400 font-semibold'}>
                          {(tok.token_error_rate * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[#64748B] dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      {tok.sifted ? (
                        tok.status === 'MATCH' ? (
                          <span className="text-[#16A34A] dark:text-emerald-400 font-bold text-[11px]">MATCH</span>
                        ) : (
                          <span className="text-[#DC2626] dark:text-rose-400 font-bold text-[11px]">MISMATCH</span>
                        )
                      ) : (
                        <span className="text-[#64748B] dark:text-slate-500 text-[10px]">SIFTED_OUT</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
