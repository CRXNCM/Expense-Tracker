import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

const FixedExpenseList = ({ expenses, onEdit, onDelete, loading }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <Calendar size={48} className="mx-auto" />
        </div>
        <p className="text-gray-500">No fixed expenses found</p>
      </div>
    );
  }

  // Group expenses by category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {});

  const categories = Object.keys(groupedExpenses);
  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : [selectedCategory];

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      monthly: 'Monthly',
      weekly: 'Weekly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  const calculateCategoryTotal = (expenses) => {
    return expenses.reduce((sum, expense) => sum + expense.totalAmount, 0);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Category Panels */}
      {filteredCategories.map(category => {
        const categoryExpenses = groupedExpenses[category];
        const categoryTotal = calculateCategoryTotal(categoryExpenses);
        const isExpanded = expandedCategories[category] || false;

        return (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">{category}</span>
                <span className="text-sm text-gray-600">
                  ({categoryExpenses.length} items)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-blue-600">
                  ${categoryTotal.toFixed(2)}
                </span>
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t">
                {categoryExpenses.map(expense => (
                  <div
                    key={expense.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {expense.category}
                        </h4>
                        <div className="mt-2 space-y-1">
                          {expense.items.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm text-gray-600"
                            >
                              <span>{item.name || 'Unnamed Item'}</span>
                              <span className="font-medium">
                                ${Number(item.amount || 0).toFixed(2)} ({getFrequencyLabel(item.frequency)})
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Total: ${Number(expense.totalAmount || 0).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(expense.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FixedExpenseList;
