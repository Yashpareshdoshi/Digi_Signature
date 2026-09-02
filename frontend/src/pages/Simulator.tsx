import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, ShieldCheck, ArrowRight, Layers, HelpCircle, Activity } from 'lucide-react';
import { api } from '../services/api';
import { SignatureDetail, TeleportationResult, MeasurementResult } from '../types';
import { QuantumCircuitView } from '../components/QuantumCircuitView';
import { BlochSphereView } from '../components/BlochSphereView';
import { DecisionBadge } from '../components/DecisionBadge';

export const Simulator: React.FC = () => {
  const [message, setMessage] = useState('Transfer ₹5000 to Account X');
  const [signerId, setSignerId] = useState('Signer-Alice');
  const [bellState, setBellState] = useState('Phi+');
  const [quantumState, setQuantumState] = useState('|0>');
  const [measurementBasis, setMeasurementBasis] = useState('Z');
  const [shots, setShots] = useState(1000);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [signatureData, setSignatureData] = useState<SignatureDetail | null>(null);
  const [teleportResult, setTeleportResult] = useState<TeleportationResult | null>(null);
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Generate Signature
  const handleGenerateSignature = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.createSignature({
        message,
        signer_id: signerId,
        bell_state: bellState,
        quantum_state: quantumState,
        measurement_basis: measurementBasis,
        shots,
      });
      setSignatureData(res);
      if (res.teleportation_data) setTeleportResult(res.teleportation_data);
      if (res.measurement_summary) setMeasurementResult(res.measurement_summary);
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.message || 'Signature generation failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Run Teleportation independently
  const handleRunTeleportation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.runTeleportation({
        quantum_state: quantumState,
        bell_state: bellState,
      });
      setTeleportResult(res);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Teleportation execution failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Run Measurement independently
  const handleRunMeasurement = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.runMeasurement({
        quantum_state: quantumState,
        basis: measurementBasis,
        shots,
      });
      setMeasurementResult(res);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Measurement execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Teleportation-Based Quantum Digital Signature Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 3-qubit state teleportation with Bell entanglement, Alice Bell measurement, Bob Pauli correction, and projective verification.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Step Status:</span>
          <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            {currentStep === 0 ? 'Ready' : `Phase ${currentStep} Active`}
          </span>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="cyber-card grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Message Payload
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Signer */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Signer ID
          </label>
          <select
            value={signerId}
            onChange={(e) => setSignerId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="Signer-Alice">Signer-Alice (Primary)</option>
            <option value="Signer-Charlie">Signer-Charlie (Secondary)</option>
            <option value="Signer-Mallory">Signer-Mallory (Unauthorized)</option>
          </select>
        </div>

        {/* Bell State */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Bell State EPR Pair
          </label>
          <select
            value={bellState}
            onChange={(e) => setBellState(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="Phi+">|Φ+⟩ = (|00⟩ + |11⟩)/√2</option>
            <option value="Phi-">|Φ-⟩ = (|00⟩ - |11⟩)/√2</option>
            <option value="Psi+">|Ψ+⟩ = (|01⟩ + |10⟩)/√2</option>
            <option value="Psi-">|Ψ-⟩ = (|01⟩ - |10⟩)/√2</option>
          </select>
        </div>

        {/* Quantum State */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Pauli Eigenstate |ψ⟩
          </label>
          <select
            value={quantumState}
            onChange={(e) => setQuantumState(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="|0>">|0⟩ (Z-basis +1)</option>
            <option value="|1>">|1⟩ (Z-basis -1)</option>
            <option value="|+>">|+⟩ (X-basis +1)</option>
            <option value="|->">|-⟩ (X-basis -1)</option>
            <option value="|+i>">|+i⟩ (Y-basis +1)</option>
            <option value="|-i>">|-i⟩ (Y-basis -1)</option>
          </select>
        </div>

        {/* Shots */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Measurement Shots
          </label>
          <select
            value={shots}
            onChange={(e) => setShots(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value={100}>100 Shots</option>
            <option value={500}>500 Shots</option>
            <option value={1000}>1,000 Shots (Standard)</option>
            <option value={5000}>5,000 Shots</option>
            <option value={10000}>10,000 Shots (High Precision)</option>
          </select>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleGenerateSignature}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Generate Complete Signature</span>
        </button>

        <button
          onClick={handleRunTeleportation}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Run Teleportation Only</span>
        </button>

        <button
          onClick={handleRunMeasurement}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Measure State Only</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Classical Integrity vs Quantum Signature Information Callout */}
      {signatureData && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[11px]">
              Classical Message Digest (SHA-256)
            </span>
            <div className="text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
              {signatureData.message_hash}
            </div>
            <p className="text-[10px] text-slate-400">
              * Note: SHA-256 provides classical message integrity verification, NOT the quantum digital signature itself.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[11px]">
              Quantum Signature Metadata
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Signature ID</span>
                <span className="text-white font-semibold">{signatureData.signature_id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Cryptographic Nonce</span>
                <span className="text-white font-semibold truncate block">{signatureData.nonce}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Bell Entanglement</span>
                <span className="text-cyan-300 font-semibold">|{signatureData.bell_state}⟩</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Status</span>
                <DecisionBadge decision={signatureData.status} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Circuit Visualization */}
      <QuantumCircuitView
        steps={teleportResult?.steps}
        bellState={bellState}
        measuredBits={teleportResult?.classical_bits || '00'}
        pauliCorrection={teleportResult?.pauli_correction || 'I'}
      />

      {/* Statevectors & Projective Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input & Recovered Statevectors */}
        <div className="space-y-4">
          <BlochSphereView
            statevector={teleportResult?.input_state}
            label={`Alice Input State |ψ⟩ (${quantumState})`}
          />
          <BlochSphereView
            statevector={teleportResult?.recovered_state}
            label={`Bob Recovered State |ψ'⟩ after Pauli ${teleportResult?.pauli_correction || 'I'}`}
          />
        </div>

        {/* Right: Projective Measurement Outcomes */}
        <div className="cyber-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Projective Measurement Outcomes ({measurementBasis} Basis)
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">
              {shots} Total Shots
            </span>
          </div>

          {measurementResult ? (
            <div className="space-y-4">
              {/* Counts Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Expected Outcome</span>
                  <span className="text-cyan-300 font-bold text-sm">
                    {measurementResult.expected_outcome}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Expected Matches</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {measurementResult.expected_count}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Empirical Error (E)</span>
                  <span className="text-amber-300 font-bold text-sm">
                    {(measurementResult.empirical_error_rate * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sample Measurement Records Table */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase mb-2">
                  Sample Shot Telemetry (First 8 Shots)
                </h4>
                <div className="overflow-x-auto max-h-48 border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px]">
                      <tr>
                        <th className="p-2">Shot #</th>
                        <th className="p-2">Basis</th>
                        <th className="p-2">Expected</th>
                        <th className="p-2">Observed</th>
                        <th className="p-2">Born Prob</th>
                        <th className="p-2">Match Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {measurementResult.sample_records.slice(0, 8).map((s) => (
                        <tr key={s.shot_number} className="hover:bg-slate-900/60">
                          <td className="p-2 text-slate-400">#{s.shot_number}</td>
                          <td className="p-2 text-cyan-300">{s.basis}</td>
                          <td className="p-2 text-slate-200">{s.expected_outcome}</td>
                          <td className="p-2 font-semibold text-white">{s.actual_outcome}</td>
                          <td className="p-2 text-slate-400">{(s.probability * 100).toFixed(1)}%</td>
                          <td className="p-2">
                            {s.is_match ? (
                              <span className="text-emerald-400 font-semibold text-[10px]">MATCH</span>
                            ) : (
                              <span className="text-rose-400 font-semibold text-[10px]">MISMATCH</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-16">
              Generate signature or run measurements to view telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
