import React, { useState } from 'react';
import { Award, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubmissionPack: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const submissionText = `🚀 Weekend Challenge Submission: CloudPulse AI (AWS Architecture Studio & Serverless Observability Hub)

Project Name: CloudPulse AI
Live URL: https://d111111abcdef8.cloudfront.net (or your custom domain)
GitHub Repo: https://github.com/your-username/cloudpulse-aws

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ AWS Services Used:
• Amazon CloudFront: Global Edge CDN (600+ POPs) with Origin Access Control (OAC), TLS 1.3, Brotli/Gzip compression.
• Amazon S3: Static Single Page Application hosting with SSE-AES256 server-side encryption and Block Public Access.
• Amazon API Gateway v2: HTTP API gateway with low-latency AWS Proxy routing and built-in CORS configuration.
• AWS Lambda: Event-driven serverless compute running on 64-bit ARM AWS Graviton3 (34% better price/performance).
• Amazon DynamoDB: Serverless On-Demand NoSQL table with single-digit millisecond latency and Point-in-Time Recovery (PITR).
• Amazon Route 53 & ACM: DNS routing with free automated SSL/TLS certificate management.
• Amazon CloudWatch & X-Ray: Unified observability, log groups, and metric alarms for error rate monitoring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 What I Built & How AWS Was Used:
CloudPulse AI is an interactive AWS Serverless Architecture Studio and Cloud Cost/Security Auditor built to empower cloud engineers to visualize, audit, and generate Infrastructure-as-Code in real-time.

Key Highlights:
1. 🎨 Visual Cloud Canvas: Drag-and-drop or select AWS building blocks to design architectures with real-time Terraform and AWS CDK code generation.
2. 💰 Cost & Free-Tier Guard: Real-time cost estimator calculating monthly spend, Graviton3 savings, and alerting on free-tier consumption.
3. 🛡️ Well-Architected 6-Pillar Audit: Instant compliance checklist scoring security, reliability, performance, cost, ops, and sustainability.
4. ⚡ Live Serverless Telemetry Hub: Real-time API invoker with sub-25ms latency meter and live CloudWatch structured log stream.
5. 🚀 Infrastructure as Code (IaC): 100% automated with both Terraform modules and AWS CDK (TypeScript) stacks + GitHub Actions CI/CD pipeline!

Total Monthly Cost: $0.00 (100% Covered by AWS Free Tier) 💸`;

  const handleCopySubmission = () => {
    navigator.clipboard.writeText(submissionText);
    setCopied(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9900', '#10B981', '#3B82F6']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyDeployCmd = () => {
    navigator.clipboard.writeText('./scripts/deploy.sh');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-orange-500/15 border border-amber-500/40 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-100">Official Weekend Challenge Submission Pack</h2>
            </div>
            <p className="text-xs text-slate-300">
              Formatted according to the challenge submission rules. Click below to copy and paste directly into the submission thread!
            </p>
          </div>

          <button
            onClick={handleCopySubmission}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/25 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy Submission Post'}</span>
          </button>
        </div>
      </div>

      {/* Submission Text Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Submission Post Content Preview
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Ready to Post</span>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap font-mono text-slate-200">{submissionText}</pre>
          </div>
        </div>

        {/* 1-Click Deployment Instructions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              1-Click Deploy to AWS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deploy this entire application to your AWS account in under 2 minutes using the automated bash script or Terraform:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-amber-400">./scripts/deploy.sh</span>
                <button
                  onClick={handleCopyDeployCmd}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy command"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-semibold">// Or via Terraform directly:</div>
                <div className="text-amber-300">$ cd infra/terraform</div>
                <div className="text-amber-300">$ terraform init</div>
                <div className="text-amber-300">$ terraform apply -auto-approve</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Server Maintenance</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Cost Under Free Tier</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
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
