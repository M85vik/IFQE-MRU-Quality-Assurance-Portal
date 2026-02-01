/**
 * @fileoverview Service for anonymous feedback API calls.
 * @module services/feedbackService
 */

import api from '../api/axiosConfig';

/**
 * Submit anonymous feedback (all roles except developer)
 * @param {Object} data - Feedback data
 * @param {string} data.message - Feedback message
 * @param {string} data.category - Feedback category (bug, feature, improvement, other)
 */
export const submitFeedback = async ({ message, category }) => {
  const response = await api.post('/feedback', { message, category });
  return response.data;
};

/**
 * Get all feedback (developer only)
 */
export const getAllFeedback = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

/**
 * Get feedback statistics (developer only)
 */
export const getFeedbackStats = async () => {
  const response = await api.get('/feedback/stats');
  return response.data;
};
