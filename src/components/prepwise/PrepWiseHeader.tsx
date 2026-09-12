import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Award, 
  Clock, 
  Building2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEffects';

interface PrepWiseHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCollege: string;
  setSelectedCollege: (college: string) => void;
  onOpenCommandPalette: () => void;
}

export const PrepWiseHeader: React.FC<PrepWiseHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCollege,
  setSelectedCollege,
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
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#30D158', '#0A84FF', '#A855F7', '#FFFFFF']
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
    { id: 'booking', label: 'Book Session (Free)', icon: BookOpen },
    { id: 'tracker', label: 'Session Tracker', icon: Clock },
    { id: 'tutor', label: 'Peer Tutors (Volunteer)', icon: UserCheck },
    { id: 'clubs', label: 'Partner Clubs', icon: Award },
    { id: 'admin', label: 'Campus Admin', icon: ShieldCheck },
  ];

  const colleges = [
    { id: 'vnrvjiet', name: 'VNRVJIET Hyderabad' },
    { id: 'cbit', name: 'CBIT Hyderabad' },
    { id: 'mjcet', name: 'MJCET Hyderabad' },
    { id: 'jntuh', name: 'JNTU Hyderabad' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030305]/95 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Identity */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group" 
            onClick={() => {
              sounds.playClick();
              setActiveTab('booking');
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#30D158] via-[#10B981] to-[#0A84FF] flex items-center justify-center text-black font-bold shadow-lg shadow-[#30D158]/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-black stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-white tracking-tight">PrepWise <span className="text-[#30D158] font-mono font-semibold text-xs px-2 py-0.5 rounded-md bg-[#30D158]/15 border border-[#30D158]/30 ml-0.5">CAMPUS</span></span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30 font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
                  100% FREE PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Open Campus Peer Tutoring & Knowledge Exchange</p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-3">
            {/* Spotlight Search */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden md:flex items-center space-x-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] px-4 py-2.5 rounded-2xl text-xs text-slate-300 transition-all shadow-inner group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#30D158] transition-colors" />
              <span className="text-slate-400">Search subjects, peer tutors, sessions...</span>
              <kbd className="bg-white/[0.08] text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-mono border border-white/[0.06]">
                ⌘K
              </kbd>
            </button>

            {/* Campus Selector */}
            <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 rounded-2xl text-xs shadow-inner">
              <Building2 className="w-4 h-4 text-[#30D158]" />
              <select
                value={selectedCollege}
                onChange={(e) => {
                  sounds.playSwitch();
                  setSelectedCollege(e.target.value);
                }}
                aria-label="Select Campus"
                className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer pr-1"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0C0C12] text-slate-200 py-1">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Enable sound feedback" : "Mute sound feedback"}
              className="w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#30D158]" />}
            </button>

            {/* Celebrate Action */}
            <button
              onClick={triggerCelebration}
              title="Celebrate peer learning"
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#30D158]/10 hover:bg-[#30D158]/20 border border-[#30D158]/30 text-[#30D158] text-xs font-semibold transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate 🎉</span>
            </button>
          </div>
        </div>

        {/* Fluid Pill Navigation */}
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
                    ? 'bg-white/[0.12] text-[#30D158] shadow-md border border-[#30D158]/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#30D158]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
