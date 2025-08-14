import React, { useState } from 'react'
import IncomeCard from '../../components/IncomeCard'

const IncomeOverview = ({ incomeData, onAddIncome, onViewIncome, onEditIncome, onDeleteIncome }) => {
  const [showAllIncomes, setShowAllIncomes] = useState(false);
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

  if (!incomeData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No income data available</p>
      </div>
    )
  }

  const { 
    totalIncome, 
    monthlyIncome, 
    weeklyIncome, 
    todayIncome, 
    recentIncomes, 
    incomeByCategory 
  } = incomeData

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Income</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
          <p className="text-sm opacity-90 mt-1">All time total</p>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">This Month</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(monthlyIncome)}</p>
          <p className="text-sm opacity-90 mt-1">Current month</p>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">This Week</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(weeklyIncome)}</p>
          <p className="text-sm opacity-90 mt-1">Current week</p>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Today</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(todayIncome)}</p>
          <p className="text-sm opacity-90 mt-1">Today's income</p>
        </div>
      </div>

      {/* Income Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Income by Category</h3>
          <div className="space-y-4">
            {incomeByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{item.category}</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incomes - Updated to use IncomeCard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Incomes</h3>
            <button
              onClick={onAddIncome}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200"
            >
              Add New
            </button>
          </div>
          
          <div className="space-y-4">
            {recentIncomes.length > 0 ? (
              <div className="grid gap-4">
                {recentIncomes.map((income) => (
                  <IncomeCard 
                    key={income._id} 
                    income={income} 
                    onView={onViewIncome} 
                    onEdit={onEditIncome} 
                    onDelete={onDeleteIncome} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent incomes found</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowAllIncomes(!showAllIncomes)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {showAllIncomes ? 'Hide All Incomes' : 'View All Incomes'}
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
            Generate Report
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
            Export Data
          </button>
        </div>
      </div>

      {/* All Incomes Section */}
      {showAllIncomes && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">All Incomes</h3>
            <button
              onClick={() => setShowAllIncomes(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕ Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeData.allIncomes && incomeData.allIncomes.length > 0 ? (
              incomeData.allIncomes.map((income) => (
                <IncomeCard 
                  key={income._id} 
                  income={income} 
                  onView={onViewIncome} 
                  onEdit={onEditIncome} 
                  onDelete={onDeleteIncome} 
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 col-span-full">No incomes found</p>
            )}
          </div>
        </div>
      )}

      {/* Income Trends Chart Placeholder */}
      {!showAllIncomes && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Income Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Income trends chart will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncomeOverview;
