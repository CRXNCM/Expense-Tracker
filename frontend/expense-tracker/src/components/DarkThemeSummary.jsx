import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DarkThemeSummary = () => {
  const { theme } = useTheme();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Dark Theme Summary
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Current Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            The dark theme has been successfully implemented across all pages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Features Implemented
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✅ Dark theme CSS variables</li>
              <li>✅ Tailwind dark mode configuration</li>
              <li>✅ Theme context provider</li>
              <li>✅ Theme toggle component</li>
              <li>✅ Component-level updates</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Available Actions
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>🌙 Toggle dark theme</li>
              <li>🎨 Customize colors</li>
              <li>💾 Save preferences</li>
              <li>📱 Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkThemeSummary;
