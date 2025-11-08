import apiClient from '../api/axiosConfig';

// ... (getters and create functions remain the same)
export const getMyDepartmentSubmissions = async () => {
  try {
    const { data } = await apiClient.get('/submissions/mydepartment');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch submissions.');
  }
};

export const createNewSubmission = async (submissionData) => {
  try {
    const { data } = await apiClient.post('/submissions', submissionData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not create new submission.');
  }
};


// --- CHANGES START: Added new function to submit an appeal ---
/**
 * Submits an appeal for a completed submission.
 * @param {string} submissionId - The ID of the submission to appeal.
 * @param {object} appealData - The data for the appeal, containing an array of indicators.
 */
export const submitAppeal = async (submissionId, appealData) => {
  try {
    const { data } = await apiClient.post(`/submissions/${submissionId}/appeal`, appealData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not submit appeal.');
  }
};
// --- CHANGES END ---