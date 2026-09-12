import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { CostParameters } from '../types';

export const CostOptimizer: React.FC = () => {
  const [params, setParams] = useState<CostParameters>({
    monthlyRequests: 250000, // 250k requests
    storageGB: 2,           // 2 GB S3
    lambdaExecutions: 250000,
    avgDurationMs: 85,       // 85ms on Graviton3
    dataTransferGB: 15,      // 15 GB
    useFreeTier: true,
    useGraviton: true,
  });

  // Calculate costs
  // CloudFront: 1TB free tier, then $0.085/GB
  const cdnCost = params.useFreeTier && params.dataTransferGB <= 1024 
    ? 0 
    : Math.max(0, (params.dataTransferGB - (params.useFreeTier ? 1024 : 0)) * 0.085);

  // S3: 5GB free tier, then $0.023/GB
  const s3Cost = params.useFreeTier && params.storageGB <= 5 
    ? 0 
    : Math.max(0, (params.storageGB - (params.useFreeTier ? 5 : 0)) * 0.023);

  // API Gateway: 1M free for 12 months, then $1.00/1M
  const apiGwCost = params.useFreeTier && params.monthlyRequests <= 1000000 
    ? 0 
    : Math.max(0, (params.monthlyRequests - (params.useFreeTier ? 1000000 : 0)) / 1000000 * 1.00);

  // Lambda compute: 1M req free + 3.2M GB-s free
  const lambdaMemGB = 0.512; // 512MB
  const computeGBS = (params.lambdaExecutions * (params.avgDurationMs / 1000)) * lambdaMemGB;
  const lambdaComputeCost = params.useFreeTier && computeGBS <= 3200000 
    ? 0 
    : Math.max(0, (computeGBS - (params.useFreeTier ? 3200000 : 0)) * (params.useGraviton ? 0.0000133334 : 0.0000166667));

  // DynamoDB: 25GB free tier
  const dynamoCost = 0.00; // Under free tier

  // Route 53 DNS zone
  const dnsCost = 0.50; // $0.50/month for 1 hosted zone

  const totalMonthlyCost = cdnCost + s3Cost + apiGwCost + lambdaComputeCost + dynamoCost + dnsCost;
  const legacyEC2Cost = 18.50 + 5.00 + 15.00; // EC2 t4g.small + EBS + ALB = ~$38.50/mo
  const monthlySavings = Math.max(0, legacyEC2Cost - totalMonthlyCost);
  const annualSavings = monthlySavings * 12;

  // Free tier usage percentages
  const freeTierReqPercent = Math.min(100, Math.round((params.monthlyRequests / 1000000) * 100));
  const freeTierStoragePercent = Math.min(100, Math.round((params.storageGB / 5) * 100));
  const freeTierCdnPercent = Math.min(100, Math.round((params.dataTransferGB / 1024) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Estimated AWS Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalMonthlyCost.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ month</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Covered 100% by AWS Free Tier
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Serverless Savings vs EC2</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            ${monthlySavings.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ mo saved</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ~${annualSavings.toFixed(0)} saved per year
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Free Tier Guard Status</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            {100 - freeTierReqPercent}% <span className="text-xs text-slate-400 font-normal">buffer left</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {params.monthlyRequests.toLocaleString()} of 1,000,000 free reqs
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Compute Architecture</span>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            Graviton3 <span className="text-xs text-amber-400 font-normal">ARM64</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            +34% Price/Performance boost
          </div>
        </div>
      </div>

      {/* Main Controls & Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Form */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Traffic & Resource Usage Sliders
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time simulation</span>
          </div>

          {/* Monthly Requests Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Monthly API & Web Requests:</span>
              <span className="text-amber-400 font-mono font-bold">{params.monthlyRequests.toLocaleString()} reqs/mo</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={params.monthlyRequests}
              onChange={(e) => setParams({ ...params, monthlyRequests: Number(e.target.value), lambdaExecutions: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10k (Personal)</span>
              <span>1M (Free Tier Cap)</span>
              <span>5M (High Scale)</span>
            </div>
          </div>

          {/* Storage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">S3 Storage (Static Assets & Uploads):</span>
              <span className="text-amber-400 font-mono font-bold">{params.storageGB} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={params.storageGB}
              onChange={(e) => setParams({ ...params, storageGB: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 GB</span>
              <span>5 GB (Free Tier)</span>
              <span>100 GB</span>
            </div>
          </div>

          {/* Data Transfer Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">CloudFront Global Egress (Data Transfer):</span>
              <span className="text-amber-400 font-mono font-bold">{params.dataTransferGB} GB/mo</span>
            </div>
            <input
              type="range"
              min="1"
              max="1500"
              step="10"
              value={params.dataTransferGB}
              onChange={(e) => setParams({ ...params, dataTransferGB: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 GB</span>
              <span>1,024 GB (1 TB Free Forever)</span>
              <span>1.5 TB</span>
            </div>
          </div>

          {/* Lambda Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Average Lambda Execution Latency:</span>
              <span className="text-amber-400 font-mono font-bold">{params.avgDurationMs} ms</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={params.avgDurationMs}
              onChange={(e) => setParams({ ...params, avgDurationMs: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20 ms (Optimized)</span>
              <span>250 ms</span>
              <span>1,000 ms</span>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={params.useFreeTier}
                onChange={(e) => setParams({ ...params, useFreeTier: e.target.checked })}
                className="rounded accent-amber-500"
              />
              <span>Apply AWS Free Tier</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={params.useGraviton}
                onChange={(e) => setParams({ ...params, useGraviton: e.target.checked })}
                className="rounded accent-amber-500"
              />
              <span>AWS Graviton3 ARM</span>
            </label>
          </div>
        </div>

        {/* Cost Breakdown & Free Tier Guards */}
        <div className="lg:col-span-6 space-y-6">
          {/* Per-Service Itemized Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
              <span>Itemized Monthly Cost Breakdown</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">${totalMonthlyCost.toFixed(2)} Total</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">CloudFront CDN (1 TB Always-Free Tier)</span>
                <span className={cdnCost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {cdnCost === 0 ? '$0.00 (Free)' : `$${cdnCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">S3 Standard Storage ({params.storageGB} GB)</span>
                <span className={s3Cost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {s3Cost === 0 ? '$0.00 (Free)' : `$${s3Cost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">API Gateway HTTP API ({params.monthlyRequests.toLocaleString()} reqs)</span>
                <span className={apiGwCost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {apiGwCost === 0 ? '$0.00 (Free)' : `$${apiGwCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">AWS Lambda (Graviton3 ARM64)</span>
                <span className={lambdaComputeCost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {lambdaComputeCost === 0 ? '$0.00 (Free)' : `$${lambdaComputeCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">DynamoDB On-Demand (25 GB Always-Free)</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">Route 53 DNS Hosted Zone</span>
                <span className="text-slate-200">$0.50</span>
              </div>
            </div>
          </div>

          {/* Free Tier Consumption Visualizer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AWS Free Tier Capacity Gauges
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Lambda & API Requests (1M Free Limit)</span>
                <span className="text-amber-400 font-mono">{freeTierReqPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${freeTierReqPercent > 80 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                  style={{ width: `${freeTierReqPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">S3 Storage Capacity (5 GB Free Limit)</span>
                <span className="text-amber-400 font-mono">{freeTierStoragePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${freeTierStoragePercent > 80 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                  style={{ width: `${freeTierStoragePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">CloudFront Data Transfer (1 TB Always-Free Limit)</span>
                <span className="text-amber-400 font-mono">{freeTierCdnPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${freeTierCdnPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
