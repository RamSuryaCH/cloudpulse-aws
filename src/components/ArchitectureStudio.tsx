import React, { useState } from 'react';
import { 
  Cloud, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Database, 
  Globe, 
  Cpu, 
  Zap, 
  Shield, 
  Activity, 
  HardDrive, 
  Radio, 
  Send, 
  Box,
  Layers,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { AWS_SERVICES, ARCHITECTURE_TEMPLATES } from '../data/awsServices';
import type { ArchitectureNode, ArchitectureConnection, ArchitectureTemplate } from '../types';
import { generateTerraform, generateCDK, generatePulumi } from '../utils/codeGenerators';
import { sounds } from '../utils/soundEffects';

interface ArchitectureStudioProps {
  selectedRegion: string;
}

export const ArchitectureStudio: React.FC<ArchitectureStudioProps> = ({ selectedRegion }) => {
  const [currentTemplate, setCurrentTemplate] = useState<ArchitectureTemplate>(ARCHITECTURE_TEMPLATES[0]);
  const [nodes, setNodes] = useState<ArchitectureNode[]>(ARCHITECTURE_TEMPLATES[0].nodes);
  const [connections, setConnections] = useState<ArchitectureConnection[]>(ARCHITECTURE_TEMPLATES[0].connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('fn');
  const [codeMode, setCodeMode] = useState<'terraform' | 'cdk' | 'pulumi'>('terraform');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(true);

  const handleSelectTemplate = (template: ArchitectureTemplate) => {
    sounds.playSwitch();
    setCurrentTemplate(template);
    setNodes(template.nodes);
    setConnections(template.connections);
    setSelectedNodeId(template.nodes[0]?.id || null);
  };

  const handleAddService = (serviceId: string) => {
    sounds.playSuccess();
    const service = AWS_SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    const newNodeId = `${service.id}-${Date.now().toString().slice(-4)}`;
    const newNode: ArchitectureNode = {
      id: newNodeId,
      serviceId: service.id,
      label: `${service.code} Node`,
      x: 350 + (nodes.length * 30) % 250,
      y: 120 + (nodes.length * 40) % 180,
      config: { ...service.defaultConfig }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNodeId);

    if (nodes.length > 0) {
      const prevNode = nodes[nodes.length - 1];
      const newConn: ArchitectureConnection = {
        id: `c-${Date.now()}`,
        from: prevNode.id,
        to: newNodeId,
        label: 'Connected'
      };
      setConnections(prev => [...prev, newConn]);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    sounds.playDelete();
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const getServiceIcon = (serviceId: string) => {
    const s = AWS_SERVICES.find(item => item.id === serviceId);
    if (!s) return Cloud;
    switch (s.icon) {
      case 'Globe': return Globe;
      case 'HardDrive': return HardDrive;
      case 'Zap': return Zap;
      case 'Cpu': return Cpu;
      case 'Database': return Database;
      case 'Radio': return Radio;
      case 'Activity': return Activity;
      case 'Shield': return Shield;
      case 'Send': return Send;
      case 'Box': return Box;
      default: return Cloud;
    }
  };

  const currentCode = codeMode === 'terraform' 
    ? generateTerraform(nodes, connections)
    : codeMode === 'cdk'
      ? generateCDK(nodes, connections)
      : generatePulumi(nodes, connections);

  const handleCopyCode = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    sounds.playSuccess();
    const filename = codeMode === 'terraform' 
      ? 'main.tf' 
      : codeMode === 'cdk' 
        ? 'CloudPulseStack.ts' 
        : 'index.ts';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedService = selectedNode ? AWS_SERVICES.find(s => s.id === selectedNode.serviceId) : null;

  return (
    <div className="space-y-8">
      {/* Studio Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2 text-[#FF9900] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Cloud Topology & IaC Synthesis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AWS Architecture Studio</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Design multi-tier AWS serverless blueprints visually. Generate production Terraform, AWS CDK, and Pulumi stacks in real-time.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-[#0F1B2A] border border-white/[0.08] text-slate-300">
            Region: <span className="text-[#FF9900] font-bold">{selectedRegion}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            Live AWS Verified
          </span>
        </div>
      </div>

      {/* Spacious Topology Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ARCHITECTURE_TEMPLATES.map((tmpl) => {
          const isSelected = currentTemplate.id === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`aws-card p-6 cursor-pointer select-none relative overflow-hidden transition-all duration-200 ${
                isSelected ? 'aws-card-active' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-white flex items-center gap-2">
                  {tmpl.name}
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/30">
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                {tmpl.description}
              </p>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-3 border-t border-white/[0.08]">
                <span className="text-emerald-400 font-bold text-sm">
                  ${tmpl.estimatedCost.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                </span>
                <span className="text-slate-300 bg-[#0B111B] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  Well-Architected: <strong className="text-emerald-400">{tmpl.complianceScore}%</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Studio Area: Catalog, Topology Canvas, and IaC Generator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: AWS Service Catalog */}
        <div className="xl:col-span-3 aws-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF9900]" />
              AWS Catalog
            </h3>
            <span className="text-xs text-slate-400 font-mono">1-Click Add</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['all', 'compute', 'storage', 'database', 'networking'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-[#0B111B] border border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[580px] pr-1">
            {AWS_SERVICES
              .filter(s => activeCategory === 'all' || s.category === activeCategory)
              .map((service) => {
                const Icon = getServiceIcon(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleAddService(service.id)}
                    className="group p-3 rounded-xl bg-[#0B111B] border border-white/[0.06] hover:border-[#FF9900]/50 hover:bg-[#141F30] cursor-pointer transition-all duration-150 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#141F30] border border-white/[0.08] flex items-center justify-center text-[#FF9900] group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-[#FF9900]">
                          {service.code}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                          {service.freeTier}
                        </div>
                      </div>
                    </div>
                    <button 
                      aria-label={`Add ${service.code} node`}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#FF9900]/20 text-[#FF9900] transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center: Topology Canvas Map */}
        <div className="xl:col-span-5 aws-card p-5 flex flex-col min-h-[640px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-2.5">
              <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
                Active Topology Canvas
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#0B111B] text-[#FF9900] border border-white/[0.08]">
                {nodes.length} Nodes
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playSwitch();
                setIsSimulatingTraffic(!isSimulatingTraffic);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSimulatingTraffic
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#0B111B] text-slate-400 border border-white/[0.08]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSimulatingTraffic ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isSimulatingTraffic ? 'Live Edge Traffic' : 'Simulation Paused'}</span>
            </button>
          </div>

          {/* Canvas Area with Dot Grid */}
          <div className="relative flex-1 bg-[#090D15] rounded-2xl border border-white/[0.08] aws-canvas-grid p-5 overflow-hidden flex flex-col justify-between">
            {/* SVG Traffic & Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9900" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#539FE5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {connections.map((conn) => {
                const sourceIdx = nodes.findIndex(n => n.id === conn.from);
                const targetIdx = nodes.findIndex(n => n.id === conn.to);
                if (sourceIdx === -1 || targetIdx === -1) return null;

                return (
                  <g key={conn.id}>
                    <line
                      x1={`${Math.min(90, Math.max(10, 15 + sourceIdx * 22))}%`}
                      y1={`${22 + (sourceIdx % 3) * 28}%`}
                      x2={`${Math.min(90, Math.max(10, 15 + targetIdx * 22))}%`}
                      y2={`${22 + (targetIdx % 3) * 28}%`}
                      stroke="url(#connGrad)"
                      strokeWidth="2.5"
                      strokeDasharray={isSimulatingTraffic ? "6 4" : "none"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Node Cards */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3.5 my-auto">
              {nodes.map((node) => {
                const service = AWS_SERVICES.find(s => s.id === node.serviceId);
                const Icon = getServiceIcon(node.serviceId);
                const isSelected = selectedNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedNodeId(node.id);
                    }}
                    className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#141F30] border-[#FF9900] shadow-xl shadow-[#FF9900]/15 ring-2 ring-[#FF9900]/30'
                        : 'bg-[#0F1B2A]/90 border-white/[0.08] hover:border-slate-600 hover:bg-[#121D2C]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 border border-[#FF9900]/25 flex items-center justify-center text-[#FF9900]">
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                        title="Delete node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{node.label}</h4>
                      <span className="text-[11px] text-[#539FE5] font-mono font-medium">{service?.code}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-2 -right-1 bg-[#FF9900] text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Node Inspector Drawer */}
            {selectedNode && selectedService && (
              <div className="relative z-10 bg-[#0B111B] border border-[#FF9900]/30 rounded-xl p-4 mt-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#FF9900] flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#FF9900]" />
                    {selectedService.name} Specification
                  </span>
                  <button 
                    onClick={() => {
                      sounds.playClick();
                      setSelectedNodeId(null);
                    }} 
                    aria-label="Close specification drawer"
                    className="text-slate-400 hover:text-white p-1 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-3">{selectedService.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#07090E] p-3 rounded-lg border border-white/[0.06]">
                  <div>
                    <span className="text-slate-400 text-[11px]">Free Tier Allowance:</span>
                    <p className="text-emerald-400 font-semibold mt-0.5">{selectedService.freeTier}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Target Region:</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{selectedRegion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Generation & IaC Pane */}
        <div className="xl:col-span-4 aws-card p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#FF9900]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                IaC Generator
              </h3>
            </div>
            {/* IaC Switcher Tabs */}
            <div className="apple-segmented-pill flex items-center space-x-1 p-1">
              {(['terraform', 'cdk', 'pulumi'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    sounds.playSwitch();
                    setCodeMode(mode);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs capitalize font-semibold transition-all ${
                    codeMode === mode
                      ? 'bg-[#FF9900] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">
              {codeMode === 'terraform' ? 'main.tf' : codeMode === 'cdk' ? 'CloudPulseStack.ts' : 'index.ts'}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141F30] hover:bg-[#1E2D44] text-slate-200 text-xs font-semibold transition-colors border border-white/[0.08]"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FF9900]/20 hover:bg-[#FF9900]/30 text-[#FF9900] text-xs font-semibold transition-colors border border-[#FF9900]/40"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-[#07090E] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto max-h-[480px]">
            <pre className="whitespace-pre leading-relaxed text-amber-100/90">{currentCode}</pre>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#0B111B] border border-white/[0.06] text-xs font-mono text-slate-400 flex items-center justify-between">
            <span className="text-[#FF9900] font-semibold">
              {codeMode === 'terraform' ? '$ terraform apply' : codeMode === 'cdk' ? '$ cdk deploy' : '$ pulumi up'}
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Free Tier Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
