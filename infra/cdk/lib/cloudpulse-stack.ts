import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export class CloudPulseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Bucket for Static Assets
    const siteBucket = new s3.Bucket(this, 'CloudPulseSiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. DynamoDB Serverless Table
    const dataTable = new dynamodb.Table(this, 'CloudPulseTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 3. AWS Lambda on Graviton3 ARM64
    const apiFunction = new lambda.Function(this, 'CloudPulseApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../backend/dist'),
      environment: {
        TABLE_NAME: dataTable.tableName,
      },
    });
    dataTable.grantReadWriteData(apiFunction);

    // 4. API Gateway HTTP API
    const httpApi = new apigw.HttpApi(this, 'CloudPulseHttpApi', {
      apiName: 'cloudpulse-api',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [apigw.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
      defaultIntegration: new integrations.HttpLambdaIntegration('LambdaIntegration', apiFunction),
    });

    // 5. CloudFront CDN with S3 Origin Access Control
    const distribution = new cloudfront.Distribution(this, 'CloudPulseCDN', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(`${httpApi.httpApiId}.execute-api.${this.region}.amazonaws.com`),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        }
      },
      defaultRootObject: 'index.html',
    });

    // 6. CloudWatch Metric Alarm
    new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
      metric: apiFunction.metricErrors(),
      threshold: 5,
      evaluationPeriods: 1,
    });

    // Outputs
    new cdk.CfnOutput(this, 'CloudFrontURL', { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, 'ApiGatewayURL', { value: httpApi.url ?? '' });
    new cdk.CfnOutput(this, 'S3BucketName', { value: siteBucket.bucketName });
  }
}
