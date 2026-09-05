import React from 'react';
import { Scale, CheckCircle2, XCircle, MinusCircle, ShieldCheck, ShieldAlert, Cpu, Database, Eye } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cyber-card space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Deterministic Decision Ledger (Zero AI/ML Audit Chain)</span>
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            6-Rule Transparent Logic
          </span>
        </div>

        {/* Dual Evidence Matrix: Classical & Quantum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Classical Evidence Card */}
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] border-b border-slate-800/60 pb-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Classical Evidence Verification</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Identity Registry</span>
                <span className={`font-semibold ${classical?.identity_authorization === 'AUTHORIZED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {classical?.identity_authorization || 'UNKNOWN'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SHA-256 Digest Match</span>
                <span className={`font-semibold ${classical?.hash_comparison === 'MATCH' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {classical?.hash_comparison || (ruleDetails?.threat_detected === 'MESSAGE_TAMPERING' ? 'MISMATCH' : 'MATCH')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Nonce Freshness</span>
                <span className={`font-semibold ${classical?.nonce_freshness === 'FRESH' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {classical?.nonce_freshness || 'VERIFIED'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Cryptographic Nonce</span>
                <span className="text-slate-300 font-mono text-[10px] truncate block" title={classical?.nonce}>
                  {classical?.nonce ? `${classical.nonce.slice(0, 12)}...` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quantum Evidence Card */}
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] border-b border-slate-800/60 pb-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quantum & Statistical Evidence</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Token Pool / Selected / Sifted</span>
                <span className="text-cyan-300 font-semibold">
                  L={quantum?.token_pool_size || qdsDetails?.pool_size || 32} | M={quantum?.signature_token_count || qdsDetails?.declared_token_count || 8} | n={quantum?.sifted_token_count || qdsDetails?.sifted_token_count || 4}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Wilson 95% Confidence Interval</span>
                <span className="text-amber-300 font-semibold">
                  {quantum?.wilson_ci_text || statisticalDetails?.confidence_interval_text || '[0.00%, 0.76%]'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Observed Error Rate (QBER)</span>
                <span className="text-cyan-300 font-semibold">
                  {quantum?.empirical_qber !== undefined ? `${(quantum.empirical_qber * 100).toFixed(2)}%` : statisticalDetails?.error_rate_percentage !== undefined ? `${statisticalDetails.error_rate_percentage}%` : '0.00%'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Decision Thresholds</span>
                <span className="text-slate-400 text-[10px]">
                  T_low={((quantum?.active_threshold_low ?? 0.05) * 100).toFixed(0)}% | T_high={((quantum?.active_threshold_high ?? 0.15) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Deterministic Rules Audit Table */}
        <div className="pt-2">
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 text-[11px]">
                <tr>
                  <th className="p-2.5 w-28">Status</th>
                  <th className="p-2.5 w-60">Rule / Invariant</th>
                  <th className="p-2.5 w-48">Logical Condition</th>
                  <th className="p-2.5">Evaluation & Verification Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-2.5">
                        {rule.status === 'PASS' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PASS</span>
                          </span>
                        )}
                        {rule.status === 'FAIL' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                            <XCircle className="w-3 h-3" />
                            <span>FAIL</span>
                          </span>
                        )}
                        {rule.status === 'NOT REACHED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-700">
                            <MinusCircle className="w-3 h-3" />
                            <span>NOT REACHED</span>
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-200">
                        {rule.name}
                      </td>
                      <td className="p-2.5 text-slate-400 text-[11px]">
                        <code>{rule.condition}</code>
                      </td>
                      <td className="p-2.5 text-slate-300 font-sans text-xs">
                        {rule.explanation}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      Rule evaluation ledger loaded with default status: {ruleDetails?.rule_triggered || 'RULE_6_CHANNEL_ACCEPTANCE'} ({ruleDetails?.confidence || 'Deterministic 100%'})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Memory-Free Sifted-Measurement QDS Token Breakdown */}
      {qdsDetails && qdsDetails.token_details && qdsDetails.token_details.length > 0 && (
        <div className="cyber-card space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Memory-Free Sifted-Measurement QDS Protocol (Token Sampling)</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Bob immediately measured incoming teleported qubits upon enrollment (VK_B) requiring zero quantum memory. Verification sifts positions where Bob's random basis matches Alice's declaration (B_B = B_A).
              </p>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-slate-400 block">Sifting Ratio</span>
              <span className="text-cyan-300 font-bold">
                {qdsDetails.sifted_token_count} / {qdsDetails.declared_token_count} Tokens ({((qdsDetails.sifted_token_count / Math.max(1, qdsDetails.declared_token_count)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 text-[11px]">
                <tr>
                  <th className="p-2.5">Token Index</th>
                  <th className="p-2.5">Alice Declared (Dec_A)</th>
                  <th className="p-2.5">Bob Recorded (VK_B)</th>
                  <th className="p-2.5">Basis Sifting Status</th>
                  <th className="p-2.5 text-right">Simulation Shots</th>
                  <th className="p-2.5 text-right">Token Error Rate</th>
                  <th className="p-2.5">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {qdsDetails.token_details.map((tok) => (
                  <tr key={tok.index} className={`hover:bg-slate-900/40 transition-colors ${!tok.sifted ? 'opacity-60' : ''}`}>
                    <td className="p-2.5 font-bold text-slate-300">
                      Token #{tok.index}
                    </td>
                    <td className="p-2.5 text-cyan-300">
                      Basis: {tok.alice_basis} | Bit: {tok.alice_bit}
                    </td>
                    <td className="p-2.5 text-indigo-300">
                      Basis: {tok.bob_basis} | Outcome: {tok.bob_outcome}
                    </td>
                    <td className="p-2.5">
                      {tok.sifted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          SIFTED (B_A == B_B)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-700">
                          DISCARDED (Conjugate Basis)
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right text-slate-300 font-mono">
                      {tok.token_shots}
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      {tok.sifted ? (
                        <span className={tok.token_error_rate > 0.15 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {(tok.token_error_rate * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      {tok.sifted ? (
                        tok.status === 'MATCH' ? (
                          <span className="text-emerald-400 font-bold text-[11px]">MATCH</span>
                        ) : (
                          <span className="text-rose-400 font-bold text-[11px]">MISMATCH</span>
                        )
                      ) : (
                        <span className="text-slate-500 text-[10px]">SIFTED_OUT</span>
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
