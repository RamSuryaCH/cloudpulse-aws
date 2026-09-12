import React, { useState } from 'react';
import { 
  Cloud, 
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveToCloud = async () => {
    if (nodes.length === 0) return;
    sounds.playSuccess();
    setSaveStatus('saving');
    try {
      const res = await fetch(
        'https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/architectures/save',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: currentTemplate.name,
            components: nodes.map(n => n.serviceId),
            complianceScore: currentTemplate.complianceScore || 0,
            monthlyCost: currentTemplate.estimatedCost || 0
          })
        }
      );
      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

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
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Serverless Studio & Code Synthesis</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          AWS Architecture Studio
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Design resilient multi-tier AWS serverless architectures with real-time Terraform, AWS CDK, and Pulumi synthesis.
        </p>
      </div>

      {/* Spacious 3-Card Architecture Presets */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Featured Architecture Presets
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ARCHITECTURE_TEMPLATES.map((tmpl) => {
            const isSelected = currentTemplate.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`apple-card p-8 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
                  isSelected ? 'apple-card-selected' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-lg text-white">
                      {tmpl.name}
                    </span>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {tmpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-4 border-t border-white/[0.08]">
                  <span className="text-[#30D158] font-bold text-sm">
                    ${tmpl.estimatedCost.toFixed(2)} <span className="text-[11px] text-slate-400 font-normal">/ mo</span>
                  </span>
                  <span className="text-slate-300 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    Well-Architected: <strong className="text-[#30D158]">{tmpl.complianceScore}%</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Expansive Canvas & Service Palette */}
      <div className="apple-card p-8 space-y-6">
        {/* Top Control Bar: Catalog Categories & Traffic Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-base font-bold text-white">Visual Cloud Topology</h3>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
              {nodes.length} Provisioned Nodes
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Save to Cloud — real DynamoDB write */}
            <button
              onClick={handleSaveToCloud}
              disabled={saveStatus === 'saving' || nodes.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                saveStatus === 'saved'
                  ? 'bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30'
                  : saveStatus === 'error'
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                    : 'bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/30 hover:bg-[#0A84FF]/25'
              }`}
            >
              {saveStatus === 'saving' && <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse" />}
              {saveStatus === 'saved'  && <Check className="w-3.5 h-3.5" />}
              {saveStatus === 'error'  && <span className="w-2 h-2 rounded-full bg-red-400" />}
              {saveStatus === 'idle'   && <Database className="w-3.5 h-3.5" />}
              <span>
                {saveStatus === 'saving' ? 'Saving...'
                  : saveStatus === 'saved'  ? 'Saved to DynamoDB!'
                  : saveStatus === 'error'  ? 'Save Failed'
                  : 'Save to Cloud'}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playSwitch();
                setIsSimulatingTraffic(!isSimulatingTraffic);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSimulatingTraffic
                  ? 'bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30'
                  : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSimulatingTraffic ? 'bg-[#30D158] animate-pulse' : 'bg-slate-500'}`} />
              <span>{isSimulatingTraffic ? 'Live Traffic Active' : 'Traffic Paused'}</span>
            </button>
          </div>
        </div>

        {/* AWS Catalog 1-Click Add Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
              Insert AWS Building Block:
            </span>
            <div className="flex space-x-1.5">
              {['all', 'compute', 'storage', 'database', 'networking'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setActiveCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-full capitalize text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                      : 'text-slate-400 hover:text-white bg-white/[0.03]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {AWS_SERVICES
              .filter(s => activeCategory === 'all' || s.category === activeCategory)
              .map((service) => {
                const Icon = getServiceIcon(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => handleAddService(service.id)}
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#F59E0B]/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-[#F59E0B] line-clamp-1">
                      {service.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      + Add
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Expansive Canvas Area */}
        <div className="relative min-h-[460px] bg-[#050508] rounded-3xl border border-white/[0.08] apple-canvas-bg p-8 overflow-hidden flex flex-col justify-between">
          {/* SVG Traffic & Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0A84FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#30D158" stopOpacity="0.9" />
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
                    y1={`${24 + (sourceIdx % 3) * 26}%`}
                    x2={`${Math.min(90, Math.max(10, 15 + targetIdx * 20))}%`}
                    y2={`${24 + (targetIdx % 3) * 26}%`}
                    stroke="url(#appleGrad)"
                    strokeWidth="3"
                    strokeDasharray={isSimulatingTraffic ? "8 5" : "none"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
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
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.12] border-[#F59E0B] shadow-2xl shadow-[#F59E0B]/20 ring-2 ring-[#F59E0B]/40 scale-[1.02]'
                      : 'bg-[#0E0E14]/90 border-white/[0.08] hover:border-white/[0.2] hover:bg-[#14141E]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                      title="Delete node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{node.label}</h4>
                    <span className="text-xs text-[#0A84FF] font-mono font-semibold">{service?.code}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute -top-2.5 -right-1 bg-[#F59E0B] text-black font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Node Configuration Drawer */}
          {selectedNode && selectedService && (
            <div className="relative z-10 bg-[#0C0C12] border border-[#F59E0B]/40 rounded-2xl p-5 mt-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-sm text-[#F59E0B] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#F59E0B]" />
                  {selectedService.name} Specification
                </span>
                <button 
                  onClick={() => {
                    sounds.playClick();
                    setSelectedNodeId(null);
                  }} 
                  aria-label="Close drawer"
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">{selectedService.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/50 p-4 rounded-xl border border-white/[0.06]">
                <div>
                  <span className="text-slate-400 text-[11px]">Free Tier Quota:</span>
                  <p className="text-[#30D158] font-bold mt-1">{selectedService.freeTier}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Target Region:</span>
                  <p className="text-slate-200 font-bold mt-1">{selectedRegion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Infrastructure as Code Synthesis Suite */}
      <div className="apple-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Code2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Infrastructure as Code Synthesis</h3>
              <p className="text-xs text-slate-400 font-mono">Live code generated directly from canvas topology</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* IaC Switcher Tabs */}
            <div className="apple-nav-bar flex items-center space-x-1 p-1">
              {(['terraform', 'cdk', 'pulumi'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    sounds.playSwitch();
                    setCodeMode(mode);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs capitalize font-bold transition-all ${
                    codeMode === mode
                      ? 'bg-[#F59E0B] text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold transition-colors border border-white/[0.08]"
            >
              {copiedCode ? <Check className="w-4 h-4 text-[#30D158]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownloadCode}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold transition-colors border border-[#F59E0B]/40"
            >
              <Download className="w-4 h-4" />
              <span>Export Stack</span>
            </button>
          </div>
        </div>

        {/* Code Editor Preview */}
        <div className="bg-[#050508] border border-white/[0.08] rounded-2xl p-6 font-mono text-xs text-slate-200 max-h-[440px] overflow-y-auto">
          <pre className="whitespace-pre leading-relaxed text-amber-100/90">{currentCode}</pre>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400 flex items-center justify-between">
          <span className="text-[#F59E0B] font-bold">
            {codeMode === 'terraform' ? '$ terraform init && terraform apply' : codeMode === 'cdk' ? '$ cdk deploy' : '$ pulumi up'}
          </span>
          <span className="text-[#30D158] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#30D158]"></span>
            100% Free Tier Compatible
          </span>
        </div>
      </div>
    </div>
  );
};
