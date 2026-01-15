const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const s3Client = require('../config/s3Client');

const downloadArchive = async (req, res) => {
  const { submissionId } = req.params;
  const user = req.user;

  // --------------------------------------------------
  // 1. Validate submissionId
  // --------------------------------------------------
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  // --------------------------------------------------
  // 2. Fetch submission
  // --------------------------------------------------
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  // --------------------------------------------------
  // 3. Check archive existence
  // --------------------------------------------------
  if (
    !submission.archive ||
    submission.archive.status !== 'Completed' ||
    !submission.archive.fileKey
  ) {
    return res.status(404).json({
      message: 'Archive not available for this submission'
    });
  }

  // --------------------------------------------------
  // 4. Authorization
  // --------------------------------------------------
  const isOwner =
    submission.department?.toString() === user.department?.toString();

  const isPrivileged =
    ['admin', 'superuser', 'qaa'].includes(user.role);

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({
      message: 'Not authorized to download this archive'
    });
  }

  // --------------------------------------------------
  // 5. Generate signed URL
  // --------------------------------------------------
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: submission.archive.fileKey,
    ResponseContentDisposition: 'attachment'
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300
    });

    return res.json({ downloadUrl });

  } catch (error) {
    console.error('Archive download error:', error);
    return res.status(500).json({
      message: 'Could not generate archive download URL'
    });
  }
};

module.exports = { downloadArchive };
