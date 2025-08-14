import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axioInstance';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import DataCard from '../../components/DataCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import BulkTable from '../../components/BulkTable';
import FixedExpenseForm from '../../components/FixedExpenseForm';
import FixedExpenseList from '../../components/FixedExpenseList';
import FixedExpenseSummary from '../../components/FixedExpenseSummary';
import { toast } from 'react-toastify';

const FixedEx = () => {
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodType, setPeriodType] = useState('Weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchFixedExpenses();
  }, [periodType, selectedDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(amount)
  }

  const fetchFixedExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(API_PATHS.FIXEDEXPENSE.GET_ALL_FIXEDEXPENSES);
      
      const expenses = response.data.data || response.data;
      setFixedExpenses(expenses);
      const processed = processFixedExpenseData(expenses);
      setProcessedData(processed);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching fixed expenses data:', err);
      setError(err.response?.data?.message || 'Failed to fetch fixed expenses data');
      setLoading(false);
      toast.error('Failed to load expenses');
    }
  };

  const processFixedExpenseData = (expenses) => {
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return {
        totalExpenses: 0,
        monthlyExpenses: 0,
        weeklyExpenses: 0,
        todayExpenses: 0,
        expensesByCategory: [],
        recentExpenses: [],
        totalItems: 0
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toDateString();

    let totalExpenses = 0;
    let totalItems = 0;
    const categoryMap = {};

    expenses.forEach(expense => {
      const expenseTotal = expense.totalAmount || 0;
      totalExpenses += expenseTotal;
      totalItems += expense.items?.length || 1;

      const category = expense.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expenseTotal;
    });

    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.periodStart);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + (expense.totalAmount || 0), 0);

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
      .reduce((sum, expense) => sum + (expense.totalAmount || 0), 0);

    const todayExpenses = expenses
      .filter(expense => new Date(expense.periodStart).toDateString() === today)
      .reduce((sum, expense) => sum + (expense.totalAmount || 0), 0);

    const recentExpenses = expenses
      .sort((a, b) => new Date(b.createdAt || b.periodStart) - new Date(a.createdAt || a.periodStart))
      .slice(0, 5)
      .map(expense => ({
        ...expense,
        totalAmount: expense.totalAmount || 0
      }));

    const expensesByCategory = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalExpenses) * 100)
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalExpenses,
      monthlyExpenses,
      weeklyExpenses,
      todayExpenses,
      expensesByCategory,
      recentExpenses,
      totalItems,
      allExpenses: expenses
    };
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      
      if (periodType === 'Weekly') {
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate.setDate(startDate.getDate() + 6);
      } else {
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
      }

      const payload = {
        ...expenseData,
        periodType,
        periodStart: startDate.toISOString(),
        periodEnd: endDate.toISOString()
      };

      if (editingExpense) {
        // Update fixed expense
        const response = await axiosInstance.put(
          API_PATHS.FIXEDEXPENSE.UPDATE_FIXEDEXPENSE(editingExpense._id),
          payload
        );
        
        setFixedExpenses(fixedExpenses.map(exp => 
          exp._id === editingExpense._id ? response.data.data : exp
        ));
        
        // Also update corresponding regular expense
        const totalAmount = expenseData.totalAmount || (expenseData.items?.reduce((sum, item) => sum + (item.unitPrice * (item.quantity || 1)), 0) || 0);
        const regularExpensePayload = {
          description: expenseData.description || expenseData.items?.[0]?.name || 'Fixed Expense',
          amount: totalAmount,
          date: startDate.toISOString().split('T')[0],
          category: expenseData.category || 'Fixed Expense',
          icon: '📅'
        };
        
        // Note: For editing, we would need to track the corresponding regular expense ID
        // For now, we'll create a new one to ensure consistency
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, regularExpensePayload);
        
        toast.success('Expense updated successfully');
      } else {
        // Create fixed expense
        const response = await axiosInstance.post(
          API_PATHS.FIXEDEXPENSE.ADD_FIXEDEXPENSE,
          payload
        );
        
        setFixedExpenses([...fixedExpenses, response.data.data]);
        
        // Create corresponding regular expense
        const totalAmount = expenseData.totalAmount || (expenseData.items?.reduce((sum, item) => sum + (item.unitPrice * (item.quantity || 1)), 0) || 0);
        const regularExpensePayload = {
          description: expenseData.description || expenseData.items?.[0]?.name || 'Fixed Expense',
          amount: totalAmount,
          date: startDate.toISOString().split('T')[0],
          category: expenseData.category || 'Fixed Expense',
          icon: '📅'
        };
        
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, regularExpensePayload);
        
        toast.success('Expense added successfully');
      }
      
      setShowForm(false);
      setEditingExpense(null);
      fetchFixedExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axiosInstance.delete(API_PATHS.FIXEDEXPENSE.DELETE_FIXEDEXPENSE(expenseId));
      setFixedExpenses(fixedExpenses.filter(exp => exp._id !== expenseId));
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
  };

  const handleRefresh = () => {
    fetchFixedExpenses();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="FixedEx">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading fixed expenses data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="FixedEx">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-10">
          <h3 className="text-red-800 font-semibold">Error Loading Fixed Expenses</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="FixedEx">
      <div className="my-5 mx-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Fixed Expenses Management</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Period Controls */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handlePeriodTypeChange('Weekly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    periodType === 'Weekly'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => handlePeriodTypeChange('Monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    periodType === 'Monthly'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
              </div>
              
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {processedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DataCard 
              title="Total Fixed Expenses" 
              count={formatCurrency(processedData.totalExpenses)}
              total={processedData.totalExpenses}
              icon="💰"
              color="text-blue-600"
              itemLabel="expenses"
            />
            <DataCard 
              title="Monthly Expenses" 
              count={formatCurrency(processedData.monthlyExpenses)}
              total={processedData.monthlyExpenses}
              icon="📅"
              color="text-green-600"
              itemLabel="monthly"
            />
            <DataCard 
              title="Weekly Expenses" 
              count={formatCurrency(processedData.weeklyExpenses)}
              total={processedData.weeklyExpenses}
              icon="📊"
              color="text-purple-600"
              itemLabel="weekly"
            />
            <DataCard 
              title="Total Items" 
              count={processedData.totalItems}
              total={processedData.totalItems}
              icon="📦"
              color="text-orange-600"
              itemLabel="items"
            />
          </div>
        )}

        {/* Fixed Expense Summary */}
        <FixedExpenseSummary 
          expenses={fixedExpenses}
          loading={loading}
        />

        {/* Bulk Add */}
        <BulkTable
          columns={[
            { key: "category", label: "Category", type: "select", options: [
              "Rent/Mortgage",
              "Utilities",
              "Insurance",
              "Subscriptions",
              "Transportation",
              "Phone/Internet",
              "Healthcare",
              "Education",
              "Childcare",
              "Loan Payments",
              "Savings/Investments",
              "Other"
            ], required: true },
            { key: "description", label: "Description", type: "text", required: true },
            { key: "amount", label: "Amount (ETB)", type: "number", required: true },
            { key: "frequency", label: "Frequency", type: "select", options: [
              "Monthly",
              "Weekly",
              "Bi-weekly",
              "Quarterly",
              "Yearly",
              "One-time"
            ], required: true },
            { key: "startDate", label: "Start Date", type: "date", required: true },
            { key: "endDate", label: "End Date", type: "date", required: false },
            { key: "notes", label: "Notes", type: "text", required: false }
          ]}
          onAddAll={async (rows) => {
            try {
              const formattedRows = rows.map(row => ({
                category: row.category,
                periodType: row.frequency === "One-time" ? "Once" : row.frequency,
                periodStart: row.startDate,
                periodEnd: row.endDate || null,
                items: [{
                  name: row.description,
                  quantity: 1,
                  unitPrice: parseFloat(row.amount) || 0,
                  notes: row.notes || ""
                }]
              }));

              console.log('Sending to API:', formattedRows);
              
              for (const expense of formattedRows) {
                // Create fixed expense
                const response = await axiosInstance.post(API_PATHS.FIXEDEXPENSE.ADD_FIXEDEXPENSE, expense);
                console.log('Fixed Expense API Response:', response);
                
                // Create corresponding regular expense
                const regularExpensePayload = {
                  description: row.description,
                  amount: parseFloat(row.amount) || 0,
                  date: row.startDate,
                  category: row.category,
                  icon: '📅'
                };
                
                await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, regularExpensePayload);
              }

              alert(`${formattedRows.length} fixed expenses and corresponding regular expenses added successfully!`);
              fetchFixedExpenses();
            } catch (error) {
              console.error('Error adding fixed expenses:', error);
              if (error.response) {
                console.error('Error response:', error.response.data);
                alert(`Failed to add fixed expenses: ${error.response.data?.message || error.message}`);
              } else {
                alert('Failed to add fixed expenses. Please check your connection and try again.');
              }
            }
          }}
          placeholderText="Add your fixed/recurring expenses in bulk..."
        />

        {/* Expense List */}
        <FixedExpenseList
          expenses={fixedExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />

        {/* Form Modal */}
        {showForm && (
          <FixedExpenseForm
            expense={editingExpense}
            periodType={periodType}
            selectedDate={selectedDate}
            onSave={handleSaveExpense}
            onClose={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}

        {fixedExpenses.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Fixed Expenses Found</h3>
            <p className="text-gray-600">You haven't added any fixed expenses yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FixedEx;
