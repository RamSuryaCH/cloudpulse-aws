import React, { useState, useEffect } from 'react';
import { Cloud, ShieldCheck, DollarSign, Activity, Globe, Award, Sparkles, Server, Search, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  onOpenCommandPalette,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playSuccess();
    }
  };

  const triggerCelebration = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#539FE5', '#10B981', '#FFFFFF', '#EC7211']
    });
  };

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  const navItems = [
    { id: 'studio', label: 'Architecture Studio', icon: Cloud },
    { id: 'cost', label: 'Cost & Free-Tier Guard', icon: DollarSign },
    { id: 'security', label: 'Well-Architected Audit', icon: ShieldCheck },
    { id: 'telemetry', label: 'Live Telemetry & Logs', icon: Activity },
    { id: 'inspector', label: 'AWS Deployment View', icon: Globe },
    { id: 'submission', label: 'Challenge Pack', icon: Award, highlight: true },
  ];

  const regions = [
    { id: 'ap-southeast-2', name: 'AP (Sydney) • ap-southeast-2' },
    { id: 'us-east-1', name: 'US East (N. Virginia) • us-east-1' },
    { id: 'eu-west-1', name: 'EU (Ireland) • eu-west-1' },
    { id: 'ap-south-1', name: 'AP (Mumbai) • ap-south-1' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0B111B]/90 backdrop-blur-2xl transition-all">
      {/* Top Status Bar with Live Indicator */}
      <div className="border-b border-white/[0.05] bg-[#0F1B2A]/70 px-4 sm:px-8 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-500/30"></span>
            </span>
            <span className="font-semibold text-white tracking-wide">AWS Production Active:</span>
            <span className="text-slate-300 hidden md:inline">CloudFront Global Edge • Graviton3 Lambda • DynamoDB</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              100% Free Tier ($0.00/mo)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Enable tactile sounds" : "Mute tactile sounds"}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF9900]" />}
              <span className="text-[11px]">{isMuted ? 'Muted' : 'Sound ON'}</span>
            </button>

            <a
              href="https://github.com/RamSuryaCH/cloudpulse-aws"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-[#FF9900] transition-colors flex items-center gap-1.5 hidden lg:flex"
            >
              <span>RamSuryaCH/cloudpulse-aws</span>
              <span className="text-slate-500">↗</span>
            </a>
            <button 
              onClick={triggerCelebration}
              className="flex items-center space-x-1.5 bg-[#FF9900]/15 hover:bg-[#FF9900]/25 border border-[#FF9900]/40 text-[#FF9900] px-3 py-1 rounded-lg transition-all active:scale-95 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate 🎉</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Apple-Grade Pro Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group" 
            onClick={() => {
              sounds.playClick();
              setActiveTab('studio');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9900] via-[#EC7211] to-[#D05C06] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#FF9900]/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <Cloud className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white tracking-tight">CloudPulse <span className="text-[#FF9900] font-mono font-semibold text-xs px-2 py-0.5 rounded-md bg-[#FF9900]/15 border border-[#FF9900]/30 ml-0.5">AI</span></span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold tracking-wider">
                  PRODUCTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AWS Architecture Studio & Serverless Observability Hub</p>
            </div>
          </div>

          {/* Search Trigger, Region Selector & Entry CTA */}
          <div className="flex items-center space-x-3">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden md:flex items-center space-x-2 bg-[#0F1B2A] hover:bg-[#141F30] border border-white/[0.08] hover:border-[#FF9900]/40 px-3.5 py-2 rounded-xl text-xs text-slate-300 transition-all shadow-inner group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF9900]" />
              <span className="text-slate-400">Search commands & resources...</span>
              <kbd className="bg-white/[0.08] text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/[0.06]">
                ⌘K
              </kbd>
            </button>

            <div className="flex items-center space-x-2 bg-[#0F1B2A] border border-white/[0.08] px-3 py-2 rounded-xl text-xs shadow-inner">
              <Server className="w-4 h-4 text-[#FF9900]" />
              <select
                value={selectedRegion}
                onChange={(e) => {
                  sounds.playSwitch();
                  setSelectedRegion(e.target.value);
                }}
                aria-label="Select AWS Region"
                className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer pr-1"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#0F1B2A] text-slate-100 py-1">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                sounds.playSuccess();
                setActiveTab('submission');
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9900] to-[#EC7211] hover:from-[#FFA726] hover:to-[#FF9900] text-slate-950 font-bold text-xs shadow-md shadow-[#FF9900]/25 transition-all active:scale-95 duration-150"
            >
              <Award className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Challenge Entry</span>
            </button>
          </div>
        </div>

        {/* Apple-style Segmented Navigation Bar */}
        <div className="mt-3 apple-segmented-pill flex space-x-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playSwitch();
                  setActiveTab(item.id);
                }}
                className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#141F30] to-[#1A283E] text-[#FF9900] shadow-md border border-[#FF9900]/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF9900]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
