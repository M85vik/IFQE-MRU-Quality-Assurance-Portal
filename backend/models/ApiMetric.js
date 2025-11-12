const mongoose = require('mongoose');

const apiMetricSchema = new mongoose.Schema({
  route: { type: String, required: true },
  method: { type: String, required: true },
  statusCode: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  responseTimeMs: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('ApiMetric', apiMetricSchema);
