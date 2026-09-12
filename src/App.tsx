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
  const [selectedRegion, setSelectedRegion] = useState<string>('us-east-1');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* Main Content Body */}
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

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">CloudPulse AI</span>
            <span>—</span>
            <span>AWS Weekend Challenge Winner Edition</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AWS Production Status: All Systems Operational
            </span>
            <span>•</span>
            <span className="text-slate-400">Graviton3 ARM64</span>
            <span>•</span>
            <span className="text-slate-400">100% Serverless</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
