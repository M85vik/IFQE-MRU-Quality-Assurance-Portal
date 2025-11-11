/**
 * @fileoverview This file defines the API routes for managing Submission Windows.
 * These endpoints allow administrators to define the timeframes during which
 * departments can submit their reports or appeals.
 * All routes in this file are protected and restricted to users with the 'admin' role.
 * @module routes/submissionWindowRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import the controller functions that handle the CRUD logic for submission windows.
const {
    getSubmissionWindows,
    createSubmissionWindow,
    updateSubmissionWindow,
    deleteSubmissionWindow,
    getCurrentOpenWindow
} = require('../controllers/submissionWindowController');

// Import middleware for authentication and role-based authorization.
const { protect, authorize } = require('../middleware/authMiddleware');



router.get('/current', protect, getCurrentOpenWindow);


// --- Global Middleware for this Router ---

/**
 * The `.use()` method applies the specified middleware to ALL subsequent routes
 * defined in this file. This is an efficient and secure way to ensure that every
 * endpoint in this module is protected and only accessible by administrators.
 *
 * Middleware Chain Execution:
 * 1. `protect`: Verifies the JWT to ensure the user is logged in.
 * 2. `authorize('admin')`: Checks if the logged-in user has the 'admin' role.
 */
router.use(protect, authorize('admin'));


// --- Route Definitions ---

// Chains the GET and POST methods to the base route '/api/submission-windows'.
router.route('/')
    /**
     * @route   GET /api/submission-windows
     * @desc    Get all submission and appeal windows.
     * @access  Private (Admin only - enforced by router.use)
     */
    .get(getSubmissionWindows)
    /**
     * @route   POST /api/submission-windows
     * @desc    Create a new submission or appeal window.
     * @access  Private (Admin only - enforced by router.use)
     */
    .post(createSubmissionWindow);

// Chains the PUT and DELETE methods for routes that target a specific window by its ID.

router.route('/:id')
    /**
     * @route   PUT /api/submission-windows/:id
     * @desc    Update an existing submission window by its ID.
     * @access  Private (Admin only - enforced by router.use)
     */
    .put(updateSubmissionWindow)
    /**
     * @route   DELETE /api/submission-windows/:id
     * @desc    Delete a submission window by its ID.
     * @access  Private (Admin only - enforced by router.use)
     */
    .delete(deleteSubmissionWindow);


// Export the configured router to be mounted in the main server file.
module.exports = router;