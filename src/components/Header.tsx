import React from 'react';
import { Cloud, Zap, ShieldCheck, DollarSign, Activity, Globe, Award, Sparkles, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UITheme } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
  currentTheme: UITheme;
  setCurrentTheme: (theme: UITheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  currentTheme,
  setCurrentTheme
}) => {
  const triggerWinCelebration = () => {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#10B981', '#3B82F6', '#EC4899', '#00F0FF']
    });
  };

  const navItems = [
    { id: 'studio', label: 'Architecture Studio', icon: Cloud },
    { id: 'cost', label: 'Cost & Free-Tier Guard', icon: DollarSign },
    { id: 'security', label: 'Well-Architected Audit', icon: ShieldCheck },
    { id: 'telemetry', label: 'Live Telemetry Hub', icon: Activity },
    { id: 'inspector', label: 'AWS Deployment View', icon: Globe },
    { id: 'submission', label: '🏆 Submission Pack', icon: Award, highlight: true },
  ];

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
    { id: 'eu-west-1', name: 'EU (Ireland)' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  ];

  const themes: { id: UITheme; name: string; tag: string }[] = [
    { id: 'aurora-bento', name: '🌌 Aurora Bento', tag: 'Recommended' },
    { id: 'cyberpunk', name: '⚡ Cyberpunk Neon', tag: 'High Voltage' },
    { id: 'swiss', name: '📐 Swiss Precision', tag: 'Minimal' },
    { id: 'neobrutalism', name: '🕹️ Neobrutalism', tag: 'Bold' },
  ];

  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl sticky top-0 z-50">
      {/* Challenge Announcement & Live Deploy Bar */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border-b border-amber-500/25 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide text-white">AWS Live Edge Active:</span>
          <span>CloudFront CDN + S3 + API Gateway v2 + Graviton3 Lambda</span>
          <span className="hidden md:inline text-amber-300/80 font-mono text-[11px]">• $0.00/mo Free Tier</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={triggerWinCelebration}
            className="hidden sm:flex items-center space-x-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-0.5 rounded-full transition-all duration-200 shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate Entry 🎉</span>
          </button>
        </div>
      </div>

      {/* Main Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-orange-500/25 ring-1 ring-white/20">
              <Cloud className="w-6 h-6 text-slate-950 font-bold" />
              <Zap className="w-3.5 h-3.5 text-amber-950 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">
                  CloudPulse <span className="text-amber-400 font-mono text-base font-semibold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Live on AWS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Bento UI • Aurora Glass Cloud Console</p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Selector Pill Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs backdrop-blur-md">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Theme:</span>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value as UITheme)}
                className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AWS Region Selector */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Region:
              </span>
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

            {/* Submission Button */}
            <button
              onClick={() => setActiveTab('submission')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Challenge Pack</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1.5 overflow-x-auto py-2.5 border-t border-white/5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                } ${item.highlight && !isActive ? 'text-amber-400 hover:text-amber-300' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
