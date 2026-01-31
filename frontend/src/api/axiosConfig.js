import axios from 'axios';
import useAuthStore from '../store/authStore';




const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) throw new Error("Base Url environment variable not loaded.")
const apiClient = axios.create({

  baseURL: `${apiUrl}/api`,
  withCredentials: true,  // Enables Cookies To Be Sent/Recieved
});



// Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().userInfo?.token;
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// We no longer need the request interceptor since we are using HTTP-only cookies which the browser manages automatically.

// Response Interceptor (For Handling 401 Errors Globally)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns 401 (Unauthorized), Log The User Out
    if (error.response && error.response.status === 401) {
      // Just clear the state. Protected routes (PrivateRoute) will handle 
      // the redirect internally without refreshing the browser.
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;