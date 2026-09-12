# ☁️ CloudPulse AI — Production AWS Serverless Architecture Studio

### **Project Name:** CloudPulse AI
### **Live URL:** https://d1pugni5iia6hw.cloudfront.net
### **GitHub Repo:** https://github.com/RamSuryaCH/cloudpulse-aws
### **API Gateway:** https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/health

---

### **AWS Services Used:**
- **Amazon CloudFront**: Global Edge CDN (600+ POPs) with Origin Access Control (OAC), TLS 1.3, Brotli/Gzip compression. Distribution ID: `EJW28095DC509`
- **Amazon S3**: Secure SPA hosting with SSE-AES256 and 100% Block Public Access (`cloudpulse-app-frontendbucket-arswr5lhouip`).
- **Amazon API Gateway v2**: HTTP API with low-latency AWS Proxy routing, CORS, and 6 live routes.
- **AWS Lambda**: Node.js 20.x on 64-bit ARM AWS Graviton3 — 34% better price/performance. Real DynamoDB reads/writes on every request.
- **Amazon DynamoDB**: Serverless On-Demand NoSQL with PITR — stores user-saved cloud architectures (`cloudpulse-challenge-data`, PK=`ARCH#cloudpulse`).
- **Amazon CloudWatch & X-Ray**: Unified observability, structured log groups, metric alarms, and distributed tracing.

---

### **What Was Built & How AWS Was Used:**

**CloudPulse AI** is an enterprise AWS Serverless Architecture Studio that lets engineers design, audit, and generate multi-tier cloud architectures in real time — then save them permanently to DynamoDB.

**Core Features:**
1. 🎨 **Visual Cloud Canvas**: Add AWS building blocks (CloudFront, Lambda, DynamoDB, S3...) to a topology canvas. Connections auto-generate.
2. 💰 **Cost & Free-Tier Guard**: Live cost estimator with Graviton3 savings calculations and Free Tier exhaustion alerts.
3. 🛡️ **Well-Architected 6-Pillar Audit**: Server-side `/api/audit` scores security, reliability, performance, cost, ops, and sustainability (98% score for the current stack).
4. ⚡ **Live Serverless Telemetry**: Real `/api/health` and `/api/metrics` API invocations hitting the live Graviton3 Lambda — sub-25ms latency visible in-app.
5. 💾 **Save to DynamoDB**: Clicking "Save to Cloud" in the Architecture Studio POSTs to `/api/architectures/save`. Lambda writes a real `PutItemCommand` to DynamoDB. `/api/architectures` reads them back with `ScanCommand`.
6. 🚀 **Multi-IaC Code Generation**: Real-time Terraform (HCL), AWS CDK (TypeScript), and Pulumi output for every design.
7. 🔄 **CI/CD Pipeline**: GitHub Actions builds, deploys frontend to S3, updates Lambda code, and invalidates CloudFront on every `main` push.

**Total Monthly Cost: $0.00** — 100% within AWS Free Tier.
