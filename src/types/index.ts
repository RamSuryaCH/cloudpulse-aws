export type AWSServiceCategory = 
  | 'compute' 
  | 'storage' 
  | 'database' 
  | 'networking' 
  | 'security' 
  | 'messaging' 
  | 'observability';

export interface AWSService {
  id: string;
  name: string;
  code: string;
  category: AWSServiceCategory;
  icon: string;
  description: string;
  freeTier: string;
  pricingUnit: string;
  baseCost: number;
  tags: string[];
  defaultConfig?: Record<string, any>;
}

export interface ArchitectureNode {
  id: string;
  serviceId: string;
  label: string;
  x: number;
  y: number;
  config?: Record<string, any>;
}

export interface ArchitectureConnection {
  id: string;
  from: string;
  to: string;
  protocol?: string;
  label?: string;
}

export interface ArchitectureTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  estimatedCost: number;
  complianceScore: number;
  servicesUsed: string[];
}

export interface SecurityAuditItem {
  id: string;
  pillar: 'Security' | 'Reliability' | 'Performance' | 'Cost' | 'Operations' | 'Sustainability';
  title: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'passed' | 'warning' | 'failed';
  remediation: string;
  terraformSnippet?: string;
  docUrl?: string;
}

export interface CostParameters {
  monthlyRequests: number;
  storageGB: number;
  lambdaExecutions: number;
  avgDurationMs: number;
  dataTransferGB: number;
  region: string;
  useFreeTier: boolean;
  useGraviton: boolean;
}

export interface LiveTelemetryLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'METRIC';
  service: string;
  message: string;
  latencyMs?: number;
  requestId?: string;
}
