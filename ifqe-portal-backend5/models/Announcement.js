/**
 * @fileoverview Defines the Mongoose schema for an Announcement.
 * Announcements are used to display important information to all users on the dashboard.
 * @module models/Announcement
 */

const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    /** The category of the announcement, used for filtering or display styling. */
    category: {
        type: String,
        enum: ['Workshop', 'Deadline', 'System Update', 'Result'],
        required: true
    },
    /** The main title of the announcement. */
    title: {
        type: String,
        required: true
    },
    /** A short summary of the announcement, visible in list views. */
    summary: {
        type: String,
        required: true
    },
    /** The full content or body of the announcement. */
    details: {
        type: String
    },
    /** The date relevant to the announcement (e.g., event date, deadline date). Stored as a string for flexibility. */
    date: {
        type: String,
        required: true
    },
    /** A color code for the announcement card, used for frontend styling. */
    color: {
        type: String,
        enum: ['blue', 'red', 'gray'],
        required: true
    },
    /** A flag to control the visibility of the announcement. Can be used to activate/deactivate without deleting. */
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields.

// Creates and exports the Announcement model.
module.exports = mongoose.model('Announcement', AnnouncementSchema);