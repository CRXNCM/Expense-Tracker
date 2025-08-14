import React from 'react';
import { Calendar, Utensils, DollarSign, Flame } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const WeeklyMealCards = ({ mealPlans, onDayClick }) => {
  // Get current week's dates
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  
  // Find meal plan for a specific date
  const getMealPlanForDate = (date) => {
    return mealPlans.find(plan => {
      const planDate = new Date(plan.date);
      return planDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">This Week's Meal Plans</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const mealPlan = getMealPlanForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              onClick={() => onDayClick(mealPlan || { date: date.toISOString(), meals: [] })}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                ${isToday ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}
                ${mealPlan ? 'border-green-200' : 'border-gray-200'}
              `}
            >
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600">{weekDays[index]}</div>
                <div className="text-sm font-bold text-gray-800">{date.getDate()}</div>
                
                {mealPlan ? (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">{mealPlan.meals.length}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(mealPlan.totalCost || 0)}
                    </div>
                    {mealPlan.totalCalories > 0 && (
                      <div className="text-xs text-orange-600">
                        {mealPlan.totalCalories} cal
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-xs text-gray-400">No meals</div>
                    <div className="text-xs text-gray-400">planned</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMealCards;
