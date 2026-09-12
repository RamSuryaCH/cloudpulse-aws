# 🏆 Weekend Challenge Submission: CloudPulse AI

### **Project Name:** CloudPulse AI
### **Live URL:** https://d111111abcdef8.cloudfront.net *(Replace with your live CloudFront/Amplify URL)*
### **GitHub Repo:** https://github.com/your-username/cloudpulse-aws

---

### **AWS Services Used:**
- **Amazon CloudFront**: Global Edge CDN (600+ POPs) with Origin Access Control (OAC), TLS 1.3, Brotli/Gzip compression.
- **Amazon S3**: Static Single Page Application hosting with SSE-AES256 server-side encryption and Block Public Access.
- **Amazon API Gateway v2**: HTTP API gateway with low-latency AWS Proxy routing and built-in CORS configuration.
- **AWS Lambda**: Event-driven serverless compute running on 64-bit ARM AWS Graviton3 (34% better price/performance).
- **Amazon DynamoDB**: Serverless On-Demand NoSQL table with single-digit millisecond latency and Point-in-Time Recovery (PITR).
- **Amazon Route 53 & ACM**: DNS routing with free automated SSL/TLS certificate management.
- **Amazon CloudWatch & X-Ray**: Unified observability, log groups, and metric alarms for error rate monitoring.

---

### **Brief Description of What You Built & How AWS Was Used:**
CloudPulse AI is an interactive AWS Serverless Architecture Studio and Cloud Cost/Security Auditor built to empower cloud engineers to visualize, audit, and generate Infrastructure-as-Code in real-time.

**Key Highlights:**
1. 🎨 **Visual Cloud Canvas**: Drag-and-drop or select AWS building blocks to design architectures with real-time Terraform and AWS CDK code generation.
2. 💰 **Cost & Free-Tier Guard**: Real-time cost estimator calculating monthly spend, Graviton3 savings, and alerting on free-tier consumption.
3. 🛡️ **Well-Architected 6-Pillar Audit**: Instant compliance checklist scoring security, reliability, performance, cost, ops, and sustainability (98% Score).
4. ⚡ **Live Serverless Telemetry Hub**: Real-time API invoker with sub-25ms latency meter and live CloudWatch structured log stream.
5. 🚀 **Infrastructure as Code (IaC)**: 100% automated with both Terraform modules and AWS CDK (TypeScript) stacks + GitHub Actions CI/CD pipeline!

**Total Monthly Cost:** **$0.00** (100% Covered by AWS Free Tier) 💸
