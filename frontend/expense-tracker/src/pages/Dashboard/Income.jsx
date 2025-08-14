import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from './IncomeOverview'
import AddIncomeModal from '../../components/AddIncomeModal'
import IncomeDetailsModal from '../../components/IncomeDetailsModal'
import IncomeCard from '../../components/IncomeCard'
import axiosInstance from '../../utils/axioInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Income = () => {
  const [incomeData, setIncomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState(null)
  const [editingIncome, setEditingIncome] = useState(null)

  useEffect(() => {
    fetchIncomeData()
  }, [])

  const fetchIncomeData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch real income data from API
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_INCOME)
      
      if (response.data) {
        const incomes = response.data
        
        // Process the raw data into dashboard format
        const processedData = processIncomeData(incomes)
        setIncomeData(processedData)
      }
      
      setLoading(false)
      
    } catch (err) {
      console.error('Error fetching income data:', err)
      setError('Failed to fetch income data')
      setLoading(false)
    }
  }

  const processIncomeData = (incomes) => {
    if (!incomes || incomes.length === 0) {
      return {
        totalIncome: 0,
        monthlyIncome: 0,
        weeklyIncome: 0,
        todayIncome: 0,
        recentIncomes: [],
        incomeByCategory: []
      }
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const currentWeek = getWeekNumber(now)
    
    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    
    // Calculate monthly income
    const monthlyIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date)
        return incomeDate.getMonth() === currentMonth && 
               incomeDate.getFullYear() === currentYear
      })
      .reduce((sum, income) => sum + income.amount, 0)
    
    // Calculate weekly income
    const weeklyIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date)
        return getWeekNumber(incomeDate) === currentWeek && 
               incomeDate.getFullYear() === currentYear
      })
      .reduce((sum, income) => sum + income.amount, 0)
    
    // Calculate today's income
    const today = new Date().toDateString()
    const todayIncome = incomes
      .filter(income => new Date(income.date).toDateString() === today)
      .reduce((sum, income) => sum + income.amount, 0)
    
        // Get recent incomes (last 5)
        const recentIncomes = incomes
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(income => ({
            _id: income._id,
            source: income.source,
            amount: income.amount,
            date: income.date,
            icon: income.icon || '💰',
            category: categorizeIncome(income.source)
          }))
    
    // Calculate income by category
    const incomeByCategory = calculateIncomeByCategory(incomes)
    
    return {
      totalIncome,
      monthlyIncome,
      weeklyIncome,
      todayIncome,
      recentIncomes,
      incomeByCategory,
      allIncomes: incomes
    }
  }

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const categorizeIncome = (source) => {
    const sourceLower = source.toLowerCase()
    if (sourceLower.includes('salary') || sourceLower.includes('wage')) {
      return 'Employment'
    } else if (sourceLower.includes('freelance') || sourceLower.includes('contract')) {
      return 'Freelance'
    } else if (sourceLower.includes('investment') || sourceLower.includes('dividend')) {
      return 'Investment'
    } else if (sourceLower.includes('side') || sourceLower.includes('gig')) {
      return 'Side Income'
    } else {
      return 'Other'
    }
  }

  const calculateIncomeByCategory = (incomes) => {
    const categoryMap = {}
    
    incomes.forEach(income => {
      const category = categorizeIncome(income.source)
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
      categoryMap[category] += income.amount
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

  const handleAddIncome = async (newIncome) => {
    try {
      // Add new income via API
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, newIncome)
      
      if (response.data) {
        // Refresh the data
        await fetchIncomeData()
        setIsModalOpen(false)
        console.log('Income added successfully!')
      }
      
    } catch (error) {
      console.error('Error adding income:', error)
    }
  }

  const handleViewIncome = (income) => {
    setSelectedIncome(income)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedIncome(null)
  }

  const handleEditIncome = async (income) => {
    try {
      // Send PUT request to update income
      const response = await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(income._id), {
        source: income.source,
        amount: income.amount,
        date: income.date,
        icon: income.icon
      });
      
      if (response.data) {
        // Refresh the data
        await fetchIncomeData();
        setIsModalOpen(false);
        setEditingIncome(null);
        console.log('Income updated successfully!');
      }
      
    } catch (error) {
      console.error('Error editing income:', error);
    }
  }

  const handleStartEdit = (income) => {
    setEditingIncome(income);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  }

  const handleDeleteIncome = async (income) => {
    try {
      // Delete income via API
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(income._id))
      
      // Refresh the data
      await fetchIncomeData()
      setIsDetailsModalOpen(false)
      console.log('Income deleted successfully!')
      
    } catch (error) {
      console.error('Error deleting income:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeMenu="Income">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading income data...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Income">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-10">
          <h3 className="text-red-800 font-semibold">Error Loading Income Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchIncomeData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Income Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Income
          </button>
        </div>
        
        <IncomeOverview 
          incomeData={incomeData} 
          onAddIncome={() => setIsModalOpen(true)}
          onViewIncome={handleViewIncome}
          onEditIncome={handleStartEdit}
          onDeleteIncome={handleDeleteIncome}
        />

        {/* Recent Incomes Section */}
        {incomeData?.recentIncomes && incomeData.recentIncomes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Incomes</h2>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {incomeData.recentIncomes.map((income) => (
                <IncomeCard 
                  key={income._id} 
                  income={{...income, totalIncome: incomeData.totalIncome}} 
                  onView={handleViewIncome}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteIncome}
                />
              ))}
            </div>
          </div>
        )}
        
        <AddIncomeModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingIncome(null);
          }} 
          onAddIncome={handleAddIncome}
          onEditIncome={handleEditIncome}
          editingIncome={editingIncome}
        />
        
        <IncomeDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={handleCloseDetailsModal} 
          income={selectedIncome}
          allIncomes={incomeData?.recentIncomes || []}
          onEdit={handleStartEdit}
          onDelete={handleDeleteIncome}
        />
      </div>
    </DashboardLayout>
  )
}

export default Income
