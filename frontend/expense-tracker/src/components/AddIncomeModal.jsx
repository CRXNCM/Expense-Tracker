import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAlert } from '../hooks/useAlert';
import AlertContainer from '../components/AlertContainer';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AddIncomeModal = ({ isOpen, onClose, onAddIncome, onEditIncome, editingIncome }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '💰',
    category: 'Active Income'
  });

  React.useEffect(() => {
    if (editingIncome) {
      setFormData({
        source: editingIncome.source || '',
        amount: editingIncome.amount || '',
        date: editingIncome.date ? new Date(editingIncome.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        icon: editingIncome.icon || '💰',
        category: editingIncome.category || 'Active Income'
      });
    } else {
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '💰',
        category: 'Active Income'
      });
    }
  }, [editingIncome]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const commonIncomeSources = [
    'Salary', 'Freelance', 'Investment', 'Bonus', 'Commission', 'Rental Income',
    'Dividend', 'Side Business', 'Consulting', 'Part-time Job', 'Overtime',
    'Gift', 'Tax Refund', 'Refund', 'Interest', 'Capital Gains', 'Royalty',
    'Pension', 'Allowance', 'Stipend', 'Scholarship', 'Grant', 'Award'
  ];

  const incomeCategories = [
    'Active Income',
    'Passive Income',
    'Investment Income',
    'Business Income',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.icon) {
      newErrors.icon = 'Icon is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { alerts, showAlert, hideAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const incomeData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingIncome && onEditIncome) {
        await onEditIncome({ ...incomeData, _id: editingIncome._id });
        showAlert('success', 'Updated!', 'Income has been updated successfully.');
      } else if (onAddIncome) {
        await onAddIncome(incomeData);
        showAlert('success', 'Added!', 'New income has been added successfully.');
      }
      
      // Reset form
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '💰',
        category: 'Active Income'
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting income:', error);
      showAlert('error', 'Error!', error.message || 'Failed to save income. Please try again.');
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
    
    // Handle autocomplete for source
    if (name === 'source') {
      const filtered = commonIncomeSources.filter(source =>
        source.toLowerCase().includes(value.toLowerCase())
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

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      source: suggestion
    }));
    setShowSuggestions(false);
    if (errors.source) {
      setErrors(prev => ({
        ...prev,
        source: ''
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
    <>
      <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingIncome ? 'Edit Income' : 'Add New Income'}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-green-100 mt-1">Track your earnings with style</p>
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

            {/* Source Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline-block w-4 h-4 mr-1" />
                Income Source
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g., Salary, Freelance, Investment"
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.source ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">{errors.source}</p>
              )}
            </div>

            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {incomeCategories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
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
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
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
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                  <p className="font-semibold text-gray-800">{formData.source || 'Source'}</p>
                  <p className="text-sm text-gray-600">{formData.category || 'Category'}</p>
                  <p className="text-green-600 font-bold">
                    {formData.amount ? `$${parseFloat(formData.amount).toFixed(2)}` : '$0.00'}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(formData.date)}</p>
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Income'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </>
  );
};

export default AddIncomeModal;
