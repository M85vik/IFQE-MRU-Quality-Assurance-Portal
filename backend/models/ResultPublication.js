const mongoose = require("mongoose");

const resultPublicationSchema = new mongoose.Schema({
  academicYear: { type: String, required: true, unique: true },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("ResultPublication", resultPublicationSchema);
