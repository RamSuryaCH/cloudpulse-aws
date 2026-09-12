#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudPulseStack } from '../lib/cloudpulse-stack';

const app = new cdk.App();
new CloudPulseStack(app, 'CloudPulseStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'CloudPulse AI - AWS Weekend Challenge Winner Architecture',
});
