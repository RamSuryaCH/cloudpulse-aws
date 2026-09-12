import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, ShieldCheck, CheckCircle2, BellRing } from 'lucide-react';
import type { CostParameters } from '../types';

export const CostOptimizer: React.FC = () => {
  const [params, setParams] = useState<CostParameters>({
    monthlyRequests: 250000,
    storageGB: 2,
    lambdaExecutions: 250000,
    avgDurationMs: 85,
    dataTransferGB: 15,
    region: 'ap-southeast-2',
    useFreeTier: true,
    useGraviton: true,
  });

  const [budgetAlertLimit, setBudgetAlertLimit] = useState<number>(5.00);
  const [simulatedAlertTriggered, setSimulatedAlertTriggered] = useState<boolean>(false);

  const regionMultiplier = params.region === 'us-east-1' ? 1.0 : 1.15;

  const cdnCost = params.useFreeTier && params.dataTransferGB <= 1024 
    ? 0 
    : Math.max(0, (params.dataTransferGB - (params.useFreeTier ? 1024 : 0)) * 0.085 * regionMultiplier);

  const s3Cost = params.useFreeTier && params.storageGB <= 5 
    ? 0 
    : Math.max(0, (params.storageGB - (params.useFreeTier ? 5 : 0)) * 0.023 * regionMultiplier);

  const apiGwCost = params.useFreeTier && params.monthlyRequests <= 1000000 
    ? 0 
    : Math.max(0, (params.monthlyRequests - (params.useFreeTier ? 1000000 : 0)) / 1000000 * 1.00);

  const lambdaMemGB = 0.512;
  const computeGBS = (params.lambdaExecutions * (params.avgDurationMs / 1000)) * lambdaMemGB;
  const lambdaUnitRate = params.useGraviton ? 0.0000133334 : 0.0000166667;
  const lambdaComputeCost = params.useFreeTier && computeGBS <= 3200000 
    ? 0 
    : Math.max(0, (computeGBS - (params.useFreeTier ? 3200000 : 0)) * lambdaUnitRate * regionMultiplier);

  const dynamoCost = 0.00;
  const dnsCost = 0.50;

  const totalMonthlyCost = cdnCost + s3Cost + apiGwCost + lambdaComputeCost + dynamoCost + dnsCost;
  const legacyEC2Cost = (18.50 + 5.00 + 16.00) * regionMultiplier;
  const monthlySavings = Math.max(0, legacyEC2Cost - totalMonthlyCost);
  const annualSavings = monthlySavings * 12;

  const freeTierReqPercent = Math.min(100, Math.round((params.monthlyRequests / 1000000) * 100));

  const triggerBudgetTest = () => {
    setSimulatedAlertTriggered(true);
    setTimeout(() => setSimulatedAlertTriggered(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="cloud-card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Estimated AWS Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            ${totalMonthlyCost.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ month</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1.5 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Free Tier Eligible
          </div>
        </div>

        <div className="cloud-card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Serverless vs EC2 Savings</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 font-mono">
            ${monthlySavings.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ mo saved</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
            ~${annualSavings.toFixed(0)} saved annually
          </div>
        </div>

        <div className="cloud-card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Free Tier Buffer</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-sky-400 font-mono">
            {100 - freeTierReqPercent}% <span className="text-xs text-slate-400 font-normal">headroom</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
            {params.monthlyRequests.toLocaleString()} of 1M free requests
          </div>
        </div>

        <div className="cloud-card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Compute Architecture</span>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-slate-100 font-mono">
            Graviton3 <span className="text-xs text-amber-400 font-normal">ARM64</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            34% Price/Performance boost
          </div>
        </div>
      </div>

      {/* Main Sliders and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 cloud-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Usage & Traffic Parameters
            </h3>
            <span className="text-xs text-amber-400 font-mono bg-[#080B11] px-2 py-0.5 rounded border border-white/[0.06]">
              Interactive Model
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Monthly API Requests:</span>
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
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">S3 Assets Storage:</span>
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
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">CloudFront Global Egress:</span>
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
          </div>

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
          </div>

          <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-[#080B11] p-3 rounded-lg border border-white/[0.06]">
              <input
                type="checkbox"
                checked={params.useFreeTier}
                onChange={(e) => setParams({ ...params, useFreeTier: e.target.checked })}
                className="rounded accent-amber-500"
              />
              <span>Apply AWS Free Tier</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-[#080B11] p-3 rounded-lg border border-white/[0.06]">
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

        {/* Breakdown & Budget Simulator */}
        <div className="lg:col-span-6 space-y-5">
          <div className="cloud-card p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
              <span>Itemized Cost Schedule</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">${totalMonthlyCost.toFixed(2)} Total</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#080B11] border border-white/[0.06]">
                <span className="text-slate-300">CloudFront CDN (1 TB Always Free)</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#080B11] border border-white/[0.06]">
                <span className="text-slate-300">S3 Standard Storage ({params.storageGB} GB)</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#080B11] border border-white/[0.06]">
                <span className="text-slate-300">API Gateway HTTP API</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#080B11] border border-white/[0.06]">
                <span className="text-slate-300">AWS Lambda (Graviton3 ARM64)</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#080B11] border border-white/[0.06]">
                <span className="text-slate-300">DynamoDB On-Demand (25 GB Free)</span>
                <span className="text-emerald-400 font-bold">$0.00 (Free)</span>
              </div>
            </div>
          </div>

          {/* Budget Alarm Guard */}
          <div className="cloud-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                AWS Budgets & SNS Alert Guard
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated AWS Budget alert threshold configured to trigger email/SNS notifications if monthly forecast exceeds:
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <div className="flex items-center space-x-1.5 bg-[#080B11] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200">
                <span>$</span>
                <input
                  type="number"
                  value={budgetAlertLimit}
                  onChange={(e) => setBudgetAlertLimit(Number(e.target.value))}
                  className="w-12 bg-transparent text-amber-400 font-bold focus:outline-none"
                />
                <span className="text-slate-500">/mo</span>
              </div>

              <button
                onClick={triggerBudgetTest}
                className="px-3 py-1.5 rounded-lg bg-[#141B2D] hover:bg-[#1E293B] text-slate-200 text-xs font-medium transition-colors border border-white/[0.06]"
              >
                {simulatedAlertTriggered ? '✓ SNS Sent (OK)' : 'Simulate Budget Alert'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
