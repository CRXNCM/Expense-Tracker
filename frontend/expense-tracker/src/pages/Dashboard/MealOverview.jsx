import React from 'react'

const MealOverview = ({ mealData, onAddMealPlan, onViewMealPlan }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get current week's days
  const getWeekDays = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }
    return weekDays
  }

  // Get meals for a specific date
  const getMealsForDate = (date) => {
    if (!mealData?.recentMealPlans) return { breakfast: null, lunch: null, dinner: null };
    
    const dateStr = date.toISOString().split('T')[0];
    const dayMeals = mealData.recentMealPlans.find(plan => 
      new Date(plan.date).toISOString().split('T')[0] === dateStr
    );
    
    if (!dayMeals) return { breakfast: null, lunch: null, dinner: null };
    
    return {
      breakfast: dayMeals.meals.find(meal => 
        meal.type.toLowerCase() === 'breakfast' || meal.type === 'Breakfast'
      ),
      lunch: dayMeals.meals.find(meal => 
        meal.type.toLowerCase() === 'lunch' || meal.type === 'Lunch'
      ),
      dinner: dayMeals.meals.find(meal => 
        meal.type.toLowerCase() === 'dinner' || meal.type === 'Dinner'
      )
    };
  }

  const weekDays = getWeekDays()

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Meal Overview</h2>
        <div className="flex space-x-3">
          <button
            onClick={onAddMealPlan}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add Meal Plan
          </button>
          <button
            onClick={onViewMealPlan}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            View All Plans
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const dayMeals = getMealsForDate(date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = date.getDate();
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center mb-3">
                <div className="font-semibold text-gray-700">{dayName}</div>
                <div className="text-2xl font-bold text-gray-800">{dayNumber}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">Breakfast</div>
                <div className="text-sm">
                  {dayMeals.breakfast ? (
                    <div>
                      <div className="font-medium">{dayMeals.breakfast.name}</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(dayMeals.breakfast.cost)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No meal</div>
                  )}
                </div>
                
                <div className="text-xs font-medium text-gray-500 mt-2">Lunch</div>
                <div className="text-sm">
                  {dayMeals.lunch ? (
                    <div>
                      <div className="font-medium">{dayMeals.lunch.name}</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(dayMeals.lunch.cost)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No meal</div>
                  )}
                </div>
                
                <div className="text-xs font-medium text-gray-500 mt-2">Dinner</div>
                <div className="text-sm">
                  {dayMeals.dinner ? (
                    <div>
                      <div className="font-medium">{dayMeals.dinner.name}</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(dayMeals.dinner.cost)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No meal</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MealOverview;
