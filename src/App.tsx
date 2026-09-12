import { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureStudio } from './components/ArchitectureStudio';
import { CostOptimizer } from './components/CostOptimizer';
import { SecurityAuditor } from './components/SecurityAuditor';
import { TelemetryHub } from './components/TelemetryHub';
import { DeploymentInspector } from './components/DeploymentInspector';
import { SubmissionPack } from './components/SubmissionPack';
import { Cloud } from 'lucide-react';
import type { UITheme } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [selectedRegion, setSelectedRegion] = useState<string>('ap-southeast-2');
  const [currentTheme, setCurrentTheme] = useState<UITheme>('aurora-bento');

  return (
    <div className={`min-h-screen relative font-sans selection:bg-amber-500 selection:text-black theme-${currentTheme}`}>
      {/* Dynamic Aurora Ambient Lighting Layer */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />

        {/* Main Bento UI Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'studio' && (
            <ArchitectureStudio selectedRegion={selectedRegion} />
          )}
          {activeTab === 'cost' && (
            <CostOptimizer />
          )}
          {activeTab === 'security' && (
            <SecurityAuditor />
          )}
          {activeTab === 'telemetry' && (
            <TelemetryHub />
          )}
          {activeTab === 'inspector' && (
            <DeploymentInspector selectedRegion={selectedRegion} />
          )}
          {activeTab === 'submission' && (
            <SubmissionPack />
          )}
        </main>

        {/* Bento Footer */}
        <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-xl py-6 mt-12 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">CloudPulse AI</span>
              <span>—</span>
              <span className="text-slate-400">AWS Weekend Challenge Edition • Bento UI & Aurora Glass Design</span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                CloudFront CDN + Graviton3 Live
              </span>
              <span>•</span>
              <span className="text-slate-400">$0.00 / mo Free Tier</span>
              <span>•</span>
              <a 
                href="https://github.com/RamSuryaCH/cloudpulse-aws" 
                target="_blank" 
                rel="noreferrer"
                className="text-amber-400 hover:underline"
              >
                GitHub Repo ↗
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
