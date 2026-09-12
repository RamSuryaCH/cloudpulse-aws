# DynamoDB Serverless On-Demand Table (Zero Idle Cost)
resource "aws_dynamodb_table" "main" {
  name         = "${var.app_name}-data"
  billing_mode = "PAY_PER_REQUEST" # Serverless on-demand pricing
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
