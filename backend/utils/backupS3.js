/**
 * @fileoverview Script to download a full backup of an AWS S3 bucket locally.
 * Preserves directory structure, supports resume (skips unchanged existing files),
 * and downloads in parallel batches.
 *
 * Usage:
 *   npm run backup:s3
 *   or
 *   node utils/backupS3.js
 */

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const chalk = require('chalk');
require('dotenv').config();

const s3Client = require('../config/s3Client');

const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const BACKUP_DIR = process.env.S3_BACKUP_DIR || path.join(__dirname, '../s3_backup');
const CONCURRENCY = 5; // Number of parallel downloads

function toNodeStream(body) {
  if (body instanceof Readable) return body;
  if (body && typeof body[Symbol.asyncIterator] === 'function') {
    return Readable.from(body);
  }
  throw new Error('Unexpected S3 Body stream type');
}

async function listAllS3Objects(bucket) {
  const allObjects = [];
  let continuationToken = undefined;

  console.log(chalk.cyan(`🔍 Fetching object list from S3 Bucket: ${chalk.bold(bucket)}...`));

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents && response.Contents.length > 0) {
      allObjects.push(...response.Contents);
      process.stdout.write(chalk.yellow(`\rFound ${allObjects.length} objects in bucket...`));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log('\n');
  return allObjects;
}

async function downloadSingleObject(bucket, objectKey, sizeBytes) {
  const localFilePath = path.join(BACKUP_DIR, objectKey);
  const localDirPath = path.dirname(localFilePath);

  // Ensure target folder exists
  await fs.promises.mkdir(localDirPath, { recursive: true });

  // Resume check: If file already exists locally with same non-zero size, skip
  if (fs.existsSync(localFilePath)) {
    const stat = fs.statSync(localFilePath);
    if (stat.size === sizeBytes && sizeBytes > 0) {
      return { status: 'skipped', key: objectKey, sizeBytes };
    }
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });

  const { Body } = await s3Client.send(command);
  const writeStream = fs.createWriteStream(localFilePath);

  await pipeline(toNodeStream(Body), writeStream);
  return { status: 'downloaded', key: objectKey, sizeBytes };
}

async function downloadAllObjects(bucket, objects) {
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  let totalBytesDownloaded = 0;

  console.log(chalk.blue(`🚀 Starting backup into local directory: ${chalk.bold(BACKUP_DIR)}`));
  console.log(chalk.gray(`Concurrent workers: ${CONCURRENCY}\n`));

  const total = objects.length;
  let index = 0;

  async function worker() {
    while (index < objects.length) {
      const currentIndex = index++;
      const item = objects[currentIndex];

      // Ignore directory marker objects
      if (item.Key.endsWith('/')) continue;

      try {
        const result = await downloadSingleObject(bucket, item.Key, item.Size || 0);

        if (result.status === 'downloaded') {
          downloadedCount++;
          totalBytesDownloaded += item.Size || 0;
          console.log(
            `[${currentIndex + 1}/${total}] ✅ ${chalk.green('DOWNLOADED')}: ${item.Key} (${(
              (item.Size || 0) /
              (1024 * 1024)
            ).toFixed(2)} MB)`
          );
        } else {
          skippedCount++;
          console.log(`[${currentIndex + 1}/${total}] ⏩ ${chalk.gray('SKIPPED (Exists)')}: ${item.Key}`);
        }
      } catch (err) {
        failedCount++;
        console.error(`[${currentIndex + 1}/${total}] ❌ ${chalk.red('FAILED')}: ${item.Key} - ${err.message}`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, objects.length) }, () => worker());
  await Promise.all(workers);

  return {
    downloadedCount,
    skippedCount,
    failedCount,
    totalBytesDownloaded,
  };
}

async function runBackup() {
  const startTime = Date.now();

  if (!BUCKET_NAME) {
    console.error(chalk.red.bold('Error: S3_BUCKET_NAME or AWS_BUCKET_NAME is not set in your .env file.'));
    process.exit(1);
  }

  if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'dummy_key') {
    console.error(chalk.red.bold('Error: Valid AWS_ACCESS_KEY_ID is missing in your .env file.'));
    process.exit(1);
  }

  try {
    const objects = await listAllS3Objects(BUCKET_NAME);

    if (objects.length === 0) {
      console.log(chalk.yellow('The S3 bucket is empty. Nothing to backup.'));
      return;
    }

    const summary = await downloadAllObjects(BUCKET_NAME, objects);
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    const downloadedMB = (summary.totalBytesDownloaded / (1024 * 1024)).toFixed(2);

    console.log(chalk.bold.green('\n=================================================='));
    console.log(chalk.bold.green('🎉 S3 BACKUP COMPLETED SUCCESSFULLY'));
    console.log(chalk.bold.green('=================================================='));
    console.log(`📁 Backup Destination:  ${chalk.cyan(BACKUP_DIR)}`);
    console.log(`📦 Total Bucket Objects: ${objects.length}`);
    console.log(`✅ Newly Downloaded:   ${summary.downloadedCount} files (${downloadedMB} MB)`);
    console.log(`⏩ Skipped (Already):   ${summary.skippedCount} files`);
    console.log(`❌ Failed Downloads:    ${summary.failedCount} files`);
    console.log(`⏱️ Total Time Taken:    ${durationSec} seconds\n`);
  } catch (err) {
    console.error(chalk.red.bold('\nCritical Backup Failure:'), err.message);
    process.exit(1);
  }
}

runBackup();
