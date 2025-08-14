import { formatCurrency, formatDate } from '../../utils/helper';
import { FaUser, FaEnvelope, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaDollarSign, FaChartLine, FaWallet, FaUtensils } from 'react-icons/fa';

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const UserProfile = () => {
    const location = useLocation();
    const { user: contextUser } = useContext(UserContext);
    const [displayedUser, setDisplayedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (hasFetched) return;
  
    try {
      setLoading(true);
      setError(null);
  
      // Fetch user info
      const userResponse = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
  
      if (userResponse.data.success && userResponse.data.user) {
        const user = userResponse.data.user;
  
        // Ensure username exists on user object, fallback to email or fullname if not
        const username = user.username || user.email?.split('@')[0] || user.fullname || 'Unknown';
  
        // Set user data including username explicitly
        setUserData({
          ...user,
          username,
        });
  
        setDisplayedUser(user);
        setHasFetched(true);
  
        // Fetch additional user data
        try {
          // Fetch user stats
          const statsResponse = await axiosInstance.get(API_PATHS.DASHBOARD.GET_QUICK_STATS);
          if (statsResponse.data.success) {
            setUserStats(statsResponse.data.data || { totalIncome: 0, totalExpenses: 0 });
          }
  
          // Fetch recent expenses
          const expensesResponse = await axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE);
          if (expensesResponse.data.success) {
            const expenseData = expensesResponse.data.data || [];
            setExpenses(Array.isArray(expenseData) ? expenseData.slice(0, 3) : []);
          }
  
          // Fetch recent incomes
          const incomesResponse = await axiosInstance.get(API_PATHS.INCOME.GET_INCOME);
          if (incomesResponse.data.success) {
            const incomeData = incomesResponse.data.data || [];
            setIncomes(Array.isArray(incomeData) ? incomeData.slice(0, 3) : []);
          }
  
          // Fetch daily logs
          const logsResponse = await axiosInstance.get(API_PATHS.DAILYLOG.GET_ALL_LOGS);
          if (logsResponse.data.success) {
            const logData = logsResponse.data.data || [];
            setDailyLogs(Array.isArray(logData) ? logData.slice(0, 3) : []);
          }
  
          // Fetch meal plans
          const mealPlansResponse = await axiosInstance.get(API_PATHS.MEALPLAN.GET_MEALPLAN);
          if (mealPlansResponse.data.success) {
            const mealData = mealPlansResponse.data.data || [];
            setMealPlans(Array.isArray(mealData) ? mealData.slice(0, 3) : []);
          }
  
        } catch (dataErr) {
          console.warn('Some additional data failed to load:', dataErr);
        }
  
      } else {
        throw new Error(userResponse.data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching user info:', err);
      setError(err.message || 'Failed to fetch user info');
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);
  

    useEffect(() => {
        if (!hasFetched && !displayedUser) {
            fetchUserData();
        }
    }, [fetchUserData, hasFetched, displayedUser]);

    useEffect(() => {
        if (!hasFetched && contextUser && !displayedUser) {
            setDisplayedUser(contextUser);
            setHasFetched(true);
            setLoading(false);
        }
    }, [contextUser, hasFetched, displayedUser]);

    const user = displayedUser || contextUser;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <DashboardLayout activeMenu="profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {userData?.profileImageUrl ? (
                  <img
                    src={userData.profileImageUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                    <FaUser className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <p className="text-blue-100">{userData?.email}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Member since {formatDate(userData?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="px-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{userData?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(userData?.dateOfBirth) || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{userData?.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUser className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-gray-900">{userData?.username || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{formatDate(userData?.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          {userStats && (
            <div className="px-6 py-6 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <FaDollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Income</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(userStats.totalIncome || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <FaWallet className="h-8 w-8 text-red-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(userStats.totalExpenses || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <FaChartLine className="h-8 w-8 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Net Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency((userStats.totalIncome || 0) - (userStats.totalExpenses || 0))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <FaUtensils className="h-8 w-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Meal Plans</p>
                      <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Section */}
          <div className="px-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            
            {/* Recent Expenses */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Expenses</h3>
              <div className="space-y-3">
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                    <span className="text-red-600 font-semibold">
                      -{formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <p className="text-gray-500">No expenses recorded yet</p>
                )}
              </div>
            </div>

            {/* Recent Incomes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Incomes</h3>
              <div className="space-y-3">
                {incomes.slice(0, 3).map((income) => (
                  <div key={income._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{income.source}</p>
                      <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      +{formatCurrency(income.amount)}
                    </span>
                  </div>
                ))}
                {incomes.length === 0 && (
                  <p className="text-gray-500">No incomes recorded yet</p>
                )}
              </div>
            </div>

            {/* Recent Daily Logs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Daily Logs</h3>
              <div className="space-y-3">
                {dailyLogs.slice(0, 3).map((log) => (
                  <div key={log._id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{formatDate(log.date)}</p>
                    <p className="text-sm text-gray-600">{log.notes || 'No notes'}</p>
                  </div>
                ))}
                {dailyLogs.length === 0 && (
                  <p className="text-gray-500">No daily logs recorded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
