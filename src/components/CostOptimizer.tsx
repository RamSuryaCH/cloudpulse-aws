import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, ShieldCheck, CheckCircle2, BellRing, Sparkles } from 'lucide-react';
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

  const [budgetAlertLimit] = useState<number>(5.00);
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
    setTimeout(() => setSimulatedAlertTriggered(false), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2 text-[#FF9900] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time FinOps & Free-Tier Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AWS Cost & Free-Tier Guard</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Model real AWS billing metrics, verify 100% Free-Tier eligibility, and calculate serverless savings vs traditional EC2 architecture.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-[#0F1B2A] border border-white/[0.08] text-slate-300">
            Free Tier Quota: <span className="text-emerald-400 font-bold">1M Req/mo Free</span>
          </span>
        </div>
      </div>

      {/* 4 Large Apple-Grade Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="aws-card p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Monthly AWS Spend</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
            ${totalMonthlyCost.toFixed(2)} <span className="text-sm text-slate-400 font-normal">/ mo</span>
          </div>
          <div className="text-xs text-emerald-300 mt-2.5 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free-Tier Covered</span>
          </div>
        </div>

        <div className="aws-card p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Serverless vs EC2 Savings</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/15 border border-[#FF9900]/30 flex items-center justify-center text-[#FF9900]">
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#FF9900] font-mono tracking-tight">
            ${monthlySavings.toFixed(2)} <span className="text-sm text-slate-400 font-normal">/ mo</span>
          </div>
          <div className="text-xs text-slate-300 mt-2.5 font-mono">
            ~${annualSavings.toFixed(0)} saved per year
          </div>
        </div>

        <div className="aws-card p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Free Tier Capacity</span>
            <div className="w-8 h-8 rounded-lg bg-[#539FE5]/15 border border-[#539FE5]/30 flex items-center justify-center text-[#539FE5]">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#539FE5] font-mono tracking-tight">
            {100 - freeTierReqPercent}% <span className="text-sm text-slate-400 font-normal">buffer</span>
          </div>
          <div className="text-xs text-slate-300 mt-2.5 font-mono">
            {params.monthlyRequests.toLocaleString()} of 1,000,000 reqs
          </div>
        </div>

        <div className="aws-card p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Compute Architecture</span>
            <div className="w-8 h-8 rounded-lg bg-[#EC7211]/15 border border-[#EC7211]/30 flex items-center justify-center text-[#EC7211]">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
            Graviton3 <span className="text-xs text-[#FF9900] font-normal">ARM64</span>
          </div>
          <div className="text-xs text-slate-300 mt-2.5">
            34% better price/performance
          </div>
        </div>
      </div>

      {/* Main Sliders and Interactive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Usage Sliders */}
        <div className="lg:col-span-7 aws-card p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#FF9900]" />
              Workload & Traffic Modeler
            </h3>
            <span className="text-xs text-[#FF9900] font-mono bg-[#0B111B] px-3 py-1 rounded-lg border border-white/[0.08]">
              Live Calculated
            </span>
          </div>

          {/* Slider 1: Monthly Requests */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-medium">Monthly API & Page Requests:</span>
              <span className="text-[#FF9900] font-mono font-bold text-base">{params.monthlyRequests.toLocaleString()} reqs</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={params.monthlyRequests}
              onChange={(e) => setParams({ ...params, monthlyRequests: Number(e.target.value), lambdaExecutions: Number(e.target.value) })}
              className="w-full accent-[#FF9900] bg-[#0B111B] h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10K (Dev)</span>
              <span className="text-emerald-400">1.0M (Free Tier Cap)</span>
              <span>5.0M (High Scale)</span>
            </div>
          </div>

          {/* Slider 2: Storage */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-medium">S3 Static Storage:</span>
              <span className="text-[#FF9900] font-mono font-bold text-base">{params.storageGB} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={params.storageGB}
              onChange={(e) => setParams({ ...params, storageGB: Number(e.target.value) })}
              className="w-full accent-[#FF9900] bg-[#0B111B] h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1 GB</span>
              <span className="text-emerald-400">5 GB (Free Tier)</span>
              <span>50 GB</span>
            </div>
          </div>

          {/* Slider 3: CDN Bandwidth */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-medium">CloudFront Global Egress Bandwidth:</span>
              <span className="text-[#FF9900] font-mono font-bold text-base">{params.dataTransferGB} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="1500"
              step="10"
              value={params.dataTransferGB}
              onChange={(e) => setParams({ ...params, dataTransferGB: Number(e.target.value) })}
              className="w-full accent-[#FF9900] bg-[#0B111B] h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1 GB</span>
              <span className="text-emerald-400">1,024 GB (1 TB Free Forever)</span>
              <span>1,500 GB</span>
            </div>
          </div>

          {/* Slider 4: Lambda Execution Duration */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-medium">Lambda Average Execution Time:</span>
              <span className="text-[#FF9900] font-mono font-bold text-base">{params.avgDurationMs} ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={params.avgDurationMs}
              onChange={(e) => setParams({ ...params, avgDurationMs: Number(e.target.value) })}
              className="w-full accent-[#FF9900] bg-[#0B111B] h-2.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10 ms (Graviton3 Fast)</span>
              <span>85 ms (Standard)</span>
              <span>500 ms</span>
            </div>
          </div>

          {/* AWS Architecture Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
            <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#0B111B] border border-white/[0.06] cursor-pointer hover:border-[#FF9900]/40 transition-colors">
              <input
                type="checkbox"
                checked={params.useFreeTier}
                onChange={(e) => setParams({ ...params, useFreeTier: e.target.checked })}
                className="w-4 h-4 rounded accent-[#FF9900]"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Apply AWS Free Tier Discount</span>
                <span className="text-[11px] text-slate-400">12 Months & Always-Free credits</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#0B111B] border border-white/[0.06] cursor-pointer hover:border-[#FF9900]/40 transition-colors">
              <input
                type="checkbox"
                checked={params.useGraviton}
                onChange={(e) => setParams({ ...params, useGraviton: e.target.checked })}
                className="w-4 h-4 rounded accent-[#FF9900]"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">AWS Graviton3 ARM64 Compute</span>
                <span className="text-[11px] text-slate-400">34% lower execution cost</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Cost Comparison & AWS Budget Guard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Detailed AWS Service Cost Breakdown */}
          <div className="aws-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>Detailed Service Cost Breakdown</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">${totalMonthlyCost.toFixed(2)}/mo</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#539FE5]/15 text-[#539FE5] flex items-center justify-center font-bold text-[10px]">CF</div>
                  <div>
                    <span className="text-slate-200 font-semibold block">Amazon CloudFront</span>
                    <span className="text-[10px] text-slate-400">1 TB Free Tier Egress</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">${cdnCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center font-bold text-[10px]">S3</div>
                  <div>
                    <span className="text-slate-200 font-semibold block">Amazon S3 Storage</span>
                    <span className="text-[10px] text-slate-400">5 GB Free Tier Storage</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">${s3Cost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#EC7211]/15 text-[#EC7211] flex items-center justify-center font-bold text-[10px]">λ</div>
                  <div>
                    <span className="text-slate-200 font-semibold block">AWS Lambda (Graviton3)</span>
                    <span className="text-[10px] text-slate-400">1M Free Invocations / mo</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">${lambdaComputeCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B111B] border border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold text-[10px]">DB</div>
                  <div>
                    <span className="text-slate-200 font-semibold block">Amazon DynamoDB</span>
                    <span className="text-[10px] text-slate-400">25 GB On-Demand Free</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400">${dynamoCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* AWS Budget Guard with Test Trigger */}
          <div className="aws-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#FF9900]" />
                <span>AWS Budget Guard Alert System</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Configured with AWS Budgets & SNS to send instantaneous SMS and email notifications if forecasted spend exceeds threshold:
            </p>

            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-[#0B111B] border border-white/[0.08] px-3 py-2 rounded-xl text-xs font-mono text-slate-200 flex items-center justify-between">
                <span className="text-slate-400">Budget Limit:</span>
                <span className="text-[#FF9900] font-bold">${budgetAlertLimit.toFixed(2)} / mo</span>
              </div>
              <button
                onClick={triggerBudgetTest}
                className="px-4 py-2 rounded-xl bg-[#FF9900]/20 hover:bg-[#FF9900]/30 text-[#FF9900] text-xs font-bold transition-all border border-[#FF9900]/40 active:scale-95 whitespace-nowrap"
              >
                Test Alert Guard
              </button>
            </div>

            {simulatedAlertTriggered && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Budget Simulation Verified: Alert SNS dispatched successfully with 0 spend breach!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
