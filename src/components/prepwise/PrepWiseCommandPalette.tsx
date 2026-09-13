import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Clock, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Home
} from 'lucide-react';
import { COURSE_SUBJECTS, SEED_PYQS } from '../../data/prepwiseData';
import { sounds } from '../../utils/soundEffects';

interface PrepWiseCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pages' | 'Subjects' | 'PYQ Papers';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
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
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    {
      id: 'tab-home',
      title: 'Home & Campus Overview',
      subtitle: 'Overview of 100% free campus peer tutoring',
      category: 'Pages',
      icon: Home,
      action: () => onSelectTab('home')
    },
    {
      id: 'tab-booking',
      title: 'Book a Free Peer Session',
      subtitle: 'Request 1-on-1 exam prep or group study circle',
      category: 'Pages',
      icon: BookOpen,
      action: () => onSelectTab('booking')
    },
    {
      id: 'tab-pyq',
      title: 'PYQ & Solved Notes Vault',
      subtitle: 'Solved past exam question papers and formulas',
      category: 'Pages',
      icon: FileText,
      action: () => onSelectTab('pyq')
    },
    {
      id: 'tab-tracker',
      title: 'Session Tracker',
      subtitle: 'Check assigned tutor details & meeting venue',
      category: 'Pages',
      icon: Clock,
      action: () => onSelectTab('tracker')
    },
    {
      id: 'tab-tutor',
      title: 'Volunteer Tutor Portal',
      subtitle: 'Claim student requests & earn volunteer hours',
      category: 'Pages',
      icon: UserCheck,
      action: () => onSelectTab('tutor')
    },
    {
      id: 'tab-clubs',
      title: 'Partner Student Clubs',
      subtitle: 'AWS Cloud Club, CSI, and IEEE chapter links',
      category: 'Pages',
      icon: Award,
      action: () => onSelectTab('clubs')
    },
    {
      id: 'tab-admin',
      title: 'Campus Admin Console',
      subtitle: 'Coordinator operations and session approvals',
      category: 'Pages',
      icon: ShieldCheck,
      action: () => onSelectTab('admin')
    },
    ...COURSE_SUBJECTS.map((subject) => ({
      id: `subj-${subject.id}`,
      title: subject.name,
      subtitle: `${subject.code} • ${subject.tutorsCount} Verified Tutors`,
      category: 'Subjects' as const,
      icon: BookOpen,
      action: () => onSelectTab('booking')
    })),
    ...SEED_PYQS.map((pyq) => ({
      id: `pyq-${pyq.id}`,
      title: `${pyq.subjectCode} ${pyq.subjectName} (${pyq.year})`,
      subtitle: `${pyq.type} • Solved PDF Notes`,
      category: 'PYQ Papers' as const,
      icon: FileText,
      action: () => onSelectTab('pyq')
    }))
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sounds.playClick();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sounds.playClick();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          sounds.playSuccess();
          filteredItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-28">
      <div 
        className="fixed inset-0" 
        onClick={() => {
          sounds.playClick();
          onClose();
        }} 
      />

      <div className="relative bg-white rounded-2xl border border-pw-border shadow-pw-dropdown w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-pw-border">
          <Search className="w-4 h-4 text-pw-tertiary mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search subjects, PYQs, portals (or press Esc to close)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-pw-text placeholder-pw-tertiary focus:outline-none"
          />
          <kbd className="bg-pw-subtle text-pw-secondary px-2 py-0.5 rounded text-[10px] font-mono border border-pw-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-pw-border/50">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-pw-secondary font-medium">
              No matching pages, subjects, or PYQ papers found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playSuccess();
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-pw-accent-subtle text-pw-accent' : 'hover:bg-pw-subtle text-pw-text'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-pw-accent text-white' : 'bg-pw-subtle text-pw-secondary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-pw-text truncate">{item.title}</span>
                        <span className="text-[10px] font-semibold text-pw-tertiary bg-pw-subtle px-1.5 py-0.5 rounded border border-pw-border">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-pw-secondary block truncate">{item.subtitle}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-pw-accent shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-pw-subtle border-t border-pw-border text-[11px] text-pw-secondary flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span><kbd className="font-mono bg-white px-1 rounded border border-pw-border">↑↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white px-1 rounded border border-pw-border">↵</kbd> to select</span>
          </div>
          <span className="font-mono text-pw-accent font-medium">100% Free Campus Platform</span>
        </div>
      </div>
    </div>
  );
};
