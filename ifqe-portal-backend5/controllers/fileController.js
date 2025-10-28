/**
 * @fileoverview This controller manages direct interactions with AWS S3 using pre-signed URLs.

 * @module controllers/fileController
 */

// --- AWS SDK v3 Imports ---
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// --- Node.js Built-in & Local Imports ---
const crypto = require('crypto'); // Used for generating secure random filenames.
const s3Client = require('../config/s3Client'); // The configured S3 client instance.
const Submission = require('../models/Submission');
const SubmissionWindow = require('../models/SubmissionWindow');

/**
 * Generates a cryptographically random string to be used as a filename.
 * This prevents filename collisions and avoids security issues with user-provided names.
 * @param {number} [bytes=16] - The number of random bytes to generate.
 * @returns {string} A random hexadecimal string.
 */
const generateFileName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

/**
 * @desc    Generate a pre-signed URL for a direct client-side S3 upload.
 * @route   POST /api/s3/upload-url
 * @access  Private (Department users)
 * @body    {string} submissionId - The ID of the submission to upload to.
 * @body    {string} fileType - The MIME type of the file (e.g., 'application/pdf').
 * @body    {string} [indicatorCode] - The code of the indicator the file is for.
 * @body    {string} [partACode] - A special code for Part A uploads (e.g., 'SUMMARY').
 * @body    {boolean} [isEvidenceLink] - True if this is for the 'evidence link' field of an indicator.
 * @returns {json} 200 - { uploadUrl, fileKey }
 */
const getUploadUrl = async (req, res) => {
  const { submissionId, indicatorCode, partACode, fileType, isEvidenceLink } = req.body;
  const user = req.user;

  // --- 1. Authorization & Validation ---
  // A series of checks to ensure the user is allowed to perform this action.

  // Find the submission this upload is intended for.
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  // Business Rule: Ensure the submission window for this academic year is open.
  // We must check for windowType: 'Submission' to differentiate from the 'Appeal' window.
  const windowOpen = await SubmissionWindow.findOne({ 
    academicYear: submission.academicYear,
    windowType: 'Submission' 
  });
  const now = new Date();
  if (!windowOpen || !(now >= windowOpen.startDate && now <= windowOpen.endDate)) {
      return res.status(403).json({ message: 'Cannot upload files because the submission window is closed.' });
  }

  // Security: User must belong to the same department as the submission.
  if (submission.department.toString() !== user.department.toString()) {
    return res.status(403).json({ message: 'Not authorized to upload to this submission' });
  }

  // Business Rule: Files can only be uploaded when the submission is in 'Draft' state.
  if (submission.status !== 'Draft') {
    return res.status(403).json({ message: 'Cannot upload files to a submitted or approved report.' });
  }

  // --- 2. Generate a Unique File Key (Path in S3) ---
  const fileName = generateFileName();
  const fileExtension = fileType.split('/')[1] || 'bin'; // Extract extension from MIME type.
  
  let key;
  // Define a structured base path in S3 for better organization.
  const basePath = `evidence/${submission.academicYear}/${submission.school}/${submission.department}`;

  // Construct the final key based on where the file belongs.
  if (indicatorCode) {
    if (isEvidenceLink) {
      key = `${basePath}/${indicatorCode}/evidence-link/${fileName}.${fileExtension}`;
    } else {
      key = `${basePath}/${indicatorCode}/main/${fileName}.${fileExtension}`;
    }
  } else if (partACode === 'SUMMARY') {
    key = `${basePath}/partA-summary/${fileName}.${fileExtension}`;
  } else {
    return res.status(400).json({ message: 'A valid indicator or part A code is required.' });
  }

  // --- 3. Create the S3 Command and Pre-sign it ---
  // The PutObjectCommand describes the upload we *intend* to perform.
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType, // Setting ContentType is crucial for browsers to handle the file correctly.
  });

  try {
    // getSignedUrl creates the temporary, secure URL. It's valid for 300 seconds (5 minutes).
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // --- 4. Send the URL and Key to the Client ---
    // The client will use 'uploadUrl' to PUT the file, and then send the 'fileKey' back
    // to another endpoint to be saved in the MongoDB submission document.
    res.json({ uploadUrl, fileKey: key });
  } catch (error) {
    console.error("Error generating S3 upload URL:", error);
    res.status(500).json({ message: 'Could not generate upload URL' });
  }
};

/**
 * @desc    Generate a pre-signed URL for secure, temporary access to a file.
 * @route   GET /api/s3/download-url
 * @access  Private (Department owners, QAA, Admin, Superuser)
 * @query   {string} fileKey - The unique S3 key of the file to download.
 * @returns {json} 200 - { downloadUrl }
 */
const getDownloadUrl = async (req, res) => {
  const { fileKey } = req.query;
  const user = req.user;

  // --- 1. Find the submission associated with the fileKey ---
  // This is a crucial security step. We find the submission to check permissions against it.
  // The $or query searches all possible locations within a submission document where the fileKey might be stored.
  const submission = await Submission.findOne({
    $or: [
      { 'archiveFileKey': fileKey },
      { 'partA.summaryFileKey': fileKey },
      { 'partB.criteria.subCriteria.indicators.fileKey': fileKey },
      { 'partB.criteria.subCriteria.indicators.evidenceLinkFileKey': fileKey }
    ]
  });

  if (!submission) {
    return res.status(404).json({ message: 'File not associated with any submission.' });
  }

  // --- 2. Authorization Check ---
  // A user can access the file if they own the submission or if they are a reviewer/admin.
  const isOwner = submission.department.toString() === user.department?.toString();
  const isReviewer = ['qaa', 'admin', 'superuser'].includes(user.role);

  if (!isOwner && !isReviewer) {
    return res.status(403).json({ message: 'Not authorized to access this file.' });
  }

  // --- 3. Create the S3 Command and Pre-sign it ---
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl });
  } catch (error) {
    console.error("Error generating S3 download URL:", error);
    res.status(500).json({ message: 'Could not generate download URL' });
  }
};

/**
 * @desc    Delete a file directly from S3.
 * @route   DELETE /api/s3/delete-file
 * @access  Private (Department users on their own 'Draft' submissions)
 * @body    {string} fileKey - The S3 key of the file to delete.
 * @returns {json} 200 - Success message.
 */
const deleteFile = async (req, res) => {
    const { fileKey } = req.body;
    const user = req.user;

    // --- 1. Security Check: Find the submission to verify ownership and editability ---
    // This single query is a powerful security check. It ensures the file exists in a submission that:
    // a) Belongs to the current user's department.
    // b) Is currently in 'Draft' status and therefore editable.
    const submission = await Submission.findOne({
      $or: [
        { 'partA.summaryFileKey': fileKey },
        { 'partB.criteria.subCriteria.indicators.fileKey': fileKey },
        { 'partB.criteria.subCriteria.indicators.evidenceLinkFileKey': fileKey }
      ],
      department: user.department,
      status: 'Draft'
    });

    if (!submission) {
        // If no submission is found, the user is not authorized or the submission is locked.
        return res.status(403).json({ message: 'Not authorized to delete this file or submission is not editable.' });
    }

    // --- 2. Execute the S3 Delete Command ---
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    });

    try {
        await s3Client.send(command);
        res.json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error("S3 Deletion Error:", error);
        res.status(500).json({ message: 'Could not delete file from storage.' });
    }
};






const getTemplateDownloadUrl = async (req, res) => {
  const { fileKey } = req.query;
  const user = req.user;

  // Ensure the user is authenticated by middleware; double-check here for safety
  if (!user) return res.status(401).json({ message: 'Authentication required.' });

  if (!fileKey || typeof fileKey !== 'string') {
    return res.status(400).json({ message: 'fileKey is required.' });
  }

  // This endpoint is only for templates
  if (!fileKey.startsWith('templates/')) {
    return res.status(400).json({ message: 'Invalid file key. Only template files can be downloaded from this endpoint.' });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Could not generate template download URL:', error);
    res.status(500).json({ message: 'Could not generate download URL' });
  }
};




// Export the controller functions.
module.exports = { getUploadUrl, getDownloadUrl, deleteFile , getTemplateDownloadUrl};