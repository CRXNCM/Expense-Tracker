import React, { useState } from 'react';
import { X, Calendar, Utensils, Flame, DollarSign, Edit, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const MealPlanDetailsModal = ({ isOpen, onClose, mealPlan, onEdit, onDelete }) => {
  if (!isOpen || !mealPlan) return null;

  // Handle the actual API data structure
  const date = mealPlan.date || new Date().toISOString();
  const totalCost = mealPlan.totalCost || 0;
  const totalCalories = mealPlan.totalCalories || 0;
  const meals = mealPlan.meals || [];

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Meal Plan Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-orange-100 mt-1">View your meal plan information</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Icon Display */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>

          {/* Meal Plan Details */}
          <div className="space-y-4">
            {/* Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{formatDate(date)}</p>
            </div>

            {/* Total Cost */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Cost</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCost)}</p>
            </div>

            {/* Total Calories */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Flame className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Calories</span>
              </div>
              <p className="text-lg font-semibold text-orange-600">{totalCalories} cal</p>
            </div>

            {/* Meals List */}
            {meals.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-1">
                  <Utensils className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Meals</span>
                </div>
                <div className="space-y-2">
                  {meals.map((meal, index) => (
                    <div key={meal._id || index} className="bg-white rounded p-3 border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{meal.name}</p>
                          <p className="text-sm text-gray-600">{meal.type}</p>
                          {meal.ingredients && meal.ingredients.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {Array.isArray(meal.ingredients) 
                                ? meal.ingredients.join(', ') 
                                : meal.ingredients}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(meal.cost || 0)}
                          </p>
                          {meal.calories > 0 && (
                            <p className="text-xs text-orange-600">{meal.calories} cal</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Meal Plan Summary</p>
                <p className="text-xl font-bold text-gray-800">{meals.length} Meal{meals.length !== 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalCost)}</p>
                <p className="text-sm text-gray-500 mt-2">{formatDate(date)}</p>
              </div>
            </div>
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
              onClick={() => onEdit && onEdit(mealPlan)}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(mealPlan)}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanDetailsModal;
