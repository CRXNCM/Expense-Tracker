import React, { useState } from 'react'
import ExpenseCard from '../../components/ExpenseCard'

const ExpenseOverview = ({ expenseData, onAddExpense, onViewExpense, onEditExpense, onDeleteExpense }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!expenseData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No expense data available</p>
      </div>
    )
  }

  const [showAllExpenses, setShowAllExpenses] = useState(false);
  
  const { 
    totalExpense, 
    monthlyExpense, 
    weeklyExpense, 
    todayExpense, 
    recentExpenses, 
    expenseByCategory 
  } = expenseData

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Expense</h3>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
          <p className="text-sm opacity-90 mt-1">All time total</p>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">This Month</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(monthlyExpense)}</p>
          <p className="text-sm opacity-90 mt-1">Current month</p>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">This Week</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(weeklyExpense)}</p>
          <p className="text-sm opacity-90 mt-1">Current week</p>
        </div>

        <div className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Today</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(todayExpense)}</p>
          <p className="text-sm opacity-90 mt-1">Today's expense</p>
        </div>
      </div>

      {/* Expense Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense by Category</h3>
          <div className="space-y-4">
            {expenseByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{item.category}</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Expenses</h3>
            <button
              onClick={onAddExpense}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
            >
              Add New
            </button>
          </div>
          
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div 
                  key={expense._id} 
                  className="border-l-4 border-red-500 pl-4 py-2 cursor-pointer hover:bg-red-50 rounded-r-lg transition-colors"
                  onClick={() => onViewExpense && onViewExpense(expense)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{expense.description}</h4>
                      <p className="text-sm text-gray-600">{expense.category}</p>
                    </div>
                    <span className="text-red-600 font-bold text-lg">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(expense.date)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent expenses found</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowAllExpenses(!showAllExpenses)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {showAllExpenses ? 'Hide All Expenses' : 'View All Expenses'}
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
            Generate Report
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
            Export Data
          </button>
        </div>
      </div>

      {/* All Expenses Section */}
      {showAllExpenses && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">All Expenses</h3>
            <button
              onClick={() => setShowAllExpenses(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕ Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseData.allExpenses && expenseData.allExpenses.length > 0 ? (
              expenseData.allExpenses.map((expense) => (
                <ExpenseCard 
                  key={expense._id} 
                  expense={{...expense, totalExpense: expenseData.totalExpense}} 
                  onView={onViewExpense}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 col-span-full">No expenses found</p>
            )}
          </div>
        </div>
      )}

      {/* Expense Trends Chart Placeholder */}
      {!showAllExpenses && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Expense trends chart will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseOverview
