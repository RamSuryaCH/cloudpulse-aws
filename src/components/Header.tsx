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
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#30D158', '#0A84FF', '#FFFFFF', '#D97706']
    });
  };

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
    { id: 'cost', label: 'Cost Guard', icon: DollarSign },
    { id: 'security', label: 'Well-Architected Audit', icon: ShieldCheck },
    { id: 'telemetry', label: 'Live Telemetry', icon: Activity },
    { id: 'inspector', label: 'AWS Deployment', icon: Globe },
    { id: 'submission', label: 'Challenge Pack', icon: Award },
  ];

  const regions = [
    { id: 'ap-southeast-2', name: 'Sydney (ap-southeast-2)' },
    { id: 'us-east-1', name: 'N. Virginia (us-east-1)' },
    { id: 'eu-west-1', name: 'Ireland (eu-west-1)' },
    { id: 'ap-south-1', name: 'Mumbai (ap-south-1)' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo & Live Pulse */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group" 
            onClick={() => {
              sounds.playClick();
              setActiveTab('studio');
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] flex items-center justify-center text-black font-bold shadow-lg shadow-[#F59E0B]/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <Cloud className="w-6 h-6 text-black stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-white tracking-tight">CloudPulse <span className="text-[#F59E0B] font-mono font-semibold text-xs px-2 py-0.5 rounded-md bg-[#F59E0B]/15 border border-[#F59E0B]/30 ml-0.5">AI</span></span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30 font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
                  LIVE AWS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AWS Serverless Architecture Studio & Cost Guard</p>
            </div>
          </div>

          {/* Quick Search, Region, Audio & Entry Action */}
          <div className="flex items-center space-x-3">
            {/* Spotlight Search Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden md:flex items-center space-x-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] px-4 py-2.5 rounded-2xl text-xs text-slate-300 transition-all shadow-inner group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#F59E0B] transition-colors" />
              <span className="text-slate-400">Search blueprints, AWS services...</span>
              <kbd className="bg-white/[0.08] text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-mono border border-white/[0.06]">
                ⌘K
              </kbd>
            </button>

            {/* Region Selector */}
            <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 rounded-2xl text-xs shadow-inner">
              <Server className="w-4 h-4 text-[#F59E0B]" />
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
                  <option key={r.id} value={r.id} className="bg-[#0C0C12] text-slate-200 py-1">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Enable tactile sound effects" : "Mute tactile sounds"}
              className="w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#F59E0B]" />}
            </button>

            {/* Challenge Entry Button */}
            <button
              onClick={() => {
                sounds.playSuccess();
                setActiveTab('submission');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-extrabold text-xs shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95 duration-150"
            >
              <Award className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Challenge Entry</span>
            </button>

            {/* Celebrate Button */}
            <button
              onClick={triggerCelebration}
              title="Celebrate deployment"
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate 🎉</span>
            </button>
          </div>
        </div>

        {/* Apple-style Fluid Segmented Pill Navigation */}
        <div className="mt-4 apple-nav-bar flex space-x-2 overflow-x-auto no-scrollbar">
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
                className={`flex-1 flex items-center justify-center space-x-2.5 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.12] text-[#F59E0B] shadow-md border border-[#F59E0B]/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
