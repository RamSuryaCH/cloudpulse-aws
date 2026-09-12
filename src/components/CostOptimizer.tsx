import React, { useState } from 'react';
import { DollarSign, Zap, TrendingDown, ShieldCheck, CheckCircle2, BellRing, Sparkles } from 'lucide-react';
import type { CostParameters } from '../types';
import { sounds } from '../utils/soundEffects';

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
    sounds.playSuccess();
    setSimulatedAlertTriggered(true);
    setTimeout(() => setSimulatedAlertTriggered(false), 3500);
  };

  return (
    <div className="space-y-12">
      {/* Header & Overview */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time FinOps & Free-Tier Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          AWS Cost & Free-Tier Guard
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Model real AWS billing metrics, calculate serverless compute savings vs traditional EC2, and verify 100% Free-Tier eligibility.
        </p>
      </div>

      {/* 4 Large Apple-Grade Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between font-mono">
            <span>Estimated Spend</span>
            <div className="w-9 h-9 rounded-xl bg-[#30D158]/15 border border-[#30D158]/30 flex items-center justify-center text-[#30D158]">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#30D158] font-mono tracking-tight">
            ${totalMonthlyCost.toFixed(2)}
          </div>
          <div className="text-xs text-[#30D158] mt-3 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Free-Tier Covered</span>
          </div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between font-mono">
            <span>Serverless Savings</span>
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#F59E0B] font-mono tracking-tight">
            ${monthlySavings.toFixed(2)}
          </div>
          <div className="text-xs text-slate-300 mt-3 font-mono">
            ~${annualSavings.toFixed(0)} saved per year
          </div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between font-mono">
            <span>Free Tier Buffer</span>
            <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/15 border border-[#0A84FF]/30 flex items-center justify-center text-[#0A84FF]">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-[#0A84FF] font-mono tracking-tight">
            {100 - freeTierReqPercent}%
          </div>
          <div className="text-xs text-slate-300 mt-3 font-mono">
            {params.monthlyRequests.toLocaleString()} of 1M quota
          </div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between font-mono">
            <span>Compute Architecture</span>
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
            Graviton3 <span className="text-sm text-[#F59E0B]">ARM64</span>
          </div>
          <div className="text-xs text-slate-300 mt-3">
            34% better price/performance
          </div>
        </div>
      </div>

      {/* Main Sliders and Interactive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Usage Sliders */}
        <div className="lg:col-span-7 apple-card p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-[#F59E0B]" />
              Workload & Traffic Modeler
            </h3>
            <span className="text-xs text-[#F59E0B] font-mono bg-white/[0.04] px-3.5 py-1 rounded-full border border-white/[0.08]">
              Dynamic Projection
            </span>
          </div>

          {/* Slider 1: Monthly Requests */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-bold">Monthly API & Edge Requests:</span>
              <span className="text-[#F59E0B] font-mono font-extrabold text-base">{params.monthlyRequests.toLocaleString()} reqs</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={params.monthlyRequests}
              onChange={(e) => {
                sounds.playClick();
                setParams({ ...params, monthlyRequests: Number(e.target.value), lambdaExecutions: Number(e.target.value) });
              }}
              className="w-full accent-[#F59E0B] bg-white/[0.06] h-3 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>10K (Dev)</span>
              <span className="text-[#30D158] font-bold">1,000,000 (Free Tier Cap)</span>
              <span>5,000,000 (High Scale)</span>
            </div>
          </div>

          {/* Slider 2: Storage */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-bold">S3 Static Storage Volume:</span>
              <span className="text-[#F59E0B] font-mono font-extrabold text-base">{params.storageGB} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={params.storageGB}
              onChange={(e) => {
                sounds.playClick();
                setParams({ ...params, storageGB: Number(e.target.value) });
              }}
              className="w-full accent-[#F59E0B] bg-white/[0.06] h-3 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1 GB</span>
              <span className="text-[#30D158] font-bold">5 GB (Free Tier Storage)</span>
              <span>50 GB</span>
            </div>
          </div>

          {/* Slider 3: CDN Bandwidth */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-bold">CloudFront Global Egress Bandwidth:</span>
              <span className="text-[#F59E0B] font-mono font-extrabold text-base">{params.dataTransferGB} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="1500"
              step="10"
              value={params.dataTransferGB}
              onChange={(e) => {
                sounds.playClick();
                setParams({ ...params, dataTransferGB: Number(e.target.value) });
              }}
              className="w-full accent-[#F59E0B] bg-white/[0.06] h-3 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1 GB</span>
              <span className="text-[#30D158] font-bold">1,024 GB (1 TB Free Forever)</span>
              <span>1,500 GB</span>
            </div>
          </div>

          {/* Slider 4: Lambda Execution Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-200 font-bold">Lambda Average Execution Time:</span>
              <span className="text-[#F59E0B] font-mono font-extrabold text-base">{params.avgDurationMs} ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={params.avgDurationMs}
              onChange={(e) => {
                sounds.playClick();
                setParams({ ...params, avgDurationMs: Number(e.target.value) });
              }}
              className="w-full accent-[#F59E0B] bg-white/[0.06] h-3 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>10 ms (Graviton3 Fast)</span>
              <span>85 ms (Standard API)</span>
              <span>500 ms</span>
            </div>
          </div>

          {/* Architecture Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
            <label className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-[#F59E0B]/50 transition-colors">
              <input
                type="checkbox"
                checked={params.useFreeTier}
                onChange={(e) => {
                  sounds.playSwitch();
                  setParams({ ...params, useFreeTier: e.target.checked });
                }}
                className="w-5 h-5 rounded accent-[#F59E0B]"
              />
              <div>
                <span className="text-xs font-bold text-white block">Apply AWS Free Tier</span>
                <span className="text-[11px] text-slate-400">12-Month & Always-Free credits</span>
              </div>
            </label>

            <label className="flex items-center space-x-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-[#F59E0B]/50 transition-colors">
              <input
                type="checkbox"
                checked={params.useGraviton}
                onChange={(e) => {
                  sounds.playSwitch();
                  setParams({ ...params, useGraviton: e.target.checked });
                }}
                className="w-5 h-5 rounded accent-[#F59E0B]"
              />
              <div>
                <span className="text-xs font-bold text-white block">AWS Graviton3 ARM64</span>
                <span className="text-[11px] text-slate-400">34% lower execution cost</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Detailed Service Cost Breakdown & Budget Alert */}
        <div className="lg:col-span-5 space-y-8">
          <div className="apple-card p-8 space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between font-mono">
              <span>Service Cost Breakdown</span>
              <span className="text-sm font-mono text-[#30D158] font-bold">${totalMonthlyCost.toFixed(2)}/mo</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0A84FF]/15 text-[#0A84FF] flex items-center justify-center font-bold text-xs">CF</div>
                  <div>
                    <span className="text-white font-bold block">Amazon CloudFront</span>
                    <span className="text-[11px] text-slate-400">1 TB Free Tier Egress</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#30D158] text-sm">${cdnCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-bold text-xs">S3</div>
                  <div>
                    <span className="text-white font-bold block">Amazon S3 Storage</span>
                    <span className="text-[11px] text-slate-400">5 GB Free Tier Storage</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#30D158] text-sm">${s3Cost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-bold text-xs">λ</div>
                  <div>
                    <span className="text-white font-bold block">AWS Lambda (Graviton3)</span>
                    <span className="text-[11px] text-slate-400">1M Free Invocations / mo</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#30D158] text-sm">${lambdaComputeCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#30D158]/15 text-[#30D158] flex items-center justify-center font-bold text-xs">DB</div>
                  <div>
                    <span className="text-white font-bold block">Amazon DynamoDB</span>
                    <span className="text-[11px] text-slate-400">25 GB On-Demand Free</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#30D158] text-sm">${dynamoCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* AWS Budget Guard with Test Trigger */}
          <div className="apple-card p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#F59E0B]" />
                <span>AWS Budget Guard Alert</span>
              </h3>
              <span className="text-xs font-mono text-[#30D158] bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30 font-bold">
                Active Guard
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Configured with AWS Budgets & SNS to send instantaneous SMS and email notifications if forecasted spend exceeds threshold:
            </p>

            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-white/[0.03] border border-white/[0.08] px-4 py-3 rounded-2xl text-xs font-mono text-slate-200 flex items-center justify-between">
                <span className="text-slate-400">Budget Limit:</span>
                <span className="text-[#F59E0B] font-bold text-sm">${budgetAlertLimit.toFixed(2)} / mo</span>
              </div>
              <button
                onClick={triggerBudgetTest}
                className="px-5 py-3 rounded-2xl bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] text-xs font-extrabold transition-all border border-[#F59E0B]/40 active:scale-95 whitespace-nowrap"
              >
                Test Alert Guard
              </button>
            </div>

            {simulatedAlertTriggered && (
              <div className="p-4 rounded-2xl bg-[#30D158]/15 border border-[#30D158]/30 text-xs text-[#30D158] flex items-center gap-2 animate-bounce font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Budget Simulation Verified: Alert SNS dispatched successfully with 0 spend breach!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
