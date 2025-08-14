import React from 'react';
import { format } from 'date-fns';

const DailyLogDetailModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Daily Log Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {format(new Date(log.date), 'MMMM d, yyyy')}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mood:</span>
                <p className="text-gray-900 dark:text-white">{log.mood}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sleep Hours:</span>
                <p className="text-gray-900 dark:text-white">{log.sleepHours}h</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Level:</span>
                <p className="text-gray-900 dark:text-white">{log.energyLevel}/10</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Productivity:</span>
                <p className="text-gray-900 dark:text-white">{log.productivity}/10</p>
              </div>
            </div>

            {log.note && (
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Note:</span>
                <p className="text-gray-900 dark:text-white mt-1">{log.note}</p>
              </div>
            )}

            {log.reflection && (
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reflection:</span>
                <p className="text-gray-900 dark:text-white mt-1">{log.reflection}</p>
              </div>
            )}

            {log.importantEvents && log.importantEvents.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Important Events:</span>
                <ul className="mt-1 space-y-1">
                  {log.importantEvents.map((event, index) => (
                    <li key={index} className="text-gray-900 dark:text-white">• {event}</li>
                  ))}
                </ul>
              </div>
            )}

            {log.goals && log.goals.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals:</span>
                <ul className="mt-1 space-y-1">
                  {log.goals.map((goal, index) => (
                    <li key={index} className="text-gray-900 dark:text-white">• {goal}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLogDetailModal;
