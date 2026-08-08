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

export const getCurrentWindow = async () => {
  try {
    const { data } = await apiClient.get('/submission-windows/current');
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Could not fetch current window');
  }
};

export const toggleSubmissionEnabled = async (id) => {
  try {
    const { data } = await apiClient.patch(`/submission-windows/${id}/toggle`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not toggle submission status.');
  }
};

export const getWindowStatus = async () => {
  try {
    const { data } = await apiClient.get('/submission-windows/status');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch window status.');
  }
};
