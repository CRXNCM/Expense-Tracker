import React from 'react';
import { X, DollarSign, Calendar, Tag, Edit, Trash2 } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ExpenseDetailsModal = ({ isOpen, onClose, expense, onEdit, onDelete }) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Expense Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-red-100 mt-1">View your expense information</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Icon Display */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
              <span className="text-4xl">{expense.icon}</span>
            </div>
          </div>

          {/* Expense Details */}
          <div className="space-y-4">
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Tag className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Description</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{expense.description}</p>
            </div>

            {/* Amount */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Amount</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(expense.amount)}</p>
            </div>

            {/* Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{formatDate(expense.date)}</p>
            </div>

            {/* Category */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Tag className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Category</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{expense.category}</p>
            </div>

            {/* Notes (if available) */}
            {expense.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Notes</span>
                </div>
                <p className="text-gray-800">{expense.notes}</p>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Expense Summary</p>
              <p className="text-xl font-bold text-gray-800">{expense.description}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(expense.amount)}</p>
              <p className="text-sm text-gray-500 mt-2">{formatDate(expense.date)}</p>
              <p className="text-sm text-gray-500">{expense.category}</p>
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
              onClick={() => onEdit && onEdit(expense)}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(expense)}
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

export default ExpenseDetailsModal;
