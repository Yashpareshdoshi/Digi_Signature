import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, CheckCircle2, ShieldCheck, Sliders } from 'lucide-react';
import { api } from '../services/api';
import { SystemSetting } from '../types';

export const Settings: React.FC = () => {
  const [settingsList, setSettingsList] = useState<SystemSetting[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSettingsList(data);
      const map: Record<string, string> = {};
      data.forEach((s) => {
        map[s.key] = s.value;
      });
      setFormData(map);
    } catch (err: any) {
      setError(err.message || 'Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);

      for (const [key, val] of Object.entries(formData)) {
        await api.updateSetting(key, val);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all parameters to system defaults?')) return;
    try {
      setLoading(true);
      const data = await api.resetSettings();
      setSettingsList(data);
      const map: Record<string, string> = {};
      data.forEach((s) => {
        map[s.key] = s.value;
      });
      setFormData(map);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <span>System Security Parameters & Threshold Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Dynamically tune deterministic statistical verification thresholds, measurement shot precision, and cryptographic replay expiration windows.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="cyber-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Deterministic Threshold Parameters</span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>System configuration successfully updated and loaded into memory.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              LOW_ERROR_THRESHOLD (T_low)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.50"
              value={formData['LOW_ERROR_THRESHOLD'] || '0.05'}
              onChange={(e) => handleInputChange('LOW_ERROR_THRESHOLD', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Error rates E ≤ T_low evaluate to VERIFIED (Default: 0.05 = 5.0%)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              HIGH_ERROR_THRESHOLD (T_high)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.05"
              max="0.90"
              value={formData['HIGH_ERROR_THRESHOLD'] || '0.15'}
              onChange={(e) => handleInputChange('HIGH_ERROR_THRESHOLD', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Error rates E &gt; T_high trigger immediate REJECT (Default: 0.15 = 15.0%)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              DEFAULT_SHOTS
            </label>
            <select
              value={formData['DEFAULT_SHOTS'] || '1000'}
              onChange={(e) => handleInputChange('DEFAULT_SHOTS', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            >
              <option value="100">100 Shots</option>
              <option value="500">500 Shots</option>
              <option value="1000">1,000 Shots (Standard Default)</option>
              <option value="5000">5,000 Shots</option>
              <option value="10000">10,000 Shots (High Precision)</option>
            </select>
            <span className="text-[11px] text-slate-500 block mt-1">
              Default Monte Carlo projective measurement sample size
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              CONFIDENCE_LEVEL
            </label>
            <input
              type="number"
              step="0.01"
              min="0.80"
              max="0.99"
              value={formData['CONFIDENCE_LEVEL'] || '0.95'}
              onChange={(e) => handleInputChange('CONFIDENCE_LEVEL', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Wilson score interval confidence parameter (0.95 = 95% Confidence)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              EXPECTED_LEGITIMATE_ERROR
            </label>
            <input
              type="number"
              step="0.005"
              min="0.001"
              max="0.10"
              value={formData['EXPECTED_LEGITIMATE_ERROR'] || '0.02'}
              onChange={(e) => handleInputChange('EXPECTED_LEGITIMATE_ERROR', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Baseline quantum simulation noise assumption for binomial likelihood (0.02 = 2.0%)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              REPLAY_WINDOW_SECONDS
            </label>
            <input
              type="number"
              min="60"
              max="86400"
              value={formData['REPLAY_WINDOW_SECONDS'] || '3600'}
              onChange={(e) => handleInputChange('REPLAY_WINDOW_SECONDS', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Maximum nonce freshness time validity in seconds (Default: 3600s / 1 hour)
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
