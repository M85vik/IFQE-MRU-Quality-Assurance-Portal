/**
 * @fileoverview Defines the Mongoose schema for a School.
 * A School is a top-level academic entity that contains multiple Departments.
 * @module models/School
 */

const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  /**
   * The name of the school (e.g., "School of Engineering").
   * This field is required and must be unique to prevent duplicate entries.
   */
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// Creates and exports the School model.
module.exports = mongoose.model('School', SchoolSchema);