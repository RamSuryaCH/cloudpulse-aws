import React, { useState } from 'react';
import { Globe, Server, Database, Zap, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cloud-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-white">Live AWS Production Architecture Inspector</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Explore the exact multi-tier AWS cloud infrastructure configured and provisioned for this application.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-lg bg-[#080B11] border border-white/[0.08] text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Status: Live on AWS
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Layer View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Infrastructure Stack Tiers
          </h3>
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`cloud-card p-3.5 cursor-pointer flex items-center justify-between ${
                  isSelected ? 'cloud-card-selected' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#080B11] text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{layer.name}</h4>
                    <p className="text-[11px] text-amber-400 font-mono">{layer.service}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080B11] text-slate-400 border border-white/[0.06]">
                    {layer.status}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-7 cloud-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">{selectedLayerData.service}</span>
                <h3 className="text-sm font-bold text-white">{selectedLayerData.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-medium">
                {selectedLayerData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedLayerData.details.map((detail, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#080B11] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">{detail.label}</span>
                  <p className="text-xs font-bold text-slate-200 break-all">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-lg bg-[#0E131F] border border-amber-500/20 text-xs text-slate-300">
            <div className="flex items-center space-x-2 font-bold text-amber-300 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Production Live in ap-southeast-2 (Sydney)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Configured using CloudFormation and S3 Origin Access Control with zero server maintenance overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
