import axiosInstance from '../utils/axioInstance';

const API_BASE_URL = '/api/v1/auth';

export const endpointTotalsService = {
  // Get dashboard comprehensive data
  getDashboardData: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/dashboard/data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get dashboard summary (legacy endpoint)
  getDashboardSummary: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/dashboard/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get all incomes
  getAllIncomes: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/income/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incomes:', error);
      throw error;
    }
  },

  // Get all expenses
  getAllExpenses: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/expense/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Get expense summary
  getExpenseSummary: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/expense/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense summary:', error);
      throw error;
    }
  },

  // Get all fixed expenses
  getAllFixedExpenses: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/fixedexpenses/getall`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fixed expenses:', error);
      throw error;
    }
  },

  // Get all meal plans
  getAllMealPlans: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/mealplan/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      throw error;
    }
  },

  // Get meal stats
  getMealStats: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/mealplan/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal stats:', error);
      throw error;
    }
  },

  // Get all daily logs
  getAllDailyLogs: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/dailylog/getUser`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      throw error;
    }
  },

  // Get all data for totals display with error handling
  getAllEndpointTotals: async () => {
    const results = {
      dashboardData: null,
      dashboardSummary: null,
      incomes: [],
      expenses: [],
      expenseSummary: null,
      fixedExpenses: [],
      mealPlans: [],
      mealStats: null,
      dailyLogs: [],
      errors: []
    };

    try {
      // Fetch dashboard data
      try {
        results.dashboardData = await endpointTotalsService.getDashboardData();
      } catch (error) {
        console.warn('Dashboard data endpoint not available:', error.message);
        results.errors.push('Dashboard data: ' + error.message);
      }

      // Fetch dashboard summary
      try {
        results.dashboardSummary = await endpointTotalsService.getDashboardSummary();
      } catch (error) {
        console.warn('Dashboard summary endpoint not available:', error.message);
        results.errors.push('Dashboard summary: ' + error.message);
      }

      // Fetch incomes
      try {
        results.incomes = await endpointTotalsService.getAllIncomes();
      } catch (error) {
        console.warn('Incomes endpoint not available:', error.message);
        results.errors.push('Incomes: ' + error.message);
      }

      // Fetch expenses
      try {
        results.expenses = await endpointTotalsService.getAllExpenses();
      } catch (error) {
        console.warn('Expenses endpoint not available:', error.message);
        results.errors.push('Expenses: ' + error.message);
      }

      // Fetch expense summary
      try {
        results.expenseSummary = await endpointTotalsService.getExpenseSummary();
      } catch (error) {
        console.warn('Expense summary endpoint not available:', error.message);
        results.errors.push('Expense summary: ' + error.message);
      }

      // Fetch fixed expenses
      try {
        results.fixedExpenses = await endpointTotalsService.getAllFixedExpenses();
      } catch (error) {
        console.warn('Fixed expenses endpoint not available:', error.message);
        results.errors.push('Fixed expenses: ' + error.message);
      }

      // Fetch meal plans
      try {
        results.mealPlans = await endpointTotalsService.getAllMealPlans();
      } catch (error) {
        console.warn('Meal plans endpoint not available:', error.message);
        results.errors.push('Meal plans: ' + error.message);
      }

      // Fetch meal stats
      try {
        results.mealStats = await endpointTotalsService.getMealStats();
      } catch (error) {
        console.warn('Meal stats endpoint not available:', error.message);
        results.errors.push('Meal stats: ' + error.message);
      }

      // Fetch daily logs
      try {
        results.dailyLogs = await endpointTotalsService.getAllDailyLogs();
      } catch (error) {
        console.warn('Daily logs endpoint not available:', error.message);
        results.errors.push('Daily logs: ' + error.message);
      }

      return results;
    } catch (error) {
      console.error('Unexpected error fetching endpoint totals:', error);
      results.errors.push('Unexpected: ' + error.message);
      return results;
    }
  }
};
