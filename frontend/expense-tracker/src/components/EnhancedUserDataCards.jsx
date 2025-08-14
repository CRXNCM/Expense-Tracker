import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';
import DataCard from './DataCard';

const EnhancedUserDataCards = () => {
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

      const [incomeResponse, expenseResponse, mealPlanResponse, dailyLogResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE),
        axiosInstance.get(API_PATHS.MEALPLAN.GET_MEALPLAN),
        axiosInstance.get(API_PATHS.DAILYLOG.GET_ALL_LOGS)
      ]);

      setUserData({
        income: incomeResponse.data.income || [],
        expenses: expenseResponse.data.expenses || [],
        mealPlans: mealPlanResponse.data.mealPlans || [],
        dailyLogs: dailyLogResponse.data.dailyLogs || []
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
      <DataCard
        title="Income"
        icon="💰"
        count={userData.income.length}
        total={userData.income.reduce((sum, item) => sum + (item.amount || 0), 0)}
        color="text-green-600"
        recentItems={userData.income.slice(0, 3).map(item => ({
          name: item.source,
          amount: item.amount
        }))}
      />

      {/* Expense Card */}
      <DataCard
        title="Expenses"
        icon="💸"
        count={userData.expenses.length}
        total={userData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0)}
        color="text-red-600"
        recentItems={userData.expenses.slice(0, 3).map(item => ({
          name: item.description,
          amount: item.amount
        }))}
      />

      {/* Meal Plan Card */}
      <DataCard
        title="Meal Plans"
        icon="🍽️"
        count={userData.mealPlans.length}
        total={userData.mealPlans.filter(plan => plan.meals?.length > 0).length}
        color="text-orange-600"
        recentItems={userData.mealPlans.slice(0, 3).map(item => ({
          name: item.date,
          amount: item.calories
        }))}
        itemLabel="active plans"
      />

      {/* Daily Log Card */}
      <DataCard
        title="Daily Logs"
        icon="📊"
        count={userData.dailyLogs.length}
        total={userData.dailyLogs.filter(log => log.completed).length}
        color="text-blue-600"
        recentItems={userData.dailyLogs.slice(0, 3).map(item => ({
          name: item.date,
          amount: item.tasks?.length || 0
        }))}
        itemLabel="completed logs"
      />

      {/* Summary Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">Total Income</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(userData.income.reduce((sum, item) => sum + (item.amount || 0), 0))}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-700">Total Expenses</h4>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(userData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0))}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">Net Balance</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  userData.income.reduce((sum, item) => sum + (item.amount || 0), 0) -
                  userData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDataCards;
