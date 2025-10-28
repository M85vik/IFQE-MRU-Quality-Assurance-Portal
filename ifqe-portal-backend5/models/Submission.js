/**
 * @fileoverview Defines the Mongoose schema for a Submission.
 * This is the core model of the application, representing a complete report
 * submitted by a department for a specific academic year. It is a complex,
 * nested structure containing all parts of the submission.
 * @module models/Submission
 */

const mongoose = require('mongoose');

// --- SUB-SCHEMAS (Used for embedding within the main SubmissionSchema) ---
// Note: {_id: false} is used to prevent Mongoose from creating ObjectId for these sub-documents.

/** A single item within Part A of the submission. */
const PartAItemSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  fileKey: { type: String }, // S3 key for an uploaded file
}, { _id: false });

/** Data for a single indicator within Part B of the submission. */
const IndicatorSubmissionSchema = new mongoose.Schema({
  indicatorCode: { type: String, required: true },
  title: { type: String, required: true },
  fileKey: { type: String },             // S3 key for the main evidence file
  evidenceLinkFileKey: { type: String }, // S3 key for an additional evidence link file
  selfAssessedScore: { type: Number },   // Score given by the department
  reviewScore: { type: Number },         // Score given by the QAA reviewer
  reviewRemark: { type: String },        // Comment from the QAA reviewer
  finalScore: { type: Number },          // Final score after superuser approval
  superuserRemark: { type: String },     // Final comment from the superuser
}, { _id: false });

/** A container for all indicators belonging to a single sub-criterion in Part B. */
const SubCriteriaSubmissionSchema = new mongoose.Schema({
  subCriteriaCode: { type: String, required: true },
  title: { type: String, required: true },
  selfAssessedScore: { type: Number, default: 0 }, // Aggregated score from indicators
  reviewScore: { type: Number, default: 0 },       // Aggregated score from indicators
  remark: { type: String },
  superuserRemark: { type: String },
  indicators: [IndicatorSubmissionSchema], // Array of submitted indicator data
}, { _id: false });

/** A container for all sub-criteria belonging to a single criterion in Part B. */
const CriteriaSubmissionSchema = new mongoose.Schema({
  criteriaCode: { type: String, required: true },
  title: { type: String, required: true },
  selfAssessedScore: { type: Number, default: 0 },
  reviewScore: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  subCriteria: [SubCriteriaSubmissionSchema], // Array of submitted sub-criteria data
}, { _id: false });


// --- MAIN SUBMISSION SCHEMA ---

const SubmissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  submissionType: { type: String, enum: ['Annual', 'Mid-term', 'Special'], default: 'Annual' },
  archiveFileKey: { type: String }, // S3 key for a final archived version of the report
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  academicYear: { type: String, required: true },
  /**
   * The current status of the submission, tracking its progress through the review workflow.
   */
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Pending Final Approval', 'Completed', 'Appeal Submitted', 'Appeal Closed'],
    default: 'Draft',
  },
  /** Part A of the submission, containing general items. */
  partA: {
    items: [PartAItemSchema],
    remark: { type: String },
    summaryFileKey: { type: String },
  },
  /** Part B of the submission, containing the detailed criteria-based assessment. */
  partB: {
    criteria: [CriteriaSubmissionSchema],
  },
  /** An object to track the appeal process for this submission. */
  appeal: {
    status: {
      type: String,
      enum: ['Not Appealed', 'Submitted', 'Closed'],
      default: 'Not Appealed'
    },
    requestedOn: { type: Date }, // Timestamp when the appeal was submitted
    closedOn: { type: Date },    // Timestamp when the superuser closed the appeal
    indicators: [ // A list of specific indicators that are being appealed
      {
        _id: false,
        indicatorCode: String,
        departmentComment: String,         // Justification from the department for the appeal
        superuserDecisionComment: String // Final decision from the superuser
      }
    ]
  },
  /** A denormalized flag for quickly querying submissions that have an associated appeal. */
  hasAppealed: { type: Boolean, default: false },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields.

// Creates and exports the Submission model.
module.exports = mongoose.model('Submission', SubmissionSchema);