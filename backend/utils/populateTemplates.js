/**
 * @fileoverview A command-line script to upload all template files from a local
 * 'templates' directory to a specified AWS S3 bucket.
 *
 * @description
 * This script reads all files from the local './templates' folder, then uploads
 * each file to the 'templates/' directory within the configured S3 bucket.
 * It uses Promise.allSettled to perform uploads in parallel for efficiency
 * and provides a summary of successful and failed uploads.
 *
 * @usage
 * 1. Make sure your .env file is configured with AWS credentials and AWS_BUCKET_NAME.
 * 2. Place all your template files (e.g., '1.1.7_Template.xlsx') inside the './templates' directory.
 * 3. Run the script from your project's root directory: `node scripts/populateTemplates.js`
 */

// --- Imports ---
const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const chalk = require('chalk'); // For colorful console output

// --- Configuration ---
require('dotenv').config(); // Load environment variables from .env file
const s3Client = require('../config/s3Client'); // Import your pre-configured S3 client

// Get required configuration from environment variables
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const LOCAL_TEMPLATES_DIR = path.join(__dirname, '..', 'templates'); // Assumes script is in /scripts and templates are in /templates

/**
 * The main function that orchestrates the file reading and uploading process.
 */
async function uploadAllTemplates() {
  console.log(chalk.blue.bold('--- Starting S3 Template Population Script ---'));

  // --- 1. Validate Configuration ---
  if (!S3_BUCKET_NAME) {
    console.error(chalk.red.bold('Error: AWS_BUCKET_NAME is not defined in your .env file.'));
    process.exit(1); // Exit the script with an error code
  }

  // --- 2. Read Files from Local Directory ---
  let localFiles;
  try {
    localFiles = fs.readdirSync(LOCAL_TEMPLATES_DIR);
    if (localFiles.length === 0) {
      console.log(chalk.yellow('Warning: The local "templates" directory is empty. Nothing to upload.'));
      return;
    }
    console.log(chalk.cyan(`Found ${localFiles.length} files in the local templates directory.`));
  } catch (error) {
    console.error(chalk.red.bold(`Error reading local directory at ${LOCAL_TEMPLATES_DIR}.`));
    console.error(chalk.red('Please make sure the directory exists and you have read permissions.'));
    console.error(error);
    process.exit(1);
  }

  // --- 3. Create Upload Promises ---
  const uploadPromises = localFiles.map(fileName => {
    // Construct the full local path and the destination key for S3
    const localFilePath = path.join(LOCAL_TEMPLATES_DIR, fileName);
    const s3Key = `templates/${fileName}`; // The destination path inside the bucket

    console.log(`Preparing to upload: ${chalk.yellow(fileName)} to S3 key: ${chalk.yellow(s3Key)}`);

    // Create the command for the S3 client
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fs.createReadStream(localFilePath), // Use a stream for efficiency
    });

    // Return the promise from the S3 client's send method
    return s3Client.send(command).then(() => ({ fileName, status: 'fulfilled' }))
      .catch(error => ({ fileName, status: 'rejected', reason: error.message }));
  });

  // --- 4. Execute All Uploads in Parallel ---
  console.log(chalk.blue('\nStarting all uploads in parallel...'));
  
  // Promise.allSettled is perfect here because it waits for ALL promises to complete,
  // regardless of whether they succeed or fail. This allows us to get a full report.
  const results = await Promise.allSettled(uploadPromises);

  // --- 5. Report the Results ---
  let successCount = 0;
  let failureCount = 0;

  console.log(chalk.blue.bold('\n--- Upload Results ---'));

  results.forEach(result => {
    // The value here is the custom object we returned in the .then() of the promise
    const { fileName, status, reason } = result.value;
    
    if (status === 'fulfilled') {
      console.log(`✅ ${chalk.green('SUCCESS')}: ${fileName}`);
      successCount++;
    } else {
      console.log(`❌ ${chalk.red('FAILURE')}: ${fileName}`);
      console.error(chalk.red(`   Reason: ${reason}`));
      failureCount++;
    }
  });

  // --- 6. Final Summary ---
  console.log(chalk.blue.bold('\n--- Final Summary ---'));
  console.log(chalk.green(`Successful uploads: ${successCount}`));
  console.log(chalk.red(`Failed uploads:     ${failureCount}`));
  console.log(chalk.blue.bold('---------------------\n'));

  if (failureCount > 0) {
    process.exit(1); // Exit with error code if any uploads failed
  }
}

// --- Run the Script ---
uploadAllTemplates().catch(error => {
  console.error(chalk.red.bold('\nAn unexpected error occurred during the script execution:'));
  console.error(error);
  process.exit(1);
});