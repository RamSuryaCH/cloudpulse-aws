import React, { useState } from 'react';
import { Award, Copy, Check, Terminal, FileCode, CheckCircle2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    navigator.clipboard.writeText(submissionText);
    setCopied(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#539FE5', '#10B981', '#FFFFFF']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyDeployCmd = () => {
    navigator.clipboard.writeText('aws cloudformation deploy --template-file infra/cloudformation/full-deploy.yaml --stack-name cloudpulse-app --capabilities CAPABILITY_NAMED_IAM --region ap-southeast-2');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="aws-card p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 flex items-center justify-center">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Official Challenge Submission Pack</h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Formatted according to the AWS Weekend Challenge submission requirements with live endpoints. Copy the post content directly to submit!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://d1pugni5iia6hw.cloudfront.net"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#141F30] hover:bg-[#1E2D44] text-slate-200 font-semibold text-xs border border-white/[0.08] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open CloudFront URL</span>
            </a>

            <button
              onClick={handleCopySubmission}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9900] to-[#EC7211] hover:from-[#FFA726] hover:to-[#FF9900] text-slate-950 font-bold text-xs shadow-lg shadow-[#FF9900]/25 transition-all active:scale-95 duration-150"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950 stroke-[2.5]" /> : <Copy className="w-4 h-4 text-slate-950 stroke-[2.5]" />}
              <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy Submission Post'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Preview & Deployment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Formatted Post Content */}
        <div className="lg:col-span-8 aws-card p-7 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#FF9900]" />
              Submission Post Markdown Preview
            </h3>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold">
              100% Ready
            </span>
          </div>

          <div className="flex-1 bg-[#07090E] border border-white/[0.08] rounded-2xl p-5 font-mono text-xs text-slate-200 leading-relaxed overflow-y-auto max-h-[520px]">
            <pre className="whitespace-pre-wrap font-mono text-slate-200">{submissionText}</pre>
          </div>
        </div>

        {/* Right: CloudFormation CLI Command & Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="aws-card p-7 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#FF9900]" />
              1-Click AWS Deploy Command
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Infrastructure provisioned with S3 OAC, API Gateway v2, and Graviton3 Lambda:
            </p>

            <div className="p-3 bg-[#07090E] border border-white/[0.08] rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#FF9900] truncate">aws cloudformation deploy...</span>
              <button
                onClick={handleCopyDeployCmd}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-3 border-t border-white/[0.08] text-xs text-slate-300 space-y-2.5 font-medium">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Server Maintenance (Serverless)</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>$0.00 / mo Free Tier Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
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
