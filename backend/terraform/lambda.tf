# Common environment variables for all Lambda functions
locals {
  lambda_env_vars = {
    DB_HOST            = aws_db_instance.postgres.address
    DB_PORT            = aws_db_instance.postgres.port
    DB_NAME            = var.db_name
    DB_USER            = var.db_username
    DB_PASSWORD        = var.db_password
    JWT_SECRET         = var.jwt_secret
    JWT_REFRESH_SECRET = var.jwt_refresh_secret
  }
}

# Lambda Function - Auth
resource "aws_lambda_function" "auth" {
  filename         = "../dist/auth.zip"
  function_name    = "${var.project_name}-auth"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/auth/handler.handler"
  source_code_hash = filebase64sha256("../dist/auth.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-auth"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# Lambda Function - Tasks
resource "aws_lambda_function" "tasks" {
  filename         = "../dist/tasks.zip"
  function_name    = "${var.project_name}-tasks"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/tasks/handler.handler"
  source_code_hash = filebase64sha256("../dist/tasks.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-tasks"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Auth Lambda
resource "aws_cloudwatch_log_group" "auth" {
  name              = "/aws/lambda/${aws_lambda_function.auth.function_name}"
  retention_in_days = 7
}

# CloudWatch Log Group for Tasks Lambda
resource "aws_cloudwatch_log_group" "tasks" {
  name              = "/aws/lambda/${aws_lambda_function.tasks.function_name}"
  retention_in_days = 7
}

# Lambda Permission for API Gateway - Auth
resource "aws_lambda_permission" "api_gateway_auth" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Lambda Permission for API Gateway - Tasks
resource "aws_lambda_permission" "api_gateway_tasks" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tasks.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
