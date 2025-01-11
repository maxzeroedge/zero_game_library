import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class WebCrawlerStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 Bucket for storing HTML files
    let bucket;
    if (process.env.UPLOAD_BUCKET) {
      bucket = s3.Bucket.fromBucketName(this, 'ZeroGameLibraryCrawlerBucket', process.env.UPLOAD_BUCKET);
    } else {
      bucket = new s3.Bucket(this, 'ZeroGameLibraryCrawlerBucket', {
        bucketName: 'ZeroGameLibraryCrawlerBucket',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    }

    // DynamoDB Table to track visited URLs
    const table = new dynamodb.Table(this, 'ZeroGameLibraryVisitedUrlsTable', {
      tableName: 'ZeroGameLibraryVisitedUrlsTable',
      partitionKey: { name: 'sanitizedUrl', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PROVISIONED,
      maxReadRequestUnits: 10,
      maxWriteRequestUnits: 10
    });
    // 

    // SQS Queue for crawl tasks
    const queue = new sqs.Queue(this, 'ZeroGameLibraryCrawlQueue', {
      queueName: 'ZeroGameLibraryCrawlQueue',
      visibilityTimeout: cdk.Duration.seconds(900),
    });

    // Add Chrome Layer (prebuilt)
    const chromeLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'ChromeLayer',
      'arn:aws:lambda:ap-south-1:764866452798:layer:chrome-aws-lambda:50'
    );

    // Lambda Function
    const crawlerLambda = new lambda.Function(this, 'ZeroGameLibraryCrawlerLambda', {
      functionName: 'ZeroGameLibraryCrawlerLambda',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      timeout: cdk.Duration.seconds(900), // Max for Lambda
      memorySize: 1024, // Increase if needed for Chrome
      layers: [chromeLayer],
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
        QUEUE_URL: queue.queueUrl,
      },
    });

    // Add SQS Event Source to Lambda
    crawlerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(queue, {
        batchSize: 10, // Process up to 10 messages at once
      })
    );

    // Grant permissions to Lambda
    bucket.grantReadWrite(crawlerLambda);
    table.grantReadWriteData(crawlerLambda);
    queue.grantConsumeMessages(crawlerLambda);
  }
}
