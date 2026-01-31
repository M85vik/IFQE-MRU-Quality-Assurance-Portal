/**
 * @fileoverview Defines the Mongoose schema for anonymous Feedback.
 * Stores only the user's role for anonymity - no user reference.
 * @module models/Feedback
 */

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  /**
   * The role of the user who submitted the feedback.
   * This is the only identifier stored to maintain anonymity.
   */
  role: {
    type: String,
    enum: ['department', 'qaa', 'admin', 'superuser'],
    required: true,
  },
  /**
   * The feedback message content.
   */
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  /**
   * Optional category to help organize feedback.
   */
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'other'],
    default: 'other',
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
