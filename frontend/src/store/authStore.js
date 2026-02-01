import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// We need to remove 'persist' middleware since we are now no longer using localStorage.
// Create channel outside to persist across store updates
const authChannel = new BroadcastChannel('auth_channel');

const useAuthStore = create(
  (set) => {
    // Listen for global logout events from other tabs
    authChannel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        sessionStorage.removeItem('isActiveSession'); // Clear own key
        set({ userInfo: null }); // Clear own state
      }
    };

    return {
      userInfo: null,
      // Updated Login : Accepts User Data (No Token Needed)
      login: (userData) => set({ userInfo: userData }),

      logout: () => {
        // 1. Notify other tabs to log out
        authChannel.postMessage({ type: 'LOGOUT' });

        // 2. Clear own state
        sessionStorage.removeItem('isActiveSession');
        set({ userInfo: null });
      },
    };
  }
);

export default useAuthStore;