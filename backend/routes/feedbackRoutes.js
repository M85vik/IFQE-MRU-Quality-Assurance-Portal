/**
 * @fileoverview Routes for anonymous feedback system.
 * @module routes/feedbackRoutes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
} = require('../controllers/feedbackController');

// All routes require authentication
router.use(protect);

// POST /api/feedback - Submit anonymous feedback (all roles except developer)
router.post('/', submitFeedback);

// GET /api/feedback - Get all feedback (developer only)
router.get('/', getAllFeedback);

// GET /api/feedback/stats - Get feedback statistics (developer only)
router.get('/stats', getFeedbackStats);

module.exports = router;
