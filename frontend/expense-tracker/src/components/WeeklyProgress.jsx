import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';
import LoadingSpinner from './LoadingSpinner';

const WeeklyProgress = () => {
  const [weeklyProgress, setWeeklyProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWeeklyProgress();
  }, []);

  const fetchWeeklyProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch fixed expenses data to calculate real weekly expenses
      const [fixedExpResponse, weeklyProgressResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.FIXEDEXPENSE.GET_ALL_FIXEDEXPENSES),
        axiosInstance.get(API_PATHS.DASHBOARD.GET_WEEKLY_PROGRESS)
      ]);
      
      const fixedExpenses = fixedExpResponse.data;
      const weeklyProgressData = weeklyProgressResponse.data;
      
      if (!weeklyProgressData || !weeklyProgressData.data) {
        throw new Error('Invalid response format from server');
      }
      
      // Calculate real weekly expenses from fixed expenses
      const realFixedWeeklyExpenses = calculateRealWeeklyExpenses(fixedExpenses);
      
      const processedData = processWeeklyProgressData({
        ...weeklyProgressData.data,
        fixedWeeklyExpenses: realFixedWeeklyExpenses
      });
      
      setWeeklyProgress(processedData);
      
    } catch (err) {
      console.error('Error fetching weekly progress:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch weekly progress data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const calculateRealWeeklyExpenses = (expenses) => {
    // Ensure expenses is an array
    if (!Array.isArray(expenses)) {
      if (expenses && typeof expenses === 'object' && expenses.expenses) {
        expenses = expenses.expenses;
      } else if (expenses && typeof expenses === 'object' && expenses.data) {
        expenses = expenses.data;
      } else {
        expenses = [];
      }
    }

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return 0;
    }

    // Calculate weekly expenses using the same logic as FixedEx.jsx
    const weeklyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.periodStart);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      })
      .reduce((sum, expense) => {
        if (!expense || !expense.items || !Array.isArray(expense.items)) {
          return sum;
        }
        return sum + expense.items.reduce((itemSum, item) => {
          if (!item || typeof item.quantity !== 'number' || typeof item.unitPrice !== 'number') {
            return itemSum;
          }
          return itemSum + (item.quantity * item.unitPrice);
        }, 0);
      }, 0);

    return weeklyExpenses;
  };

  const processWeeklyProgressData = (data) => {
    // Ensure we have valid data structure
    if (!data) return null;
    
    // Validate and sanitize the data
    const processed = {
      fixedWeeklyExpenses: parseFloat(data.fixedWeeklyExpenses) || 0,
      weeklyIncome: parseFloat(data.weeklyIncome) || 0,
      remainingAmount: parseFloat(data.remainingAmount) || 0,
      progressPercentage: Math.min(Math.max(parseFloat(data.progressPercentage) || 0, 0), 100),
      status: data.status || 'neutral',
      lastUpdated: new Date().toISOString()
    };
    
    // Calculate derived values
    processed.remainingAmount = processed.weeklyIncome - processed.fixedWeeklyExpenses;
    
    if (processed.fixedWeeklyExpenses > 0) {
      processed.progressPercentage = Math.min(
        ((processed.weeklyIncome / processed.fixedWeeklyExpenses) * 100),
        100
      );
    }
    
    // Determine status based on remaining amount
    if (processed.remainingAmount > 0) {
      processed.status = 'surplus';
    } else if (processed.remainingAmount < 0) {
      processed.status = 'deficit';
    } else {
      processed.status = 'neutral';
    }
    
    return processed;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeeklyProgress();
  };

  const handleRetry = () => {
    fetchWeeklyProgress();
  };

  if (loading && !refreshing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading weekly progress...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">Error Loading Weekly Progress</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weeklyProgress) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center text-gray-500">
          <p>No weekly progress data available</p>
        </div>
      </div>
    );
  }

  const { fixedWeeklyExpenses, weeklyIncome, remainingAmount, progressPercentage, status } = weeklyProgress;

  const getStatusColor = () => {
    switch (status) {
      case 'surplus':
        return 'text-green-600';
      case 'deficit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'surplus':
        return 'bg-green-500';
      case 'deficit':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-2 rounded hover:bg-gray-100 transition ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Refresh data"
        >
          <svg 
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Fixed Weekly Expenses</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(fixedWeeklyExpenses)}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Weekly Income</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(weeklyIncome)}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className={`text-xl font-bold ${getStatusColor()}`}>
              {formatCurrency(remainingAmount)}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {status === 'surplus' ? '✅ Surplus' : status === 'deficit' ? '⚠️ Deficit' : '⏳ Neutral'}
          </span>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB'
  }).format(amount);
};

export default WeeklyProgress;
