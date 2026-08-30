const fs = require('fs');
const path = require('path');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mime = require('mime-types');
const crypto = require('crypto');
const s3Client = require('../config/s3Client');
const Submission = require('../models/Submission');
const S3Metric = require('../models/S3Metric');

const isLocalDev = !process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'dummy_key';
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure local uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const logS3Metric = async (operation, user, fileKey, fileSizeBytes = 0) => {
  try {
    const fileSizeMB = +(fileSizeBytes / (1024 * 1024)).toFixed(2);
    await S3Metric.create({
      operation,
      userId: user._id,
      fileKey,
      fileSizeMB
    });
  } catch (err) {
    console.error("Failed to record S3 metric:", err.message);
  }
};

const generateFileName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

/**
 * @desc    Generate an upload URL (S3 pre-signed or local endpoint fallback)
 * @route   POST /api/files/upload-url
 * @access  Private (Department users)
 */
const getUploadUrl = async (req, res) => {
  const { submissionId, indicatorCode, partACode, fileType, isEvidenceLink } = req.body;
  const user = req.user;

  // 1. Authorization & Validation
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  // Security: User must belong to the same department as the submission
  if (submission.department.toString() !== user.department?.toString()) {
    return res.status(403).json({ message: 'Not authorized to upload to this submission' });
  }

  // Business Rule: Files can only be uploaded when the submission is in 'Draft' state
  if (submission.status !== 'Draft') {
    return res.status(403).json({ message: 'Cannot upload files to a submitted or approved report.' });
  }

  // 2. Generate a Unique File Key
  const fileName = generateFileName();
  const fileExtension = mime.extension(fileType) || 'bin';
  let key;
  const basePath = `evidence/${submission.academicYear}/${submission.school}/${submission.department}`;

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

  // Local fallback if dummy AWS credentials are in use
  if (isLocalDev) {
    await logS3Metric("PUT", user, key);
    return res.json({
      uploadUrl: `/api/files/local-upload?fileKey=${encodeURIComponent(key)}`,
      fileKey: key
    });
  }

  // S3 presigned URL for production
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    await logS3Metric("PUT", user, key);
    res.json({ uploadUrl, fileKey: key });
  } catch (error) {
    console.error("Error generating S3 upload URL, falling back to local storage:", error.message);
    res.json({
      uploadUrl: `/api/files/local-upload?fileKey=${encodeURIComponent(key)}`,
      fileKey: key
    });
  }
};

/**
 * @desc    Handle local file upload (used in development/fallback)
 * @route   PUT /api/files/local-upload
 * @access  Private (Authenticated users)
 */
const handleLocalUpload = async (req, res) => {
  try {
    const { fileKey } = req.query;
    if (!fileKey) {
      return res.status(400).json({ message: 'Missing fileKey' });
    }

    const filePath = path.join(UPLOADS_DIR, fileKey.replace(/\//g, '_'));
    fs.writeFileSync(filePath, req.body);

    res.status(200).json({ message: 'File uploaded successfully locally.' });
  } catch (error) {
    console.error('Local upload error:', error);
    res.status(500).json({ message: 'Local upload failed.' });
  }
};

/**
 * @desc    Generate a download URL for a file
 * @route   GET /api/files/download-url
 * @access  Private
 */
const getDownloadUrl = async (req, res) => {
  const { fileKey, submissionId } = req.query;
  const user = req.user;

  if (!fileKey) {
    return res.status(400).json({ message: 'Missing fileKey' });
  }

  if (fileKey.startsWith('templates/')) {
    if (isLocalDev) {
      return res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
    }
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition: 'attachment',
    });

    try {
      const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      await logS3Metric("GET", user, fileKey);
      return res.json({ downloadUrl });
    } catch (error) {
      return res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
    }
  }

  let submission = null;
  if (submissionId) {
    submission = await Submission.findById(submissionId);
  }

  if (!submission) {
    submission = await Submission.findOne({
      $or: [
        { 'archiveFileKey': fileKey },
        { 'partA.summaryFileKey': fileKey },
        { 'partB.criteria.subCriteria.indicators.fileKey': fileKey },
        { 'partB.criteria.subCriteria.indicators.evidenceLinkFileKey': fileKey },
        { 'partB.criteria.subCriteria.indicators.evidenceFileKeys': fileKey }
      ]
    });
  }

  if (!submission) {
    // Fallback: If submission document is not found or not yet saved, check if fileKey path belongs to user's department
    const parts = fileKey.split('/');
    const keyDeptId = parts[3];
    const isOwnerByPath = user.department && keyDeptId === user.department.toString();
    const isReviewer = ['qaa', 'admin', 'superuser'].includes(user.role);

    if (isOwnerByPath || isReviewer) {
      if (isLocalDev) {
        await logS3Metric("GET", user, fileKey);
        return res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
      }
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
      });
      try {
        const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        await logS3Metric("GET", user, fileKey);
        return res.json({ downloadUrl });
      } catch (error) {
        return res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
      }
    }

    return res.status(404).json({ message: 'File not associated with any submission.' });
  }

  const isOwner = submission.department.toString() === user.department?.toString();
  const isReviewer = ['qaa', 'admin', 'superuser'].includes(user.role);

  if (!isOwner && !isReviewer) {
    return res.status(403).json({ message: 'Not authorized to access this file.' });
  }

  if (isLocalDev) {
    await logS3Metric("GET", user, fileKey);
    return res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    await logS3Metric("GET", user, fileKey);
    res.json({ downloadUrl });
  } catch (error) {
    res.json({ downloadUrl: `/api/files/local-download?fileKey=${encodeURIComponent(fileKey)}` });
  }
};

/**
 * @desc    Serve local file for download/preview
 * @route   GET /api/files/local-download
 * @access  Private
 */
const handleLocalDownload = async (req, res) => {
  try {
    const { fileKey } = req.query;
    if (!fileKey) return res.status(400).send('Missing fileKey');

    const filePath = path.join(UPLOADS_DIR, fileKey.replace(/\//g, '_'));
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }

    // Fallback template sample if template file is requested
    if (fileKey.startsWith('templates/')) {
      const templatePath = path.join(__dirname, '../templates', path.basename(fileKey));
      if (fs.existsSync(templatePath)) {
        return res.sendFile(templatePath);
      }
    }

    res.status(404).send('File not found');
  } catch (error) {
    res.status(500).send('Error serving file');
  }
};

/**
 * @desc    Delete a file
 * @route   DELETE /api/files/delete-file
 * @access  Private
 */
const deleteFile = async (req, res) => {
  const { fileKey } = req.body;
  const user = req.user;

  const submission = await Submission.findOne({
    $or: [
      { 'partA.summaryFileKey': fileKey },
      { 'partB.criteria.subCriteria.indicators.fileKey': fileKey },
      { 'partB.criteria.subCriteria.indicators.evidenceLinkFileKey': fileKey },
      { 'partB.criteria.subCriteria.indicators.evidenceFileKeys': fileKey }
    ],
    department: user.department,
    status: 'Draft'
  });

  if (!submission) {
    return res.status(403).json({ message: 'Not authorized to delete this file or submission is not editable.' });
  }

  // Delete local copy if exists
  const localPath = path.join(UPLOADS_DIR, fileKey.replace(/\//g, '_'));
  if (fs.existsSync(localPath)) {
    try { fs.unlinkSync(localPath); } catch {}
  }

  if (!isLocalDev) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    });
    try {
      await s3Client.send(command);
      await logS3Metric("DELETE", user, fileKey);
    } catch (err) {
      console.warn("S3 delete failed:", err.message);
    }
  }

  res.json({ message: 'File deleted successfully.' });
};

module.exports = { getUploadUrl, getDownloadUrl, deleteFile, handleLocalUpload, handleLocalDownload };