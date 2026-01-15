const Submission = require('../models/Submission');
const { createSubmissionArchive } = require('../utils/archiveService');

const generateArchive = async (req, res) => {
   
 const { submissionId } = req.params;


  const submission = await Submission.findById(submissionId)
    .populate('school department');

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  if (!['Completed', 'Appeal Closed'].includes(submission.status)) {
    return res.status(403).json({
      message: 'Archive allowed only after final approval'
    });
  }

  if (submission.archive?.status === 'In Progress') {
    return res.status(409).json({
      message: 'Archive already in progress'
    });
  }

  // Mark as in progress
  submission.archive = {
    status: 'In Progress',
    generatedBy: req.user.role
  };
  await submission.save();

  try {
    const archiveKey = await createSubmissionArchive(submission);

    submission.archive.status = 'Completed';
    submission.archive.fileKey = archiveKey;
    submission.archive.generatedAt = new Date();
    submission.archive.error = null;

    await submission.save();

    return res.json({
      message: 'Archive generated successfully',
      archiveKey
    });

  } catch (err) {
    submission.archive.status = 'Failed';
    submission.archive.error = err.message;
    await submission.save();

    return res.status(500).json({
      message: 'Archive generation failed'
    });
  }
};

module.exports = { generateArchive };
