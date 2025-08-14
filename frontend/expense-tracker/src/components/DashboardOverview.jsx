import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';
import WeeklyProgress from './WeeklyProgress';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [fixedExpensesTotal, setFixedExpensesTotal] = useState(0);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real expense, income, and fixed expense data in parallel
      const [expenseResponse, incomeResponse, fixedExpenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE),
        axiosInstance.get(API_PATHS.INCOME.GET_INCOME),
        axiosInstance.get(API_PATHS.FIXEDEXPENSE.GET_ALL_FIXEDEXPENSES)
      ]);

      const expenseData = Array.isArray(expenseResponse.data) ? expenseResponse.data : expenseResponse.data?.data || [];
      const incomeData = Array.isArray(incomeResponse.data) ? incomeResponse.data : incomeResponse.data?.data || [];
      const fixedExpenseData = Array.isArray(fixedExpenseResponse.data) ? fixedExpenseResponse.data : fixedExpenseResponse.data?.data || [];

      setExpenses(expenseData);
      setIncomes(incomeData);
      setFixedExpenses(fixedExpenseData);

      // Calculate totals
      const regularExpensesTotal = expenseData.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
      const fixedExpensesTotal = fixedExpenseData.reduce((sum, expense) => {
        // Handle both totalAmount and amount fields
        const amount = Number(expense.totalAmount || expense.amount || 0);
        return sum + amount;
      }, 0);
      const totalExpenses = regularExpensesTotal + fixedExpensesTotal;
      const incomeTotal = incomeData.reduce((sum, income) => sum + (Number(income.amount) || 0), 0);

      setFixedExpensesTotal(fixedExpensesTotal);
      setTotalExpense(totalExpenses);
      setTotalIncome(incomeTotal);

      // Create dashboard data structure based on real data
      const dashboardData = createDashboardData(expenseData, incomeData, fixedExpenseData);
      setDashboardData(dashboardData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const createDashboardData = (expenses, incomes, fixedExpenses) => {
    // Calculate totals
    const regularExpensesTotal = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const fixedExpensesTotal = fixedExpenses.reduce((sum, expense) => {
      const amount = Number(expense.totalAmount || expense.amount || 0);
      return sum + amount;
    }, 0);
    const totalExpenses = regularExpensesTotal + fixedExpensesTotal;
    const incomeTotal = incomes.reduce((sum, income) => sum + (Number(income.amount) || 0), 0);

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(expense.amount) || 0;
      return acc;
    }, {});

    // Group incomes by source
    const incomesBySource = incomes.reduce((acc, income) => {
      const source = income.source || 'Other';
      if (!acc[source]) acc[source] = 0;
      acc[source] += Number(income.amount) || 0;
      return acc;
    }, {});

    // Create top expense categories
    const topExpenseCategories = Object.entries(expensesByCategory)
      .map(([category, total]) => ({ _id: category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Create top income sources
    const topIncomeSources = Object.entries(incomesBySource)
      .map(([source, total]) => ({ _id: source, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      summary: {
        totalIncome: incomeTotal,
        totalExpenses: totalExpenses,
        totalBalance: incomeTotal - totalExpenses
      },
      daily: {
        income: 0,
        expenses: 0,
        balance: 0
      },
      weekly: {
        income: 0,
        expenses: 0,
        balance: 0
      },
      monthly: {
        income: 0,
        expenses: 0,
        balance: 0
      },
      analytics: {
        topExpenseCategories,
        topIncomeSources
      },
      recentActivities: {
        dailyLogs: [],
        todayMeals: [],
        weeklyMealCount: 0
      }
    };
  };

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
        <span className="ml-3 text-gray-600">Loading real data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4 max-w-md mx-auto">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.734 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-red-800">Error Loading Data</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button 
            onClick={fetchRealData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { summary, daily, weekly, monthly, analytics } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4">
        <WeeklyProgress/>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
          <p className="text-sm text-gray-600">{incomes.length} income records</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
          <p className="text-sm text-gray-600">{expenses.length} regular expenses</p>
          {fixedExpensesTotal > 0 && (
            <p className="text-xs text-gray-500">+ {formatCurrency(fixedExpensesTotal)} fixed expenses</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800">Current Balance</h3>
          <p className={`text-3xl font-bold ${summary.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(summary.totalBalance)}
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Expense Categories</h3>
          <div className="space-y-3">
            {analytics.topExpenseCategories.length > 0 ? (
              analytics.topExpenseCategories.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{category._id}</span>
                  <span className="font-semibold text-red-600">{formatCurrency(category.total)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No expense categories found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Income Sources</h3>
          <div className="space-y-3">
            {analytics.topIncomeSources.length > 0 ? (
              analytics.topIncomeSources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{source._id}</span>
                  <span className="font-semibold text-green-600">{formatCurrency(source.total)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No income sources found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
