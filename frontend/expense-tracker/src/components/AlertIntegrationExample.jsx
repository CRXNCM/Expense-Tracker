import React from 'react';
import { useAlert } from '../hooks/useAlert';
import AlertContainer from '../components/AlertContainer';

// Example usage in any component
const MyComponent = () => {
  const { alerts, showAlert, hideAlert } = useAlert();

  const handleSave = () => {
    showAlert('success', 'Saved!', 'Your data has been saved successfully.');
  };

  const handleError = () => {
    showAlert('error', 'Error!', 'Something went wrong.');
  };

  return (
    <div>
      {/* Your component content */}
      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </div>
  );
};

// Usage in AddIncomeModal
const AddIncomeModal = ({ isOpen, onClose, onAddIncome, onEditIncome, editingIncome }) => {
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Your form logic
      await onAddIncome(data);
      showAlert('success', 'Added!', 'Income added successfully.');
    } catch (error) {
      showAlert('error', 'Error!', 'Failed to add income.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Your modal content */}
        <AlertContainer alerts={alerts} onClose={hideAlert} />
      </div>
    </div>
  );
};
