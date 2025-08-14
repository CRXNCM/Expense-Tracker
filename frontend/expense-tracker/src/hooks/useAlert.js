import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((type, title, message, autoClose = false, duration = 3000) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      type,
      title,
      message,
      autoClose,
      duration,
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    return id;
  }, []);

  const hideAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    hideAlert,
    clearAllAlerts,
  };
};
