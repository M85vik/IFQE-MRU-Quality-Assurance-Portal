// config/s3Client.js
require('dotenv').config(); 
const { S3Client } = require('@aws-sdk/client-s3');

// Ensure your .env file has AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION


const s3Client = new S3Client({
  region: process.env.AWS_REGION?.trim() || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  },
});

module.exports = s3Client;