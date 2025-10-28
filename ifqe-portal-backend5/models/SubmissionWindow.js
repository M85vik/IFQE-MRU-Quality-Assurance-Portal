/**
 * @fileoverview Defines the Mongoose schema for a SubmissionWindow.
 * This model specifies the time frames during which departments can
 * submit their reports or appeals.
 * @module models/SubmissionWindow
 */

const mongoose = require('mongoose');

const SubmissionWindowSchema = new mongoose.Schema({
    /** The academic year this window applies to (e.g., "2023-2024"). */
    academicYear: {
        type: String,
        required: true,
    },
    /** The date and time when the submission window opens. */
    startDate: {
        type: Date,
        required: true
    },
    /** The date and time when the submission window closes. */
    endDate: {
        type: Date,
        required: true
    },
    /**
     * The type of window, allowing for separate submission and appeal periods
     * within the same academic year.
     */
    windowType: {
        type: String,
        enum: ['Submission', 'Appeal'], // Can only be one of these two values
        default: 'Submission',
        required: true,
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields.

/**
 * A compound unique index.
 * This ensures that for any given academicYear, there can be only ONE 'Submission' window
 * and only ONE 'Appeal' window, preventing duplicate window types for the same year.
 */
SubmissionWindowSchema.index({ academicYear: 1, windowType: 1 }, { unique: true });

// Creates and exports the SubmissionWindow model.
module.exports = mongoose.model('SubmissionWindow', SubmissionWindowSchema);