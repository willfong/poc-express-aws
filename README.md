# Express + AWS

POC for Express applications using AWS. Testing out AWS features and functionality. 

## Current Features

### CloudWatch
- PutMetricDataCommand - Add metrics for monitoring/graphing

### S3
- ListBucketsCommand - List buckets that are available
- ListObjectsV2Command - List objects in a specific bucket
- PutObjectCommand - Put an object into a bucket
- GetObjectCommand - Get an object from a bucket

## Getting Started

Set up your AWS credentials:
```
➜  poc-express-aws git:(main) ✗ cat ~/.aws/config 
[default]
region=ap-southeast-1
➜  poc-express-aws git:(main) ✗ cat ~/.aws/credentials 
[default]
aws_access_key_id = AK...U4
aws_secret_access_key = Vv...H6
➜  poc-express-aws git:(main) ✗ 
```

Then set up the project:

```
yarn install
yarn dev
```

## Reference

- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
