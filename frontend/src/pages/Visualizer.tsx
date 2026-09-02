import React, { useState, useEffect } from 'react';
import { Eye, Layers, Atom, Sparkles, Orbit, Grid } from 'lucide-react';
import { api } from '../services/api';
import { BlochSphereView } from '../components/BlochSphereView';
import { QuantumCircuitView } from '../components/QuantumCircuitView';

export const Visualizer: React.FC = () => {
  const [states, setStates] = useState<any[]>([]);
  const [bellStates, setBellStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('|0>');
  const [selectedBell, setSelectedBell] = useState('Phi+');
  const [statevectorData, setStatevectorData] = useState<any>(null);
  const [bellVectorData, setBellVectorData] = useState<any>(null);
  const [bellSteps, setBellSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      const [sRes, bRes] = await Promise.all([api.getStates(), api.getBellStates()]);
      setStates(sRes);
      setBellStates(bRes);
      loadSingleState('|0>');
      loadBellPair('Phi+');
    } catch (err) {
      console.error('Failed to load visualizer metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSingleState = async (stateName: string) => {
    setSelectedState(stateName);
    try {
      const res = await api.runTeleportation({ quantum_state: stateName, bell_state: selectedBell });
      setStatevectorData(res.input_state);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBellPair = async (bellName: string) => {
    setSelectedBell(bellName);
    try {
      const res = await api.createBellState(bellName);
      setBellVectorData(res.final_statevector);
      setBellSteps(res.circuit_steps);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <span>Interactive Quantum Physics & Statevector Visualizer</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore Hilbert spaces, Pauli eigenstates, Bloch sphere spherical angles, Bell-state entanglement, and teleportation unitary matrices.
        </p>
      </div>

      {/* Section 1: Single Qubit Pauli Eigenstates */}
      <div className="cyber-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Atom className="w-4 h-4" />
            <span>Pauli Eigenstate Explorer (Z, X, Y Bases)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">2-Dimensional Hilbert Space ℂ²</span>
        </div>

        {/* State Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {states.map((st) => (
            <button
              key={st.label}
              onClick={() => loadSingleState(st.label)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedState === st.label
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {st.label} ({st.basis} Basis, λ={st.eigenvalue})
            </button>
          ))}
        </div>

        {/* State Details & Bloch Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BlochSphereView statevector={statevectorData} label={`Eigenstate ${selectedState}`} />

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between font-mono text-xs">
            <div className="space-y-2">
              <span className="text-slate-400 text-[11px] font-bold block">DIRAC FORMALISM & EIGENVALUES</span>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold">
                {selectedState === '|0>' && '|0⟩ = [1, 0]ᵀ (Z-basis, eigenvalue +1)'}
                {selectedState === '|1>' && '|1⟩ = [0, 1]ᵀ (Z-basis, eigenvalue -1)'}
                {selectedState === '|+>' && '|+⟩ = (|0⟩ + |1⟩)/√2 (X-basis, eigenvalue +1)'}
                {selectedState === '|->' && '|-⟩ = (|0⟩ - |1⟩)/√2 (X-basis, eigenvalue -1)'}
                {selectedState === '|+i>' && '|+i⟩ = (|0⟩ + i|1⟩)/√2 (Y-basis, eigenvalue +1)'}
                {selectedState === '|-i>' && '|-i⟩ = (|0⟩ - i|1⟩)/√2 (Y-basis, eigenvalue -1)'}
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Projective measurements on this state along its eigenbasis yield deterministic outcomes with probability p = 1.0. Measurements along complementary orthogonal bases result in maximum superposition entropy (50% Born probability).
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Norm: ||ψ||² = 1.000</span>
              <span>Purity: Tr(ρ²) = 1.000 (Pure State)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: 2-Qubit Bell States (EPR Pairs) */}
      <div className="cyber-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Maximally Entangled Bell States (EPR Pairs in ℂ⁴)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Concurrence = 1.000 | Von Neumann Entropy = 1.000</span>
        </div>

        {/* Bell State Tabs */}
        <div className="flex flex-wrap gap-2">
          {bellStates.map((b) => (
            <button
              key={b.name}
              onClick={() => loadBellPair(b.name)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedBell === b.name
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              |{b.name}⟩
            </button>
          ))}
        </div>

        {/* Bell Vector Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BlochSphereView statevector={bellVectorData} label={`Bell Pair |${selectedBell}⟩ (4-State Amplitudes)`} />

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-slate-400 text-[11px] font-bold block">ENTANGLEMENT PROPERTIES</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Concurrence C(ψ)</span>
                <span className="text-purple-300 font-bold text-sm">1.000 (Maximal)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Entanglement Entropy</span>
                <span className="text-cyan-300 font-bold text-sm">1.000 e-bit</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              These 4 Bell states form an orthonormal basis for the 2-qubit Hilbert space. Measuring one qubit instantaneously determines the state of the entangled partner regardless of spatial separation.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Quantum Gate Operators Reference Matrix */}
      <div className="cyber-card space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>Fundamental Quantum Operators Matrix Reference</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Pauli-X (Bit Flip)</span>
            <div className="text-slate-300 text-[11px]">[ [0, 1], [1, 0] ]</div>
            <span className="text-[10px] text-slate-500 mt-1 block">X|0⟩ = |1⟩, X|1⟩ = |0⟩</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Pauli-Z (Phase Flip)</span>
            <div className="text-slate-300 text-[11px]">[ [1, 0], [0, -1] ]</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Pauli-Y</span>
            <div className="text-slate-300 text-[11px]">[ [0, -i], [i, 0] ]</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Y = i·X·Z</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Hadamard (H)</span>
            <div className="text-slate-300 text-[11px]">1/√2 [ [1, 1], [1, -1] ]</div>
            <span className="text-[10px] text-slate-500 mt-1 block">H|0⟩ = |+⟩, H|1⟩ = |-⟩</span>
          </div>
        </div>
      </div>
    </div>
  );
};
