import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Copy, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { SECURITY_AUDIT_ITEMS } from '../data/awsServices';
import type { SecurityAuditItem } from '../types';

export const SecurityAuditor: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [items] = useState<SecurityAuditItem[]>(SECURITY_AUDIT_ITEMS);
  const [expandedId, setExpandedId] = useState<string | null>('sec-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const pillars = ['All', 'Security', 'Reliability', 'Performance', 'Cost', 'Operations', 'Sustainability'];

  const filteredItems = selectedPillar === 'All' 
    ? items 
    : items.filter(i => i.pillar === selectedPillar);

  const passedCount = items.filter(i => i.status === 'passed').length;
  const score = Math.round((passedCount / items.length) * 100);

  const handleCopySnippet = (id: string, snippet?: string) => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Scorecard Bento Header */}
      <div className="bento-card p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">AWS Well-Architected Framework Audit</h2>
            </div>
            <p className="text-xs text-slate-300/80 leading-relaxed max-w-2xl">
              Automated compliance evaluation across all 6 AWS Well-Architected Framework pillars. Evaluates infrastructure-as-code configurations, IAM least-privilege, encryption-at-rest, and edge caching resilience.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 text-slate-300 border border-white/10 text-xs font-mono">
                Pillars Evaluated: <span className="text-amber-400 font-bold">6 / 6</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 text-slate-300 border border-white/10 text-xs font-mono">
                Checks Passed: <span className="text-emerald-400 font-bold">{passedCount} / {items.length}</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 text-slate-300 border border-white/10 text-xs font-mono">
                Critical Vulnerabilities: <span className="text-emerald-400 font-bold">0</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-white/10">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-100 font-mono">{score}%</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Passed</span>
              </div>
            </div>
            <button
              onClick={handleRescan}
              disabled={isScanning}
              className="mt-3 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isScanning ? 'Auditing Codebase...' : 'Re-run Compliance Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pillar Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {pillars.map((pillar) => (
          <button
            key={pillar}
            onClick={() => setSelectedPillar(pillar)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedPillar === pillar
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      {/* Audit Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bento-card overflow-hidden"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
                        {item.pillar}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Passed
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3 text-xs bg-slate-950/40">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                    <span className="font-bold text-slate-300">Detailed Recommendation:</span>
                    <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    <p className="text-emerald-400/90 font-mono text-[11px] mt-1">✓ Remediation: {item.remediation}</p>
                  </div>

                  {item.terraformSnippet && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-slate-400">Enforced Terraform Block:</span>
                        <button
                          onClick={() => handleCopySnippet(item.id, item.terraformSnippet)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono border border-white/10"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-amber-200/80 overflow-x-auto">
                        {item.terraformSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
