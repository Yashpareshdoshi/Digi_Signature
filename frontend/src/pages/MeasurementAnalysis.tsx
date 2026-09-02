import React, { useState, useEffect } from 'react';
import { Activity, Percent, BarChart2, Layers, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { api } from '../services/api';
import { MeasurementResult } from '../types';

export const MeasurementAnalysis: React.FC = () => {
  const [basisData, setBasisData] = useState<any[]>([]);
  const [selectedBasis, setSelectedBasis] = useState('Z');
  const [selectedState, setSelectedState] = useState('|0>');
  const [shots, setShots] = useState(1000);
  const [noiseRate, setNoiseRate] = useState(0.02);
  const [liveMeasurement, setLiveMeasurement] = useState<MeasurementResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBasisDistribution();
    runSampleMeasurement('Z', '|0>', 1000, 0.02);
  }, []);

  const loadBasisDistribution = async () => {
    try {
      const data = await api.getMeasurementDistribution();
      setBasisData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const runSampleMeasurement = async (b = selectedBasis, s = selectedState, sh = shots, nr = noiseRate) => {
    try {
      setLoading(true);
      const res = await api.runMeasurement({
        quantum_state: s,
        basis: b,
        shots: sh,
        noise_rate: nr,
      });
      setLiveMeasurement(res);
      loadBasisDistribution();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunNew = () => {
    runSampleMeasurement(selectedBasis, selectedState, shots, noiseRate);
  };

  const outcomeChartData = liveMeasurement
    ? Object.entries(liveMeasurement.counts).map(([outcome, count]) => {
        const actualPct = (count / liveMeasurement.shots) * 100;
        const expectedPct = (liveMeasurement.theoretical_probabilities[outcome] || 0) * 100;
        return {
          outcome: `|${outcome}⟩`,
          Expected: Math.round(expectedPct),
          Actual: Math.round(actualPct),
        };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Quantum Measurement Outcome & Basis Distribution Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical vs Born-rule theoretical probability analysis across Pauli measurement bases ($Z, X, Y$) under calibrated channel noise.
          </p>
        </div>

        <button
          onClick={handleRunNew}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Execute Sample Shots</span>
        </button>
      </div>

      {/* Control Console */}
      <div className="cyber-card grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div>
          <label className="block text-slate-400 uppercase font-semibold mb-1">State Under Test</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="|0>">|0⟩ (Z-basis eigenstate)</option>
            <option value="|1>">|1⟩ (Z-basis eigenstate)</option>
            <option value="|+>">|+⟩ (X-basis eigenstate)</option>
            <option value="|->">|-⟩ (X-basis eigenstate)</option>
            <option value="|+i>">|+i⟩ (Y-basis eigenstate)</option>
            <option value="|-i>">|-i⟩ (Y-basis eigenstate)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 uppercase font-semibold mb-1">Measurement Basis</label>
          <select
            value={selectedBasis}
            onChange={(e) => setSelectedBasis(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="Z">Z Basis (Projectors: |0⟩⟨0|, |1⟩⟨1|)</option>
            <option value="X">X Basis (Projectors: |+⟩⟨+|, |-⟩⟨-|)</option>
            <option value="Y">Y Basis (Projectors: |+i⟩⟨+i|, |-i⟩⟨-i|)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 uppercase font-semibold mb-1">Shot Count</label>
          <select
            value={shots}
            onChange={(e) => setShots(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value={100}>100 Shots</option>
            <option value={500}>500 Shots</option>
            <option value={1000}>1,000 Shots</option>
            <option value={5000}>5,000 Shots</option>
            <option value={10000}>10,000 Shots</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between uppercase font-semibold text-slate-400 mb-1">
            <span>Simulated Noise</span>
            <span className="text-cyan-400">{(noiseRate * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.02"
            value={noiseRate}
            onChange={(e) => setNoiseRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400 mt-2"
          />
        </div>
      </div>

      {/* Outcome Distributions & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Expected vs Observed Probability */}
        <div className="cyber-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Expected (Born Rule) vs Observed Probability (%)
            </h3>
            <span className="text-xs text-cyan-400 font-mono">{shots} Shots Sampled</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="outcome" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="Expected" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Expected Theoretical (%)" />
                <Bar dataKey="Actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Empirical Measured (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Historical Basis Match vs Mismatch */}
        <div className="cyber-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Database Matches vs Mismatches by Basis
            </h3>
            <span className="text-xs text-slate-400 font-mono">Aggregated Telemetry</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="basis" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="matches" fill="#10b981" radius={[4, 4, 0, 0]} name="Expected Matches" />
                <Bar dataKey="mismatches" fill="#ef4444" radius={[4, 4, 0, 0]} name="Unexpected Errors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary KPI Bar */}
      {liveMeasurement && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
          <div className="cyber-card">
            <span className="text-xs text-slate-400 block mb-1">Expected Outcome</span>
            <span className="text-2xl font-bold text-cyan-300">|{liveMeasurement.expected_outcome}⟩</span>
          </div>
          <div className="cyber-card">
            <span className="text-xs text-slate-400 block mb-1">Expected Matches</span>
            <span className="text-2xl font-bold text-emerald-400">{liveMeasurement.expected_count}</span>
          </div>
          <div className="cyber-card">
            <span className="text-xs text-slate-400 block mb-1">Unexpected Errors</span>
            <span className="text-2xl font-bold text-rose-400">{liveMeasurement.unexpected_count}</span>
          </div>
          <div className="cyber-card">
            <span className="text-xs text-slate-400 block mb-1">Empirical Error Rate</span>
            <span className="text-2xl font-bold text-amber-300">
              {(liveMeasurement.empirical_error_rate * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
