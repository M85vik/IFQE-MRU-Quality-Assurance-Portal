// ifqe-portal-frontend5/src/services/submissionWindowService.js

import apiClient from '../api/axiosConfig';

export const getSubmissionWindows = async () => {
  try {
    const { data } = await apiClient.get('/submission-windows');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch submission windows.');
  }
};

export const createSubmissionWindow = async (windowData) => {
    try {
        const { data } = await apiClient.post('/submission-windows', windowData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not create submission window.');
    }
};

export const updateSubmissionWindow = async (id, windowData) => {
    try {
        const { data } = await apiClient.put(`/submission-windows/${id}`, windowData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not update submission window.');
    }
};

export const deleteSubmissionWindow = async (id) => {
    try {
        const { data } = await apiClient.delete(`/submission-windows/${id}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not delete submission window.');
    }
};