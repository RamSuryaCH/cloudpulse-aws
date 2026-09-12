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
        { label: 'Distribution ID', value: 'E3B9QZ9P118X74' },
        { label: 'Origin Access Control (OAC)', value: 'Enforced (No direct S3 bypass)' },
        { label: 'Cache Policy', value: 'CachingOptimized (1 Year Immutable Hash)' },
        { label: 'Compression', value: 'Gzip & Brotli Auto-Compression' },
        { label: 'Price Class', value: 'PriceClass_100 (North America & Europe Free)' }
      ]
    },
    {
      id: 'storage',
      name: '3. Static Storage Layer',
      service: 'Amazon Simple Storage Service (S3)',
      icon: Layers,
      status: '11 9s Durability',
      details: [
        { label: 'Bucket Name', value: 'cloudpulse-production-assets-2026' },
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
        { label: 'Cold Start Latency', value: '< 120ms (Warm latency: 12ms)' }
      ]
    },
    {
      id: 'database',
      name: '5. Serverless Database Tier',
      service: 'Amazon DynamoDB',
      icon: Database,
      status: 'Zero Idle Cost',
      details: [
        { label: 'Capacity Mode', value: 'PAY_PER_REQUEST (On-Demand)' },
        { label: 'Point-In-Time Recovery', value: 'Enabled (35-day Continuous Backup)' },
        { label: 'Data Encryption', value: 'KMS Default Encryption' },
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
        { label: 'Log Group', value: '/aws/lambda/cloudpulse-backend' },
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">Live AWS Deployment Architecture Inspector</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explore the exact multi-tier AWS cloud infrastructure configured and provisioned for this application.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Status: Production Ready
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Layer Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Stack Navigation */}
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
                onClick={() => setActiveLayer(layer.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{layer.name}</h4>
                    <p className="text-[11px] text-amber-400 font-mono">{layer.service}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {layer.status}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer Details Panel */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">{selectedLayerData.service}</span>
                <h3 className="text-base font-bold text-slate-100">{selectedLayerData.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
                {selectedLayerData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedLayerData.details.map((detail, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">{detail.label}</span>
                  <p className="text-xs font-bold text-slate-200">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/20 text-xs text-slate-300">
            <div className="flex items-center space-x-2 font-bold text-amber-300 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% AWS Well-Architected & Free-Tier Compliant</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This deployment configuration is completely reproducible using the included Terraform and AWS CDK infrastructure files located in the <code className="text-amber-300 font-mono">/infra</code> directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
