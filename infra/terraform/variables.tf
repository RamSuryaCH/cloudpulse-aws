variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS deployment region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Environment name (e.g. production, staging)"
}

variable "app_name" {
  type        = string
  default     = "cloudpulse-aws"
  description = "Application resource prefix name"
}
