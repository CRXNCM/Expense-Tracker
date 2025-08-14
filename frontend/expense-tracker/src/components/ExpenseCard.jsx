import React from 'react';
import { formatCurrency } from '../utils/helper';

const ExpenseCard = ({ expense, onView, onEdit, onDelete }) => {
  const { description, amount, date, icon, category } = expense;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Housing': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon || '💸'}</span>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">
              {description}
            </h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-red-600 text-lg">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <button
          onClick={() => onView(expense)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
