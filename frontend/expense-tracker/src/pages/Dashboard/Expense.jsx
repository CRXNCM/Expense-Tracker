import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import ExpenseOverview from './ExpenseOverview'
import AddExpenseModal from '../../components/AddExpenseModal'
import ExpenseDetailsModal from '../../components/ExpenseDetailsModal'
import ExpenseCard from '../../components/ExpenseCard'
import axiosInstance from '../../utils/axioInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Expense = () => {
  const [expenseData, setExpenseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    fetchExpenseData()
  }, [])

  const fetchExpenseData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch both regular and fixed expenses
      const [regularResponse, fixedResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE),
        axiosInstance.get(API_PATHS.FIXEDEXPENSE.GET_ALL_FIXEDEXPENSES)
      ])
      
      const regularExpenses = regularResponse.data || []
      const fixedExpenses = fixedResponse.data.data || fixedResponse.data || []
      
      // Convert fixed expenses to regular format for display
      const convertedFixedExpenses = fixedExpenses.map(fixed => ({
        _id: fixed._id,
        description: fixed.description || fixed.items?.[0]?.name || 'Fixed Expense',
        amount: fixed.totalAmount || 0,
        date: fixed.periodStart || new Date().toISOString(),
        icon: '📅',
        category: fixed.category || 'Fixed Expense',
        type: 'fixed'
      }))
      
      // Combine all expenses
      const allExpenses = [...regularExpenses, ...convertedFixedExpenses]
      
      // Process combined data
      const processedData = processExpenseData(allExpenses)
      setExpenseData(processedData)
      
    } catch (err) {
      console.error('Error fetching expense data:', err)
      setError('Failed to fetch expense data')
    } finally {
      setLoading(false)
    }
  }

    const processExpenseData = (expenses) => {
        if (!expenses || expenses.length === 0) {
            return {
                totalExpense: 0,
                monthlyExpense: 0,
                weeklyExpense: 0,
                todayExpense: 0,
                recentExpenses: [],
                allExpenses: [],
                expenseByCategory: []
            }
        }

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const currentWeek = getWeekNumber(now)
        
        // Calculate totals
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        
        // Calculate monthly expense
        const monthlyExpense = expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date)
                return expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear
            })
            .reduce((sum, expense) => sum + expense.amount, 0)
        
        // Calculate weekly expense
        const weeklyExpense = expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date)
                return getWeekNumber(expenseDate) === currentWeek && 
                       expenseDate.getFullYear() === currentYear
            })
            .reduce((sum, expense) => sum + expense.amount, 0)
        
        // Calculate today's expense
        const today = new Date().toDateString()
        const todayExpense = expenses
            .filter(expense => new Date(expense.date).toDateString() === today)
            .reduce((sum, expense) => sum + expense.amount, 0)
        
        // Get recent expenses (last 5)
        const recentExpenses = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(expense => ({
                _id: expense._id,
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                icon: expense.icon || '💸',
                category: expense.category || categorizeExpense(expense.description)
            }))
        
        // Get all expenses for the "View All" functionality
        const allExpenses = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(expense => ({
                _id: expense._id,
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                icon: expense.icon || '💸',
                category: expense.category || categorizeExpense(expense.description)
            }))
        
        // Calculate expense by category
        const expenseByCategory = calculateExpenseByCategory(expenses)
        
        return {
            totalExpense,
            monthlyExpense,
            weeklyExpense,
            todayExpense,
            recentExpenses,
            allExpenses,
            expenseByCategory
        }
    }

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const categorizeExpense = (description) => {
    const descLower = description.toLowerCase()
    if (descLower.includes('food') || descLower.includes('restaurant') || descLower.includes('grocery')) {
      return 'Food'
    } else if (descLower.includes('transport') || descLower.includes('gas') || descLower.includes('uber')) {
      return 'Transport'
    } else if (descLower.includes('entertainment') || descLower.includes('movie') || descLower.includes('game')) {
      return 'Entertainment'
    } else if (descLower.includes('shopping') || descLower.includes('amazon') || descLower.includes('clothing')) {
      return 'Shopping'
    } else if (descLower.includes('bill') || descLower.includes('utility') || descLower.includes('electric')) {
      return 'Bills'
    } else if (descLower.includes('rent') || descLower.includes('housing') || descLower.includes('mortgage')) {
      return 'Housing'
    } else {
      return 'Other'
    }
  }

  const calculateExpenseByCategory = (expenses) => {
    const categoryMap = {}
    
    expenses.forEach(expense => {
      const category = expense.category || categorizeExpense(expense.description)
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
      categoryMap[category] += expense.amount
    })
    
    const total = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0)
    
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / total) * 100)
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  const handleAddExpense = async (newExpense) => {
    try {
      // Add new expense via API
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, newExpense)
      
      if (response.data) {
        // Refresh the data
        await fetchExpenseData()
        setIsModalOpen(false)
        console.log('Expense added successfully!')
      }
      
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedExpense(null)
  }

  const handleEditExpense = async (expense) => {
    try {
      // Send PUT request to update expense
      const response = await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(expense._id), {
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        icon: expense.icon
      });
      
      if (response.data) {
        // Refresh the data
        await fetchExpenseData();
        setIsModalOpen(false);
        setEditingExpense(null);
        console.log('Expense updated successfully!');
      }
      
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  }

  const handleStartEdit = (expense) => {
    setEditingExpense(expense);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  }

  const handleDeleteExpense = async (expense) => {
    try {
      // Add confirmation dialog
      const isConfirmed = window.confirm(`Are you sure you want to delete the expense "${expense.description}" for ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(expense.amount)}?`);
      
      if (!isConfirmed) {
        return;
      }

      // Delete expense via API - use the correct endpoint format
      const response = await axiosInstance.delete(`/api/v1/auth/expense/${expense._id}`)
      
      if (response.status === 200 || response.status === 204) {
        // Refresh the data
        await fetchExpenseData()
        setIsDetailsModalOpen(false)
        console.log('Expense deleted successfully!')
      } else {
        throw new Error('Failed to delete expense')
      }
      
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Failed to delete expense. Please try again.')
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeMenu="Expense">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-600">Loading expense data...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Expense">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-10">
          <h3 className="text-red-800 font-semibold">Error Loading Expense Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchExpenseData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expense Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Expense
          </button>
        </div>
        
        <ExpenseOverview 
          expenseData={expenseData} 
          onAddExpense={() => setIsModalOpen(true)}
          onViewExpense={handleViewExpense}
          onEditExpense={handleStartEdit}
          onDeleteExpense={handleDeleteExpense}
        />

        {/* Recent Expenses Section */}
        {expenseData?.recentExpenses && expenseData.recentExpenses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {expenseData.recentExpenses.map((expense) => (
                <ExpenseCard 
                  key={expense._id} 
                  expense={{...expense, totalExpense: expenseData.totalExpense}} 
                  onView={handleViewExpense}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          </div>
        )}
        
        <AddExpenseModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }} 
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          editingExpense={editingExpense}
        />
        
        <ExpenseDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={handleCloseDetailsModal} 
          expense={selectedExpense}
          onEdit={handleStartEdit}
          onDelete={handleDeleteExpense}
        />
      </div>
    </DashboardLayout>
  )
}

export default Expense
