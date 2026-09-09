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
  Layers
} from 'lucide-react';
import { DemoModal } from './DemoModal';

export const Navbar: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
      <header className="sticky top-0 z-40 bg-[#070a12]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Binary className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                QUANTUM<span className="text-cyan-400">DEFENSE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block">
                QDS Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Teleportation-Based Quantum Digital Signatures with Deterministic Threat Detection
            </p>
          </div>
        </div>

        {/* Center: System Status Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NumPy Statevector Engine</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300 text-[11px]">
            <Radio className="w-3 h-3 text-amber-400" />
            <span>Deterministic (Zero AI/ML)</span>
          </div>
        </div>

        {/* Right: 1-Click SIH Research Demo CTA */}
        <div className="flex items-center gap-2">
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
      <nav className="bg-[#0b0f19] border-b border-slate-800/80 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-slate-800 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Research & Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
          </button>

          {advancedOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-52 bg-[#0e1322] border border-slate-700/80 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-0.5"
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
                          ? 'bg-cyan-950/80 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-850'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
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
