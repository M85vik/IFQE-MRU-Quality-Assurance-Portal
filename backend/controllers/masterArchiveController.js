const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3Client');
const MasterArchive = require('../models/MasterArchive');
const { createMasterArchive } = require('../utils/masterArchiveService');

// ------------------------------------------------------------------
// POST /archives/master/:academicYear
// Trigger master archive generation (admin only)
// ------------------------------------------------------------------
const generateMasterArchive = async (req, res) => {
  const { academicYear } = req.params;

  // Check if already in progress
  let record = await MasterArchive.findOne({ academicYear });

  if (record && record.status === 'In Progress') {
    return res.status(409).json({ message: 'Master archive generation already in progress for this year.' });
  }

  // Upsert the record to "In Progress"
  if (!record) {
    record = await MasterArchive.create({
      academicYear,
      status: 'In Progress',
      generatedBy: req.user.role,
    });
  } else {
    record.status = 'In Progress';
    record.error = null;
    record.generatedBy = req.user.role;
    await record.save();
  }

  // Respond immediately — work runs in the background
  res.json({ message: 'Master archive generation started.', status: 'In Progress' });

  // Background processing (fire-and-forget, errors caught internally)
  (async () => {
    try {
      const result = await createMasterArchive(academicYear, req.user.role);

      if (!result.archiveKey) {
        record.status = 'Failed';
        record.error = 'No approved submissions or files found for this year.';
        await record.save();
        return;
      }

      record.status = 'Completed';
      record.fileKey = result.archiveKey;
      record.submissionCount = result.submissionCount;
      record.fileCount = result.fileCount;
      record.zipSizeMB = result.zipSizeMB;
      record.generatedAt = new Date();
      record.error = null;
      await record.save();

    } catch (err) {
      console.error(`[MasterArchiveCtrl] Background generation failed:`, err.message);
      record.status = 'Failed';
      record.error = err.message;
      await record.save();
    }
  })();
};

// ------------------------------------------------------------------
// GET /archives/master/:academicYear/download
// Returns signed download URL for completed master archive
// ------------------------------------------------------------------
const downloadMasterArchive = async (req, res) => {
  const { academicYear } = req.params;

  const record = await MasterArchive.findOne({ academicYear });

  if (!record || record.status !== 'Completed' || !record.fileKey) {
    return res.status(404).json({ message: 'Master archive not available for this year.' });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: record.fileKey,
      ResponseContentDisposition: `attachment; filename="Master_Archive_${academicYear}.zip"`,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    return res.json({ downloadUrl });

  } catch (error) {
    console.error('Master archive download error:', error);
    return res.status(500).json({ message: 'Could not generate download URL.' });
  }
};

// ------------------------------------------------------------------
// GET /archives/master/:academicYear/status
// Returns current status of the master archive for polling
// ------------------------------------------------------------------
const getMasterArchiveStatus = async (req, res) => {
  const { academicYear } = req.params;
  const record = await MasterArchive.findOne({ academicYear });

  if (!record) {
    return res.json({
      academicYear,
      status: 'Not Generated',
      fileKey: null,
      submissionCount: 0,
      fileCount: 0,
      zipSizeMB: 0,
    });
  }

  return res.json({
    academicYear: record.academicYear,
    status: record.status,
    fileKey: record.fileKey || null,
    submissionCount: record.submissionCount || 0,
    fileCount: record.fileCount || 0,
    zipSizeMB: record.zipSizeMB || 0,
    generatedAt: record.generatedAt || null,
    error: record.error || null,
  });
};

module.exports = { generateMasterArchive, downloadMasterArchive, getMasterArchiveStatus };
