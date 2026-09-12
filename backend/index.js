/**
 * CloudPulse AI & PrepWise Campus — Serverless Lambda Handler
 * Runtime: Node.js 20.x on AWS Graviton3 (ARM64)
 * Triggered by: Amazon API Gateway v2 (HTTP API AWS_PROXY)
 */

const { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
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
  'X-Powered-By': 'PrepWise Campus AI Platform'
};

const ok  = (body)                => ({ statusCode: 200, headers: HEADERS, body: JSON.stringify(body) });
const bad = (code, msg, extra={}) => ({ statusCode: code, headers: HEADERS, body: JSON.stringify({ error: msg, ...extra }) });

// Preset pricing map (Server-Side Source of Truth)
const COURSE_PRICES = {
  'eng-maths-3': 299,
  'dsa': 349,
  'digital-electronics': 299,
  'dbms': 279,
  'operating-systems': 319,
  'organic-chem': 249
};

const PACKAGE_MULTIPLIERS = {
  'one_on_one': 1.0,
  'group_sprint': 0.85,
  'subject_mastery': 2.1
};

exports.handler = async (event) => {
  const path   = event.rawPath || event.path || '/api/health';
  const method = (event.requestContext?.http?.method || event.httpMethod || 'GET').toUpperCase();
  const query  = event.queryStringParameters || {};
  console.log(`[PrepWise API] ${method} ${path}`);

  if (method === 'OPTIONS') return ok({ preflight: true });

  try {
    // ─────────────────────────────────────────────
    // 1. Health & Core AWS Route
    // ─────────────────────────────────────────────
    if (path === '/api/health' && method === 'GET') {
      return ok({
        status: 'healthy',
        service: 'PrepWise Campus & CloudPulse AI',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        region: REGION,
        runtime: 'Node.js 20.x (ARM64 Graviton3)',
        freeTierEligible: true,
        services: {
          cloudfront: 'ACTIVE — d1pugni5iia6hw.cloudfront.net',
          s3:         'ACTIVE — cloudpulse-app-frontendbucket-arswr5lhouip',
          apiGateway: 'ACTIVE — pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com',
          lambda:     'ACTIVE — Graviton3 ARM64',
          dynamoDB:   'ACTIVE — ' + TABLE_NAME,
          cloudwatch: 'ACTIVE — /aws/lambda/cloudpulse-challenge-api'
        }
      });
    }

    // ─────────────────────────────────────────────
    // 2. PrepWise: GET /api/prepwise/courses
    // ─────────────────────────────────────────────
    if (path === '/api/prepwise/courses' && method === 'GET') {
      return ok({
        status: 'success',
        courses: [
          { id: 'eng-maths-3', name: 'Engineering Mathematics III (PDE & Complex Variables)', code: 'MA301', category: 'engineering', basePricePerHour: 299 },
          { id: 'dsa', name: 'Data Structures & Algorithms in C++/Java', code: 'CS201', category: 'computer_science', basePricePerHour: 349 },
          { id: 'digital-electronics', name: 'Digital Logic & Microprocessors (8086/ARM)', code: 'EC204', category: 'electronics', basePricePerHour: 299 },
          { id: 'dbms', name: 'Database Management Systems & SQL Querying', code: 'CS302', category: 'computer_science', basePricePerHour: 279 },
          { id: 'operating-systems', name: 'Operating Systems & System Programming', code: 'CS304', category: 'computer_science', basePricePerHour: 319 },
          { id: 'organic-chem', name: 'Engineering Chemistry & Spectroscopy', code: 'CH101', category: 'basic_sciences', basePricePerHour: 249 }
        ]
      });
    }

    // ─────────────────────────────────────────────
    // 3. PrepWise: POST /api/prepwise/sessions/create (Server-Side Price Calculation)
    // ─────────────────────────────────────────────
    if (path === '/api/prepwise/sessions/create' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { studentName, studentContact, collegeName, courseId, courseName, sessionType = 'one_on_one', referralCode } = body;

      if (!studentName || !studentContact || !courseId) {
        return bad(400, 'Missing required fields: studentName, studentContact, courseId');
      }

      // Server-Side Price Calculation Guard (Never trust client totalAmount)
      const basePrice = COURSE_PRICES[courseId] || 299;
      const mult = PACKAGE_MULTIPLIERS[sessionType] || 1.0;
      const totalAmount = Math.round(basePrice * mult);

      // Financial breakdown: Tutor keeps 75%, Platform Net = 25%
      const tutorEarnings = Math.round(totalAmount * 0.75 * 100) / 100;
      const platformNet = Math.round(totalAmount * 0.25 * 100) / 100;
      // If attributed to partner club, Club Share = 20% of Platform Net
      const partnerClubShare = referralCode ? Math.round(platformNet * 0.20 * 100) / 100 : 0;

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
          collegeName: collegeName || 'Hyderbad Campus',
          courseId,
          courseName: courseName || courseId,
          sessionType,
          durationMins: sessionType === 'subject_mastery' ? 180 : 60,
          totalAmount,
          tutorEarnings,
          platformNet,
          partnerClubShare,
          paymentStatus: 'pending',
          sessionStatus: 'unassigned',
          referralCode: referralCode || '',
          createdAt,
          ttl: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60)
        })
      }));

      return ok({
        success: true,
        sessionId,
        publicToken,
        totalAmount,
        tutorEarnings,
        platformNet,
        paymentStatus: 'pending',
        upiVpa: 'prepwise@upi',
        message: 'Session booking created. Submit manual UPI payment reference to confirm.'
      });
    }

    // ─────────────────────────────────────────────
    // 4. PrepWise: POST /api/prepwise/sessions/pay (Submit Manual UPI UTR)
    // ─────────────────────────────────────────────
    if (path === '/api/prepwise/sessions/pay' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { publicToken, paymentRef } = body;

      if (!publicToken || !paymentRef) {
        return bad(400, 'Missing publicToken or paymentRef UTR reference');
      }

      const scanResult = await ddb.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'publicToken = :tok',
        ExpressionAttributeValues: marshall({ ':tok': publicToken })
      }));

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return bad(404, 'Booking session not found for token');
      }

      const item = unmarshall(scanResult.Items[0]);

      await ddb.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ PK: item.PK, SK: item.SK }),
        UpdateExpression: 'SET paymentStatus = :s, paymentRef = :r, submittedAt = :t',
        ExpressionAttributeValues: marshall({
          ':s': 'submitted',
          ':r': paymentRef,
          ':t': new Date().toISOString()
        })
      }));

      return ok({
        success: true,
        publicToken,
        paymentStatus: 'submitted',
        paymentRef,
        message: 'Manual UPI Reference submitted successfully. Awaiting Admin verification.'
      });
    }

    // ─────────────────────────────────────────────
    // 5. PrepWise: GET /api/prepwise/sessions/track?token=...
    // ─────────────────────────────────────────────
    if (path === '/api/prepwise/sessions/track' && method === 'GET') {
      const token = query.token;
      if (!token) return bad(400, 'Missing token parameter');

      const scanResult = await ddb.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'publicToken = :tok',
        ExpressionAttributeValues: marshall({ ':tok': token })
      }));

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return bad(404, 'Booking session not found for this token');
      }

      const session = unmarshall(scanResult.Items[0]);
      return ok({ success: true, session });
    }

    // ─────────────────────────────────────────────
    // 6. PrepWise: ADMIN POST /api/prepwise/admin/verify-payment
    // ─────────────────────────────────────────────
    if (path === '/api/prepwise/admin/verify-payment' && method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { sessionId, action = 'verify' } = body;

      if (!sessionId) return bad(400, 'Missing sessionId');

      const newStatus = action === 'verify' ? 'verified' : 'rejected';

      await ddb.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ PK: 'SESSION#prepwise', SK: sessionId }),
        UpdateExpression: 'SET paymentStatus = :s, verifiedBy = :v, verifiedAt = :t',
        ExpressionAttributeValues: marshall({
          ':s': newStatus,
          ':v': 'Admin (Console)',
          ':t': new Date().toISOString()
        })
      }));

      return ok({ success: true, sessionId, paymentStatus: newStatus });
    }

    // ─────────────────────────────────────────────
    // 7. PrepWise: ADMIN POST /api/prepwise/admin/complete-session
    // ─────────────────────────────────────────────
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

      return ok({ success: true, sessionId, sessionStatus: 'completed', message: 'Session completed. Tutor earnings unlocked.' });
    }

    // Fallback 404
    return bad(404, 'Route not found', { requestedPath: path });

  } catch (error) {
    console.error('[PrepWise Error]:', error.name, error.message);
    return bad(500, 'Internal serverless error', { message: error.message });
  }
};
