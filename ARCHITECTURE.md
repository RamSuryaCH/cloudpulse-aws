# 🏛️ Deep-Dive Cloud Architecture — CloudPulse AI

This document details the architectural decisions, security mitigations, and cost optimizations implemented in **CloudPulse AI**.

---

## 1. Edge & Content Delivery (Amazon CloudFront)
- **Origin Access Control (OAC)**: Replaces legacy Origin Access Identity (OAI) using SigV4 signing to prevent any S3 bypass.
- **HTTP/3 & TLS 1.3**: Automatic cipher negotiation with HSTS headers.
- **Cache Strategy**:
  - `/*`: Cache-Control `max-age=31536000, immutable` for hashed assets.
  - `/index.html`: `no-cache, no-store, must-revalidate` for instant zero-downtime updates.
  - `/api/*`: Proxy to API Gateway with caching disabled and header forwarding.

---

## 2. Serverless Compute (AWS Lambda on Graviton3 ARM64)
- **Architecture**: `arm64` execution mode using AWS Graviton3 processors.
- **Performance Benefits**:
  - 34% better price/performance compared to x86_64.
  - Reduced cold start latency (<120ms).
- **Runtime**: Node.js 20.x with native ES modules and AWS SDK v3 modular imports.

---

## 3. Data Tier (Amazon DynamoDB On-Demand)
- **Billing Mode**: `PAY_PER_REQUEST` ensures zero fixed cost during idle states.
- **Durability**: Point-in-Time Recovery (PITR) enabled for 35-day rollback capability.
- **Security**: KMS Server-side encryption at rest.

---

## 4. CI/CD Pipeline (GitHub Actions)
- Automated linting & TypeScript verification.
- Zero-downtime S3 static asset sync with selective cache headers.
- Automatic CloudFront edge invalidation on main branch merges.
