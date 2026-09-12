import React, { useState } from 'react';
import { 
  Cloud, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Sparkles, 
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
  Layers
} from 'lucide-react';
import { AWS_SERVICES, ARCHITECTURE_TEMPLATES } from '../data/awsServices';
import type { ArchitectureNode, ArchitectureConnection, ArchitectureTemplate } from '../types';
import { generateTerraform, generateCDK } from '../utils/codeGenerators';

interface ArchitectureStudioProps {
  selectedRegion: string;
}

export const ArchitectureStudio: React.FC<ArchitectureStudioProps> = ({ selectedRegion }) => {
  const [currentTemplate, setCurrentTemplate] = useState<ArchitectureTemplate>(ARCHITECTURE_TEMPLATES[0]);
  const [nodes, setNodes] = useState<ArchitectureNode[]>(ARCHITECTURE_TEMPLATES[0].nodes);
  const [connections, setConnections] = useState<ArchitectureConnection[]>(ARCHITECTURE_TEMPLATES[0].connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [codeMode, setCodeMode] = useState<'terraform' | 'cdk'>('terraform');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activePaletteCategory, setActivePaletteCategory] = useState<string>('all');
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(true);

  // Load a preset template
  const handleSelectTemplate = (template: ArchitectureTemplate) => {
    setCurrentTemplate(template);
    setNodes(template.nodes);
    setConnections(template.connections);
    setSelectedNodeId(null);
  };

  // Add node from palette
  const handleAddService = (serviceId: string) => {
    const service = AWS_SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    const newNodeId = `${service.id}-${Date.now().toString().slice(-4)}`;
    const newNode: ArchitectureNode = {
      id: newNodeId,
      serviceId: service.id,
      label: `${service.code} Instance`,
      x: 350 + (nodes.length * 40) % 300,
      y: 120 + (nodes.length * 50) % 200,
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNodeId);

    // Auto connect to previous node if available
    if (nodes.length > 0) {
      const prevNode = nodes[nodes.length - 1];
      const newConn: ArchitectureConnection = {
        id: `c-${Date.now()}`,
        from: prevNode.id,
        to: newNodeId,
        label: 'Internal Traffic'
      };
      setConnections(prev => [...prev, newConn]);
    }
  };

  // Delete selected node
  const handleDeleteNode = (nodeId: string) => {
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

  const generatedTerraform = generateTerraform(nodes, connections);
  const generatedCDK = generateCDK(nodes, connections);
  const currentCode = codeMode === 'terraform' ? generatedTerraform : generatedCDK;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const filename = codeMode === 'terraform' ? 'main.tf' : 'CloudPulseStack.ts';
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
    <div className="space-y-6">
      {/* Bento Top Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {ARCHITECTURE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`bento-card p-4 cursor-pointer ${
              currentTemplate.id === tmpl.id
                ? 'ring-2 ring-amber-500/50 !border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                {tmpl.name}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {tmpl.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300/80 leading-relaxed mb-3 line-clamp-2">
              {tmpl.description}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span className="text-emerald-400 font-mono font-semibold">Est. Cost: ${tmpl.estimatedCost.toFixed(2)}/mo</span>
              <span className="text-amber-400 font-mono font-semibold">Compliance: {tmpl.complianceScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Studio Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: AWS Service Palette */}
        <div className="xl:col-span-3 bento-card p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              AWS Building Blocks
            </h3>
            <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              1-Click Add
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {['all', 'compute', 'storage', 'database', 'networking'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActivePaletteCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  activePaletteCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service List */}
          <div className="space-y-2 overflow-y-auto max-h-[520px] pr-1">
            {AWS_SERVICES
              .filter(s => activePaletteCategory === 'all' || s.category === activePaletteCategory)
              .map((service) => {
                const Icon = getServiceIcon(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleAddService(service.id)}
                    className="group p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-amber-500/40 hover:bg-slate-800/60 cursor-pointer transition-all duration-200 flex items-center justify-between backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                          {service.code}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {service.freeTier}
                        </div>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center: Interactive Visual Architecture Canvas */}
        <div className="xl:col-span-5 bento-card p-4 flex flex-col min-h-[560px]">
          {/* Canvas Controls Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Visual Cloud Topology</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-white/10">
                  {nodes.length} AWS Resources
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Click any resource node to inspect configuration and security policies.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSimulatingTraffic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSimulatingTraffic ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span>{isSimulatingTraffic ? 'Live Traffic ON' : 'Paused'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Topology Graph Area */}
          <div className="relative flex-1 bg-slate-950/60 rounded-xl border border-white/10 bg-grid-pattern p-4 overflow-hidden flex flex-col justify-between backdrop-blur-md">
            {/* SVG Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9900" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              {connections.map((conn) => {
                const source = nodes.find(n => n.id === conn.from);
                const target = nodes.find(n => n.id === conn.to);
                if (!source || !target) return null;

                const sourceIdx = nodes.findIndex(n => n.id === conn.from);
                const targetIdx = nodes.findIndex(n => n.id === conn.to);
                
                return (
                  <g key={conn.id}>
                    <line
                      x1={`${Math.min(90, Math.max(10, 15 + sourceIdx * 20))}%`}
                      y1={`${20 + (sourceIdx % 3) * 30}%`}
                      x2={`${Math.min(90, Math.max(10, 15 + targetIdx * 20))}%`}
                      y2={`${20 + (targetIdx % 3) * 30}%`}
                      stroke="url(#lineGrad)"
                      strokeWidth="2.5"
                      strokeDasharray={isSimulatingTraffic ? "6 6" : "none"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes Grid Layout */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 my-auto">
              {nodes.map((node) => {
                const service = AWS_SERVICES.find(s => s.id === node.serviceId);
                const Icon = getServiceIcon(node.serviceId);
                const isSelected = selectedNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative p-3 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-xl ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/20 ring-2 ring-amber-500/40 -translate-y-0.5'
                        : 'bg-slate-900/80 border-white/10 hover:border-amber-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2.5">
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{node.label}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] text-slate-400 font-mono">{service?.code || 'AWS Resource'}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase shadow-md shadow-amber-500/30">
                        Active
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Resource Inspector Drawer */}
            {selectedNode && selectedService && (
              <div className="relative z-10 bg-slate-900/90 border border-amber-500/40 rounded-xl p-3 mt-4 text-xs backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {selectedService.name} Configuration
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Free Tier: Active
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mb-2">{selectedService.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/80 p-2.5 rounded-lg border border-white/10">
                  <div>
                    <span className="text-slate-500">Tier Allowance:</span>
                    <p className="text-slate-200">{selectedService.freeTier}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Deployment Region:</span>
                    <p className="text-slate-200">{selectedRegion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Production IaC Generator (Terraform & CDK) */}
        <div className="xl:col-span-4 bento-card p-4 flex flex-col h-full">
          {/* Code Switcher Bar */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Infrastructure as Code
              </h3>
            </div>
            <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-xl border border-white/10">
              <button
                onClick={() => setCodeMode('terraform')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  codeMode === 'terraform'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Terraform
              </button>
              <button
                onClick={() => setCodeMode('cdk')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  codeMode === 'cdk'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AWS CDK
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">
              {codeMode === 'terraform' ? 'main.tf (HCL 2.0)' : 'CloudPulseStack.ts (TypeScript)'}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-white/5"
                title="Copy IaC code to clipboard"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs transition-colors"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-y-auto max-h-[480px]">
            <pre className="whitespace-pre leading-relaxed text-amber-100/90">{currentCode}</pre>
          </div>

          {/* Quick CLI Execution Tip */}
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="font-mono text-amber-300 font-medium">
              {codeMode === 'terraform' ? '$ terraform init && terraform apply' : '$ cdk synth && cdk deploy'}
            </span>
            <span className="text-emerald-400 font-bold">100% Free Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
