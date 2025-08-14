import React, { useState } from 'react';
import { X, Calendar, Utensils, Flame, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const DailyMealPlanModal = ({ isOpen, onClose, dailyMealPlan, onEdit, onDelete, onAddMeal }) => {
  if (!isOpen || !dailyMealPlan) return null;

  const date = dailyMealPlan.date || new Date().toISOString();
  const meals = dailyMealPlan.meals || [];
  const totalCost = dailyMealPlan.totalCost || 0;
  const totalCalories = dailyMealPlan.totalCalories || 0;

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Daily Meal Plan</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-blue-100 mt-1">{formatDate(date)}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-xl font-bold text-orange-600">{totalCalories} cal</p>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Meals ({meals.length})</h3>
              <button
                onClick={() => onAddMeal && onAddMeal(dailyMealPlan)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Meal
              </button>
            </div>

            {meals.length > 0 ? (
              <div className="space-y-3">
                {meals.map((meal, index) => (
                  <div key={meal._id || index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                            {meal.type}
                          </span>
                          <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                        </div>
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Ingredients:</span> {Array.isArray(meal.ingredients) 
                              ? meal.ingredients.join(', ') 
                              : meal.ingredients}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-green-600">{formatCurrency(meal.cost || 0)}</p>
                        {meal.calories > 0 && (
                          <p className="text-sm text-orange-600">{meal.calories} cal</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onEdit && onEdit({...dailyMealPlan, editingMeal: meal})}
                        className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 rounded"
                      >
                        <Edit size={12} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete && onDelete({...dailyMealPlan, deletingMeal: meal})}
                        className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded"
                      >
                        <Trash2 size={12} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">No meals planned for this day</p>
                <button
                  onClick={() => onAddMeal && onAddMeal(dailyMealPlan)}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add First Meal
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit && onEdit(dailyMealPlan)}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Edit size={16} className="mr-2" />
              Edit Plan
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(dailyMealPlan)}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMealPlanModal;
