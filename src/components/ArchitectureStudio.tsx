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
  X
} from 'lucide-react';
import { AWS_SERVICES, ARCHITECTURE_TEMPLATES } from '../data/awsServices';
import type { ArchitectureNode, ArchitectureConnection, ArchitectureTemplate } from '../types';
import { generateTerraform, generateCDK, generatePulumi } from '../utils/codeGenerators';

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
    setCurrentTemplate(template);
    setNodes(template.nodes);
    setConnections(template.connections);
    setSelectedNodeId(template.nodes[0]?.id || null);
  };

  const handleAddService = (serviceId: string) => {
    const service = AWS_SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    const newNodeId = `${service.id}-${Date.now().toString().slice(-4)}`;
    const newNode: ArchitectureNode = {
      id: newNodeId,
      serviceId: service.id,
      label: `${service.code} Instance`,
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
        label: 'Internal'
      };
      setConnections(prev => [...prev, newConn]);
    }
  };

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

  const currentCode = codeMode === 'terraform' 
    ? generateTerraform(nodes, connections)
    : codeMode === 'cdk'
      ? generateCDK(nodes, connections)
      : generatePulumi(nodes, connections);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
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
    <div className="space-y-6">
      {/* Topology Presets Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {ARCHITECTURE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`cloud-card p-4 cursor-pointer select-none ${
              currentTemplate.id === tmpl.id ? 'cloud-card-selected' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                {tmpl.name}
              </span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {tmpl.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5 line-clamp-2">
              {tmpl.description}
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
              <span className="text-emerald-400 font-semibold">${tmpl.estimatedCost.toFixed(2)} / mo</span>
              <span className="text-slate-300">Well-Architected: {tmpl.complianceScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Resource Catalog */}
        <div className="xl:col-span-3 cloud-card p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              AWS Catalog
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Insert</span>
          </div>

          <div className="flex gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {['all', 'compute', 'storage', 'database', 'networking'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs capitalize font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 bg-[#0A0D14]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-1">
            {AWS_SERVICES
              .filter(s => activeCategory === 'all' || s.category === activeCategory)
              .map((service) => {
                const Icon = getServiceIcon(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleAddService(service.id)}
                    className="group p-2 rounded-lg bg-[#080B11] border border-white/[0.05] hover:border-amber-500/40 hover:bg-[#121826] cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#121826] border border-white/[0.08] flex items-center justify-center text-amber-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200 group-hover:text-amber-300">
                          {service.code}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                          {service.freeTier}
                        </div>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded bg-amber-500/10 text-amber-300">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center: Topology Canvas */}
        <div className="xl:col-span-5 cloud-card p-4 flex flex-col min-h-[540px]">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Cloud Topology Map</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080B11] text-amber-400 border border-white/[0.08]">
                  {nodes.length} Nodes
                </span>
              </h3>
            </div>
            <button
              onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isSimulatingTraffic
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#080B11] text-slate-400 border border-white/[0.08]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSimulatingTraffic ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isSimulatingTraffic ? 'Traffic Active' : 'Traffic Paused'}</span>
            </button>
          </div>

          {/* Canvas Area */}
          <div className="relative flex-1 bg-[#07090E] rounded-lg border border-white/[0.06] canvas-grid p-4 overflow-hidden flex flex-col justify-between">
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9900" stopOpacity="0.8" />
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
                      x1={`${Math.min(90, Math.max(10, 15 + sourceIdx * 20))}%`}
                      y1={`${20 + (sourceIdx % 3) * 30}%`}
                      x2={`${Math.min(90, Math.max(10, 15 + targetIdx * 20))}%`}
                      y2={`${20 + (targetIdx % 3) * 30}%`}
                      stroke="url(#connGrad)"
                      strokeWidth="2"
                      strokeDasharray={isSimulatingTraffic ? "4 4" : "none"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-2.5 my-auto">
              {nodes.map((node) => {
                const service = AWS_SERVICES.find(s => s.id === node.serviceId);
                const Icon = getServiceIcon(node.serviceId);
                const isSelected = selectedNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#121826] border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                        : 'bg-[#0E131F]/90 border-white/[0.08] hover:border-slate-700 hover:bg-[#0E131F]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{node.label}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{service?.code}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1 bg-amber-500 text-slate-950 font-bold text-[8px] px-1.5 py-0.2 rounded uppercase">
                        Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Node Inspector Drawer */}
            {selectedNode && selectedService && (
              <div className="relative z-10 bg-[#0E131F] border border-amber-500/30 rounded-lg p-3 mt-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    {selectedService.name} Configuration
                  </span>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-300 text-[11px] mb-2">{selectedService.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#080B11] p-2 rounded border border-white/[0.06]">
                  <div>
                    <span className="text-slate-500">Free Tier Allowance:</span>
                    <p className="text-slate-200">{selectedService.freeTier}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Region Target:</span>
                    <p className="text-slate-200">{selectedRegion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Generation Pane */}
        <div className="xl:col-span-4 cloud-card p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Infrastructure as Code
              </h3>
            </div>
            <div className="flex items-center space-x-1 bg-[#080B11] p-0.5 rounded-md border border-white/[0.08]">
              {(['terraform', 'cdk', 'pulumi'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCodeMode(mode)}
                  className={`px-2 py-0.5 rounded text-[11px] capitalize font-medium transition-all ${
                    codeMode === mode
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">
              {codeMode === 'terraform' ? 'main.tf' : codeMode === 'cdk' ? 'CloudPulseStack.ts' : 'index.ts'}
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-[#141B2D] hover:bg-[#1E293B] text-slate-200 text-xs transition-colors border border-white/[0.06]"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadCode}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs transition-colors border border-amber-500/30"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#07090E] border border-white/[0.06] rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-y-auto max-h-[460px]">
            <pre className="whitespace-pre leading-relaxed text-amber-100/90">{currentCode}</pre>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-[#0E131F] border border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-amber-400 font-medium">
              {codeMode === 'terraform' ? '$ terraform apply' : codeMode === 'cdk' ? '$ cdk deploy' : '$ pulumi up'}
            </span>
            <span className="text-emerald-400 font-medium">Free Tier Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
