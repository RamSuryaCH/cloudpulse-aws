import React from 'react';
import { Cloud, ShieldCheck, DollarSign, Activity, Globe, Award, Sparkles, Server } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
}) => {
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#10B981', '#38BDF8', '#6366F1']
    });
  };

  const navItems = [
    { id: 'studio', label: 'Architecture Studio', icon: Cloud },
    { id: 'cost', label: 'Cost & Free-Tier Guard', icon: DollarSign },
    { id: 'security', label: 'Well-Architected Audit', icon: ShieldCheck },
    { id: 'telemetry', label: 'Live Telemetry & Logs', icon: Activity },
    { id: 'inspector', label: 'AWS Deployment View', icon: Globe },
    { id: 'submission', label: 'Challenge Pack', icon: Award, highlight: true },
  ];

  const regions = [
    { id: 'ap-southeast-2', name: 'AP (Sydney)' },
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'eu-west-1', name: 'EU (Ireland)' },
    { id: 'ap-south-1', name: 'AP (Mumbai)' },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-xl sticky top-0 z-50">
      {/* Top Production Banner */}
      <div className="bg-[#0E131F] border-b border-white/[0.06] px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide">AWS Production Active:</span>
          <span className="text-slate-300">CloudFront Global Edge • Graviton3 ARM64 • DynamoDB On-Demand</span>
          <span className="hidden lg:inline text-amber-400 font-mono text-[11px]">• $0.00/mo Free Tier Verified</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href="https://github.com/RamSuryaCH/cloudpulse-aws"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors font-mono"
          >
            GitHub: RamSuryaCH/cloudpulse-aws ↗
          </a>
          <button 
            onClick={triggerCelebration}
            className="flex items-center space-x-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-md transition-all active:scale-95 font-medium"
          >
            <Sparkles className="w-3 h-3" />
            <span>Celebrate 🎉</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('studio')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-white/10">
              <Cloud className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white tracking-tight">CloudPulse <span className="text-amber-400 font-mono font-semibold text-xs px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">AI</span></span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
                  LIVE AWS
                </span>
              </div>
            </div>
          </div>

          {/* Region and Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-[#0E131F] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-xs">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('submission')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Challenge Entry</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-white/[0.06] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white/[0.08] text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
