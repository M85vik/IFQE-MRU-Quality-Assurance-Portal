// models/SchoolResult.js
const mongoose = require("mongoose");

const SchoolResultSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  schoolName: { type: String, required: true },
  criteria: [
    {
      sNo: Number,
      code: String,
      name: String,
      weightage: Number,
      maxMarks: Number,
      marksAwarded: Number,
      percentage: Number,
      weightedScore: Number,
    },
  ],
  finalScore: {
    totalWeightedScore: Number,
    outOf: Number
  }
},
{ timestamps: true });

module.exports = mongoose.model("SchoolResult", SchoolResultSchema);
