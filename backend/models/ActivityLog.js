const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: String
  },
  action: { type: String, required: true }, // e.g., "Deleted submission", "Uploaded file"
  details: { type: String }, // e.g., "Submission ID: 6911e33a8410f2b43457a00b"
  academicYear: { type: String, required: true }, // e.g., "2024-25"
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
