import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';

export const dashboardService = {
  // Get comprehensive dashboard data
  async getDashboardData() {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_DATA);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get dashboard charts data
  async getDashboardCharts(period = 'month') {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DASHBOARD_CHARTS}?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      throw error;
    }
  },

  // Get quick stats
  async getQuickStats() {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_QUICK_STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  },

  // Get dashboard summary (legacy)
  async getDashboardSummary() {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_SUMMARY);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get weekly progress (fixed weekly expenses vs weekly income)
  async getWeeklyProgress() {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_WEEKLY_PROGRESS);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      throw error;
    }
  }
};
