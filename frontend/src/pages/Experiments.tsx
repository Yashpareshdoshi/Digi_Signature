import React, { useState } from 'react';
import { Play, RotateCcw, Download, FlaskConical, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { DecisionBadge } from '../components/DecisionBadge';

interface ExperimentResult {
  scenario: string;
  shots: number;
  noise_applied_pct: number;
  unexpected_outcomes: number;
  error_rate_pct: number;
  ci_lower_pct: number;
  ci_upper_pct: number;
  forgery_probability_pct: number;
  decision: string;
  threat_detected: string;
  rule_triggered: string;
  latency_ms: number;
}

export const Experiments: React.FC = () => {
  const [shots, setShots] = useState(1000);
  const [noise, setNoise] = useState(0.05);
  const [intensity, setIntensity] = useState('MEDIUM');
  const [scenario, setScenario] = useState('LEGITIMATE');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExperimentResult[]>([
    {
      scenario: 'LEGITIMATE',
      shots: 1000,
      noise_applied_pct: 2.0,
      unexpected_outcomes: 21,
      error_rate_pct: 2.1,
      ci_lower_pct: 1.38,
      ci_upper_pct: 3.19,
      forgery_probability_pct: 0.01,
      decision: 'VERIFIED',
      threat_detected: 'NONE',
      rule_triggered: 'RULE_6_VERIFIED_LEGITIMATE',
      latency_ms: 2.3,
    },
    {
      scenario: 'FORGERY',
      shots: 1000,
      noise_applied_pct: 85.0,
      unexpected_outcomes: 489,
      error_rate_pct: 48.9,
      ci_lower_pct: 45.8,
      ci_upper_pct: 52.01,
      forgery_probability_pct: 99.99,
      decision: 'REJECTED',
      threat_detected: 'SIGNATURE_FORGERY',
      rule_triggered: 'RULE_4_HIGH_MEASUREMENT_ERROR',
      latency_ms: 2.6,
    },
    {
      scenario: 'REPLAY',
      shots: 1000,
      noise_applied_pct: 2.0,
      unexpected_outcomes: 19,
      error_rate_pct: 1.9,
      ci_lower_pct: 1.22,
      ci_upper_pct: 2.95,
      forgery_probability_pct: 0.01,
      decision: 'REJECTED',
      threat_detected: 'REPLAY_ATTACK',
      rule_triggered: 'RULE_3_NONCE_REPLAY',
      latency_ms: 1.8,
    },
    {
      scenario: 'IMPERSONATION',
      shots: 1000,
      noise_applied_pct: 2.0,
      unexpected_outcomes: 20,
      error_rate_pct: 2.0,
      ci_lower_pct: 1.3,
      ci_upper_pct: 3.07,
      forgery_probability_pct: 0.01,
      decision: 'REJECTED',
      threat_detected: 'IMPERSONATION',
      rule_triggered: 'RULE_1_IDENTITY_MISMATCH',
      latency_ms: 1.9,
    },
    {
      scenario: 'CHANNEL_MANIPULATION',
      shots: 1000,
      noise_applied_pct: 25.0,
      unexpected_outcomes: 247,
      error_rate_pct: 24.7,
      ci_lower_pct: 22.12,
      ci_upper_pct: 27.46,
      forgery_probability_pct: 98.42,
      decision: 'REJECTED',
      threat_detected: 'SIGNATURE_FORGERY',
      rule_triggered: 'RULE_4_HIGH_MEASUREMENT_ERROR',
      latency_ms: 2.4,
    },
  ]);

  const handleRunExperiment = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/experiments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shots,
          noise_rate: noise,
          attack_scenario: scenario,
          intensity,
          quantum_state: '|0>',
          basis: 'Z',
        }),
      });
      const data = await res.json();
      setResults((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllScenarios = async () => {
    try {
      setLoading(true);
      const scenarios = ['LEGITIMATE', 'FORGERY', 'REPLAY', 'IMPERSONATION', 'CHANNEL_MANIPULATION'];
      const batchResults = [];
      for (const sc of scenarios) {
        const res = await fetch('/api/analytics/experiments/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shots,
            noise_rate: noise,
            attack_scenario: sc,
            intensity,
            quantum_state: '|0>',
            basis: 'Z',
          }),
        });
        const data = await res.json();
        batchResults.push(data);
      }
      setResults(batchResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qds_experiments_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <span>Academic Experimental Framework & Threat Evaluation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct parameterized empirical trials across varying measurement shot counts (100–10,000), channel noise levels, and attack intensities.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Trial Data (JSON)</span>
        </button>
      </div>

      {/* Experiment Controls Console */}
      <div className="cyber-card space-y-4 font-mono text-xs">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Trial Parameters & Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1">Scenario Vector</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="LEGITIMATE">Legitimate Signature (No Threat)</option>
              <option value="FORGERY">Signature Forgery (Unentangled Fabricated State)</option>
              <option value="REPLAY">Replay Attack (Consumed Nonce)</option>
              <option value="IMPERSONATION">Signer Impersonation (Spoofed ID)</option>
              <option value="CHANNEL_MANIPULATION">Channel Noise Manipulation</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1">Measurement Shots (n)</label>
            <select
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value={100}>100 Shots</option>
              <option value={500}>500 Shots</option>
              <option value={1000}>1,000 Shots (Standard)</option>
              <option value={5000}>5,000 Shots</option>
              <option value={10000}>10,000 Shots (High Precision)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1">Attack Intensity</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="LOW">Low Intensity</option>
              <option value="MEDIUM">Medium Intensity</option>
              <option value="HIGH">High Intensity</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between uppercase font-semibold text-slate-400 mb-1">
              <span>Channel Noise (p)</span>
              <span className="text-purple-300">{(noise * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.01"
              value={noise}
              onChange={(e) => setNoise(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400 mt-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleRunExperiment}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Single Trial</span>
          </button>

          <button
            onClick={handleRunAllScenarios}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execute All 5 Scenarios Benchmark</span>
          </button>
        </div>
      </div>

      {/* Experimental Evaluation Matrix Table */}
      <div className="cyber-card space-y-3 font-mono text-xs">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Empirical Trial Log & Threat Comparison Matrix
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px]">
              <tr>
                <th className="p-3">Scenario</th>
                <th className="p-3 text-right">Shots (n)</th>
                <th className="p-3 text-right">Error Rate (E)</th>
                <th className="p-3 text-right">Wilson 95% CI</th>
                <th className="p-3 text-right">Statistical Forgery Indicator</th>
                <th className="p-3">Detection Classification</th>
                <th className="p-3">Decision</th>
                <th className="p-3 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="p-3 font-bold text-slate-200">{r.scenario}</td>
                  <td className="p-3 text-right text-slate-400">{r.shots}</td>
                  <td className="p-3 text-right text-cyan-300 font-bold">{r.error_rate_pct}%</td>
                  <td className="p-3 text-right text-slate-400">[{r.ci_lower_pct}%, {r.ci_upper_pct}%]</td>
                  <td className="p-3 text-right text-amber-300">{r.forgery_probability_pct}%</td>
                  <td className="p-3 text-slate-300">{r.threat_detected}</td>
                  <td className="p-3">
                    <DecisionBadge decision={r.decision} size="sm" />
                  </td>
                  <td className="p-3 text-right text-slate-500">{r.latency_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
