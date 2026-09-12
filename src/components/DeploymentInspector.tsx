import React, { useState } from 'react';
import { Globe, Server, Database, Zap, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface DeploymentInspectorProps {
  selectedRegion: string;
}

export const DeploymentInspector: React.FC<DeploymentInspectorProps> = ({ selectedRegion: _selectedRegion }) => {
  const [activeLayer, setActiveLayer] = useState<string>('cdn');

  const architectureLayers = [
    {
      id: 'dns',
      name: '1. DNS & SSL / TLS Layer',
      service: 'Amazon Route 53 & ACM',
      icon: Globe,
      status: 'Active',
      details: [
        { label: 'DNS Hosting', value: 'Route 53 Hosted Zone with Geo-routing' },
        { label: 'SSL/TLS Certificate', value: 'ACM (Free AWS 2048-bit RSA / ECDSA)' },
        { label: 'TLS Protocol', value: 'TLS 1.3 / TLS 1.2 Strict Enforced' },
        { label: 'HTTP/3 Support', value: 'QUIC / HTTP/3 Enabled' }
      ]
    },
    {
      id: 'cdn',
      name: '2. Global Edge CDN Layer',
      service: 'Amazon CloudFront',
      icon: Zap,
      status: '600+ POPs',
      details: [
        { label: 'Distribution ID', value: 'EJW28095DC509' },
        { label: 'Origin Access Control (OAC)', value: 'Enforced (No direct S3 bypass)' },
        { label: 'Cache Policy', value: 'CachingOptimized (1 Year Immutable Hash)' },
        { label: 'Compression', value: 'Gzip & Brotli Auto-Compression' },
        { label: 'Live Endpoint', value: 'https://d1pugni5iia6hw.cloudfront.net' }
      ]
    },
    {
      id: 'storage',
      name: '3. Static Storage Layer',
      service: 'Amazon Simple Storage Service (S3)',
      icon: Layers,
      status: '11 9s Durability',
      details: [
        { label: 'Bucket Name', value: 'cloudpulse-app-frontendbucket-arswr5lhouip' },
        { label: 'Public Access Block', value: '100% Blocked (OAC-only read access)' },
        { label: 'Encryption', value: 'Server-Side Encryption SSE-S3 (AES-256)' },
        { label: 'Versioning', value: 'Enabled with 30-Day Lifecycle Retention' }
      ]
    },
    {
      id: 'compute',
      name: '4. Serverless Backend & Compute',
      service: 'Amazon API Gateway v2 + AWS Lambda',
      icon: Server,
      status: 'Graviton3 ARM64',
      details: [
        { label: 'API Protocol', value: 'HTTP API v2 (Low-latency AWS Proxy)' },
        { label: 'Lambda Runtime', value: 'Node.js 20.x on AWS Graviton3 (ARM64)' },
        { label: 'Memory Allocation', value: '512 MB (Fast compute burst)' },
        { label: 'Live Endpoint', value: 'https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com' }
      ]
    },
    {
      id: 'database',
      name: '5. Serverless Database Tier',
      service: 'Amazon DynamoDB',
      icon: Database,
      status: 'Zero Idle Cost',
      details: [
        { label: 'Table Name', value: 'cloudpulse-challenge-data' },
        { label: 'Capacity Mode', value: 'PAY_PER_REQUEST (On-Demand)' },
        { label: 'Point-In-Time Recovery', value: 'Enabled (35-day Continuous Backup)' },
        { label: 'Monthly Base Cost', value: '$0.00 (Within 25 GB Free Tier)' }
      ]
    },
    {
      id: 'monitoring',
      name: '6. Telemetry & Observability',
      service: 'Amazon CloudWatch & X-Ray',
      icon: Zap,
      status: 'Live Alarms',
      details: [
        { label: 'Log Group', value: '/aws/lambda/cloudpulse-challenge-api' },
        { label: 'Metric Alarms', value: 'High Error Rate (>5 errors/min)' },
        { label: 'Distributed Tracing', value: 'AWS X-Ray Active Tracing' },
        { label: 'Log Retention', value: '30 Days Auto-expire' }
      ]
    }
  ];

  const selectedLayerData = architectureLayers.find(l => l.id === activeLayer) || architectureLayers[0];

  return (
    <div className="space-y-8">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2 text-[#FF9900] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tier Infrastructure Topology</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AWS Deployment Inspector</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Inspect the live AWS infrastructure stack deployed via CloudFormation and S3 OAC into Sydney (ap-southeast-2).
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CloudFormation Stack: cloudpulse-app
          </span>
        </div>
      </div>

      {/* Interactive Layer Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Stack Tier Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Infrastructure Stack Tiers
          </h3>
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveLayer(layer.id);
                }}
                className={`aws-card p-4 cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  isSelected ? 'aws-card-active' : ''
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40' : 'bg-[#0B111B] text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{layer.name}</h4>
                    <p className="text-xs text-[#539FE5] font-mono font-medium">{layer.service}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#0B111B] text-slate-300 border border-white/[0.08]">
                    {layer.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Specification Viewer */}
        <div className="lg:col-span-7 aws-card p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/30 flex items-center justify-center">
                <selectedLayerData.icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedLayerData.name}</h3>
                <span className="text-xs text-[#539FE5] font-mono font-semibold">{selectedLayerData.service}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Active
            </span>
          </div>

          {/* Key-Value Specifications */}
          <div className="space-y-3.5">
            {selectedLayerData.details.map((detail, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0B111B] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="text-xs text-slate-400 font-mono">{detail.label}</span>
                <span className="text-xs font-mono font-bold text-slate-100 break-all text-left sm:text-right">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#0B111B] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Security Model: AWS IAM Least Privilege</span>
            <span className="text-[#FF9900] font-semibold">AWS CDK & TF Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
};
