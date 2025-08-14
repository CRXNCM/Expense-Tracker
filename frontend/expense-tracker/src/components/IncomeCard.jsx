import React, { useState } from 'react';
import CustomConfirmModal from './CustomConfirmModal';

const IncomeCard = ({ income, onView, onEdit, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white bg-opacity-70 backdrop-blur-md rounded-md shadow-md border border-gray-300 p-3 hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.03]">
      <div className="space-y-2">
        {/* Header with source and amount */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-900 truncate max-w-xs">{income.source}</h3>
            <p className="text-xs text-gray-600 truncate max-w-xs">{income.category}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-green-600">{formatCurrency(income.amount)}</p>
          </div>
        </div>

        {/* Date and description */}
        <div className="border-t border-gray-200 pt-2">
          <p className="text-xs text-gray-500">{formatDate(income.date)}</p>
          {income.description && (
            <p className="text-xs text-gray-700 mt-1 line-clamp-2">{income.description}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onView && onView(income)}
            className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit && onEdit(income)}
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
          onDelete && onDelete(income);
          setShowConfirmModal(false);
        }}
        title="Delete Income"
        message={`Are you sure you want to delete the income "${income.source}" for ${formatCurrency(income.amount)}? This action cannot be undone.`}
      />
    </article>
  );
};

export default IncomeCard;
