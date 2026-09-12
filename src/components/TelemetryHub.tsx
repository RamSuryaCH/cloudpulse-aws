import React, { useState } from 'react';
import { Activity, Send, Zap, Clock, Shield, Terminal } from 'lucide-react';
import type { LiveTelemetryLog } from '../types';

export const TelemetryHub: React.FC = () => {
  const [logs, setLogs] = useState<LiveTelemetryLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      level: 'INFO',
      service: 'aws:lambda:api-handler',
      message: 'START RequestId: 8f92-41ab-8c9e-128f9241ab8c Version: $LATEST (ARM64 Graviton3)',
      latencyMs: 14,
      requestId: '8f92-41ab-8c9e-128f9241ab8c'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 4800).toISOString(),
      level: 'INFO',
      service: 'aws:dynamodb:query',
      message: 'DynamoDB GetItem completed in 3.2ms. Table: cloudpulse-data. Status: 200 OK.',
      latencyMs: 3.2,
      requestId: '8f92-41ab-8c9e-128f9241ab8c'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 4500).toISOString(),
      level: 'METRIC',
      service: 'aws:cloudfront:edge',
      message: 'CloudFront Edge POP (IAD89-C1) Cache HIT. Response returned in 11ms.',
      latencyMs: 11,
      requestId: 'cf-hit-9293848'
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 1200).toISOString(),
      level: 'INFO',
      service: 'aws:lambda:api-handler',
      message: 'END RequestId: 8f92-41ab-8c9e-128f9241ab8c | Duration: 24.12 ms Billed: 25 ms Memory: 72 MB',
      latencyMs: 24.12,
      requestId: '8f92-41ab-8c9e-128f9241ab8c'
    }
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/health');
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST'>('GET');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<any>({
    status: 200,
    statusText: 'OK',
    latencyMs: 18.4,
    region: 'us-east-1 (N. Virginia)',
    edgePop: 'IAD89-C1 (CloudFront Global Edge)',
    serverlessRuntime: 'Node.js 20.x on AWS Graviton3 ARM64',
    body: {
      status: 'healthy',
      version: '1.0.0',
      cloud: 'AWS',
      services: ['CloudFront', 'S3', 'API Gateway v2', 'Lambda', 'DynamoDB', 'CloudWatch'],
      uptimeSeconds: 84920
    }
  });

  const [invocationsCount, setInvocationsCount] = useState<number>(142);
  const [avgLatency, setAvgLatency] = useState<number>(19.5);

  const handleInvokeApi = async () => {
    setIsExecuting(true);
    const start = performance.now();

    // Simulate real serverless invocation
    setTimeout(() => {
      const duration = Math.round((performance.now() - start + Math.random() * 15 + 10) * 10) / 10;
      const reqId = Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 10);
      
      let resBody: any = {};
      if (selectedEndpoint === '/api/health') {
        resBody = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          region: 'us-east-1',
          uptime: '99.999%',
          freeTierCompliance: true
        };
      } else if (selectedEndpoint === '/api/architectures') {
        resBody = {
          success: true,
          action: 'FETCH_TOPOLOGY',
          activeNodes: 7,
          iacFormat: 'Terraform v1.8 + AWS CDK v2.130'
        };
      } else {
        resBody = {
          complianceScore: 98,
          passedChecks: 6,
          failedChecks: 0,
          tlsVersion: 'TLS 1.3',
          oacStatus: 'ENFORCED'
        };
      }

      setLastResponse({
        status: 200,
        statusText: 'OK',
        latencyMs: duration,
        region: 'us-east-1',
        edgePop: 'IAD89-C1 (CloudFront Edge)',
        serverlessRuntime: 'Node.js 20.x on AWS Graviton3',
        body: resBody
      });

      const newLog1: LiveTelemetryLog = {
        id: `log-${Date.now()}-1`,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        service: 'aws:apigateway:http-api',
        message: `${requestMethod} ${selectedEndpoint} HTTP/2 200 OK | Source: CloudFront Edge`,
        latencyMs: duration,
        requestId: reqId
      };

      const newLog2: LiveTelemetryLog = {
        id: `log-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        service: 'aws:lambda:graviton3',
        message: `END RequestId: ${reqId} Duration: ${duration}ms Memory Used: 68MB`,
        latencyMs: duration,
        requestId: reqId
      };

      setLogs(prev => [newLog1, newLog2, ...prev.slice(0, 15)]);
      setInvocationsCount(c => c + 1);
      setAvgLatency(prev => Math.round(((prev * 9 + duration) / 10) * 10) / 10);
      setIsExecuting(false);
    }, 280);
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Invocations</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {invocationsCount.toLocaleString()} <span className="text-xs text-emerald-400 font-normal">reqs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            HTTP API + Lambda Handlers
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Average P95 Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {avgLatency} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 font-medium">
            Graviton3 Warm Start (~18ms)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Serverless Error Rate</span>
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            0.00% <span className="text-xs text-emerald-400 font-normal">5xx</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Zero dropped requests
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>CloudFront Cache HIT</span>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            96.8% <span className="text-xs text-slate-400 font-normal">Hit Ratio</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Served directly from Edge POP
          </div>
        </div>
      </div>

      {/* Main Grid: API Tester & CloudWatch Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive API Request Trigger */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Live Serverless API Invocation
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-400 font-medium">Target Serverless Route:</label>
            <div className="flex space-x-2">
              <select
                value={requestMethod}
                onChange={(e) => setRequestMethod(e.target.value as 'GET' | 'POST')}
                className="bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400 px-3 py-2 rounded-lg focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 px-3 py-2 rounded-lg focus:outline-none"
              >
                <option value="/api/health">/api/health (System Health & Uptime)</option>
                <option value="/api/architectures">/api/architectures (Get Cloud Topology)</option>
                <option value="/api/audit">/api/audit (Run Security Check)</option>
              </select>
            </div>

            <button
              onClick={handleInvokeApi}
              disabled={isExecuting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isExecuting ? 'animate-bounce' : ''}`} />
              <span>{isExecuting ? 'Invoking AWS Lambda...' : 'Execute Request to AWS'}</span>
            </button>
          </div>

          {/* Response Payload Viewer */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-mono">Response Payload:</span>
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{lastResponse.status} {lastResponse.statusText}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400">{lastResponse.latencyMs} ms</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 max-h-[220px] overflow-y-auto">
              <div className="text-[10px] text-slate-500 mb-1 border-b border-slate-800 pb-1">
                // Edge: {lastResponse.edgePop} | Runtime: {lastResponse.serverlessRuntime}
              </div>
              <pre className="text-emerald-300/90 whitespace-pre-wrap">
                {JSON.stringify(lastResponse.body, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Live CloudWatch Structured Log Stream */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Amazon CloudWatch Log Stream
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Streaming Live</span>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-2.5 overflow-y-auto max-h-[420px]">
            {logs.map((log) => (
              <div key={log.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                  <span className="text-amber-400/90">{log.service}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-200 text-[11px] break-all">
                  {log.message}
                </div>
                {log.latencyMs && (
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-2 font-mono">
                    <span className="text-emerald-400 font-medium">⚡ Latency: {log.latencyMs}ms</span>
                    {log.requestId && <span>| ReqID: {log.requestId.slice(0, 12)}...</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Log Group: /aws/lambda/cloudpulse-backend</span>
            <span>Retention: 30 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
