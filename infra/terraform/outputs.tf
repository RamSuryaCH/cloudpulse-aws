output "cloudfront_domain_name" {
  description = "CloudFront CDN Live URL"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}

output "api_gateway_endpoint" {
  description = "Serverless API Gateway HTTP endpoint"
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "s3_bucket_name" {
  description = "S3 Static Assets Deployment Bucket"
  value       = aws_s3_bucket.frontend.id
}

output "dynamodb_table_name" {
  description = "DynamoDB On-Demand Table"
  value       = aws_dynamodb_table.main.id
}
