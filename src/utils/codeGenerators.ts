import type { ArchitectureNode, ArchitectureConnection } from '../types';

export function generateTerraform(nodes: ArchitectureNode[], connections: ArchitectureConnection[]): string {
  const serviceIds = new Set(nodes.map(n => n.serviceId));

  let tf = `# ==============================================================================
# CloudPulse AI - Production AWS Terraform Infrastructure
# Provisioned Nodes: ${nodes.length} | Connections: ${connections.length}
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudPulse-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Architecture = "Serverless-Multi-Tier"
    }
  }
}

variable "aws_region" {
  type        = string
  default     = "ap-southeast-2"
  description = "Target AWS deployment region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment"
}

variable "app_name" {
  type        = string
  default     = "cloudpulse-app"
  description = "Resource prefix"
}
`;

  if (serviceIds.has('s3') || serviceIds.has('cloudfront')) {
    tf += `
# ------------------------------------------------------------------------------
# 1. Amazon S3 Bucket (Static Single Page Application)
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket_prefix = "\${var.app_name}-assets-"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
`;
  }

  if (serviceIds.has('cloudfront')) {
    tf += `
# ------------------------------------------------------------------------------
# 2. Amazon CloudFront Origin Access Control (OAC) & Global CDN
# ------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "\${var.app_name}-oac"
  description                       = "OAC for secure S3 frontend access"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  comment             = "CloudPulse AI Global Edge CDN"

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

resource "aws_s3_bucket_policy" "cdn_access" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "\${aws_s3_bucket.frontend.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
        }
      }
    }]
  })
}
`;
  }

  if (serviceIds.has('dynamodb')) {
    tf += `
# ------------------------------------------------------------------------------
# 3. Amazon DynamoDB Serverless Table (On-Demand NoSQL)
# ------------------------------------------------------------------------------
resource "aws_dynamodb_table" "main_db" {
  name         = "\${var.app_name}-data"
  billing_mode = "PAY_PER_REQUEST" # Zero idle cost!
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}
`;
  }

  if (serviceIds.has('lambda') || serviceIds.has('apigateway')) {
    tf += `
# ------------------------------------------------------------------------------
# 4. AWS Lambda Compute (Graviton3 ARM64) & API Gateway v2
# ------------------------------------------------------------------------------
resource "aws_iam_role" "lambda_exec" {
  name = "\${var.app_name}-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "api_handler" {
  function_name = "\${var.app_name}-api"
  runtime       = "nodejs20.x"
  architectures = ["arm64"] # Graviton3 ARM64
  handler       = "index.handler"
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 10
  memory_size   = 512

  filename         = "\${path.module}/../../backend/dist/lambda.zip"
  source_code_hash = filebase64sha256("\${path.module}/../../backend/dist/lambda.zip")

  environment {
    variables = {
      ENVIRONMENT  = var.environment
      DYNAMO_TABLE = try(aws_dynamodb_table.main_db.name, "")
    }
  }
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "\${var.app_name}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api_handler.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/\${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "\${aws_apigatewayv2_api.http_api.arn}/*/*"
}
`;
  }

  if (serviceIds.has('cloudwatch')) {
    tf += `
# ------------------------------------------------------------------------------
# 5. Amazon CloudWatch Metric Alarms
# ------------------------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "\${var.app_name}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alarm when Lambda encounters > 5 errors in 1 minute"

  dimensions = {
    FunctionName = try(aws_lambda_function.api_handler.function_name, "cloudpulse-app-api")
  }
}
`;
  }

  tf += `
# ------------------------------------------------------------------------------
# Outputs
# ------------------------------------------------------------------------------
output "cloudfront_url" {
  description = "CloudFront CDN Live URL"
  value       = try("https://\${aws_cloudfront_distribution.cdn.domain_name}", "N/A")
}

output "api_gateway_url" {
  description = "Serverless API Gateway Endpoint"
  value       = try(aws_apigatewayv2_stage.prod.invoke_url, "N/A")
}
`;

  return tf;
}

export function generateCDK(_nodes: ArchitectureNode[], _connections: ArchitectureConnection[]): string {
  return `import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export class CloudPulseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Static Website Bucket
    const siteBucket = new s3.Bucket(this, 'CloudPulseSiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. DynamoDB Serverless On-Demand Table
    const dataTable = new dynamodb.Table(this, 'CloudPulseTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 3. AWS Lambda on Graviton3 ARM64
    const apiFunction = new lambda.Function(this, 'CloudPulseApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../backend/dist'),
      environment: {
        TABLE_NAME: dataTable.tableName,
      },
    });
    dataTable.grantReadWriteData(apiFunction);

    // 4. API Gateway HTTP API
    const httpApi = new apigw.HttpApi(this, 'CloudPulseHttpApi', {
      apiName: 'cloudpulse-api',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [apigw.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
      defaultIntegration: new integrations.HttpLambdaIntegration('LambdaIntegration', apiFunction),
    });

    // 5. CloudFront CDN with S3 Origin Access Control
    const distribution = new cloudfront.Distribution(this, 'CloudPulseCDN', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(\`\${httpApi.httpApiId}.execute-api.\${this.region}.amazonaws.com\`),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        }
      },
      defaultRootObject: 'index.html',
    });

    // 6. CloudWatch Metric Alarm
    new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
      metric: apiFunction.metricErrors(),
      threshold: 5,
      evaluationPeriods: 1,
    });

    // Outputs
    new cdk.CfnOutput(this, 'CloudFrontURL', { value: \`https://\${distribution.distributionDomainName}\` });
    new cdk.CfnOutput(this, 'ApiGatewayURL', { value: httpApi.url ?? '' });
    new cdk.CfnOutput(this, 'S3BucketName', { value: siteBucket.bucketName });
  }
}
`;
}

export function generatePulumi(_nodes: ArchitectureNode[], _connections: ArchitectureConnection[]): string {
  return `import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// 1. S3 Bucket for Static Assets
const siteBucket = new aws.s3.Bucket("frontendBucket", {
    acl: "private",
    forceDestroy: true,
});

const blockPublicAccess = new aws.s3.BucketPublicAccessBlock("frontendPublicAccessBlock", {
    bucket: siteBucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});

// 2. DynamoDB Serverless Table
const dynamoTable = new aws.dynamodb.Table("dataTable", {
    billingMode: "PAY_PER_REQUEST",
    attributes: [
        { name: "PK", type: "S" },
        { name: "SK", type: "S" }
    ],
    hashKey: "PK",
    rangeKey: "SK",
    pointInTimeRecovery: { enabled: true },
});

// 3. CloudFront Distribution with OAC
const oac = new aws.cloudfront.OriginAccessControl("siteOAC", {
    originAccessControlOriginType: "s3",
    signingBehavior: "always",
    signingProtocol: "sigv4",
});

export const bucketName = siteBucket.id;
export const tableName = dynamoTable.id;
`;
}
