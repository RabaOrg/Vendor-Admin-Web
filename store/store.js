import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      login: (token, user) => set({ isLoggedIn: true, token, user }),
      logOut: () => set({ isLoggedIn: false, token: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);


//  createCustomers: async (credentials) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await axiosInstance.post('/admin/create-user', credentials);
//           if (response.data) {
//             const { data } = response.data;
//             set({ isLoggedIn: true, token: response.data.token, loading: false });
           
//             return data;
//           } else {
//             throw new Error('Invalid response format');
//           }
//         } catch (error) {
//           set({ error: error.response?.data?.message || 'Authentication failed', loading: false });
//           toast.error(error.response?.data?.message || 'An unexpected error occurred');
//           console.error('Error in createCustomers:', error);
//           throw error;
//         }
//       },

//       createBusiness: async (id, credentials) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await axiosInstance.post(`/admin/create-user/${id}`, credentials);
//           if (response.data && response.data.data) {
//             const { data } = response.data;
//             set({ isLoggedIn: true, token: response.data.token, loading: false });
//             toast.success(data.message);
//             return data;
//           } else {
//             throw new Error('Invalid response format');
//           }
//         } catch (error) {
//           set({ error: error.response?.data?.message || 'Operation failed', loading: false });
//           toast.error(error.response?.data?.message || 'An unexpected error occurred');
//           console.error('Error in createBusiness:', error);
//           throw error;
//         }
//       },