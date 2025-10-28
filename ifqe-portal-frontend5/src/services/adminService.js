import apiClient from '../api/axiosConfig';

export const getSchoolPerformanceData = async (year) => {
  try {
    const { data } = await apiClient.get(`/analytics/schools/${year}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch school performance data.');
  }
};

export const getApprovedSubmissions = async () => {
  try {
    const { data } = await apiClient.get('/submissions/approved');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch approved submissions.');
  }
};

export const getIndicatorComparisonData = async (year) => {
    try {
        const { data } = await apiClient.get(`/analytics/indicator-comparison/${year}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not fetch indicator comparison data.');
    }
};