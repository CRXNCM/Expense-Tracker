import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AddExpenseModal = ({ isOpen, onClose, onAddExpense, onEditExpense, editingExpense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    icon: '💸'
  });

  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: editingExpense.category || '',
        icon: editingExpense.icon || '💸'
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        icon: '💸'
      });
    }
  }, [editingExpense]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const commonExpenseCategories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Housing',
    'Healthcare', 'Education', 'Travel', 'Gifts', 'Personal Care', 'Insurance',
    'Utilities', 'Groceries', 'Dining', 'Gas', 'Parking', 'Subscriptions',
    'Electronics', 'Clothing', 'Books', 'Fitness', 'Pet Care', 'Other'
  ];

  const commonExpenseDescriptions = [
    'Grocery Shopping', 'Restaurant', 'Gas', 'Uber Ride', 'Movie Tickets',
    'Netflix Subscription', 'Electric Bill', 'Rent', 'Coffee', 'Lunch',
    'Dinner', 'Shopping', 'Phone Bill', 'Internet Bill', 'Car Insurance',
    'Health Insurance', 'Doctor Visit', 'Medicine', 'Books', 'Clothing',
    'Gym Membership', 'Haircut', 'Pet Food', 'Parking Fee', 'Taxi'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.icon) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingExpense && onEditExpense) {
        await onEditExpense({ ...expenseData, _id: editingExpense._id });
      } else if (onAddExpense) {
        await onAddExpense(expenseData);
      }
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        icon: '💸'
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle autocomplete for title
    if (name === 'title') {
      const filtered = commonExpenseDescriptions.filter(desc =>
        desc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(value.length > 0);
    }
    
    // Handle autocomplete for category
    if (name === 'category') {
      const filtered = commonExpenseCategories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(value.length > 0);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSuggestionClick = (suggestion, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: suggestion
    }));
    setShowSuggestions(false);
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setFormData(prev => ({
      ...prev,
      icon: emojiObject.emoji
    }));
    setShowEmojiPicker(false);
    if (errors.icon) {
      setErrors(prev => ({
        ...prev,
        icon: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-red-100 mt-1">
            {editingExpense ? 'Update your expense details' : 'Track your spending with style'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Icon Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <span className="text-2xl">{formData.icon}</span>
                <span className="text-gray-500 text-sm">Click to change</span>
              </button>
              {showEmojiPicker && (
                <div className="absolute z-10 mt-2">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
            {errors.icon && (
              <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline-block w-4 h-4 mr-1" />
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., Grocery Shopping, Restaurant, Gas"
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-red-50 cursor-pointer text-gray-700"
                      onClick={() => handleSuggestionClick(suggestion, 'title')}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-1" />
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline-block w-4 h-4 mr-1" />
              Category
            </label>
            <div className="relative">
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., Food, Transport, Entertainment"
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-red-50 cursor-pointer text-gray-700"
                      onClick={() => handleSuggestionClick(suggestion, 'category')}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{formData.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{formData.description || 'Description'}</p>
                <p className="text-red-600 font-bold">
                  {formData.amount ? `$${parseFloat(formData.amount).toFixed(2)}` : '$0.00'}
                </p>
                <p className="text-sm text-gray-600">{formatDate(formData.date)}</p>
                <p className="text-xs text-gray-500">{formData.category || 'Category'}</p>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update Expense' : 'Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
