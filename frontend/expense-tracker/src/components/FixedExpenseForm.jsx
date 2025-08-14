import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

const FixedExpenseForm = ({ expense, onSave, onCancel, categories = [], periodType, selectedDate }) => {
  const [formData, setFormData] = useState({
    category: '',
    items: [],
    totalAmount: 0
  });

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unitPrice: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || '',
        items: expense.items || [],
        totalAmount: expense.totalAmount || 0
      });
    }
  }, [expense]);

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleNewItemChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.unitPrice) {
      const item = {
        id: Date.now(),
        name: newItem.name,
        quantity: parseFloat(newItem.quantity),
        unitPrice: parseFloat(newItem.unitPrice),
        totalPrice: parseFloat(newItem.quantity) * parseFloat(newItem.unitPrice)
      };
      
      const updatedItems = [...formData.items, item];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      setFormData({
        ...formData,
        items: updatedItems,
        totalAmount
      });
      
      setNewItem({ name: '', quantity: '', unitPrice: '' });
    }
  };

  const removeItem = (itemId) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category && formData.items.length > 0) {
      // Transform items to match backend structure
      const backendItems = formData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));
      
      onSave({
        category: formData.category,
        items: backendItems,
        totalAmount: formData.totalAmount
      });
    }
  };

  const defaultCategories = [
    'Housing', 'Utilities', 'Transportation', 'Insurance', 
    'Subscriptions', 'Healthcare', 'Education', 'Other'
  ];

  const availableCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {expense ? 'Edit Fixed Expense' : 'Add New Fixed Expense'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-medium mb-3">Items</h4>
          
          <div className="space-y-3 mb-4">
            {formData.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h5 className="text-sm font-medium mb-2">Add New Item</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) => handleNewItemChange('name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) => handleNewItemChange('quantity', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={newItem.unitPrice}
                onChange={(e) => handleNewItemChange('unitPrice', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={addItem}
                className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-lg font-bold text-blue-600">
              ${formData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!formData.category || formData.items.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className="mr-2" />
            {expense ? 'Update' : 'Save'} Expense
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FixedExpenseForm;
