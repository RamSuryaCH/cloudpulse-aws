import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  X,
  GraduationCap,
  FileText
} from 'lucide-react';
import { COURSE_SUBJECTS } from '../../data/prepwiseData';
import { sounds } from '../../utils/soundEffects';

interface PrepWiseCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const PrepWiseCommandPalette: React.FC<PrepWiseCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items = [
    // Navigation
    { id: 'tab-booking', label: 'Book Session (100% Free)', category: 'Navigation', icon: BookOpen, action: () => { onSelectTab('booking'); onClose(); } },
    { id: 'tab-pyq', label: 'PYQ Vault & Solved Notes', category: 'Navigation', icon: FileText, action: () => { onSelectTab('pyq'); onClose(); } },
    { id: 'tab-tracker', label: 'Student Session Tracker', category: 'Navigation', icon: Clock, action: () => { onSelectTab('tracker'); onClose(); } },
    { id: 'tab-tutor', label: 'Peer Tutor Portal (Volunteer Karma)', category: 'Navigation', icon: UserCheck, action: () => { onSelectTab('tutor'); onClose(); } },
    { id: 'tab-clubs', label: 'Partner Clubs & Chapters', category: 'Navigation', icon: Award, action: () => { onSelectTab('clubs'); onClose(); } },
    { id: 'tab-admin', label: 'Campus Admin Console', category: 'Navigation', icon: ShieldCheck, action: () => { onSelectTab('admin'); onClose(); } },

    // Course Subjects Shortcuts
    ...COURSE_SUBJECTS.map(c => ({
      id: `course-${c.id}`,
      label: `Course: ${c.name} (${c.code})`,
      category: 'Subjects Catalog',
      icon: GraduationCap,
      action: () => {
        onSelectTab('booking');
        onClose();
      }
    }))
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      sounds.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      sounds.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        sounds.playSuccess();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      sounds.playClick();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div 
        className="apple-card max-w-xl w-full p-0 overflow-hidden shadow-2xl border-2 border-[#30D158]/40 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#050508]">
          <Search className="w-5 h-5 text-[#30D158] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a course name, code, or PYQ paper to jump..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching courses or commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playSuccess();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-white/[0.1] text-white font-medium shadow-md' 
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#30D158]' : 'text-slate-400'}`} />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#30D158]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/60 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with <kbd className="text-slate-400">↑</kbd> <kbd className="text-slate-400">↓</kbd></span>
          <span>Select with <kbd className="text-slate-400">↵</kbd></span>
        </div>
      </div>
    </div>
  );
};
