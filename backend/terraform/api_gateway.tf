# API Gateway HTTP API
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins  = ["*"]
    allow_methods  = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers  = ["*"]
    expose_headers = ["*"]
    max_age        = 300
  }

  tags = {
    Name = "${var.project_name}-api"
  }
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Name = "${var.project_name}-api-stage"
  }
}

# Lambda Integration - Auth
resource "aws_apigatewayv2_integration" "auth" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.auth.invoke_arn
  payload_format_version = "2.0"
}

# Lambda Integration - Tasks
resource "aws_apigatewayv2_integration" "tasks" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.tasks.invoke_arn
  payload_format_version = "2.0"
}

# ============================================
# AUTH ROUTES
# ============================================
resource "aws_apigatewayv2_route" "auth_register" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/auth/register"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "auth_login" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/auth/login"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "auth_refresh" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/auth/refresh"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "auth_get_users" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /api/auth/users"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "auth_delete_user" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /api/auth/users/{email}"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

# ============================================
# TASKS ROUTES
# ============================================
resource "aws_apigatewayv2_route" "tasks_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /api/tasks"
  target    = "integrations/${aws_apigatewayv2_integration.tasks.id}"
}

resource "aws_apigatewayv2_route" "tasks_create" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/tasks"
  target    = "integrations/${aws_apigatewayv2_integration.tasks.id}"
}

resource "aws_apigatewayv2_route" "tasks_get_by_id" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /api/tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.tasks.id}"
}

resource "aws_apigatewayv2_route" "tasks_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /api/tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.tasks.id}"
}

resource "aws_apigatewayv2_route" "tasks_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /api/tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.tasks.id}"
}
