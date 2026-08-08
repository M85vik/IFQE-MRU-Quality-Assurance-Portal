const mongoose = require('mongoose');

const MasterArchiveSchema = new mongoose.Schema({
  academicYear: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['Not Generated', 'In Progress', 'Completed', 'Failed'],
    default: 'Not Generated',
  },
  fileKey: { type: String },
  submissionCount: { type: Number, default: 0 },
  fileCount: { type: Number, default: 0 },
  zipSizeMB: { type: Number, default: 0 },
  generatedAt: { type: Date },
  generatedBy: { type: String },
  error: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MasterArchive', MasterArchiveSchema);
