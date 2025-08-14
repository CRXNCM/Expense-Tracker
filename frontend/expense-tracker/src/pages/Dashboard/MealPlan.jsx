import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import MealOverview from './MealOverview';
import AddMealPlanModal from '../../components/AddMealPlanModal';
import MealPlanCard from '../../components/MealPlanCard';
import MealPlanDetailsModal from '../../components/MealPlanDetailsModal';
import DailyMealPlanModal from '../../components/DailyMealPlanModal';
import WeeklyMealCards from '../../components/WeeklyMealCards';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS } from '../../utils/apiPaths';

const MealPlan = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [selectedDailyMealPlan, setSelectedDailyMealPlan] = useState(null);
  const [editingMealPlan, setEditingMealPlan] = useState(null);

  useEffect(() => {
    fetchMealData();
  }, []);

  const fetchMealData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch meal plans
      const plansResponse = await axiosInstance.get(API_PATHS.MEALPLAN.GET_MEALPLAN);
      const mealPlans = plansResponse.data;
      
      // Fetch stats
      const statsResponse = await axiosInstance.get(API_PATHS.MEALPLAN.GET_MEALPLAN_STATS);
      const stats = statsResponse.data;
      
      // Process the data
      const processedData = processMealData(mealPlans, stats);
      setMealData(processedData);
      setMealPlans(mealPlans.sort((a, b) => new Date(b.date) - new Date(a.date)));
      
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching meal data:', err);
      setError('Failed to fetch meal data');
      setLoading(false);
    }
  };

  const processMealData = (mealPlans, stats) => {
    if (!mealPlans || mealPlans.length === 0) {
      return {
        totalMeals: 0,
        totalCost: 0,
        totalCalories: 0,
        monthlyMeals: 0,
        weeklyMeals: 0,
        todayMeals: 0,
        avgCost: 0,
        avgCalories: 0,
        recentMealPlans: [],
        mealByType: [],
        allMealPlans: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentWeek = getWeekNumber(now);
    const today = now.toDateString();

    // Calculate totals
    const totalMeals = stats?.totalMeals || 0;
    const totalCost = stats?.totalCost || 0;
    const totalCalories = stats?.totalCalories || 0;
    const avgCost = stats?.avgCost || 0;
    const avgCalories = stats?.avgCalories || 0;

    // Calculate monthly meals
    const monthlyMeals = mealPlans
      .filter(plan => {
        const planDate = new Date(plan.date);
        return planDate.getMonth() === currentMonth && 
               planDate.getFullYear() === currentYear;
      })
      .reduce((sum, plan) => sum + (plan.meals?.length || 0), 0);

    // Calculate weekly meals
    const weeklyMeals = mealPlans
      .filter(plan => {
        const planDate = new Date(plan.date);
        return getWeekNumber(planDate) === currentWeek && 
               planDate.getFullYear() === currentYear;
      })
      .reduce((sum, plan) => sum + (plan.meals?.length || 0), 0);

    // Calculate today's meals
    const todayMeals = mealPlans
      .filter(plan => new Date(plan.date).toDateString() === today)
      .reduce((sum, plan) => sum + (plan.meals?.length || 0), 0);

    // Get recent meal plans (last 5)
    const recentMealPlans = mealPlans
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(plan => ({
        _id: plan._id,
        date: plan.date,
        totalCost: plan.totalCost || 0,
        totalCalories: plan.totalCalories || 0,
        meals: plan.meals || [],
        mealCount: plan.meals?.length || 0
      }));

    // Calculate meals by type
    const mealByType = calculateMealsByType(mealPlans);

    // Get all meal plans
    const allMealPlans = mealPlans
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(plan => ({
        _id: plan._id,
        date: plan.date,
        totalCost: plan.totalCost || 0,
        totalCalories: plan.totalCalories || 0,
        meals: plan.meals || [],
        mealCount: plan.meals?.length || 0
      }));

    return {
      totalMeals,
      totalCost,
      totalCalories,
      monthlyMeals,
      weeklyMeals,
      todayMeals,
      avgCost,
      avgCalories,
      recentMealPlans,
      mealByType,
      allMealPlans
    };
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const calculateMealsByType = (mealPlans) => {
    const typeMap = {};
    
    mealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        const type = meal.type || 'Other';
        if (!typeMap[type]) {
          typeMap[type] = 0;
        }
        typeMap[type] += 1;
      });
    });

    const total = Object.values(typeMap).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(typeMap)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const handleAddMealPlan = async (newMealPlan) => {
    try {
      const response = await axiosInstance.post(API_PATHS.MEALPLAN.ADD_MEALPLAN, newMealPlan);
      
      if (response.data) {
        await fetchMealData();
        setIsModalOpen(false);
        toast.success('Meal plan added successfully!');
      }
    } catch (error) {
      console.error('Error adding meal plan:', error);
      toast.error('Failed to add meal plan');
    }
  };

  const handleViewMealPlan = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMealPlan(null);
  };

  const handleEditMealPlan = async (mealPlan) => {
    try {
      const response = await axiosInstance.put(API_PATHS.MEALPLAN.UPDATE_MEALPLAN(mealPlan._id), mealPlan);
      
      if (response.data) {
        await fetchMealData();
        setIsModalOpen(false);
        setEditingMealPlan(null);
        toast.success('Meal plan updated successfully!');
      }
    } catch (error) {
      console.error('Error editing meal plan:', error);
      toast.error('Failed to update meal plan');
    }
  };

  const handleStartEdit = (mealPlan) => {
    setEditingMealPlan(mealPlan);
    setIsDetailsModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteMealPlan = async (mealPlan) => {
    try {
      const isConfirmed = window.confirm(`Are you sure you want to delete the meal plan for ${new Date(mealPlan.date).toLocaleDateString()}?`);
      
      if (!isConfirmed) {
        return;
      }

      await axiosInstance.delete(API_PATHS.MEALPLAN.DELETE_MEALPLAN(mealPlan._id));
      await fetchMealData();
      setIsDetailsModalOpen(false);
      toast.success('Meal plan deleted successfully!');
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast.error('Failed to delete meal plan');
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Meal Plans">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Loading meal data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Meal Plans">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-10">
          <h3 className="text-red-800 font-semibold">Error Loading Meal Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMealData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Meal Plans">
      <div className="my-5 mx-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Meal Plan Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Meal Plan
          </button>
        </div>
        
        <WeeklyMealCards 
          mealPlans={mealPlans} 
          onDayClick={(dailyMealPlan) => {
            setSelectedDailyMealPlan(dailyMealPlan);
            setIsDailyModalOpen(true);
          }}
        />

        <MealOverview 
          mealData={mealData} 
          onAddMealPlan={() => setIsModalOpen(true)}
          onViewMealPlan={handleViewMealPlan}
          onEditMealPlan={handleStartEdit}
          onDeleteMealPlan={handleDeleteMealPlan}
          
        />

        {/* Recent Meal Plans Section */}
        {mealPlans && mealPlans.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Meals</h2>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {mealPlans.slice(0, 6).map((mealPlan) => (
                <MealPlanCard 
                  key={mealPlan._id} 
                  mealPlan={mealPlan} 
                  onView={handleViewMealPlan}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteMealPlan}
                  onDayClick={(dailyMealPlan) => {
            setSelectedDailyMealPlan(dailyMealPlan);
            setIsDailyModalOpen(true);
          }}
                />
              ))}
            </div>
          </div>
        )}
        
        <AddMealPlanModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingMealPlan(null);
          }} 
          onAddMealPlan={handleAddMealPlan}
          onEditMealPlan={handleEditMealPlan}
          editingMealPlan={editingMealPlan}
        />
        
        <MealPlanDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={handleCloseDetailsModal} 
          mealPlan={selectedMealPlan}
          allMealPlans={mealData?.recentMealPlans || []}
          onEdit={handleStartEdit}
          onDelete={handleDeleteMealPlan}
        />
        
        <DailyMealPlanModal 
          isOpen={isDailyModalOpen}
          onClose={() => setIsDailyModalOpen(false)}
          dailyMealPlan={selectedDailyMealPlan}
          onEdit={handleEditMealPlan}
          onDelete={handleDeleteMealPlan}
          onAddMeal={handleAddMealPlan}
        />
      </div>
    </DashboardLayout>
  );
};

export default MealPlan;
