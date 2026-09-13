/**
 * PrepWise Campus & CloudPulse AI — Serverless Lambda Handler
 * Runtime: Node.js 20.x on AWS Graviton3 (ARM64)
 * Triggered by: Amazon API Gateway v2 (HTTP API AWS_PROXY)
 */

const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'cloudpulse-challenge-data';
const REGION     = process.env.AWS_REGION      || 'ap-southeast-2';

const ddb = new DynamoDBClient({ region: REGION });

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'X-Serverless-Runtime': 'Node.js 20.x Graviton3 (ARM64)',
  'X-CloudPulse-Region': REGION,
  'X-Powered-By': 'PrepWise Campus — Free Peer Tutoring Platform'
};

const ok  = (body)                => ({ statusCode: 200, headers: HEADERS, body: JSON.stringify(body) });
const bad = (code, msg, extra={}) => ({ statusCode: code, headers: HEADERS, body: JSON.stringify({ error: msg, ...extra }) });

exports.handler = async (event) => {
  const path   = event.rawPath || event.path || '/api/health';
  const method = (event.requestContext?.http?.method || event.httpMethod || 'GET').toUpperCase();
  const query  = event.queryStringParameters || {};
  console.log(`[PrepWise Free API] ${method} ${path}`);

  if (method === 'OPTIONS') return ok({ preflight: true });

  try {
    // GET /api/health
    if (path === '/api/health' && method === 'GET') {
      return ok({
        status: 'healthy',
        platform: 'PrepWise Campus — 100% Free Peer Tutoring Platform',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        region: REGION,
        runtime: 'Node.js 20.x (ARM64 Graviton3)',
        services: {
          cloudfront: 'ACTIVE — d1pugni5iia6hw.cloudfront.net',
          s3:         'ACTIVE — cloudpulse-app-frontendbucket-arswr5lhouip',
          apiGateway: 'ACTIVE — pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com',
          lambda:     'ACTIVE — Graviton3 ARM64',
          dynamoDB:   'ACTIVE — ' + TABLE_NAME
        }
      });
    }

    // GET /api/prepwise/courses
    if (path === '/api/prepwise/courses' && method === 'GET') {
      return ok({
        status: 'success',
        isFree: true,
        courses: [
          { id: 'eng-maths-3', name: 'Engineering Mathematics III (PDE & Complex Variables)', code: 'MA301', category: 'engineering' },
          { id: 'dsa', name: 'Data Structures & Algorithms in C++/Java', code: 'CS201', category: 'computer_science' },
          { id: 'digital-electronics', name: 'Digital Logic & Microprocessors (8086/ARM)', code: 'EC204', category: 'electronics' },
          { id: 'dbms', name: 'Database Management Systems & SQL Querying', code: 'CS302', category: 'computer_science' },
          { id: 'operating-systems', name: 'Operating Systems & System Programming', code: 'CS304', category: 'computer_science' },
          { id: 'organic-chem', name: 'Engineering Chemistry & Spectroscopy', code: 'CH101', category: 'basic_sciences' }
        ]
      });
    }

    // POST /api/prepwise/sessions/create (100% Free Booking)
    if (path === '/api/prepwise/sessions/create' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { studentName, studentContact, collegeName, courseId, courseName, sessionType = 'one_on_one', referralCode } = body;

      if (!studentName || !studentContact || !courseId) {
        return bad(400, 'Missing required fields: studentName, studentContact, courseId');
      }

      const sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      const publicToken = 'pw-tok-' + Math.random().toString(36).slice(2, 10);
      const createdAt = new Date().toISOString();

      await ddb.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({
          PK: 'SESSION#prepwise',
          SK: sessionId,
          publicToken,
          studentName,
          studentContact,
          collegeName: collegeName || 'Hyderabad Campus',
          courseId,
          courseName: courseName || courseId,
          sessionType,
          durationMins: sessionType === 'subject_mastery' ? 180 : 60,
          isFree: true,
          sessionStatus: 'requested',
          referralCode: referralCode || '',
          createdAt,
          ttl: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60)
        })
      }));

      return ok({
        success: true,
        sessionId,
        publicToken,
        isFree: true,
        sessionStatus: 'requested',
        message: 'Free peer tutoring session requested successfully.'
      });
    }

    // GET /api/prepwise/sessions/track?token=...
    if (path === '/api/prepwise/sessions/track' && method === 'GET') {
      const token = query.token;
      if (!token) return bad(400, 'Missing token parameter');

      const scanResult = await ddb.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'publicToken = :tok',
        ExpressionAttributeValues: marshall({ ':tok': token })
      }));

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return bad(404, 'Session not found for token');
      }

      const session = unmarshall(scanResult.Items[0]);
      return ok({ success: true, session });
    }

    // ADMIN POST /api/prepwise/admin/complete-session
    if (path === '/api/prepwise/admin/complete-session' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { sessionId } = body;

      if (!sessionId) return bad(400, 'Missing sessionId');

      await ddb.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ PK: 'SESSION#prepwise', SK: sessionId }),
        UpdateExpression: 'SET sessionStatus = :s, completedAt = :t',
        ExpressionAttributeValues: marshall({
          ':s': 'completed',
          ':t': new Date().toISOString()
        })
      }));

      return ok({ success: true, sessionId, sessionStatus: 'completed', message: 'Session completed. Volunteer Karma awarded.' });
    }

    // Fallback 404
    return bad(404, 'Route not found', { requestedPath: path });

  } catch (error) {
    console.error('[PrepWise Free API Error]:', error.name, error.message);
    return bad(500, 'Internal serverless error', { message: error.message });
  }
};
