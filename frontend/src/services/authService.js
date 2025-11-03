import apiClient from '../api/axiosConfig';

export const loginUser = async (email, password) => {
  try {
    const { data } = await apiClient.post('/users/login', { email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred during login.');
  }
};

export const registerUser = async (userData) => {
  try {
    const { data } = await apiClient.post('/users/register', userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred during registration.');
  }
};