import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Simulator } from './pages/Simulator';
import { Verification } from './pages/Verification';
import { Attacks } from './pages/Attacks';
import { Visualizer } from './pages/Visualizer';
import { MeasurementAnalysis } from './pages/MeasurementAnalysis';
import { Alerts } from './pages/Alerts';
import { Experiments } from './pages/Experiments';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A] dark:bg-[#080b12] dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-150">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/attacks" element={<Attacks />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/measurements" element={<MeasurementAnalysis />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <footer className="border-t border-[#CBD5E1] bg-white dark:border-slate-800 dark:bg-[#0e1322] py-4 px-6 text-center text-xs text-[#64748B] dark:text-slate-400 font-mono transition-colors duration-150">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-[#0F172A] dark:text-slate-300">
                Quantum-Inspired Cyber Threat Detection for Digital Signature Security
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                Deterministic Quantum Threat Detection Framework (Zero AI/ML)
              </span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
