import React, { useState } from 'react';
import CustomConfirmModal from './CustomConfirmModal';

const MealPlanCard = ({ mealPlan, onView, onEdit, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle the actual API data structure
  const date = mealPlan.date || new Date().toISOString();
  const totalCost = mealPlan.totalCost || 0;
  const totalCalories = mealPlan.totalCalories || 0;
  const meals = mealPlan.meals || [];
  
  // Get meal summary info
  const mealCount = meals.length;
  const mealTypes = meals.map(meal => meal.type).join(', ');
  const mealNames = meals.map(meal => meal.name).join(', ');

  return (
    <article className="bg-white bg-opacity-70 backdrop-blur-md rounded-md shadow-md border border-gray-300 p-3 hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.03]">
      <div className="space-y-2">
        {/* Header with date and meal count */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-900 truncate max-w-xs">
              Meal{mealCount !== 1 ? 's' : ''}
            </h3>
            <p className="text-xs text-gray-600 truncate max-w-xs">{mealTypes || 'Meal Plan'}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-blue-600">${totalCost}</p>
          </div>
        </div>

        {/* Date and meal details */}
        <div className="border-t border-gray-200 pt-2">
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
          {mealNames && (
            <p className="text-xs text-gray-700 mt-1 line-clamp-2">
              {mealNames}
            </p>
          )}
          {totalCalories > 0 && (
            <p className="text-xs text-gray-600 mt-1">{totalCalories} cal</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onView && onView(mealPlan)}
            className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit && onEdit(mealPlan)}
            className="flex-1 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <CustomConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          onDelete && onDelete(mealPlan);
          setShowConfirmModal(false);
        }}
        title="Delete Meal Plan"
        message={`Are you sure you want to delete the meal plan for ${formatDate(date)}? This action cannot be undone.`}
      />
    </article>
  );
};

export default MealPlanCard;
