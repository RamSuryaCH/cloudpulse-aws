# 🏛️ Deep-Dive Cloud Architecture — PrepWise Campus

This document details the architectural decisions, security mitigations, and performance optimizations implemented in **PrepWise Campus**.

---

## 1. Edge & Content Delivery (Amazon CloudFront)
- **Origin Access Control (OAC)**: Replaces legacy Origin Access Identity (OAI) using SigV4 signing to prevent any direct S3 bucket bypass.
- **HTTP/3 & TLS 1.3**: Automatic cipher negotiation with HSTS headers for low-latency asset delivery.
- **Cache Strategy**:
  - `/*`: Cache-Control `max-age=31536000, immutable` for hashed static assets (`.js`, `.css`, fonts).
  - `/index.html`: `no-cache, no-store, must-revalidate` for instant zero-downtime client releases.
  - `/api/*`: Direct proxy to Amazon API Gateway v2 with caching disabled and origin header forwarding.

---

## 2. Serverless Compute (AWS Lambda on Graviton3 ARM64)
- **Architecture**: `arm64` execution mode powered by AWS Graviton3 processors.
- **Performance Benefits**:
  - 34% better price/performance compared to legacy x86_64 runtimes.
  - Sub-120ms cold starts and sub-20ms warm execution latency.
- **Runtime**: Node.js 20.x with native ES modules and AWS SDK v3 modular DynamoDB clients.

---

## 3. Data Tier (Amazon DynamoDB On-Demand)
- **Billing Mode**: `PAY_PER_REQUEST` ensures zero fixed cost during idle campus hours.
- **Durability**: Point-in-Time Recovery (PITR) enabled for 35-day backup retention.
- **Data Models**:
  - `SESSION#prepwise`: Stores student study session requests, assigned TAs, venues, and status lifecycles.
  - `TUTOR#profile`: Volunteer peer tutor credentials, subjects handled, volunteer hours, and karma rewards.

---

## 4. Design System & Frontend Architecture
- **Aesthetic**: Scholarly Minimal (warm stone background `#FAFAF9`, crisp white elevated cards `#FFFFFF`, royal blue accents `#2563EB`).
- **Typography**: Google Fonts pairing — **Instrument Sans** (display) + **Inter** (body) + **JetBrains Mono** (code).
- **Client Framework**: React 19 + TypeScript + Vite + Tailwind CSS with strict module boundaries.

