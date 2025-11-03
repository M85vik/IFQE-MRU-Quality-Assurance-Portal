import apiClient from '../api/axiosConfig';

export const getSuperuserQueue = async () => {
  try {
    const { data } = await apiClient.get('/submissions/queue/superuser');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch superuser queue.');
  }
};