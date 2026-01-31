/**
 * @fileoverview Controller for anonymous feedback operations.
 * Handles submission by all roles (except developer) and retrieval by developers only.
 * @module controllers/feedbackController
 */

const Feedback = require('../models/Feedback');

/**
 * @desc    Submit anonymous feedback (role only, no user identity)
 * @route   POST /api/feedback
 * @access  Private (all roles except developer)
 */
const submitFeedback = async (req, res) => {
  try {
    const { message, category } = req.body;
    const userRole = req.user.role;

    // Developers cannot submit feedback
    if (userRole === 'developer') {
      return res.status(403).json({ message: 'Developers cannot submit feedback.' });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Feedback message is required.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ message: 'Feedback message cannot exceed 2000 characters.' });
    }

    // Create feedback with only role - no user reference for anonymity
    const feedback = await Feedback.create({
      role: userRole,
      message: message.trim(),
      category: category || 'other',
    });

    res.status(201).json({ message: 'Feedback submitted anonymously. Thank you!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

/**
 * @desc    Get all feedback (anonymous - shows only role)
 * @route   GET /api/feedback
 * @access  Private (developer only)
 */
const getAllFeedback = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only developers can view feedback
    if (userRole !== 'developer') {
      return res.status(403).json({ message: 'Access denied. Developer role required.' });
    }

    const feedback = await Feedback.find()
      .select('role message category createdAt')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback.' });
  }
};

/**
 * @desc    Get feedback statistics
 * @route   GET /api/feedback/stats
 * @access  Private (developer only)
 */
const getFeedbackStats = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'developer') {
      return res.status(403).json({ message: 'Access denied. Developer role required.' });
    }

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byRole: {
            $push: '$role'
          },
          byCategory: {
            $push: '$category'
          }
        }
      }
    ]);

    const roleStats = await Feedback.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      total: stats[0]?.total || 0,
      byRole: roleStats,
      byCategory: categoryStats,
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ message: 'Failed to fetch feedback stats.' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
};
