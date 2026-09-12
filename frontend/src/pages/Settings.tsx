import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, CheckCircle2, ShieldCheck, Sliders, Sun, Moon, Palette } from 'lucide-react';
import { api } from '../services/api';
import { SystemSetting } from '../types';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span>System Security Parameters & Threshold Configuration</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Dynamically tune deterministic statistical verification thresholds, measurement shot precision, and cryptographic replay expiration windows.
        </p>
      </div>

      {/* Appearance & UI Theme Card */}
      <div className="cyber-card space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
          <h3 className="text-xs font-semibold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <span>UI Appearance & Theme Preference</span>
          </h3>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400">
            Active: <strong className="uppercase text-[#0891B2] dark:text-cyan-300">{theme} Mode</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'light'
                ? 'bg-[#ECFEFF] border-[#0891B2] text-[#0F172A] ring-2 ring-[#0891B2]/30 shadow-xs'
                : 'bg-white border-[#CBD5E1] hover:border-[#0891B2] text-[#475569] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 shadow-xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex-shrink-0">
              <Sun className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0F172A] dark:text-white">Light Theme</span>
                {theme === 'light' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC] font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-sans mt-1">
                Enterprise cybersecurity aesthetic with crisp contrast, soft elevation, and calibrated daylight readability.
              </p>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-cyan-500 text-white ring-2 ring-cyan-500/50 shadow-md'
                : 'bg-white border-[#CBD5E1] hover:border-[#0891B2] text-[#475569] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 shadow-xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 flex-shrink-0">
              <Moon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0F172A] dark:text-white">Dark Theme</span>
                {theme === 'dark' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-sans mt-1">
                Deep space cybersecurity aesthetic with luminous quantum accents, ideal for command centers.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="cyber-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <h3 className="text-xs font-semibold text-[#0F172A] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0891B2] dark:text-cyan-400" />
            <span>Deterministic Threshold Parameters</span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#475569] border border-[#CBD5E1] dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] dark:bg-emerald-950/80 dark:border-emerald-500/60 dark:text-emerald-300 text-xs flex items-center gap-2 font-mono shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
            <span>System configuration successfully updated and loaded into memory.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-300 text-xs font-mono shadow-xs">
            {error}
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              LOW_ERROR_THRESHOLD (T_low)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.50"
              value={formData['LOW_ERROR_THRESHOLD'] || '0.05'}
              onChange={(e) => handleInputChange('LOW_ERROR_THRESHOLD', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Error rates E ≤ T_low evaluate to VERIFIED (Default: 0.05 = 5.0%)
            </span>
          </div>

          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              HIGH_ERROR_THRESHOLD (T_high)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.05"
              max="0.90"
              value={formData['HIGH_ERROR_THRESHOLD'] || '0.15'}
              onChange={(e) => handleInputChange('HIGH_ERROR_THRESHOLD', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Error rates E &gt; T_high trigger immediate REJECT (Default: 0.15 = 15.0%)
            </span>
          </div>

          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              DEFAULT_SHOTS
            </label>
            <select
              value={formData['DEFAULT_SHOTS'] || '1000'}
              onChange={(e) => handleInputChange('DEFAULT_SHOTS', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            >
              <option value="100">100 Shots</option>
              <option value="500">500 Shots</option>
              <option value="1000">1,000 Shots (Standard Default)</option>
              <option value="5000">5,000 Shots</option>
              <option value="10000">10,000 Shots (High Precision)</option>
            </select>
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Default Monte Carlo projective measurement sample size
            </span>
          </div>

          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              CONFIDENCE_LEVEL
            </label>
            <input
              type="number"
              step="0.01"
              min="0.80"
              max="0.99"
              value={formData['CONFIDENCE_LEVEL'] || '0.95'}
              onChange={(e) => handleInputChange('CONFIDENCE_LEVEL', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Wilson score interval confidence parameter (0.95 = 95% Confidence)
            </span>
          </div>

          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              EXPECTED_LEGITIMATE_ERROR
            </label>
            <input
              type="number"
              step="0.005"
              min="0.001"
              max="0.10"
              value={formData['EXPECTED_LEGITIMATE_ERROR'] || '0.02'}
              onChange={(e) => handleInputChange('EXPECTED_LEGITIMATE_ERROR', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Baseline quantum simulation noise assumption for binomial likelihood (0.02 = 2.0%)
            </span>
          </div>

          <div>
            <label className="block text-[#0F172A] dark:text-slate-300 font-semibold mb-1">
              REPLAY_WINDOW_SECONDS
            </label>
            <input
              type="number"
              min="60"
              max="86400"
              value={formData['REPLAY_WINDOW_SECONDS'] || '3600'}
              onChange={(e) => handleInputChange('REPLAY_WINDOW_SECONDS', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:border-[#0891B2] focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:border-cyan-500 shadow-xs"
            />
            <span className="text-[11px] text-[#64748B] dark:text-slate-500 block mt-1">
              Maximum nonce freshness time validity in seconds (Default: 3600s / 1 hour)
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
