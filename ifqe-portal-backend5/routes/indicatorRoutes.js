/**
 * @fileoverview This file defines the API routes for fetching Indicator data.
 * Indicators are the core assessment criteria for submissions.
 * @module routes/indicatorRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import the controller function that contains the logic for fetching indicators.
const { getAllIndicators } = require('../controllers/indicatorController');

// Import the 'protect' middleware to ensure a user is authenticated via JWT before accessing the route.
const { protect } = require('../middleware/authMiddleware');


// --- Route Definition ---

/**
 * @route   GET /api/indicators/
 * @desc    Get a list of all indicators in the system, sorted by their code.
 * @access  Private (Requires user to be authenticated)
 * 
 * Middleware Chain:
 * 1. `protect`: Verifies the user's JWT to ensure they are logged in.
 * 2. `getAllIndicators`: If authentication is successful, this controller function is executed.
 */
router.get('/', protect, getAllIndicators);


// Export the configured router to be mounted in the main server file (e.g., server.js).
module.exports = router;