import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  CheckCircle2,
  ShieldAlert,
  Bell,
  Eye,
  Activity,
  FlaskConical,
  ScrollText,
  Settings as SettingsIcon,
  Zap,
  Radio,
  Binary,
  ChevronDown,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { DemoModal } from './DemoModal';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const mainNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Create Signature', path: '/simulator', icon: Cpu },
    { name: 'Verify & Decision Ledger', path: '/verification', icon: CheckCircle2 },
    { name: 'Attack Simulator', path: '/attacks', icon: ShieldAlert },
    { name: 'Incidents', path: '/alerts', icon: Bell },
  ];

  const advancedNavItems = [
    { name: 'Quantum Circuit', path: '/visualizer', icon: Eye },
    { name: 'Analytics & Measurements', path: '/measurements', icon: Activity },
    { name: 'Parameter Sweeps', path: '/experiments', icon: FlaskConical },
    { name: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
    { name: 'System Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#CBD5E1] text-[#0F172A] dark:bg-[#070a12]/95 dark:text-slate-100 dark:border-slate-800 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-colors">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Binary className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F172A] dark:text-white">
                QUANTUM<span className="text-[#0891B2] dark:text-cyan-400">DEFENSE</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/30 hidden sm:inline-block font-semibold">
                QDS Platform
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400 hidden md:block">
              Teleportation-Based Quantum Digital Signatures with Deterministic Threat Detection
            </p>
          </div>
        </div>

        {/* Center: System Status Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NumPy Statevector Engine</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] dark:bg-slate-900 dark:border-slate-800 dark:text-amber-300 text-[11px]">
            <Radio className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span>Deterministic (Zero AI/ML)</span>
          </div>
        </div>

        {/* Right: Theme Toggle & 1-Click SIH Research Demo CTA */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDemoOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all duration-150 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>1-Click SIH Demo</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <nav className="bg-[#F8FAFC] border-b border-[#CBD5E1] dark:bg-[#0b0f19] dark:border-slate-800/80 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto transition-colors">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC] font-bold shadow-xs dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-500/40 dark:shadow-sm dark:shadow-cyan-950/50'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 font-medium'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Advanced / Research Section Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-[#CBD5E1] hover:border-[#0891B2] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 dark:border-slate-800 transition-colors whitespace-nowrap shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Research & Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>

          {advancedOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl z-50 flex flex-col gap-0.5 dark:bg-[#0e1322] dark:border-slate-700/80"
              onMouseLeave={() => setAdvancedOpen(false)}
            >
              <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Advanced Research Modules
              </div>
              {advancedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setAdvancedOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-cyan-100 text-cyan-900 font-semibold dark:bg-cyan-950/80 dark:text-cyan-300'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* 1-Click Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
};
