import { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureStudio } from './components/ArchitectureStudio';
import { CostOptimizer } from './components/CostOptimizer';
import { SecurityAuditor } from './components/SecurityAuditor';
import { TelemetryHub } from './components/TelemetryHub';
import { DeploymentInspector } from './components/DeploymentInspector';
import { SubmissionPack } from './components/SubmissionPack';
import { Cloud } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [selectedRegion, setSelectedRegion] = useState<string>('ap-southeast-2');

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Main Studio Body */}
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

      {/* Production Footer */}
      <footer className="border-t border-white/[0.06] bg-[#07090E] py-5 mt-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">CloudPulse AI</span>
            <span>—</span>
            <span className="text-slate-400">AWS Weekend Challenge Production Stack</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live: CloudFront + Graviton3 Lambda
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
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
