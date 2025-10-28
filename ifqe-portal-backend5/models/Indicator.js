/**
 * @fileoverview Defines the Mongoose schema for an Indicator.
 * An Indicator represents a single metric or item to be assessed in a submission.
 * It includes scoring rubrics, guidelines, and other metadata.
 * @module models/Indicator
 */

const mongoose = require('mongoose');

/**
 * @description A sub-schema for defining a single level of a scoring rubric.
 * This is not a model itself but is embedded within the IndicatorSchema.
 * {_id: false} prevents Mongoose from creating a unique _id for each rubric detail.
 */
const RubricDetailSchema = new mongoose.Schema({
  score: { type: Number },
  description: { type: String },
}, { _id: false });

const IndicatorSchema = new mongoose.Schema({
  /** A unique code identifying the indicator (e.g., "1.1.1"). */
  indicatorCode: { type: String, required: true, unique: true },
  /** The full title or question for the indicator. */
  title: { type: String, required: true },
  /** The parent criterion this indicator belongs to (e.g., "1.1"). */
  criterionCode: { type: String, required: true },
  /** The parent sub-criterion, if applicable. */
  subCriterionCode: { type: String },
  /** A flag to determine if an external evidence link is mandatory for this indicator. */
  requiresEvidenceLink: { type: Boolean, default: false },
  /** An object containing the scoring rubric for this indicator, broken down by performance levels. */
  rubric: {
    excellent: RubricDetailSchema,
    veryGood: RubricDetailSchema,
    satisfactory: RubricDetailSchema,
    needsImprovement: RubricDetailSchema,
    notSatisfactory: RubricDetailSchema,
  },
  /**
   * Guidelines and instructions for the department user on how to fill out this indicator.
   */
  guidelines: {
    text: [String],
    // Mongoose.Schema.Types.Mixed allows for flexible data types (e.g., a string or an array of strings).
    // Note: Mongoose cannot automatically detect changes to Mixed types, so they must be marked manually if modified.
    formula: { type: mongoose.Schema.Types.Mixed }, // Can be a String or an Array
    remarks: { type: mongoose.Schema.Types.Mixed }  // Can be a String or an Array
  },
  /** The S3 file key for an optional template file associated with this indicator. */
  templateFileKey: { type: String },
});

// Creates and exports the Indicator model.
module.exports = mongoose.model('Indicator', IndicatorSchema);