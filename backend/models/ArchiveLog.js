const mongoose = require('mongoose');

const archiveLogSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
  submissionTitle: String,
  school: String,
  department: String,

  fileCount: Number,
  timeTakenSec: Number,
  archiveKey: String,
   zipSizeMB:{type:Number, default:0},

  createdBy: String, // optional: user role/name
}, { timestamps: true });

module.exports = mongoose.model("ArchiveLog", archiveLogSchema);
