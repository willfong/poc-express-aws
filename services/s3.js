// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
import { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client();

const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

const _listBucketsCommand = async () => {
    const command = new ListBucketsCommand({});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _listObjectsV2Command = async (Bucket, ContinuationToken = null) => {
    let input = { Bucket }
    if (ContinuationToken) input = { ...input, ContinuationToken }
    const command = new ListObjectsV2Command(input);
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _putObjectCommand = async (Bucket, Key, Body) => {
    const input = { Bucket, Key, Body }
    const command = new PutObjectCommand(input);
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _getObjectCommand = async (Bucket, Key) => {
    const input = { Bucket, Key }
    const command = new GetObjectCommand(input);
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

export const bucketList = async () => {
    const response = await _listBucketsCommand();
    return response.Buckets;
}

export const objectList = async (bucketName) => {
    let response = await _listObjectsV2Command(bucketName);
    if (response.$metadata.httpStatusCode === 404) {
        return [404, false];
    }
    if (response.$metadata.httpStatusCode === 301) {
        return [301, false];
    }
    let objects = response.Contents || [];
    while (response.NextContinuationToken) {
        response = await _listObjectsV2Command(bucketName, response.NextContinuationToken);
        objects = objects.concat(response.Contents);
    }
    return [false, objects];
}

export const objectPut = async (bucketName, key, body) => {
    const response = await _putObjectCommand(bucketName, key, body);
    return [false, response];
}

export const objectGet = async (bucketName, key) => {
    const response = await _getObjectCommand(bucketName, key);
    const bodyContents = await streamToString(response.Body);
    return [false, bodyContents];
}
