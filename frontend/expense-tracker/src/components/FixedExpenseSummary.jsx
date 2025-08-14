import React from 'react';

const FixedExpenseSummary = ({ expenses, loading }) => {
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
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500">No data available for summary</p>
      </div>
    );
  }

  const totalFixedExpenses = expenses.reduce((sum, expense) => sum + expense.totalAmount, 0);

  // Calculate totals by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.totalAmount;
    return acc;
  }, {});

  // Sort categories by total descending
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Fixed Expenses Summary</h3>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Fixed Expenses</p>
            <p className="text-3xl font-bold text-blue-600">
              ${totalFixedExpenses.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3">Expenses by Category</h4>
        <div className="space-y-3">
          {sortedCategories.map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{category}</span>
              <span className="font-semibold text-blue-600">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-xl font-bold">{expenses.reduce((sum, expense) => sum + expense.items.length, 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-xl font-bold">{Object.keys(categoryTotals).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedExpenseSummary;
