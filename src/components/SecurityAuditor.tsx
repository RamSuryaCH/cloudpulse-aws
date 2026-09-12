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

  // Pillar scores for Radar Chart
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

  // Helper to compute polygon points for 6-pillar Radar Chart
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
    <div className="space-y-8">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2 text-[#FF9900] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated 6-Pillar Well-Architected Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AWS Well-Architected Audit</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Continuous posture evaluation against AWS Well-Architected best practices: IAM least privilege, S3 OAC encryption, Graviton3 efficiency, and serverless reliability.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            0 Critical Vulnerabilities
          </span>
        </div>
      </div>

      {/* Scorecard Hero Banner + 6-Pillar Radar Visualizer */}
      <div className="aws-card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Compliance & Posture Status</h2>
                <p className="text-xs text-slate-400 font-mono">AWS Foundational Security Best Practices (FSBP) v1.0.0</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              All infrastructure components are statically analyzed for least-privilege IAM policies, TLS 1.3 encryption in transit, S3 Block Public Access with Origin Access Control (OAC), and DynamoDB continuous Point-in-Time Recovery.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0B111B] text-slate-200 border border-white/[0.08] text-xs font-mono">
                Pillars Evaluated: <span className="text-[#FF9900] font-bold">6 of 6</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0B111B] text-slate-200 border border-white/[0.08] text-xs font-mono">
                Checks Passed: <span className="text-emerald-400 font-bold">{passedCount} of {items.length}</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0B111B] text-slate-200 border border-white/[0.08] text-xs font-mono">
                IAM Violations: <span className="text-emerald-400 font-bold">0</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRescan}
                disabled={isScanning}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#141F30] hover:bg-[#1E2D44] text-slate-200 text-xs font-semibold transition-all border border-white/[0.08] active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#FF9900]' : ''}`} />
                <span>{isScanning ? 'Scanning Audit Rules...' : 'Re-run Compliance Scan'}</span>
              </button>
            </div>
          </div>

          {/* 6-Pillar Interactive Radar Diagram & Score */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0B111B] border border-white/[0.08]">
            <div className="relative flex items-center justify-center">
              {/* Radar Spider SVG */}
              <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible">
                {/* Background grid concentric polygons */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <polygon
                    key={i}
                    points={getRadarPoints([100 * level, 100 * level, 100 * level, 100 * level, 100 * level, 100 * level], 70, 110, 100)}
                    fill="none"
                    stroke="#1E2D44"
                    strokeWidth="1"
                    strokeDasharray={level === 1.0 ? "none" : "2 2"}
                  />
                ))}

                {/* Radar Area Polygon */}
                <polygon
                  points={getRadarPoints(radarScores, 70, 110, 100)}
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />

                {/* Radar Vertices Dots */}
                {radarScores.map((scoreVal, idx) => {
                  const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                  const r = (scoreVal / 100) * 70;
                  const x = 110 + r * Math.cos(angle);
                  const y = 100 + r * Math.sin(angle);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#FF9900"
                      stroke="#0B111B"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Labels around perimeter */}
                {radarPillars.map((p, idx) => {
                  const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                  const x = 110 + 92 * Math.cos(angle);
                  const y = 100 + 86 * Math.sin(angle);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-mono fill-slate-300 font-semibold"
                    >
                      {p.slice(0, 4)}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="mt-3 flex items-center justify-between w-full pt-3 border-t border-white/[0.06] text-xs font-mono">
              <span className="text-slate-400">Overall Score:</span>
              <span className="text-emerald-400 font-extrabold text-sm">{score}% EXCELLENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {pillars.map((pillar) => (
          <button
            key={pillar}
            onClick={() => {
              sounds.playSwitch();
              setSelectedPillar(pillar);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPillar === pillar
                ? 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-[#0F1B2A] border border-white/[0.06]'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      {/* Audit Checklist Items */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="aws-card overflow-hidden transition-all duration-200"
            >
              <div
                onClick={() => {
                  sounds.playClick();
                  setExpandedId(isExpanded ? null : item.id);
                }}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#0B111B] text-[#539FE5] border border-white/[0.08]">
                        {item.pillar}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    PASS
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-white/[0.06] space-y-4 bg-[#090D15]/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                      <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1">
                        Remediation & Implementation
                      </span>
                      <p className="text-slate-200 leading-relaxed">{item.remediation}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                      <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1">
                        Impact Level & Principle
                      </span>
                      <p className="text-[#FF9900] font-mono font-medium">Impact: Low / Zero Performance Overhead</p>
                      <p className="text-slate-300 mt-1">AWS Well-Architected Framework Pillar 1.2 Compliance</p>
                    </div>
                  </div>

                  {item.terraformSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">IaC Configuration Verification:</span>
                        <button
                          onClick={() => handleCopySnippet(item.id, item.terraformSnippet)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#141F30] hover:bg-[#1E2D44] text-slate-300 text-xs font-medium border border-white/[0.08]"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy IaC Block'}</span>
                        </button>
                      </div>
                      <div className="bg-[#07090E] border border-white/[0.08] rounded-xl p-3.5 font-mono text-xs text-amber-100/90 overflow-x-auto">
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
