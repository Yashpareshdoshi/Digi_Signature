import React, { useEffect, useState } from 'react';
import { X, Cpu, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

interface QiskitCircuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantumState: string;
  bellState: string;
}

export const QiskitCircuitModal: React.FC<QiskitCircuitModalProps> = ({
  isOpen,
  onClose,
  quantumState,
  bellState,
}) => {
  const [diagram, setDiagram] = useState<string>('Loading Qiskit circuit diagram...');
  const [backendName, setBackendName] = useState<string>('qiskit');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.getCircuitDiagram(quantumState, bellState)
      .then((res) => {
        setDiagram(res.diagram);
        setBackendName(res.backend);
      })
      .catch((err) => {
        setDiagram(`Error generating diagram: ${err.message}`);
      });
  }, [isOpen, quantumState, bellState]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(diagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono">
              Qiskit Standard Quantum Teleportation Circuit
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Backend: {backendName.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Showing 3-qubit teleportation circuit with EPR pair entanglement, Alice Bell measurement,
          and Bob classically controlled Pauli operations (<code className="text-cyan-300">c_if</code>)
          for state <code className="text-cyan-300 font-bold">{quantumState}</code> and Bell pair{' '}
          <code className="text-cyan-300 font-bold">{bellState}</code>.
        </div>

        <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre leading-tight max-h-96">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {diagram}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
