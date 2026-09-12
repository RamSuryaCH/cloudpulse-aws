# CloudWatch Metric Alarm for Lambda 5xx Errors
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.app_name}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Trigger alarm when backend Lambda encounters > 5 errors in 1 minute"

  dimensions = {
    FunctionName = aws_lambda_function.api_handler.function_name
  }
}
