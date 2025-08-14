import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AddDailyLogModal = ({ isOpen, onClose, selectedDate, existingLog, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: 'Neutral',
    note: '',
    energyLevel: 5,
    productivity: 5,
    sleepHours: 7,
    importantEvents: [],
    goals: [],
    reflection: ''
  });
  const [newEvent, setNewEvent] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const moodOptions = ['Happy', 'Sad', 'Tired', 'Stressed', 'Excited', 'Calm', 'Anxious', 'Motivated', 'Neutral'];

  useEffect(() => {
    if (existingLog) {
      setFormData({
        ...existingLog,
        date: format(new Date(existingLog.date), 'yyyy-MM-dd')
      });
    } else if (selectedDate) {
      setFormData({
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  }, [existingLog, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'energyLevel' || name === 'productivity' || name === 'sleepHours' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setFormData(prev => ({
        ...prev,
        importantEvents: [...prev.importantEvents, newEvent.trim()]
      }));
      setNewEvent('');
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleRemoveEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      importantEvents: prev.importantEvents.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (existingLog) {
        await axiosInstance.put(API_PATHS.DAILYLOG.UPDATE_LOG(existingLog._id), formData);
        toast.success('Daily log updated successfully');
      } else {
        await axiosInstance.post(API_PATHS.DAILYLOG.CREATE_DAILYLOG, formData);
        toast.success('Daily log created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save daily log');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {existingLog ? 'Edit Daily Log' : 'Add Daily Log'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mood
              </label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Energy Level (1-10)
                </label>
                <input
                  type="range"
                  name="energyLevel"
                  min="1"
                  max="10"
                  value={formData.energyLevel}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{formData.energyLevel}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Productivity (1-10)
                </label>
                <input
                  type="range"
                  name="productivity"
                  min="1"
                  max="10"
                  value={formData.productivity}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{formData.productivity}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sleep Hours
              </label>
              <input
                type="number"
                name="sleepHours"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleepHours}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Note
              </label>
              <textarea
                name="note"
                rows="3"
                value={formData.note}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="How was your day?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Important Events
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  placeholder="Add an event"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {formData.importantEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-sm">{event}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(index)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goals
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a goal"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-sm">{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(index)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reflection
              </label>
              <textarea
                name="reflection"
                rows="3"
                value={formData.reflection}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Reflect on your day..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (existingLog ? 'Update Log' : 'Create Log')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDailyLogModal;
