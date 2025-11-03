import apiClient from '../api/axiosConfig';

export const fetchAllIndicators = async () => {
  try {
    const { data } = await apiClient.get('/indicators');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch report structure.');
  }
};