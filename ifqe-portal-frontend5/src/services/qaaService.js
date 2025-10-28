import apiClient from '../api/axiosConfig';

/**
 * Fetches submissions for the review queue, with optional filtering.
 * @param {object} filters - An object containing filters like { academicYear, school, department }
 */
export const getReviewQueue = async (filters = {}) => {
  try {
    const { data } = await apiClient.get('/submissions/queue/review', {
      params: filters // Pass filters as query parameters
    }); 
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch review queue.');
  }
};

/**
 * Updates a submission with review scores, remarks, and a new status.
 * @param {string} submissionId - The ID of the submission to update.
 * @param {object} reviewData - The data containing updated partB and/or status.
 */
export const submitReview = async (submissionId, reviewData) => {
    try {
        const { data } = await apiClient.put(`/submissions/${submissionId}`, reviewData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not submit review.');
    }
}