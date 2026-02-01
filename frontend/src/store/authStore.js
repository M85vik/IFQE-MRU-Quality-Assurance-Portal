import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// We need to remove 'persist' middleware since we are now no longer using localStorage.
const useAuthStore = create(
  (set) => ({
    userInfo: null,
    // Updated Login : Accepts User Data (No Token Needed)
    login: (userData) => set({ userInfo: userData }),

    logout: () => {
      sessionStorage.removeItem('isActiveSession'); // Clear tab key
      set({ userInfo: null });
    },
  })
);

export default useAuthStore;