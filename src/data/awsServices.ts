import type { AWSService, ArchitectureTemplate, SecurityAuditItem } from '../types';

export const AWS_SERVICES: AWSService[] = [
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    code: 'CloudFront',
    category: 'networking',
    icon: 'Globe',
    description: 'Global CDN distribution with Origin Access Control (OAC), TLS 1.3, Brotli/Gzip compression, and 600+ edge POPs.',
    freeTier: '1 TB data transfer out/month + 10,000,000 requests',
    pricingUnit: 'per GB / request',
    baseCost: 0.085,
    tags: ['CDN', 'Edge', 'OAC', 'HTTPS'],
    defaultConfig: {
      priceClass: 'PriceClass_100',
      tlsVersion: 'TLSv1.2_2021',
      compress: true,
      defaultTTL: 86400
    }
  },
  {
    id: 's3',
    name: 'Amazon S3',
    code: 'S3',
    category: 'storage',
    icon: 'HardDrive',
    description: 'Scalable object storage with 99.999999999% durability, SSE-AES256 encryption, and S3 Block Public Access.',
    freeTier: '5 GB Standard Storage + 20,000 GET / 2,000 PUT',
    pricingUnit: 'per GB/mo',
    baseCost: 0.023,
    tags: ['SPA Hosting', 'SSE-S3', 'Durability'],
    defaultConfig: {
      storageClass: 'Standard',
      encryption: 'AES256',
      versioning: true,
      blockPublicAccess: true
    }
  },
  {
    id: 'apigateway',
    name: 'Amazon API Gateway v2',
    code: 'API Gateway',
    category: 'networking',
    icon: 'Zap',
    description: 'Low-latency HTTP API with CORS support, automatic request throttling, and direct AWS_PROXY integrations.',
    freeTier: '1,000,000 API requests/month for 12 months',
    pricingUnit: 'per million calls',
    baseCost: 1.00,
    tags: ['HTTP API', 'CORS', 'Rate Limiting', 'Proxy'],
    defaultConfig: {
      protocolType: 'HTTP',
      corsEnabled: true,
      throttlingRateLimit: 10000,
      throttlingBurstLimit: 5000
    }
  },
  {
    id: 'lambda',
    name: 'AWS Lambda (Graviton3)',
    code: 'Lambda',
    category: 'compute',
    icon: 'Cpu',
    description: 'Serverless compute running on 64-bit ARM AWS Graviton3 processors with microsecond billing and zero idle cost.',
    freeTier: '1,000,000 free requests & 3.2M GB-seconds compute/mo',
    pricingUnit: 'per GB-second',
    baseCost: 0.0000133334,
    tags: ['Graviton3', 'ARM64', 'Serverless', 'Sub-25ms'],
    defaultConfig: {
      runtime: 'nodejs20.x',
      architecture: 'arm64',
      memorySize: 512,
      timeoutSeconds: 10
    }
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    code: 'DynamoDB',
    category: 'database',
    icon: 'Database',
    description: 'Fully managed NoSQL database with single-digit millisecond latency, On-Demand billing, and Point-in-Time Recovery.',
    freeTier: '25 GB Storage, 25 WCU & 25 RCU (Always Free)',
    pricingUnit: 'per million read/write units',
    baseCost: 0.25,
    tags: ['NoSQL', 'On-Demand', 'PITR', 'Always Free'],
    defaultConfig: {
      billingMode: 'PAY_PER_REQUEST',
      pitrEnabled: true,
      ttlEnabled: true,
      encryptionAtRest: true
    }
  },
  {
    id: 'route53',
    name: 'Amazon Route 53 & ACM',
    code: 'Route 53',
    category: 'networking',
    icon: 'Radio',
    description: 'Global DNS routing service with health checks and free AWS Certificate Manager SSL/TLS certificates.',
    freeTier: 'ACM Certificates are 100% Free',
    pricingUnit: '$0.50 per hosted zone/mo',
    baseCost: 0.50,
    tags: ['DNS', 'Custom Domain', 'Free SSL', 'Failover'],
    defaultConfig: {
      routingPolicy: 'Simple',
      healthCheckEnabled: true,
      tlsCertificate: 'ACM Automated'
    }
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch & X-Ray',
    code: 'CloudWatch',
    category: 'observability',
    icon: 'Activity',
    description: 'Unified telemetry, real-time structured logging, metric alarms, and distributed request tracing.',
    freeTier: '10 custom metrics + 5 GB log ingestion/mo',
    pricingUnit: 'per GB ingested',
    baseCost: 0.50,
    tags: ['Metrics', 'Alarms', 'X-Ray Tracing', 'Logs'],
    defaultConfig: {
      logRetentionDays: 30,
      alarmThresholdErrors: 5,
      xrayTracing: 'Active'
    }
  },
  {
    id: 'cognito',
    name: 'Amazon Cognito',
    code: 'Cognito',
    category: 'security',
    icon: 'Shield',
    description: 'Secure customer identity and access management with OAuth 2.0, Passkeys, and MFA support.',
    freeTier: '50,000 Monthly Active Users (MAUs) Always Free',
    pricingUnit: 'per MAU above 50k',
    baseCost: 0.0055,
    tags: ['OAuth2', 'Passkeys', 'JWT Tokens', 'MFA'],
    defaultConfig: {
      mfaConfiguration: 'OPTIONAL',
      passwordPolicy: 'Strong'
    }
  },
  {
    id: 'sqs',
    name: 'Amazon SQS & SNS',
    code: 'SQS / SNS',
    category: 'messaging',
    icon: 'Send',
    description: 'Managed message queuing and pub/sub notifications for asynchronous event processing.',
    freeTier: '1,000,000 SQS requests + 1,000,000 SNS notifications/mo',
    pricingUnit: 'per million messages',
    baseCost: 0.40,
    tags: ['Queues', 'Pub/Sub', 'FIFO', 'Decoupled'],
    defaultConfig: {
      queueType: 'Standard',
      messageRetentionDays: 14
    }
  },
  {
    id: 'ecs',
    name: 'Amazon ECS (Fargate)',
    code: 'ECS Fargate',
    category: 'compute',
    icon: 'Box',
    description: 'Serverless container orchestration for Docker containers with zero EC2 cluster management.',
    freeTier: 'Pay per vCPU & memory per second',
    pricingUnit: 'per vCPU-hour',
    baseCost: 0.04048,
    tags: ['Containers', 'Docker', 'Microservices'],
    defaultConfig: {
      launchType: 'FARGATE',
      cpu: '256 (0.25 vCPU)',
      memory: '512 MB'
    }
  }
];

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'serverless-grand-slam',
    name: 'CloudPulse Serverless Modern Stack',
    badge: 'Live Production',
    description: 'Edge CDN + S3 SPA + HTTP API Gateway + Graviton3 Lambda + DynamoDB On-Demand + CloudWatch. Zero idle cost, sub-25ms latency, 100% Free Tier compliant.',
    nodes: [
      { id: 'dns', serviceId: 'route53', label: 'Route 53 Custom Domain', x: 50, y: 160 },
      { id: 'cdn', serviceId: 'cloudfront', label: 'CloudFront Edge CDN + SSL', x: 260, y: 160 },
      { id: 'spa', serviceId: 's3', label: 'S3 Bucket (SPA Assets)', x: 480, y: 80 },
      { id: 'api', serviceId: 'apigateway', label: 'API Gateway v2 (HTTP API)', x: 480, y: 240 },
      { id: 'fn', serviceId: 'lambda', label: 'AWS Lambda (Graviton3 Node.js)', x: 700, y: 240 },
      { id: 'db', serviceId: 'dynamodb', label: 'DynamoDB (On-Demand NoSQL)', x: 920, y: 240 },
      { id: 'logs', serviceId: 'cloudwatch', label: 'CloudWatch Telemetry & Alarms', x: 700, y: 380 },
    ],
    connections: [
      { id: 'c1', from: 'dns', to: 'cdn', protocol: 'HTTPS', label: 'Route 53 DNS' },
      { id: 'c2', from: 'cdn', to: 'spa', protocol: 'OAC SigV4', label: '/* Static Assets' },
      { id: 'c3', from: 'cdn', to: 'api', protocol: 'HTTPS Proxy', label: '/api/* REST Requests' },
      { id: 'c4', from: 'api', to: 'fn', protocol: 'AWS_PROXY', label: 'Payload Proxy' },
      { id: 'c5', from: 'fn', to: 'db', protocol: 'AWS SDK v3', label: 'Item Query' },
      { id: 'c6', from: 'fn', to: 'logs', protocol: 'CloudWatch', label: 'Log Stream' },
    ],
    estimatedCost: 0.00,
    complianceScore: 100,
    servicesUsed: ['CloudFront', 'S3', 'API Gateway', 'Lambda', 'DynamoDB', 'Route 53', 'CloudWatch']
  },
  {
    id: 'event-driven',
    name: 'Asynchronous Event-Driven Pipeline',
    badge: 'High Throughput',
    description: 'High-volume ingestion using API Gateway, Amazon SQS FIFO queues, Lambda workers, and DynamoDB event log.',
    nodes: [
      { id: 'dns', serviceId: 'route53', label: 'Clients / Ingestion Webhooks', x: 50, y: 160 },
      { id: 'api', serviceId: 'apigateway', label: 'API Gateway Ingestion', x: 260, y: 160 },
      { id: 'queue', serviceId: 'sqs', label: 'Amazon SQS Message Queue', x: 480, y: 160 },
      { id: 'worker', serviceId: 'lambda', label: 'Lambda Batch Worker', x: 700, y: 160 },
      { id: 'db', serviceId: 'dynamodb', label: 'DynamoDB Event Store', x: 920, y: 160 },
    ],
    connections: [
      { id: 'c1', from: 'dns', to: 'api', protocol: 'HTTPS', label: 'Ingest Request' },
      { id: 'c2', from: 'api', to: 'queue', protocol: 'SQS PutMessage', label: 'Enqueue' },
      { id: 'c3', from: 'queue', to: 'worker', protocol: 'EventSourceMapping', label: 'Batch Poll' },
      { id: 'c4', from: 'worker', to: 'db', protocol: 'SDK v3', label: 'Persist Event' },
    ],
    estimatedCost: 0.50,
    complianceScore: 95,
    servicesUsed: ['API Gateway', 'SQS', 'Lambda', 'DynamoDB', 'CloudWatch']
  },
  {
    id: 'fargate-microservices',
    name: 'ECS Fargate Containerized Stack',
    badge: 'Enterprise Docker',
    description: 'Containerized architecture with CloudFront CDN, Application Load Balancer, ECS Fargate containers, and DynamoDB.',
    nodes: [
      { id: 'dns', serviceId: 'route53', label: 'Public Web Traffic', x: 50, y: 160 },
      { id: 'cdn', serviceId: 'cloudfront', label: 'CloudFront CDN', x: 260, y: 160 },
      { id: 'ecs', serviceId: 'ecs', label: 'Amazon ECS Fargate', x: 520, y: 160 },
      { id: 'db', serviceId: 'dynamodb', label: 'DynamoDB Data Store', x: 780, y: 160 },
      { id: 'auth', serviceId: 'cognito', label: 'Cognito JWT Auth', x: 520, y: 310 },
    ],
    connections: [
      { id: 'c1', from: 'dns', to: 'cdn', protocol: 'HTTPS', label: 'Edge Route' },
      { id: 'c2', from: 'cdn', to: 'ecs', protocol: 'ALB Target', label: 'Container API' },
      { id: 'c3', from: 'ecs', to: 'db', protocol: 'Private Subnet', label: 'SDK Query' },
      { id: 'c4', from: 'ecs', to: 'auth', protocol: 'JWT Validate', label: 'Verify Claims' },
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
    title: 'S3 Public Access Block & Origin Access Control (OAC)',
    description: 'Enforce strict S3 Block Public Access with Origin Access Control (OAC) so static assets can only be retrieved via CloudFront edge signature verification.',
    impact: 'Critical',
    status: 'passed',
    remediation: 'Attach Origin Access Control (OAC) policy and set block_public_acls = true on S3.',
    terraformSnippet: `resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
  },
  {
    id: 'sec-2',
    pillar: 'Security',
    title: 'Enforce Modern TLS 1.3 & HTTPS-Only Redirection',
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
    id: 'sec-3',
    pillar: 'Security',
    title: 'IAM Least-Privilege Execution Roles',
    description: 'Lambda execution role restricts access strictly to required DynamoDB table ARNs without wildcard (*) resource permissions.',
    impact: 'High',
    status: 'passed',
    remediation: 'Scope IAM policies strictly to aws_dynamodb_table.main.arn.'
  },
  {
    id: 'rel-1',
    pillar: 'Reliability',
    title: 'Multi-AZ Serverless Redundancy & Self-Healing',
    description: 'CloudFront distributes across 600+ edge locations; Lambda and DynamoDB automatically span 3 Availability Zones with automatic failover.',
    impact: 'Critical',
    status: 'passed',
    remediation: 'Serverless primitives inherently span all AZs in the configured AWS region.'
  },
  {
    id: 'rel-2',
    pillar: 'Reliability',
    title: 'DynamoDB Continuous Point-in-Time Recovery (PITR)',
    description: 'Point-in-time recovery protects against accidental data deletion with second-by-second rollback capability for 35 days.',
    impact: 'High',
    status: 'passed',
    remediation: 'Enable point_in_time_recovery { enabled = true } on DynamoDB.'
  },
  {
    id: 'perf-1',
    pillar: 'Performance',
    title: 'AWS Graviton3 ARM64 Compute Execution',
    description: 'Lambda functions run on 64-bit ARM Graviton3 architecture providing 34% better price/performance and lower latency.',
    impact: 'Medium',
    status: 'passed',
    remediation: 'Configure architectures = ["arm64"] on aws_lambda_function.',
    terraformSnippet: `resource "aws_lambda_function" "api" {
  architectures = ["arm64"]
  runtime       = "nodejs20.x"
}`
  },
  {
    id: 'perf-2',
    pillar: 'Performance',
    title: 'CloudFront Edge Caching with Brotli Compression',
    description: 'Edge caching delivers >95% cache hit ratio with automatic Brotli/Gzip compression reducing data transfer payload sizes by 70%.',
    impact: 'Medium',
    status: 'passed',
    remediation: 'Set compress = true on CloudFront default_cache_behavior.'
  },
  {
    id: 'cost-1',
    pillar: 'Cost',
    title: 'Zero Idle Cost Architecture (Pay-Per-Request)',
    description: 'By using S3, CloudFront, Lambda, and DynamoDB On-Demand, zero monthly fixed charges are incurred when no traffic is being served.',
    impact: 'High',
    status: 'passed',
    remediation: 'Set DynamoDB billing_mode = "PAY_PER_REQUEST".'
  },
  {
    id: 'ops-1',
    pillar: 'Operations',
    title: 'Automated CI/CD with Zero-Downtime Cache Invalidation',
    description: 'GitHub Actions automatically runs tests, builds production bundles, syncs to S3, and triggers CloudFront cache invalidations.',
    impact: 'High',
    status: 'passed',
    remediation: 'Add aws cloudfront create-invalidation to deployment pipeline.'
  },
  {
    id: 'ops-2',
    pillar: 'Operations',
    title: 'Proactive CloudWatch Metric Alarms & Telemetry',
    description: 'Alarms trigger on Lambda 5xx invocation errors and API Gateway latency anomalies to maintain 99.99% uptime.',
    impact: 'High',
    status: 'passed',
    remediation: 'Provision aws_cloudwatch_metric_alarm resource for Lambda errors.'
  },
  {
    id: 'sust-1',
    pillar: 'Sustainability',
    title: 'Carbon-Efficient Serverless & Edge Offloading',
    description: 'High edge cache hit ratio prevents unnecessary compute executions, directly minimizing energy consumption and carbon footprint.',
    impact: 'Medium',
    status: 'passed',
    remediation: 'Set Cache-Control: max-age=31536000 for immutable assets.'
  }
];
