import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Cloud, 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Code2, 
  X,
  Zap,
  Server
} from 'lucide-react';
import { AWS_SERVICES, ARCHITECTURE_TEMPLATES } from '../data/awsServices';
import { sounds } from '../utils/soundEffects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onSelectTemplate?: (templateId: string) => void;
  onSelectService?: (serviceId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectTemplate,
  onSelectService
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
    { id: 'tab-studio', label: 'Architecture Studio', category: 'Navigation', icon: Cloud, action: () => { onSelectTab('studio'); onClose(); } },
    { id: 'tab-cost', label: 'Cost & Free-Tier Guard', category: 'Navigation', icon: DollarSign, action: () => { onSelectTab('cost'); onClose(); } },
    { id: 'tab-security', label: 'Well-Architected Audit', category: 'Navigation', icon: ShieldCheck, action: () => { onSelectTab('security'); onClose(); } },
    { id: 'tab-telemetry', label: 'Live Telemetry & Logs', category: 'Navigation', icon: Activity, action: () => { onSelectTab('telemetry'); onClose(); } },
    { id: 'tab-inspector', label: 'AWS Deployment View', category: 'Navigation', icon: Globe, action: () => { onSelectTab('inspector'); onClose(); } },
    { id: 'tab-manifest', label: 'Production Stack Manifest', category: 'Navigation', icon: Globe, action: () => { onSelectTab('manifest'); onClose(); } },

    // Blueprints
    ...ARCHITECTURE_TEMPLATES.map(t => ({
      id: `tmpl-${t.id}`,
      label: `Preset: ${t.name}`,
      category: 'Architecture Blueprint',
      icon: Sparkles,
      action: () => { 
        onSelectTab('studio'); 
        if (onSelectTemplate) onSelectTemplate(t.id); 
        onClose(); 
      }
    })),

    // AWS Services
    ...AWS_SERVICES.map(s => ({
      id: `svc-${s.id}`,
      label: `AWS Service: ${s.name} (${s.code})`,
      category: 'AWS Catalog',
      icon: s.category === 'compute' ? Zap : s.category === 'database' ? Server : Layers,
      action: () => {
        onSelectTab('studio');
        if (onSelectService) onSelectService(s.id);
        onClose();
      }
    })),

    // Quick Actions
    { id: 'act-export-tf', label: 'IaC: Switch to Terraform (.tf)', category: 'Quick Action', icon: Code2, action: () => { onSelectTab('studio'); onClose(); } },
    { id: 'act-export-cdk', label: 'IaC: Switch to AWS CDK (TypeScript)', category: 'Quick Action', icon: Code2, action: () => { onSelectTab('studio'); onClose(); } },
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
      sounds.playClick();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sounds.playClick();
      setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        sounds.playSuccess();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#0B111B] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col ring-1 ring-white/10"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#0F1B2A]/80">
          <Search className="w-5 h-5 text-[#FF9900] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search AWS services, architecture blueprints, or press Tab/Arrow keys..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching AWS resources or commands found for "{query}"
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'bg-[#141F30] text-[#FF9900] shadow-sm border border-[#FF9900]/30' 
                      : 'text-slate-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#FF9900]/20 text-[#FF9900]' : 'bg-[#0F1B2A] text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <span className="text-[10px] font-mono text-[#FF9900] flex items-center gap-1 font-semibold">
                        <span>Select</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#070B12] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span><kbd className="bg-white/[0.08] px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-white/[0.08] px-1.5 py-0.5 rounded text-[10px]">↵</kbd> Choose</span>
          </div>
          <span className="text-[#FF9900]">CloudPulse Command Center</span>
        </div>
      </div>
    </div>
  );
};
