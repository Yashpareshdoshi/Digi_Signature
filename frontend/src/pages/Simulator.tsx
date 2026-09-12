import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Play,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Zap,
  Info,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { SignatureDetail, TeleportationResult, MeasurementResult } from '../types';
import { StepIndicator } from '../components/StepIndicator';
import { QuantumCircuitView } from '../components/QuantumCircuitView';
import { BlochSphereView } from '../components/BlochSphereView';
import { DecisionBadge } from '../components/DecisionBadge';
import { QiskitCircuitModal } from '../components/QiskitCircuitModal';

export const Simulator: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Transfer ₹5000 to Account X');
  const [signerId, setSignerId] = useState('Signer-Alice');
  const [bellState, setBellState] = useState('Phi+');
  const [quantumState, setQuantumState] = useState('|0>');
  const [measurementBasis, setMeasurementBasis] = useState('Z');
  const [shots, setShots] = useState(1000);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureDetail | null>(null);
  const [teleportResult, setTeleportResult] = useState<TeleportationResult | null>(null);
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isQiskitModalOpen, setIsQiskitModalOpen] = useState(false);

  // Quick message presets for SIH demonstrations
  const messagePresets = [
    { label: 'Bank Transfer', text: 'Authorize Wire Transfer: $5,000 to Bob (Account #9481)' },
    { label: 'Legal Contract', text: 'Mutual NDA & Intellectual Property Agreement v1.2' },
    { label: 'Software Firmware', text: 'Firmware Release Binary: Hash Release-v2.4.0-Production' },
  ];

  // Primary Action: Generate Quantum Signature
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
    } catch (err: any) {
      setError(err.message || 'Signature generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToVerification = () => {
    if (signatureData) {
      navigate('/verification', { state: { selectedSignatureId: signatureData.signature_id } });
    } else {
      navigate('/verification');
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator: 01 Message → 02 Signature → 03 Teleportation */}
      <StepIndicator currentStep={signatureData ? 3 : 1} />

      {/* Page Header */}
      <div className="cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-wide">
              Create Quantum Digital Signature
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC] dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40 font-semibold">
              QDS Signer
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            Encode plaintext with classical SHA-256 digest and single-use cryptographic nonce, then seal via quantum teleportation.
          </p>
        </div>

        {signatureData && (
          <button
            onClick={handleProceedToVerification}
            className="px-4 py-2 rounded-lg bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start md:self-auto dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950"
          >
            <span>Proceed to Step 04: Verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="cyber-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] dark:border-slate-800/80 pb-3">
          <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <span>Document Payload & Signer Identity</span>
          </h2>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">Presets:</span>
            {messagePresets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMessage(p.text)}
                className="px-2.5 py-1 rounded-md bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#CBD5E1] text-[11px] text-[#0891B2] font-semibold dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-cyan-300 transition-colors shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input & Signer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Message Content
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-slate-400 mb-1">
              Signer Entity
            </label>
            <select
              value={signerId}
              onChange={(e) => setSignerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            >
              <option value="Signer-Alice">Signer-Alice (Authorized)</option>
              <option value="Signer-Charlie">Signer-Charlie (Secondary)</option>
              <option value="Signer-Mallory">Signer-Mallory (Unauthorized)</option>
            </select>
          </div>
        </div>

        {/* Collapsible Advanced Parameters */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#0891B2] dark:hover:text-cyan-400 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Quantum Parameters (Bell Pair, Pauli Eigenbasis, Shots)</span>
            {showAdvancedSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvancedSettings && (
            <div className="mt-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] dark:bg-slate-950/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase mb-1">
                  Entangled Bell Pair
                </label>
                <select
                  value={bellState}
                  onChange={(e) => setBellState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500"
                >
                  <option value="Phi+">|Φ+⟩ = (|00⟩ + |11⟩)/√2</option>
                  <option value="Phi-">|Φ-⟩ = (|00⟩ - |11⟩)/√2</option>
                  <option value="Psi+">|Ψ+⟩ = (|01⟩ + |10⟩)/√2</option>
                  <option value="Psi-">|Ψ-⟩ = (|01⟩ - |10⟩)/√2</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase mb-1">
                  Pauli Eigenstate |ψ⟩
                </label>
                <select
                  value={quantumState}
                  onChange={(e) => setQuantumState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500"
                >
                  <option value="|0>">|0⟩ (Z-basis +1)</option>
                  <option value="|1>">|1⟩ (Z-basis -1)</option>
                  <option value="|+>">|+⟩ (X-basis +1)</option>
                  <option value="|->">|-⟩ (X-basis -1)</option>
                  <option value="|+i>">|+i⟩ (Y-basis +1)</option>
                  <option value="|-i>">|-i⟩ (Y-basis -1)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] dark:text-slate-400 uppercase mb-1">
                  Simulation Shots
                </label>
                <select
                  value={shots}
                  onChange={(e) => setShots(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A] font-mono focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500"
                >
                  <option value={100}>100 Shots</option>
                  <option value={500}>500 Shots</option>
                  <option value={1000}>1,000 Shots (Standard)</option>
                  <option value={5000}>5,000 Shots</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleGenerateSignature}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950"
          >
            <Play className="w-4 h-4 fill-white dark:fill-slate-950" />
            <span>Generate Quantum Signature</span>
          </button>

          <button
            onClick={() => setIsQiskitModalOpen(true)}
            className="px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#475569] border border-[#CBD5E1] dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-cyan-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Cpu className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <span>Qiskit Circuit</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Generated Signature Information (Single Consolidated Card) */}
      {signatureData && (
        <div className="cyber-card space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
              <span className="font-bold text-[#0F172A] dark:text-white uppercase tracking-wide">
                Signature Generated & Teleported
              </span>
            </div>
            <DecisionBadge decision={signatureData.status} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="cyber-subcard">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Signature ID</span>
              <span className="text-[#0F172A] dark:text-white font-bold">{signatureData.signature_id}</span>
            </div>

            <div className="cyber-subcard">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Single-Use Nonce</span>
              <span className="text-[#0891B2] dark:text-cyan-300 font-bold truncate block">{signatureData.nonce}</span>
            </div>

            <div className="cyber-subcard">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Signer Entity</span>
              <span className="text-[#0F172A] dark:text-slate-200 font-semibold">{signatureData.signer_id}</span>
            </div>

            <div className="cyber-subcard">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">Bell Entangled State</span>
              <span className="text-[#2563EB] dark:text-indigo-300 font-bold">|{signatureData.bell_state}⟩</span>
            </div>
          </div>

          <div className="cyber-subcard">
            <span className="text-[#64748B] block text-[10px] uppercase mb-1 font-bold tracking-wider">
              Classical Digest (SHA-256)
            </span>
            <span className="text-[#475569] dark:text-slate-300 text-[11px] break-all font-mono">
              {signatureData.message_hash}
            </span>
          </div>
        </div>
      )}

      {/* Teleportation Pipeline UI (Step 7) */}
      {teleportResult && (
        <div className="cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800/80 pb-2.5">
            <h2 className="text-xs font-bold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
              <span>3-Qubit Quantum Teleportation Pipeline</span>
            </h2>
            <span className="text-[10px] font-mono text-[#16A34A] dark:text-emerald-400 font-semibold">
              Fidelity: {teleportResult.fidelity.toFixed(4)} (Exact)
            </span>
          </div>

          {/* Visual Flow: Alice ↓ Bell Measurement ↓ Classical Bits ↓ Pauli Correction ↓ Bob ↓ Recovered State */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center font-mono">
            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">1. Alice Input</span>
              <span className="text-xs font-bold text-[#0891B2] dark:text-cyan-300 my-1">|ψ⟩ on q0</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">{quantumState}</span>
            </div>

            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">2. Bell Pair</span>
              <span className="text-xs font-bold text-[#2563EB] dark:text-indigo-300 my-1">|{teleportResult.bell_state_used}⟩</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">q1 ⊗ q2</span>
            </div>

            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">3. Alice BSM</span>
              <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 my-1">Bits: {teleportResult.classical_bits}</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">c0, c1</span>
            </div>

            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">4. Pauli Key</span>
              <span className="text-xs font-bold text-[#D97706] dark:text-amber-300 my-1">Gate: {teleportResult.pauli_correction}</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">Correction</span>
            </div>

            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">5. Bob Receiver</span>
              <span className="text-xs font-bold text-[#16A34A] dark:text-emerald-300 my-1">Qubit q2</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">Post-Correction</span>
            </div>

            <div className="cyber-subcard flex flex-col items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">6. Recovered</span>
              <span className="text-xs font-bold text-[#16A34A] dark:text-emerald-400 my-1">|ψ'⟩</span>
              <span className="text-[10px] text-[#475569] dark:text-slate-400 font-semibold">F = 1.000</span>
            </div>
          </div>

          {/* Expandable Technical Details */}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#0891B2] dark:hover:text-cyan-400 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showTechnicalDetails ? 'Hide Technical Details' : 'View Technical Details (Bloch Spheres & Circuit Steps)'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTechnicalDetails && (
              <div className="space-y-6 pt-4">
                {/* 3-Qubit Circuit View */}
                <QuantumCircuitView
                  steps={teleportResult.steps}
                  bellState={bellState}
                  measuredBits={teleportResult.classical_bits}
                  pauliCorrection={teleportResult.pauli_correction}
                />

                {/* Bloch Spheres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BlochSphereView
                    statevector={teleportResult.input_state}
                    label={`Alice Input State |ψ⟩ (${quantumState})`}
                  />
                  <BlochSphereView
                    statevector={teleportResult.recovered_state}
                    label={`Bob Recovered State |ψ'⟩ after Pauli ${teleportResult.pauli_correction}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Qiskit Circuit Modal */}
      <QiskitCircuitModal
        isOpen={isQiskitModalOpen}
        onClose={() => setIsQiskitModalOpen(false)}
        quantumState={quantumState}
        bellState={bellState}
      />
    </div>
  );
};
