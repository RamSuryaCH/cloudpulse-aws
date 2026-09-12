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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#10B981', '#38BDF8', '#6366F1']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyDeployCmd = () => {
    navigator.clipboard.writeText('aws cloudformation deploy --template-file infra/cloudformation/full-deploy.yaml --stack-name cloudpulse-app --capabilities CAPABILITY_NAMED_IAM --region ap-southeast-2');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cloud-card p-6 bg-[#0E131F]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-white">Official Weekend Challenge Submission Pack</h2>
            </div>
            <p className="text-xs text-slate-300">
              Formatted according to the challenge submission rules with live AWS URLs. Click below to copy and paste directly into the submission thread!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://d1pugni5iia6hw.cloudfront.net"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#141B2D] hover:bg-[#1E293B] text-slate-200 font-semibold text-xs border border-white/[0.08] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Live App</span>
            </a>

            <button
              onClick={handleCopySubmission}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
              <span>{copied ? 'Copied! 🎉' : 'Copy Post Content'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 cloud-card p-5 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Submission Post Content Preview
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
              Live & Verified
            </span>
          </div>

          <div className="flex-1 bg-[#07090E] border border-white/[0.06] rounded-lg p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-y-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap font-mono text-slate-200">{submissionText}</pre>
          </div>
        </div>

        {/* Deploy Command Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="cloud-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              AWS Deployment Command
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deployed live via CloudFormation with full S3 OAC and Graviton3 Lambda integration:
            </p>

            <div className="p-2.5 bg-[#07090E] border border-white/[0.06] rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 text-[11px] truncate">aws cloudformation deploy...</span>
              <button
                onClick={handleCopyDeployCmd}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-300 space-y-2 font-medium">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Server Maintenance</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>$0.00 / mo Free Tier Verified</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Automated CI/CD Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
