/**
 * @fileoverview This file defines the API routes for the core Submission resource.
 * It includes endpoints for creating, retrieving, updating, and managing the entire
 * submission workflow. Access to these routes is tightly controlled based on user roles
 * (department, qaa, admin, superuser) using the 'protect' and 'authorize' middleware.
 * @module routes/submissionRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import controller functions that contain the complex business logic for the submission workflow.
const {
  createSubmission,
  getMyDepartmentSubmissions,
  getSubmissionsForReview,
  getApprovedSubmissions,
  getSubmissionById,
  updateSubmission,
  getSubmissionsForSuperuser,
  submitAppeal,
} = require('../controllers/submissionController');

// Import middleware for authentication (protect) and role-based authorization (authorize).
const { protect, authorize } = require('../middleware/authMiddleware');


// --- Route Definitions ---

// Defines routes for the base '/api/submissions' endpoint.
router.route('/')
  /**
   * @route   POST /api/submissions
   * @desc    Creates a new, empty submission for the logged-in department user.
   * @access  Private (Department role only)
   */
  .post(protect, authorize('department'), createSubmission);
  
// Defines a specific route for a department user to get their own submissions.
router.route('/mydepartment')
  /**
   * @route   GET /api/submissions/mydepartment
   * @desc    Retrieves all submissions belonging to the currently logged-in user's department.
   * @access  Private (Department role only)
   */
  .get(protect, authorize('department'), getMyDepartmentSubmissions);

// Defines a route for QAA/Admin users to view the queue of submissions awaiting review.
router.route('/queue/review')
    /**
     * @route   GET /api/submissions/queue/review
     * @desc    Gets the queue of submissions that are 'Under Review' and ready for a QAA member.
     * @access  Private (QAA and Admin roles)
     */
    .get(protect, authorize('qaa', 'admin'), getSubmissionsForReview);

// Defines a route to view all finalized/approved submissions.
router.route('/approved')
    /**
     * @route   GET /api/submissions/approved
     * @desc    Gets all submissions that are fully completed and approved.
     * @access  Private (QAA and Admin roles)
     */
    .get(protect, authorize('qaa', 'admin'), getApprovedSubmissions);    

// Defines a route for the Superuser to view their queue of pending actions.
router.route('/queue/superuser')
    /**
     * @route   GET /api/submissions/queue/superuser
     * @desc    Gets the queue of submissions awaiting final action (approval or appeal review).
     * @access  Private (Superuser role only)
     */
    .get(protect, authorize('superuser'), getSubmissionsForSuperuser);

// Defines the route for submitting an appeal for a specific submission.
router.route('/:id/appeal')
    /**
     * @route   POST /api/submissions/:id/appeal
     * @desc    Submits an appeal for a specific completed submission.
     * @access  Private (Department role only)
     */
    .post(protect, authorize('department'), submitAppeal);

// Defines routes for interacting with a single submission by its unique ID.
// Note: More complex authorization is handled inside these controller functions.
router.route('/:id')
  /**
   * @route   GET /api/submissions/:id
   * @desc    Retrieves a single submission by its unique ID.
   * @access  Private. Authorization is handled within the controller to allow both the
   *          submission owner (department) and reviewers (qaa, admin, superuser) to access it.
   */
  .get(protect, getSubmissionById)
  /**
   * @route   PUT /api/submissions/:id
   * @desc    Updates a single submission. The specific update logic is highly role-dependent.
   * @access  Private. The `updateSubmission` controller contains complex authorization logic
   *          to determine what fields a user can modify based on their role and the submission's status.
   */
  .put(protect, updateSubmission);

// Export the configured router to be mounted in the main server file.
module.exports = router;