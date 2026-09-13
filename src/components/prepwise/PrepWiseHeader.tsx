import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Volume2, 
  VolumeX, 
  Building2,
  Menu,
  X
} from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playSuccess();
    }
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
    { id: 'home', label: 'Home' },
    { id: 'booking', label: 'Book Session' },
    { id: 'pyq', label: 'PYQ Vault' },
    { id: 'tracker', label: 'Tracker' },
    { id: 'tutor', label: 'Volunteer' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'admin', label: 'Admin' },
  ];

  const colleges = [
    { id: 'vnrvjiet', name: 'VNRVJIET Hyderabad' },
    { id: 'cbit', name: 'CBIT Hyderabad' },
    { id: 'mjcet', name: 'MJCET Hyderabad' },
    { id: 'jntuh', name: 'JNTU Hyderabad' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pw-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none group" 
            onClick={() => {
              sounds.playClick();
              setActiveTab('home');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-pw-accent text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-pw-accent-hover transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-pw-text tracking-tight font-display">PrepWise</span>
                <span className="text-[11px] font-semibold text-pw-accent bg-pw-accent-subtle px-2 py-0.5 rounded-md border border-pw-accent-border">
                  CAMPUS
                </span>
              </div>
              <span className="text-[11px] text-pw-secondary hidden md:block">100% Free Peer Tutoring</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playSwitch();
                    setActiveTab(item.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-pw-subtle text-pw-text font-semibold'
                      : 'text-pw-secondary hover:text-pw-text hover:bg-pw-subtle/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Spotlight Search (Cmd+K) */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden lg:flex items-center space-x-2 bg-pw-subtle hover:bg-pw-muted/70 border border-pw-border px-3 py-1.5 rounded-lg text-xs text-pw-secondary transition-colors"
              title="Search subjects, PYQs (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-pw-tertiary" />
              <span>Search</span>
              <kbd className="bg-white text-pw-secondary px-1.5 py-0.5 rounded text-[10px] font-mono border border-pw-border shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Campus Selector */}
            <div className="flex items-center space-x-1.5 bg-pw-subtle border border-pw-border px-2.5 py-1.5 rounded-lg text-xs">
              <Building2 className="w-3.5 h-3.5 text-pw-accent shrink-0" />
              <select
                value={selectedCollege}
                onChange={(e) => {
                  sounds.playSwitch();
                  setSelectedCollege(e.target.value);
                }}
                aria-label="Select Campus"
                className="bg-transparent text-pw-text font-medium text-xs focus:outline-none cursor-pointer pr-1"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="text-pw-text py-1">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Enable sound feedback" : "Mute sound feedback"}
              className="w-9 h-9 rounded-lg bg-pw-subtle hover:bg-pw-muted/70 border border-pw-border flex items-center justify-center text-pw-secondary transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-pw-tertiary" /> : <Volume2 className="w-4 h-4 text-pw-accent" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-pw-subtle hover:bg-pw-muted border border-pw-border flex items-center justify-center text-pw-text"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-pw-border space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playSwitch();
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-pw-accent-subtle text-pw-accent font-semibold'
                      : 'text-pw-secondary hover:bg-pw-subtle'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
