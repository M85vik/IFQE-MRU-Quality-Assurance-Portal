/**
 * @fileoverview This file defines the API routes for analytics and reporting endpoints.
 * All routes in this file are protected and require specific administrative or reviewer roles.
 * @module routes/analyticsRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import controller functions that contain the business logic for each route.
const { 
    getSchoolPerformance, 
    getDepartmentPerformance, 
    getIndicatorComparison 
} = require('../controllers/analyticsController');

// Import middleware for authentication and authorization.
const { protect, authorize } = require('../middleware/authMiddleware');


// --- Route Definitions ---

/**
 * @route   GET /api/analytics/schools/:year
 * @desc    Get the aggregated performance score for each school for a specific academic year.
 * @access  Private (Requires 'admin', 'qaa', or 'superuser' role)
 * 
 * Middleware Chain:
 * 1. `protect`: Ensures the user is logged in by verifying their JWT.
 * 2. `authorize(...)`: Checks if the logged-in user's role is one of the specified roles.
 * 3. `getSchoolPerformance`: If the above checks pass, the main controller logic is executed.
 */
router.get('/schools/:year', protect, authorize('admin', 'qaa', 'superuser'), getSchoolPerformance);

/**
 * @route   GET /api/analytics/departments/:schoolId/:year
 * @desc    Get the performance score for each department within a given school and academic year.
 * @access  Private (Requires 'admin', 'qaa', or 'superuser' role)
 */
router.get('/departments/:schoolId/:year', protect, authorize('admin', 'qaa', 'superuser'), getDepartmentPerformance);

/**
 * @route   GET /api/analytics/indicator-comparison/:year
 * @desc    Get a side-by-side comparison of how different schools scored on each indicator for a given year.
 * @access  Private (Requires 'admin', 'qaa', or 'superuser' role)
 */
router.get('/indicator-comparison/:year', protect, authorize('admin', 'qaa', 'superuser'), getIndicatorComparison);


// Export the configured router to be mounted in the main server file (e.g., server.js or app.js).
module.exports = router;