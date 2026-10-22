import React from 'react';
import { Download, Terminal, Database, LineChart, Cpu, ShieldCheck, Github } from 'lucide-react';

export type ActiveTab = 'overview' | 'eda' | 'benchmark' | 'xai' | 'mlops' | 'package';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onExportZip: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportZip,
  isExporting,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              AegisChurn<span className="text-cyan-400">ML</span>
            </span>
            <span className="hidden xl:inline text-xs font-mono text-slate-500 pl-2 border-l border-slate-800">
              Production DS Lab
            </span>
          </div>

          {/* Zone 2: Clean Nav Links with responsive spacing */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('eda')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'eda'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              EDA & Stats
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'benchmark'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Model Arena
            </button>

            <button
              onClick={() => setActiveTab('xai')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'xai'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              SHAP & What-If
            </button>

            <button
              onClick={() => setActiveTab('mlops')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mlops'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              MLOps & Drift
            </button>

            <button
              onClick={() => setActiveTab('package')}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'package'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Package
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExportZip}
              disabled={isExporting}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Packaging...' : 'Export Repo (.zip)'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-900">
          {(
            [
              ['overview', 'Overview'],
              ['eda', 'EDA & Stats'],
              ['benchmark', 'Models'],
              ['xai', 'SHAP & What-If'],
              ['mlops', 'MLOps & Drift'],
              ['package', 'GitHub Package'],
            ] as const
          ).map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
                activeTab === tabKey
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
