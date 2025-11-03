import axios from 'axios';
import useAuthStore from '../store/authStore';




const apiUrl = import.meta.env.VITE_API_URL;

if(!apiUrl) throw new Error("Base Url environment variable not loaded.")
const apiClient = axios.create({
  
  baseURL:`${apiUrl}/api`
});



// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().userInfo?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired or invalid. Logging out.");
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;