#!/bin/bash
set -e

echo "========================================================"
echo "  🚀 CloudPulse AI - 1-Click AWS Deployment Script"
echo "========================================================"

# 1. Build frontend
echo "📦 1. Building React + Vite SPA..."
npm run build

# 2. Package Lambda backend
echo "⚡ 2. Packaging Lambda Serverless backend..."
mkdir -p backend/dist
cd backend && zip -q -r dist/lambda.zip index.js package.json && cd ..

# 3. Apply Terraform
echo "🏗️ 3. Provisioning AWS Infrastructure with Terraform..."
cd infra/terraform
terraform init
terraform apply -auto-approve

S3_BUCKET=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_URL=$(terraform output -raw cloudfront_domain_name)
API_URL=$(terraform output -raw api_gateway_endpoint)
cd ../..

# 4. Upload static assets to S3
echo "☁️ 4. Syncing frontend assets to S3 bucket ($S3_BUCKET)..."
aws s3 sync dist/ "s3://$S3_BUCKET/" --delete --cache-control "public, max-age=31536000, immutable"
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" --cache-control "no-cache, no-store, must-revalidate"

echo "========================================================"
echo "  🎉 DEPLOYMENT COMPLETE!"
echo "  🌐 Live CloudFront CDN: $CLOUDFRONT_URL"
echo "  ⚡ Serverless API:      $API_URL"
echo "  💰 Estimated Cost:     \$0.00 / month (100% Free Tier)"
echo "========================================================"
