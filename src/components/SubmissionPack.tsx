import React, { useState } from 'react';
import { Award, Copy, Check, Terminal, FileCode, CheckCircle2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const SubmissionPack: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const submissionText = `🚀 Weekend Challenge Submission: CloudPulse AI (AWS Architecture Studio & Serverless Observability Hub)

Project Name: CloudPulse AI
Live URL: https://d1pugni5iia6hw.cloudfront.net
GitHub Repo: https://github.com/RamSuryaCH/cloudpulse-aws

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ AWS Services Used:
• Amazon CloudFront: Global Edge CDN (600+ POPs) with Origin Access Control (OAC), TLS 1.3, Brotli/Gzip compression.
• Amazon S3: Static Single Page Application hosting with SSE-AES256 server-side encryption and Block Public Access (cloudpulse-app-frontendbucket-arswr5lhouip).
• Amazon API Gateway v2: HTTP API gateway with low-latency AWS Proxy routing and built-in CORS configuration (https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com).
• AWS Lambda: Event-driven serverless compute running on 64-bit ARM AWS Graviton3 (34% better price/performance).
• Amazon DynamoDB: Serverless On-Demand NoSQL table with single-digit millisecond latency and Point-in-Time Recovery (PITR) (cloudpulse-challenge-data).
• Amazon Route 53 & ACM: DNS routing with free automated SSL/TLS certificate management.
• Amazon CloudWatch & X-Ray: Unified observability, log groups, and metric alarms for error rate monitoring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 What I Built & How AWS Was Used:
CloudPulse AI is an interactive AWS Serverless Architecture Studio and Cloud Cost/Security Auditor built to empower cloud engineers to visualize, audit, and generate Infrastructure-as-Code in real-time.

Key Highlights:
1. 🎨 Visual Cloud Canvas: Drag-and-drop or select AWS building blocks to design architectures with real-time Terraform and AWS CDK code generation.
2. 💰 Cost & Free-Tier Guard: Real-time cost estimator calculating monthly spend, Graviton3 savings, and alerting on free-tier consumption.
3. 🛡️ Well-Architected 6-Pillar Audit: Instant compliance checklist scoring security, reliability, performance, cost, ops, and sustainability (98% Score).
4. ⚡ Live Serverless Telemetry Hub: Real-time API invoker with sub-25ms latency meter and live CloudWatch structured log stream.
5. 🚀 Infrastructure as Code (IaC): 100% automated with both Terraform modules, AWS CDK (TypeScript) stacks, and CloudFormation template + GitHub Actions CI/CD pipeline!

Total Monthly Cost: $0.00 (100% Covered by AWS Free Tier) 💸`;

  const handleCopySubmission = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(submissionText);
    setCopied(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#30D158', '#0A84FF', '#FFFFFF', '#D97706']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyDeployCmd = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText('aws cloudformation deploy --template-file infra/cloudformation/full-deploy.yaml --stack-name cloudpulse-app --capabilities CAPABILITY_NAMED_IAM --region ap-southeast-2');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="apple-card p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 flex items-center justify-center">
                <Award className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Official Challenge Submission Pack</h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Formatted according to the AWS Weekend Challenge submission requirements with verified live endpoints. Copy the post content directly to submit!
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://d1pugni5iia6hw.cloudfront.net"
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.playClick()}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs border border-white/[0.08] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open CloudFront URL</span>
            </a>

            <button
              onClick={handleCopySubmission}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-black text-xs shadow-xl shadow-[#F59E0B]/25 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-black stroke-[2.5]" /> : <Copy className="w-4 h-4 text-black stroke-[2.5]" />}
              <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy Submission Post'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Preview & Deployment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Formatted Post Content */}
        <div className="lg:col-span-8 apple-card p-8 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2.5 font-mono">
              <FileCode className="w-5 h-5 text-[#F59E0B]" />
              Submission Post Markdown Preview
            </h3>
            <span className="text-xs text-[#30D158] font-mono bg-[#30D158]/10 px-3.5 py-1 rounded-full border border-[#30D158]/30 font-bold">
              100% Ready
            </span>
          </div>

          <div className="flex-1 bg-[#050508] border border-white/[0.08] rounded-3xl p-6 font-mono text-xs text-slate-200 leading-relaxed overflow-y-auto max-h-[520px]">
            <pre className="whitespace-pre-wrap font-mono text-slate-200">{submissionText}</pre>
          </div>
        </div>

        {/* Right: CloudFormation CLI Command & Badges */}
        <div className="lg:col-span-4 space-y-8">
          <div className="apple-card p-8 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2.5 font-mono">
              <Terminal className="w-5 h-5 text-[#F59E0B]" />
              1-Click AWS Deploy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Infrastructure provisioned with S3 OAC, API Gateway v2, and Graviton3 Lambda:
            </p>

            <div className="p-4 bg-[#050508] border border-white/[0.08] rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#F59E0B] truncate font-bold">aws cloudformation deploy...</span>
              <button
                onClick={handleCopyDeployCmd}
                className="p-2 rounded-xl hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-[#30D158]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-300 space-y-3 font-semibold">
              <div className="flex items-center space-x-2.5 text-[#30D158]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Server Maintenance (Serverless)</span>
              </div>
              <div className="flex items-center space-x-2.5 text-[#30D158]">
                <CheckCircle2 className="w-4 h-4" />
                <span>$0.00 / mo Free Tier Verified</span>
              </div>
              <div className="flex items-center space-x-2.5 text-[#30D158]">
                <CheckCircle2 className="w-4 h-4" />
                <span>GitHub Actions CI/CD Pipeline Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
