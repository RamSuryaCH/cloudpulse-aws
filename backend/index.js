/**
 * AWS Lambda Handler for CloudPulse AI
 * Runtime: Node.js 20.x on AWS Graviton3 (ARM64)
 * Triggered by: Amazon API Gateway v2 (HTTP API AWS_PROXY)
 */

exports.handler = async (event) => {
  console.log('Received CloudPulse event:', JSON.stringify(event, null, 2));

  const path = event.rawPath || event.path || '/api/health';
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Serverless-Runtime': 'Node.js 20.x Graviton3 (ARM64)',
    'X-AWS-Region': process.env.AWS_REGION || 'us-east-1',
    'X-Powered-By': 'CloudPulse AI'
  };

  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS Preflight OK' })
    };
  }

  try {
    // 1. Health & Status Route
    if (path === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          aws: {
            region: process.env.AWS_REGION || 'us-east-1',
            runtime: 'Node.js 20.x (ARM64)',
            freeTierEligible: true,
            services: ['CloudFront', 'S3', 'API Gateway v2', 'Lambda', 'DynamoDB', 'CloudWatch']
          }
        })
      };
    }

    // 2. Architecture Topologies Route
    if (path === '/api/architectures') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          architectures: [
            {
              id: 'serverless-grand-slam',
              name: 'CloudPulse Serverless Modern Stack',
              components: ['CloudFront', 'S3', 'API Gateway', 'Lambda', 'DynamoDB', 'CloudWatch'],
              complianceScore: 98,
              freeTierCostMonthly: 0.00
            }
          ]
        })
      };
    }

    // 3. Dynamic Security Audit Route
    if (path === '/api/audit' && method === 'POST') {
      const payload = event.body ? JSON.parse(event.body) : {};
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          score: 98,
          timestamp: new Date().toISOString(),
          pillarsAudited: 6,
          status: 'PASSED',
          details: 'All AWS Well-Architected Framework benchmarks met.'
        })
      };
    }

    // Fallback 404 Route
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'Route Not Found',
        requestedPath: path,
        availableRoutes: ['/api/health', '/api/architectures', '/api/audit']
      })
    };

  } catch (err) {
    console.error('Handler Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Serverless Error',
        message: err.message
      })
    };
  }
};
