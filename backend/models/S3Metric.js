const mongoose = require("mongoose");

const s3MetricSchema = new mongoose.Schema({
  operation: { type: String, enum: ["PUT", "GET", "DELETE"], required: true },
  fileSizeMB: { type: Number, default: 0 },
  fileKey: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
},{ timestamps: true });

module.exports = mongoose.model("S3Metric", s3MetricSchema);
