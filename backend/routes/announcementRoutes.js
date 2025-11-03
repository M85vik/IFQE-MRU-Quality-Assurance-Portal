/**
 * @fileoverview This file defines the API routes for managing announcements.
 * A key feature of this file is the use of `router.use()` to apply security middleware
 * to all routes at once, ensuring that only administrators can access these endpoints.
 * @module routes/announcementRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import controller functions that contain the business logic for each route.
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');

// Import middleware for authentication (protect) and role-based authorization (authorize).
const { protect, authorize } = require('../middleware/authMiddleware');


// --- Global Middleware for this Router ---

/**

 * Middleware Chain Execution:
 * 1. `protect`: Verifies the JWT to ensure the user is logged in.
 * 2. `authorize('admin')`: Checks if the logged-in user has the 'admin' role.
 */
router.use(protect, authorize('admin'));


// --- Route Definitions ---

// This chains multiple HTTP methods (GET, POST) to the same base route ('/').
// This is a clean and organized way to define CRUD operations for a resource.
router.route('/')
  /**
   * @route   GET /api/announcements
   * @desc    Get all announcements.
   * @access  Private (Admin only - enforced by router.use)
   */
  .get(getAnnouncements)
  /**
   * @route   POST /api/announcements
   * @desc    Create a new announcement.
   * @access  Private (Admin only - enforced by router.use)
   */
  .post(createAnnouncement);

// This chains methods for routes that target a specific resource by its ID.
router.route('/:id')
  /**
   * @route   PUT /api/announcements/:id
   * @desc    Update an existing announcement by its ID.
   * @access  Private (Admin only - enforced by router.use)
   */
  .put(updateAnnouncement)
  /**
   * @route   DELETE /api/announcements/:id
   * @desc    Delete an announcement by its ID.
   * @access  Private (Admin only - enforced by router.use)
   */
  .delete(deleteAnnouncement);


// Export the configured router to be mounted in the main server file (e.g., server.js or app.js).
module.exports = router;