import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';

export const adminService = {
  // Get all users (superadmin only)
  getAllUsers: async () => {
    const response = await axiosInstance.get(API_PATHS.ADMIN.USERS);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    const response = await axiosInstance.put(API_PATHS.ADMIN.USER_ROLE(userId), { role: newRole });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(API_PATHS.ADMIN.USER_DELETE(userId));
    return response.data;
  }
};
