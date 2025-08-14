import React, { useState } from 'react';

const AddMealPlanModal = ({ isOpen, onClose, onAddMealPlan, selectedDate }) => {
  const getCurrentWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { startOfWeek, endOfWeek };
  };

  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  
  const [mealPlan, setMealPlan] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    meals: []
  });

  const [newMeal, setNewMeal] = useState({
    type: 'Breakfast',
    name: '',
    ingredients: '',
    cost: '',
    calories: ''
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleAddMeal = () => {
    if (!newMeal.name.trim()) return;

    const meal = {
      type: newMeal.type,
      name: newMeal.name,
      ingredients: newMeal.ingredients ? newMeal.ingredients.split(',').map(i => i.trim()) : [],
      cost: newMeal.cost ? parseFloat(newMeal.cost) : 0,
      calories: newMeal.calories ? parseInt(newMeal.calories) : 0
    };

    setMealPlan(prev => ({
      ...prev,
      meals: [...prev.meals, meal]
    }));

    setNewMeal({
      type: 'Breakfast',
      name: '',
      ingredients: '',
      cost: '',
      calories: ''
    });
  };

  const handleRemoveMeal = (index) => {
    setMealPlan(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totalCost = mealPlan.meals.reduce((sum, meal) => sum + (meal.cost || 0), 0);
    const totalCalories = mealPlan.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    onAddMealPlan({
      ...mealPlan,
      totalCost,
      totalCalories
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Meal Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={mealPlan.date}
              onChange={(e) => setMealPlan(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={startOfWeek.toISOString().split('T')[0]}
              max={endOfWeek.toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Only current week dates allowed ({startOfWeek.toLocaleDateString()} - {endOfWeek.toLocaleDateString()})
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Meals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {mealTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Grilled Chicken Salad"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                <input
                  type="text"
                  value={newMeal.ingredients}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="e.g., chicken, lettuce, tomato"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  value={newMeal.cost}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddMeal}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                >
                  Add Meal
                </button>
              </div>
            </div>

            {mealPlan.meals.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Added Meals</h4>
                <div className="space-y-2">
                  {mealPlan.meals.map((meal, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <span className="font-medium">{meal.type}:</span> {meal.name}
                        {meal.cost > 0 && <span className="ml-2 text-sm text-gray-600">${meal.cost}</span>}
                        {meal.calories > 0 && <span className="ml-2 text-sm text-gray-600">{meal.calories} cal</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMeal(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              disabled={mealPlan.meals.length === 0}
            >
              Save Meal Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMealPlanModal;
