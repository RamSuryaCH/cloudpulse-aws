export type UITheme = 'aurora-bento' | 'cyberpunk' | 'swiss' | 'neobrutalism';

export type AWSServiceCategory = 
  | 'compute' 
  | 'storage' 
  | 'database' 
  | 'networking' 
  | 'security' 
  | 'analytics' 
  | 'management';

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
}

export interface CostParameters {
  monthlyRequests: number;
  storageGB: number;
  lambdaExecutions: number;
  avgDurationMs: number;
  dataTransferGB: number;
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
