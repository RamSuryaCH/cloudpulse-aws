import { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureStudio } from './components/ArchitectureStudio';
import { CostOptimizer } from './components/CostOptimizer';
import { SecurityAuditor } from './components/SecurityAuditor';
import { TelemetryHub } from './components/TelemetryHub';
import { DeploymentInspector } from './components/DeploymentInspector';
import { SubmissionPack } from './components/SubmissionPack';
import { CommandPalette } from './components/CommandPalette';
import { Cloud } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [selectedRegion, setSelectedRegion] = useState<string>('ap-southeast-2');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#030305] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#F59E0B] selection:text-black antialiased">
      {/* Universal Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Apple Floating Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Spacious Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
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

      {/* Apple Pro Production Footer */}
      <footer className="border-t border-white/[0.06] bg-black/60 py-10 mt-20 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">CloudPulse AI</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-400">AWS Weekend Challenge Production Stack</span>
          </div>

          <div className="flex items-center space-x-5 font-mono text-xs">
            <span className="flex items-center gap-2 text-[#30D158] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></span>
              Live: CloudFront + Graviton3 Lambda
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200 font-bold">$0.00 / mo Free Tier</span>
            <span className="text-slate-600">•</span>
            <a 
              href="https://github.com/RamSuryaCH/cloudpulse-aws" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#F59E0B] hover:underline font-bold"
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
