# 🎓 PrepWise Campus — 100% Free Campus Peer Tutoring & PYQ Vault

[![Live App](https://img.shields.io/badge/Live_App-CloudFront_HTTPS-2563EB?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://d1pugni5iia6hw.cloudfront.net)
[![GitHub](https://img.shields.io/badge/GitHub-RamSuryaCH/cloudpulse--aws-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RamSuryaCH/cloudpulse-aws)
[![AWS](https://img.shields.io/badge/AWS-Serverless-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Graviton3](https://img.shields.io/badge/Compute-Graviton3_ARM64-FF9900?style=for-the-badge&logo=arm&logoColor=white)](https://aws.amazon.com/ec2/graviton/)
[![Cost](https://img.shields.io/badge/Fee-100%25_Free_Platform-16A34A?style=for-the-badge)](https://d1pugni5iia6hw.cloudfront.net)

> **PrepWise Campus** is a 100% free, open peer-tutoring and exam preparation platform for engineering students across Hyderabad colleges (VNRVJIET, CBIT, MJCET, JNTU). Powered by senior student TAs, campus student clubs, and AWS Serverless architecture.

---

## 🌐 Live Production Endpoints

- **Live Web Application (CloudFront Edge)**: [https://d1pugni5iia6hw.cloudfront.net](https://d1pugni5iia6hw.cloudfront.net)
- **Live Serverless API (API Gateway + Graviton3 Lambda)**: [https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/health](https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/health)
- **GitHub Repository**: [https://github.com/RamSuryaCH/cloudpulse-aws](https://github.com/RamSuryaCH/cloudpulse-aws)

---

## 🌟 Core Features

1. 📚 **1-on-1 & Group Peer Tutoring**: Students book free sprint sessions with high-GPA senior TAs who have mastered the exact semester syllabus.
2. 📝 **Solved PYQ & Notes Vault**: Verified previous year question papers, formula cheat sheets, and lab viva code walkthroughs with 1-click clipboard copy.
3. ⏱️ **Single-Token Session Tracker**: Students track assigned TA details and campus venue via public session tokens (`?token=...`) with post-session 5-star review submission.
4. 🏅 **Volunteer Tutor Portal**: Senior TAs claim pending requests, earn academic Karma points, and track verified volunteer service hours.
5. 🤝 **Partner Club Hub**: Student chapters (AWS Cloud Club VNRVJIET, CSI CBIT, IEEE MJCET) sponsor study circles and track campus community impact.
6. 🛡️ **Campus Coordinator Console**: Admin dashboard to match peer tutors and confirm completed sessions.
7. 🔍 **⌘K Spotlight Command Palette**: Instant keyboard-driven lookup for courses, PYQs, and portals.

---

## 🏗️ AWS Serverless Architecture

```
+-----------------------------------------------------------------------------------+
|                                  USER / BROWSER                                   |
+-----------------------------------------------------------------------------------+
                                         | (HTTPS)
                                         v
                +---------------------------------------------------+
                |          Amazon CloudFront (CDN Edge)             |
                |          - Origin Access Control (OAC)            |
                |          - HTTP/3 & TLS 1.3                       |
                +---------------------------------------------------+
                       /                                       \
                      / (Static Assets /*)                      \ (API Routing /api/*)
                     v                                           v
       +---------------------------+               +---------------------------+
       |      Amazon S3 Bucket     |               |   Amazon API Gateway v2   |
       |   - React 19 + TypeScript |               |   - Low-latency HTTP API  |
       |   - Scholarly Minimal UI  |               |   - CORS & AWS Proxy      |
       +---------------------------+               +---------------------------+
                                                                 |
                                                                 v
                                                   +---------------------------+
                                                   |    AWS Lambda Functions   |
                                                   |    - Node.js 20 on ARM64  |
                                                   |      (AWS Graviton3)      |
                                                   +---------------------------+
                                                                 |
                                                                 v
                                                   +---------------------------+
                                                   |   Amazon DynamoDB         |
                                                   |   - Sessions, Courses,    |
                                                   |     Tutors & Reviews      |
                                                   +---------------------------+
```

---

## 🛠️ AWS Services Utilized

| Service | Category | Purpose in PrepWise Campus | Live AWS Resource |
| :--- | :--- | :--- | :--- |
| **Amazon CloudFront** | CDN & Edge | Global CDN distribution with Origin Access Control (OAC) and TLS 1.3 | `d1pugni5iia6hw.cloudfront.net` |
| **Amazon S3** | Storage | High-speed Single Page Application hosting with SSE-AES256 encryption | `cloudpulse-app-frontendbucket-arswr5lhouip` |
| **Amazon API Gateway v2** | Networking | HTTP API with CORS, proxy routing to Lambda | `pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com` |
| **AWS Lambda** | Serverless Compute | Graviton3 ARM64 handler — DynamoDB session creation, tracking & status updates | `cloudpulse-challenge-api` |
| **Amazon DynamoDB** | Database | Serverless NoSQL store — peer sessions persisted via `POST /api/prepwise/sessions/create` | `cloudpulse-challenge-data` |
| **Amazon CloudWatch** | Observability | Real-time structured log streams and health telemetry | `/aws/lambda/cloudpulse-challenge-api` |

---

## 🚀 Local Development

```bash
# 1. Clone repository
git clone https://github.com/RamSuryaCH/cloudpulse-aws.git
cd cloudpulse-aws

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License
MIT License. Open source educational platform for Hyderabad campuses.
