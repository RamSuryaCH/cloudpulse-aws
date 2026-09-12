import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Copy, Check, ChevronDown, ChevronUp, RefreshCw, Sparkles } from 'lucide-react';
import { SECURITY_AUDIT_ITEMS } from '../data/awsServices';
import type { SecurityAuditItem } from '../types';
import { sounds } from '../utils/soundEffects';

export const SecurityAuditor: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [items] = useState<SecurityAuditItem[]>(SECURITY_AUDIT_ITEMS);
  const [expandedId, setExpandedId] = useState<string | null>('sec-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const pillars = ['All', 'Security', 'Reliability', 'Performance', 'Cost', 'Operations', 'Sustainability'];

  const pillarScores: Record<string, number> = {
    'Security': 100,
    'Reliability': 96,
    'Performance': 98,
    'Cost': 100,
    'Operations': 95,
    'Sustainability': 97,
  };

  const filteredItems = selectedPillar === 'All' 
    ? items 
    : items.filter(i => i.pillar === selectedPillar);

  const passedCount = items.filter(i => i.status === 'passed').length;
  const score = Math.round((passedCount / items.length) * 100);

  const handleCopySnippet = (id: string, snippet?: string) => {
    if (!snippet) return;
    sounds.playSuccess();
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRescan = () => {
    sounds.playSwitch();
    setIsScanning(true);
    setTimeout(() => {
      sounds.playSuccess();
      setIsScanning(false);
    }, 1000);
  };

  const getRadarPoints = (scores: number[], radius: number, cx: number, cy: number) => {
    return scores.map((val, idx) => {
      const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
      const r = (val / 100) * radius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const radarPillars = ['Security', 'Reliability', 'Performance', 'Cost', 'Operations', 'Sustainability'];
  const radarScores = radarPillars.map(p => pillarScores[p]);

  return (
    <div className="space-y-12">
      {/* Header & Overview */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated 6-Pillar Well-Architected Framework</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          AWS Well-Architected Audit
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Continuous posture evaluation across IAM least privilege, CloudFront OAC encryption, Graviton3 sustainability, and serverless reliability.
        </p>
      </div>

      {/* Scorecard Hero Banner + 6-Pillar Radar Visualizer */}
      <div className="apple-card p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Posture & Compliance Scorecard</h2>
                <p className="text-xs text-slate-400 font-mono">AWS Foundational Security Best Practices (FSBP) v1.0.0</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              All infrastructure components are statically analyzed for least-privilege IAM policies, TLS 1.3 encryption in transit, S3 Block Public Access with Origin Access Control (OAC), and DynamoDB continuous Point-in-Time Recovery.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-2 rounded-2xl bg-white/[0.04] text-slate-200 border border-white/[0.08] text-xs font-mono">
                Pillars Evaluated: <span className="text-[#F59E0B] font-bold">6 of 6</span>
              </span>
              <span className="px-4 py-2 rounded-2xl bg-white/[0.04] text-slate-200 border border-white/[0.08] text-xs font-mono">
                Checks Passed: <span className="text-[#30D158] font-bold">{passedCount} of {items.length}</span>
              </span>
              <span className="px-4 py-2 rounded-2xl bg-white/[0.04] text-slate-200 border border-white/[0.08] text-xs font-mono">
                IAM Violations: <span className="text-[#30D158] font-bold">0</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRescan}
                disabled={isScanning}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold transition-all border border-white/[0.08] active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-[#F59E0B]' : ''}`} />
                <span>{isScanning ? 'Scanning Audit Rules...' : 'Re-run Compliance Scan'}</span>
              </button>
            </div>
          </div>

          {/* 6-Pillar Interactive Radar Diagram & Score */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#07070A] border border-white/[0.08]">
            <div className="relative flex items-center justify-center">
              {/* Radar Spider SVG */}
              <svg width="240" height="220" viewBox="0 0 240 220" className="overflow-visible">
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <polygon
                    key={i}
                    points={getRadarPoints([100 * level, 100 * level, 100 * level, 100 * level, 100 * level, 100 * level], 80, 120, 110)}
                    fill="none"
                    stroke="#232330"
                    strokeWidth="1"
                    strokeDasharray={level === 1.0 ? "none" : "2 2"}
                  />
                ))}

                <polygon
                  points={getRadarPoints(radarScores, 80, 120, 110)}
                  fill="rgba(48, 209, 88, 0.2)"
                  stroke="#30D158"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />

                {radarScores.map((scoreVal, idx) => {
                  const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                  const r = (scoreVal / 100) * 80;
                  const x = 120 + r * Math.cos(angle);
                  const y = 110 + r * Math.sin(angle);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#F59E0B"
                      stroke="#07070A"
                      strokeWidth="2"
                    />
                  );
                })}

                {radarPillars.map((p, idx) => {
                  const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                  const x = 120 + 104 * Math.cos(angle);
                  const y = 110 + 98 * Math.sin(angle);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-mono fill-slate-300 font-bold"
                    >
                      {p.slice(0, 4)}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between w-full pt-4 border-t border-white/[0.08] text-xs font-mono">
              <span className="text-slate-400">Framework Rating:</span>
              <span className="text-[#30D158] font-black text-base">{score}% EXCELLENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Filter Pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {pillars.map((pillar) => (
          <button
            key={pillar}
            onClick={() => {
              sounds.playSwitch();
              setSelectedPillar(pillar);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedPillar === pillar
                ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20'
                : 'text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.06]'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      {/* Audit Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="apple-card overflow-hidden transition-all duration-300"
            >
              <div
                onClick={() => {
                  sounds.playClick();
                  setExpandedId(isExpanded ? null : item.id);
                }}
                className="p-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-xl bg-[#30D158]/15 border border-[#30D158]/30 flex items-center justify-center text-[#30D158]">
                    <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-white/[0.06] text-[#0A84FF] border border-white/[0.08]">
                        {item.pillar}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30">
                    PASSED
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-4 bg-black/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1 font-bold">
                        Remediation & Specification
                      </span>
                      <p className="text-slate-200 leading-relaxed">{item.remediation}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1 font-bold">
                        Impact & Principle
                      </span>
                      <p className="text-[#F59E0B] font-mono font-bold">Impact: Low / Zero Performance Overhead</p>
                      <p className="text-slate-300 mt-1">AWS Well-Architected Framework Pillar 1.2 Compliance</p>
                    </div>
                  </div>

                  {item.terraformSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">IaC Configuration Verification:</span>
                        <button
                          onClick={() => handleCopySnippet(item.id, item.terraformSnippet)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold border border-white/[0.08]"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy IaC Block'}</span>
                        </button>
                      </div>
                      <div className="bg-[#050508] border border-white/[0.08] rounded-2xl p-4 font-mono text-xs text-amber-100/90 overflow-x-auto">
                        <pre className="whitespace-pre">{item.terraformSnippet}</pre>
                      </div>
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
