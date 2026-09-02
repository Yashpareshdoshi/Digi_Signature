import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  CheckCircle,
  ShieldAlert,
  Eye,
  Activity,
  Bell,
  FlaskConical,
  ScrollText,
  Settings as SettingsIcon,
  Zap,
  Radio,
  Binary
} from 'lucide-react';
import { DemoModal } from './DemoModal';

export const Navbar: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'QDS Simulator', path: '/simulator', icon: Cpu },
    { name: 'Verification', path: '/verification', icon: CheckCircle },
    { name: 'Attack Simulator', path: '/attacks', icon: ShieldAlert },
    { name: 'Quantum Visualizer', path: '/visualizer', icon: Eye },
    { name: 'Measurement Analysis', path: '/measurements', icon: Activity },
    { name: 'Security Alerts', path: '/alerts', icon: Bell },
    { name: 'Experiments', path: '/experiments', icon: FlaskConical },
    { name: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070a10]/95 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Binary className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                QUANTUM<span className="text-cyan-400">DEFENSE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                QDS Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Quantum-Inspired Cyber Threat Detection for Digital Signature Security
            </p>
          </div>
        </div>

        {/* Center: System Status Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Simulation: NumPy Statevector</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>AI/ML: Strictly Disabled (Deterministic)</span>
          </div>
        </div>

        {/* Right: 1-Click Complete Demo CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-150 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Run Complete Demo</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Bar */}
      <nav className="bg-[#0b0f19] border-b border-slate-800/80 px-6 py-2 flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
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
      </nav>

      {/* 1-Click Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
};
