output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.postgres.address
  sensitive   = true
}

output "lambda_auth_function_name" {
  description = "Auth Lambda function name"
  value       = aws_lambda_function.auth.function_name
}

output "lambda_tasks_function_name" {
  description = "Tasks Lambda function name"
  value       = aws_lambda_function.tasks.function_name
}
