/**
 * @fileoverview Defines the Mongoose schema for a Department.
 * Each department is linked to a parent School.
 * @module models/Department
 */

const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  /**
   * The name of the department (e.g., "Computer Science").
   * This field is required and must be unique.
   */
  name: {
    type: String,
    required: true
  },
  /**
   * A reference to the parent School this department belongs to.
   * This establishes a relationship between the Department and School collections.
   */
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School', // Corresponds to the 'School' model
    required: true
  }
});

// Creates and exports the Department model.
module.exports = mongoose.model('Department', DepartmentSchema);