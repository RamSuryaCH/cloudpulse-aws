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
    <div className="min-h-screen bg-[#0A101D] text-slate-100 flex flex-col font-sans selection:bg-[#FF9900] selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
      <footer className="border-t border-white/[0.08] bg-[#070B12] py-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-[#FF9900]/20 flex items-center justify-center text-[#FF9900]">
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">CloudPulse AI</span>
            <span className="text-slate-500">—</span>
            <span className="text-slate-400">AWS Weekend Challenge Production Stack</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs">
            <span className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live: CloudFront + Graviton3 Lambda
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-bold">$0.00 / mo Free Tier</span>
            <span className="text-slate-600">•</span>
            <a 
              href="https://github.com/RamSuryaCH/cloudpulse-aws" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#FF9900] hover:underline font-semibold"
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
