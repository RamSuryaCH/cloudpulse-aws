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
    <div className="space-y-12">
      {/* Header & Overview */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Tier Infrastructure Topology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          AWS Deployment Inspector
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Inspect the live multi-tier AWS cloud infrastructure configured and provisioned for this application in Sydney (ap-southeast-2).
        </p>
      </div>

      {/* Interactive Layer Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Stack Tier Selector List */}
        <div className="lg:col-span-5 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
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
                className={`apple-card p-5 cursor-pointer flex items-center justify-between transition-all duration-300 ${
                  isSelected ? 'apple-card-selected' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    isSelected ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{layer.name}</h4>
                    <p className="text-xs text-[#0A84FF] font-mono font-semibold">{layer.service}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                    {layer.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Specification Viewer */}
        <div className="lg:col-span-7 apple-card p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center">
                <selectedLayerData.icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedLayerData.name}</h3>
                <span className="text-xs text-[#0A84FF] font-mono font-bold">{selectedLayerData.service}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified Active
            </span>
          </div>

          {/* Key-Value Specifications */}
          <div className="space-y-4">
            {selectedLayerData.details.map((detail, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <span className="text-xs text-slate-400 font-mono font-bold">{detail.label}</span>
                <span className="text-xs font-mono font-bold text-white break-all text-left sm:text-right">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Security Model: AWS IAM Least Privilege</span>
            <span className="text-[#F59E0B] font-bold">AWS CDK & TF Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
};
