import React, { useState, useEffect } from 'react';
import { endpointTotalsService } from '../../services/endpointTotalsService';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataCard from '../../components/DataCard';
import './EndpointTotalsTestPage.css';

const EndpointTotalsTestPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const allData = await endpointTotalsService.getAllEndpointTotals();
      setData(allData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number || 0);
  };

  const calculateTotals = () => {
    if (!data) return null;

    const {
      dashboardData,
      dashboardSummary,
      incomes,
      expenses,
      expenseSummary,
      fixedExpenses,
      mealPlans,
      mealStats,
      dailyLogs
    } = data;

    // Calculate totals from available data
    const totalIncome = Array.isArray(incomes) 
      ? incomes.reduce((sum, income) => sum + (income.amount || 0), 0)
      : 0;

    const totalExpenses = Array.isArray(expenses) 
      ? expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      : 0;

    const totalFixedExpenses = Array.isArray(fixedExpenses?.data || fixedExpenses) 
      ? (fixedExpenses?.data || fixedExpenses).reduce((sum, expense) => {
          const itemsTotal = Array.isArray(expense.items) 
            ? expense.items.reduce((itemSum, item) => itemSum + (item.amount || 0), 0)
            : 0;
          return sum + itemsTotal;
        }, 0)
      : 0;

    const totalMealCost = Array.isArray(mealPlans?.data || mealPlans)
      ? (mealPlans?.data || mealPlans).reduce((sum, meal) => sum + (meal.totalCost || 0), 0)
      : 0;

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      incomeCount: Array.isArray(incomes) ? incomes.length : 0,
      expenseCount: Array.isArray(expenses) ? expenses.length : 0,
      fixedExpenseCount: Array.isArray(fixedExpenses?.data || fixedExpenses) ? (fixedExpenses?.data || fixedExpenses).length : 0,
      mealPlanCount: Array.isArray(mealPlans?.data || mealPlans) ? (mealPlans?.data || mealPlans).length : 0,
      dailyLogCount: Array.isArray(dailyLogs) ? dailyLogs.length : 0,
      totalRecords: 0 // Will be calculated below
    };
  };

  if (loading) {
    return (
      <div className="test-page-container">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading endpoint totals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page-container">
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={fetchAllData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();
  const totalRecords = totals.incomeCount + totals.expenseCount + totals.fixedExpenseCount + totals.mealPlanCount + totals.dailyLogCount;

  return (
    <div className="test-page-container">
      <div className="test-page-header">
        <h1>📊 Endpoint Totals Test Page</h1>
        <p>Comprehensive overview of all backend endpoint totals</p>
      </div>

      <div className="totals-grid">
        {/* Summary Cards */}
            
        <section className="summary-section">
          <h2>📈 Summary Overview</h2>
          <div className="summary-cards">
            <DataCard
              title="Total Income"
              total={formatCurrency(totals.totalIncome)}
              count={formatNumber(totals.incomeCount)}
              itemLabel="income records"

              icon="💰"
              color="success"
            />
            <DataCard
              title="Total Expenses"
              total={formatCurrency(totals.totalExpenses)}
              count={formatNumber(totals.expenseCount)}
              itemLabel="expense records"

              icon="💸"
              color="danger"
            />
            <DataCard
              title="Total Balance"
              total={formatCurrency(totals.totalBalance)}
              count={formatNumber(totals.balanceCount)}
              itemLabel="balance records"

              icon="⚖️"
              color="info"
            />
            <DataCard
              title="Total Records"
              total={formatNumber(totalRecords)}
              count={formatNumber(totals.totalRecords)}
              itemLabel="total records"

              icon="📊"
              color="primary"
            />
          </div>
        </section>

        {/* Entity Counts */}
        <section className="counts-section">
          <h2>📋 Entity Counts</h2>
          <div className="counts-grid">
            <DataCard
              title="Income Records"
              total={formatNumber(totals.incomeCount)}
              icon="💵"
              color="success"
            />
            <DataCard
              title="Expense Records"
              total={formatNumber(totals.expenseCount)}
              icon="🧾"
              color="danger"
            />
            <DataCard
              title="Daily Logs"
              total={formatNumber(totals.dailyLogCount)}
              icon="📅"
              color="info"
            />
            <DataCard
              title="Meal Plans"
              total={formatNumber(totals.mealPlanCount)}
              icon="🍽️"
              color="warning"
            />
            <DataCard
              title="Fixed Expenses"
              total={formatNumber(totals.fixedExpenseCount)}
              icon="🏠"
              color="secondary"
            />
          </div>
        </section>

        {/* Financial Breakdown */}
        <section className="financial-section">
          <h2>💰 Financial Breakdown</h2>
          <div className="financial-grid">
            <div className="financial-card">
              <h3>Dashboard Summary</h3>
              {data.dashboardSummary && (
                <>
                  <p>Total Income: {formatCurrency(data.dashboardSummary.totalIncome)}</p>
                  <p>Total Expenses: {formatCurrency(data.dashboardSummary.totalExpenses)}</p>
                  <p>Total Balance: {formatCurrency(data.dashboardSummary.totalBalance)}</p>
                </>
              )}
              
            </div>
            <div className="financial-card">
              <h3>Expense Summary</h3>
              {data.expenseSummary && (
                <>
                  <p>Total Expenses: {formatCurrency(data.expenseSummary.totalAmount)}</p>
                  <p>Total Records: {formatNumber(data.expenseSummary.totalExpenses)}</p>
                </>
              )}
            </div>
            <div className="financial-card">
              <h3>Meal Statistics</h3>
              {data.mealStats && (
                <>
                  <p>Total Meals: {formatNumber(data.mealStats.totalMeals || 0)}</p>
                  <p>Total Cost: {formatCurrency(data.mealStats.totalCost || 0)}</p>
                  <p>Total Calories: {formatNumber(data.mealStats.totalCalories || 0)}</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Category Breakdowns */}
        <section className="categories-section">
          <h2>📊 Category Breakdowns</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>Expense Categories</h3>
              {data.expenseSummary?.categoryTotals && Object.entries(data.expenseSummary.categoryTotals).map(([category, amount], index) => (
                <div key={index} className="category-item">
                  <span>{category}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
            <div className="category-card">
              <h3>Top Expense Categories</h3>
              {data.dashboardData?.data?.analytics?.topExpenseCategories?.slice(0, 5).map((category, index) => (
                <div key={index} className="category-item">
                  <span>{category._id}</span>
                  <span>{formatCurrency(category.total)}</span>
                </div>
              ))}
            </div>
            <div className="category-card">
              <h3>Top Income Sources</h3>
              {data.dashboardData?.data?.analytics?.topIncomeSources?.slice(0, 5).map((source, index) => (
                <div key={index} className="category-item">
                  <span>{source._id}</span>
                  <span>{formatCurrency(source.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default EndpointTotalsTestPage;
