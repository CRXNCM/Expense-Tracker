import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';

const UserDataCards = () => {
  const [userData, setUserData] = useState({
    income: [],
    expenses: [],
    mealPlans: [],
    dailyLogs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all user data in parallel
      const [incomeResponse, expenseResponse, mealPlanResponse, dailyLogResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE),
        axiosInstance.get(API_PATHS.MEALPLAN.GET_MEALPLAN),
        axiosInstance.get(API_PATHS.DAILYLOG.GET_ALL_LOGS)
      ]);

      setUserData({
        income: Array.isArray(incomeResponse.data) ? incomeResponse.data : incomeResponse.data.income || [],
        expenses: Array.isArray(expenseResponse.data) ? expenseResponse.data : expenseResponse.data.expenses || [],
        mealPlans: Array.isArray(mealPlanResponse.data) ? mealPlanResponse.data : mealPlanResponse.data.mealPlans || [],
        dailyLogs: Array.isArray(dailyLogResponse.data) ? dailyLogResponse.data : dailyLogResponse.data.dailyLogs || []
      });

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchUserData}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Income Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Income</h3>
          <span className="text-green-500 text-2xl">💰</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-green-600">
            {userData.income.length}
          </p>
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-lg font-semibold text-green-700">
            {formatCurrency(userData.income.reduce((sum, item) => sum + (item.amount || 0), 0))}
          </p>
          <p className="text-xs text-gray-500">Total Amount</p>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Expenses</h3>
          <span className="text-red-500 text-2xl">💸</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-red-600">
            {userData.expenses.length}
          </p>
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-lg font-semibold text-red-700">
            {formatCurrency(userData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0))}
          </p>
          <p className="text-xs text-gray-500">Total Amount</p>
        </div>
      </div>

      {/* Meal Plan Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Meal Plans</h3>
          <span className="text-orange-500 text-2xl">🍽️</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-orange-600">
            {userData.mealPlans.length}
          </p>
          <p className="text-sm text-gray-600">Total Plans</p>
          <p className="text-lg font-semibold text-orange-700">
            {userData.mealPlans.filter(plan => plan.meals?.length > 0).length}
          </p>
          <p className="text-xs text-gray-500">Active Plans</p>
        </div>
      </div>

      {/* Daily Log Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daily Logs</h3>
          <span className="text-blue-500 text-2xl">📊</span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-blue-600">
            {userData.dailyLogs.length}
          </p>
          <p className="text-sm text-gray-600">Total Logs</p>
          <p className="text-lg font-semibold text-blue-700">
            {userData.dailyLogs.filter(log => log.completed).length}
          </p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {/* Detailed Data Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Income */}
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Recent Income</h4>
              <div className="space-y-2">
                {userData.income.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">{item.source}</span>
                    <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                {userData.income.length === 0 && (
                  <p className="text-sm text-gray-500">No income records found</p>
                )}
              </div>
            </div>

            {/* Recent Expenses */}
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Recent Expenses</h4>
              <div className="space-y-2">
                {userData.expenses.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">{item.description}</span>
                    <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                {userData.expenses.length === 0 && (
                  <p className="text-sm text-gray-500">No expense records found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataCards;
