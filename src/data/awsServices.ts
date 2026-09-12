import type { AWSService, ArchitectureTemplate, SecurityAuditItem } from '../types';

export const AWS_SERVICES: AWSService[] = [
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    code: 'CloudFront',
    category: 'networking',
    icon: 'Globe',
    description: 'Fast, secure, and programmable global Content Delivery Network (CDN) with 600+ POPs.',
    freeTier: '1 TB data transfer out/month + 10,000,000 HTTP/HTTPS requests',
    pricingUnit: 'per GB & request',
    baseCost: 0.085,
    tags: ['CDN', 'SSL/TLS', 'Edge', 'DDoS Protection']
  },
  {
    id: 's3',
    name: 'Amazon Simple Storage Service',
    code: 'S3',
    category: 'storage',
    icon: 'HardDrive',
    description: 'Object storage with 99.999999999% (11 9s) data durability and static website hosting.',
    freeTier: '5 GB Standard storage, 20,000 GET, 2,000 PUT requests',
    pricingUnit: 'per GB/mo',
    baseCost: 0.023,
    tags: ['Static Assets', 'SPA Hosting', 'Object Storage', 'KMS Encryption']
  },
  {
    id: 'apigateway',
    name: 'Amazon API Gateway (v2)',
    code: 'API Gateway',
    category: 'networking',
    icon: 'Zap',
    description: 'Managed HTTP API endpoint for REST and WebSocket interfaces with native CORS & throttling.',
    freeTier: '1,000,000 API calls/month for 12 months',
    pricingUnit: 'per million calls',
    baseCost: 1.00,
    tags: ['Serverless REST', 'CORS', 'Rate Limiting', 'JWT Auth']
  },
  {
    id: 'lambda',
    name: 'AWS Lambda (Node.js / Python / Go)',
    code: 'Lambda',
    category: 'compute',
    icon: 'Cpu',
    description: 'Serverless event-driven compute running on AWS Graviton3 ARM with microsecond billing.',
    freeTier: '1,000,000 free requests & 3.2M seconds of compute time/mo',
    pricingUnit: 'per GB-second',
    baseCost: 0.0000166667,
    tags: ['Serverless', 'Graviton3', 'Zero Idle Cost', 'Auto Scaling']
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    code: 'DynamoDB',
    category: 'database',
    icon: 'Database',
    description: 'Single-digit millisecond latency NoSQL database with on-demand capacity & PITR.',
    freeTier: '25 GB Storage, 25 WCU & 25 RCU (Always Free)',
    pricingUnit: 'per million read/write units',
    baseCost: 0.25,
    tags: ['NoSQL', 'Key-Value', 'Point-In-Time-Recovery', 'Always Free']
  },
  {
    id: 'route53',
    name: 'Amazon Route 53 & ACM',
    code: 'Route 53',
    category: 'networking',
    icon: 'Radio',
    description: 'Highly available and scalable cloud DNS web service + Free Automated SSL/TLS Certificates.',
    freeTier: 'ACM Certificates are 100% Free',
    pricingUnit: 'per hosted zone ($0.50/mo)',
    baseCost: 0.50,
    tags: ['Custom Domain', 'DNS', 'Free SSL', 'Failover Routing']
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch & X-Ray',
    code: 'CloudWatch',
    category: 'management',
    icon: 'Activity',
    description: 'Unified telemetry, distributed tracing, live alarms, and operational dashboards.',
    freeTier: '10 custom metrics, 5 GB log data ingestion/month',
    pricingUnit: 'per GB ingested',
    baseCost: 0.50,
    tags: ['Observability', 'Alarms', 'Distributed Tracing', 'Logs']
  },
  {
    id: 'cognito',
    name: 'Amazon Cognito',
    code: 'Cognito',
    category: 'security',
    icon: 'Shield',
    description: 'Customer Identity and Access Management with OAuth 2.0, SAML, and Passkeys support.',
    freeTier: '50,000 MAUs (Monthly Active Users) Always Free',
    pricingUnit: 'per MAU above tier',
    baseCost: 0.0055,
    tags: ['Auth', 'OAuth2', 'Passkeys', 'JWT Tokens']
  },
  {
    id: 'sns',
    name: 'Amazon SNS & SQS',
    code: 'SNS / SQS',
    category: 'analytics',
    icon: 'Send',
    description: 'Pub/Sub messaging and managed message queues for decoupling distributed microservices.',
    freeTier: '1,000,000 SNS notifications & 1,000,000 SQS requests/month',
    pricingUnit: 'per million messages',
    baseCost: 0.50,
    tags: ['Pub/Sub', 'Queues', 'Event-Driven', 'Asynchronous']
  },
  {
    id: 'ecs',
    name: 'Amazon ECS (AWS Fargate)',
    code: 'ECS Fargate',
    category: 'compute',
    icon: 'Box',
    description: 'Serverless container orchestration for Docker microservices with zero cluster management.',
    freeTier: 'Pay per vCPU / GB memory per second',
    pricingUnit: 'per vCPU-hour',
    baseCost: 0.04048,
    tags: ['Containers', 'Docker', 'Microservices', 'Zero-Cluster']
  }
];

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'challenge-winner',
    name: '🌟 CloudPulse Serverless Grand Slam',
    badge: 'Challenge Recommended',
    description: 'The ultimate production-ready AWS Serverless stack. CloudFront CDN + S3 SPA + API Gateway HTTP + Graviton3 Lambda + DynamoDB On-Demand + CloudWatch Monitoring. Zero server maintenance, 100% Free Tier compatible!',
    nodes: [
      { id: 'user', serviceId: 'route53', label: 'User / Route 53 Custom Domain', x: 50, y: 150 },
      { id: 'cdn', serviceId: 'cloudfront', label: 'CloudFront Edge CDN + Free SSL', x: 260, y: 150 },
      { id: 'spa', serviceId: 's3', label: 'S3 Bucket (React SPA Assets)', x: 480, y: 70 },
      { id: 'api', serviceId: 'apigateway', label: 'API Gateway v2 (HTTP API)', x: 480, y: 230 },
      { id: 'fn', serviceId: 'lambda', label: 'AWS Lambda (Graviton3 Node.js)', x: 700, y: 230 },
      { id: 'db', serviceId: 'dynamodb', label: 'DynamoDB (Serverless NoSQL)', x: 920, y: 230 },
      { id: 'logs', serviceId: 'cloudwatch', label: 'CloudWatch Telemetry & Alarms', x: 700, y: 380 },
    ],
    connections: [
      { id: 'c1', from: 'user', to: 'cdn', protocol: 'HTTPS (Port 443)', label: 'Custom Domain SSL' },
      { id: 'c2', from: 'cdn', to: 'spa', protocol: 'OAC Restrict', label: '/* Static HTML/JS' },
      { id: 'c3', from: 'cdn', to: 'api', protocol: 'HTTPS', label: '/api/* REST Requests' },
      { id: 'c4', from: 'api', to: 'fn', protocol: 'AWS Proxy', label: 'JSON Payload' },
      { id: 'c5', from: 'fn', to: 'db', protocol: 'AWS SDK v3', label: 'Fast Read/Write' },
      { id: 'c6', from: 'fn', to: 'logs', protocol: 'CloudWatch Logs', label: 'Metrics & Traces' },
    ],
    estimatedCost: 0.00,
    complianceScore: 98,
    servicesUsed: ['CloudFront', 'S3', 'API Gateway', 'Lambda', 'DynamoDB', 'Route 53', 'CloudWatch']
  },
  {
    id: 'event-driven',
    name: '⚡ Async Event-Driven Processor',
    badge: 'High Throughput',
    description: 'Decoupled event-driven architecture using API Gateway, SQS FIFO queues, Lambda workers, and DynamoDB for guaranteed message delivery under massive traffic spikes.',
    nodes: [
      { id: 'user', serviceId: 'route53', label: 'Clients / IoT Devices', x: 50, y: 150 },
      { id: 'api', serviceId: 'apigateway', label: 'API Gateway Ingestion', x: 260, y: 150 },
      { id: 'queue', serviceId: 'sns', label: 'Amazon SQS Message Queue', x: 480, y: 150 },
      { id: 'worker', serviceId: 'lambda', label: 'Lambda Batch Processor', x: 700, y: 150 },
      { id: 'db', serviceId: 'dynamodb', label: 'DynamoDB Event Store', x: 920, y: 150 },
    ],
    connections: [
      { id: 'c1', from: 'user', to: 'api', protocol: 'HTTPS REST', label: 'Ingest Event' },
      { id: 'c2', from: 'api', to: 'queue', protocol: 'Direct Integration', label: 'Enqueue' },
      { id: 'c3', from: 'queue', to: 'worker', protocol: 'EventSourceMapping', label: 'Batch Poll' },
      { id: 'c4', from: 'worker', to: 'db', protocol: 'SDK v3', label: 'Persist' },
    ],
    estimatedCost: 0.50,
    complianceScore: 94,
    servicesUsed: ['API Gateway', 'SQS', 'Lambda', 'DynamoDB', 'CloudWatch']
  },
  {
    id: 'container-fargate',
    name: '🐳 Containerized Microservices (ECS)',
    badge: 'Enterprise Docker',
    description: 'Production container workflow with Application Load Balancer, ECS Fargate serverless containers, Aurora Serverless v2 PostgreSQL, and Secrets Manager.',
    nodes: [
      { id: 'user', serviceId: 'route53', label: 'Public Web Traffic', x: 50, y: 150 },
      { id: 'cdn', serviceId: 'cloudfront', label: 'CloudFront CDN', x: 260, y: 150 },
      { id: 'ecs', serviceId: 'ecs', label: 'Amazon ECS Fargate Containers', x: 520, y: 150 },
      { id: 'db', serviceId: 'dynamodb', label: 'Serverless Database Tier', x: 780, y: 150 },
      { id: 'sec', serviceId: 'cognito', label: 'Cognito OAuth2 / IAM Roles', x: 520, y: 300 },
    ],
    connections: [
      { id: 'c1', from: 'user', to: 'cdn', protocol: 'HTTPS', label: 'Edge Cache' },
      { id: 'c2', from: 'cdn', to: 'ecs', protocol: 'ALB Target', label: 'Docker API' },
      { id: 'c3', from: 'ecs', to: 'db', protocol: 'Private Subnet', label: 'Encrypted Query' },
      { id: 'c4', from: 'ecs', to: 'sec', protocol: 'IAM Policy', label: 'Token Verify' },
    ],
    estimatedCost: 14.50,
    complianceScore: 96,
    servicesUsed: ['CloudFront', 'ECS Fargate', 'DynamoDB', 'Cognito', 'CloudWatch']
  }
];

export const SECURITY_AUDIT_ITEMS: SecurityAuditItem[] = [
  {
    id: 'sec-1',
    pillar: 'Security',
    title: 'S3 Public Access Blocked & OAC Configured',
    description: 'Enforce strict S3 Block Public Access with Origin Access Control (OAC) so static assets are ONLY accessible through CloudFront edge CDN.',
    impact: 'Critical',
    status: 'passed',
    remediation: 'Attach Origin Access Control (OAC) policy and set block_public_acls = true.',
    terraformSnippet: `resource "aws_s3_bucket_public_access_block" "app" {
  bucket                  = aws_s3_bucket.app.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
  },
  {
    id: 'sec-2',
    pillar: 'Security',
    title: 'Enforce TLS 1.3 & HTTPS-Only Protocol',
    description: 'CloudFront and API Gateway enforce modern TLS v1.3 with automatic HTTP to HTTPS 301 redirection.',
    impact: 'High',
    status: 'passed',
    remediation: 'Set viewer_protocol_policy = "redirect-to-https" and minimum_protocol_version = "TLSv1.2_2021".',
    terraformSnippet: `viewer_certificate {
  minimum_protocol_version = "TLSv1.2_2021"
  ssl_support_method       = "sni-only"
}`
  },
  {
    id: 'rel-1',
    pillar: 'Reliability',
    title: 'Multi-AZ Edge Redundancy & Self-Healing Serverless',
    description: 'CloudFront deploys to 600+ Points of Presence globally; Lambda & DynamoDB automatically replicate across 3 AWS Availability Zones.',
    impact: 'Critical',
    status: 'passed',
    remediation: 'Serverless primitives inherently span all AZs in the configured region.'
  },
  {
    id: 'perf-1',
    pillar: 'Performance',
    title: 'AWS Graviton3 ARM Architecture Execution',
    description: 'Lambda functions run on 64-bit ARM (Graviton) processors providing 34% better price-performance and reduced cold starts.',
    impact: 'Medium',
    status: 'passed',
    remediation: 'Configure architectures = ["arm64"] on aws_lambda_function.',
    terraformSnippet: `resource "aws_lambda_function" "api" {
  architectures = ["arm64"]
  runtime       = "nodejs20.x"
}`
  },
  {
    id: 'cost-1',
    pillar: 'Cost',
    title: 'Zero Idle Cost Architecture (Pay Only Per Request)',
    description: 'By utilizing S3, CloudFront, Lambda, and DynamoDB On-Demand, zero monthly fixed costs are incurred during idle periods.',
    impact: 'High',
    status: 'passed',
    remediation: 'Set DynamoDB billing_mode = "PAY_PER_REQUEST".'
  },
  {
    id: 'ops-1',
    pillar: 'Operations',
    title: 'Automated CI/CD with Zero-Downtime Cache Invalidation',
    description: 'GitHub Actions automatically runs test suites, builds production bundles, uploads to S3, and creates CloudFront cache invalidations.',
    impact: 'High',
    status: 'passed',
    remediation: 'Add aws cloudfront create-invalidation --paths "/*" to deployment pipeline.'
  },
  {
    id: 'sust-1',
    pillar: 'Sustainability',
    title: 'Maximized Carbon Efficiency with Serverless & CDN Caching',
    description: 'High edge cache hit ratio (>95%) prevents backend CPU wakeups, reducing carbon emissions and energy consumption.',
    impact: 'Medium',
    status: 'passed',
    remediation: 'Configure CloudFront Cache-Control: max-age=31536000 for immutable assets.'
  }
];
