// config/s3.js (CommonJS)
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined
});

function randomKey(prefix = '') {
  return `${prefix}${crypto.randomUUID()}`;
}

async function getPresignedPutUrl({ bucket, key, contentType, expiresIn = 60 }) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return url;
}

module.exports = { s3, getPresignedPutUrl, randomKey };
// This file configures the AWS S3 client and provides a function to generate presigned URLs for uploading files.