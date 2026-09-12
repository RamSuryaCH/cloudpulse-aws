# ☁️ CloudPulse AI — Next-Gen AWS Serverless Architecture Studio & Observability Hub

[![Live App](https://img.shields.io/badge/Live_Demo-CloudFront_HTTPS-10B981?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://d1pugni5iia6hw.cloudfront.net)
[![GitHub](https://img.shields.io/badge/GitHub-RamSuryaCH/cloudpulse--aws-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RamSuryaCH/cloudpulse-aws)
[![AWS](https://img.shields.io/badge/AWS-Serverless-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Graviton3](https://img.shields.io/badge/Compute-Graviton3_ARM64-FF9900?style=for-the-badge&logo=arm&logoColor=white)](https://aws.amazon.com/ec2/graviton/)
[![Cost](https://img.shields.io/badge/Monthly_Cost-$0.00_(Free_Tier)-10B981?style=for-the-badge)](https://aws.amazon.com/free/)

> Enterprise-grade AWS Serverless visual architecture studio, multi-cloud cost guard, Well-Architected 6-pillar compliance auditor, and real-time observability telemetry platform.

---

## 🌐 Live AWS Production Endpoints

- **Live Web Application (CloudFront CDN)**: [https://d1pugni5iia6hw.cloudfront.net](https://d1pugni5iia6hw.cloudfront.net)
- **Live Serverless API (API Gateway + Graviton3 Lambda)**: [https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/health](https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/health)
- **GitHub Repository**: [https://github.com/RamSuryaCH/cloudpulse-aws](https://github.com/RamSuryaCH/cloudpulse-aws)

---

## 🌟 What is CloudPulse AI?

**CloudPulse AI** is an interactive AWS cloud architecture studio and observability hub. It allows developers and architects to:
1. **Design Cloud Topologies**: Visually connect AWS services and auto-generate production-ready **Terraform (HCL)** and **AWS CDK (TypeScript)** code in real time.
2. **Guard AWS Free-Tier Spending**: Live cost estimator with usage sliders, Free Tier exhaustion alerts, and Graviton3 ARM savings calculations.
3. **Audit Well-Architected Compliance**: Instant 6-pillar compliance audit scoring security (OAC, KMS, TLS 1.3), reliability, performance, cost, ops, and sustainability.
4. **Inspect Live Serverless Telemetry**: Real-time API invocation bench with sub-25ms response tracking and CloudWatch structured log stream.
5. **Inspect Live Deployment**: Interactive multi-tier deep dive showing how CloudPulse itself is hosted on AWS.

---

## 🏗️ Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                  USER / BROWSER                                   |
+-----------------------------------------------------------------------------------+
                                         | (HTTPS / Route 53 DNS)
                                         v
               +---------------------------------------------------+
               |          Amazon CloudFront (CDN Edge)             |
               |          - Custom Domain & SSL/TLS (ACM)          |
               |          - Origin Access Control (OAC)            |
               +---------------------------------------------------+
                      /                                       \
                     / (Static Assets /*)                      \ (API Routing /api/*)
                    v                                           v
      +---------------------------+               +---------------------------+
      |      Amazon S3 Bucket     |               |   Amazon API Gateway v2   |
      |   - React / Vite Single   |               |   - Low-latency HTTP API  |
      |     Page Application      |               |   - CORS & AWS Proxy      |
      +---------------------------+               +---------------------------+
                                                                |
                                                                v
                                                  +---------------------------+
                                                  |    AWS Lambda Functions   |
                                                  |    - Node.js 20 on ARM64  |
                                                  |      (AWS Graviton3)      |
                                                  +---------------------------+
                                                    /           |           \
                                                   v            v            v
                                        +-------------+  +-------------+  +-------------+
                                        |  DynamoDB   |  | CloudWatch  |  | Amazon SNS  |
                                        |  (NoSQL)    |  |  (Logs &    |  |  (Incident  |
                                        |  On-Demand  |  |   Metrics)  |  |   Alerts)   |
                                        +-------------+  +-------------+  +-------------+
```

---

## 🛠️ AWS Services Utilized

| Service | Category | Purpose in CloudPulse | Live AWS Resource |
| :--- | :--- | :--- | :--- |
| **Amazon CloudFront** | CDN & Edge | Global CDN distribution with Origin Access Control (OAC) and TLS 1.3 | `d1pugni5iia6hw.cloudfront.net` |
| **Amazon S3** | Storage | Secure Single Page Application hosting with SSE-AES256 encryption | `cloudpulse-app-frontendbucket-arswr5lhouip` |
| **Amazon API Gateway v2** | Networking | HTTP API with CORS, proxy routing to Lambda, and 6 live routes | `pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com` |
| **AWS Lambda** | Serverless Compute | Graviton3 ARM64 handler — DynamoDB `PutItemCommand` (save), `ScanCommand` (list/metrics), Well-Architected audit | `cloudpulse-challenge-api` |
| **Amazon DynamoDB** | Database | Serverless NoSQL store — architecture designs persisted via `POST /api/architectures/save` and read via `GET /api/architectures` | `cloudpulse-challenge-data` |
| **Amazon CloudWatch & X-Ray** | Observability | Real-time metric alarms, latency telemetry, distributed traces, and structured log streaming | `/aws/lambda/cloudpulse-challenge-api` |

---

## 🚀 Quickstart & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/RamSuryaCH/cloudpulse-aws.git
cd cloudpulse-aws

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

---

## 📦 1-Click AWS Deployment

```bash
# Deploy with CloudFormation
aws cloudformation deploy \
  --template-file infra/cloudformation/full-deploy.yaml \
  --stack-name cloudpulse-app \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-southeast-2
```

---

## 📄 License
MIT License. Created for the AWS Weekend Challenge.
