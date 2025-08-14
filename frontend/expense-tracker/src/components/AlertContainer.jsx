import React from 'react';
import Alert from './Alert';
import PropTypes from 'prop-types';

const AlertContainer = ({ alerts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => onClose(alert.id)}
          autoClose={alert.autoClose}
          duration={alert.duration}
        />
      ))}
    </div>
  );
};

AlertContainer.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      title: PropTypes.string,
      message: PropTypes.string,
      autoClose: PropTypes.bool,
      duration: PropTypes.number,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertContainer;
