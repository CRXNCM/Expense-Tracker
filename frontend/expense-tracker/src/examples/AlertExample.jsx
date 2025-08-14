import React from 'react';
import { useAlert } from '../hooks/useAlert';
import AlertContainer from '../components/AlertContainer';

const AlertExample = () => {
  const { alerts, showAlert, hideAlert } = useAlert();

  const handleSuccess = () => {
    showAlert('success', 'Success!', 'Your changes have been saved successfully.');
  };

  const handleError = () => {
    showAlert('error', 'Error!', 'Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    showAlert('warning', 'Warning!', 'Please review your changes before proceeding.');
  };

  const handleAutoClose = () => {
    showAlert('info', 'Auto-close', 'This alert will close automatically in 3 seconds.', true, 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Alert System Demo</h2>
      
      <div className="space-x-4">
        <button
          onClick={handleSuccess}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Success
        </button>
        
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error
        </button>
        
        <button
          onClick={handleWarning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Show Warning
        </button>
        
        <button
          onClick={handleAutoClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Auto-close
        </button>
      </div>

      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </div>
  );
};

export default AlertExample;
