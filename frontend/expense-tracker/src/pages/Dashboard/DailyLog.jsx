import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'react-toastify';
import AddDailyLogModal from '../../components/AddDailyLogModal';
import DailyLogDetailModal from '../../components/DailyLogDetailModal';

const DailyLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentLog, setCurrentLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const moodOptions = ['Happy', 'Sad', 'Tired', 'Stressed', 'Excited', 'Calm', 'Anxious', 'Motivated', 'Neutral'];

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogByDate(selectedDate);
  }, [selectedDate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DAILYLOG.GET_ALL_LOGS);
      setLogs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch daily logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogByDate = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axiosInstance.get(API_PATHS.DAILYLOG.GET_LOG_BY_DATE(formattedDate));
      if (response.data.data) {
        setCurrentLog(response.data.data);
        setFormData({
          ...response.data.data,
          date: format(new Date(response.data.data.date), 'yyyy-MM-dd')
        });
      } else {
        setCurrentLog(null);
        setFormData({
          date: format(date, 'yyyy-MM-dd'),
          mood: 'Neutral',
          note: '',
          energyLevel: 5,
          productivity: 5,
          sleepHours: 7,
          importantEvents: [],
          goals: [],
          reflection: ''
        });
      }
    } catch (error) {
      console.error('Error fetching log by date:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLog) {
        await axiosInstance.put(API_PATHS.DAILYLOG.UPDATE_LOG(currentLog._id), formData);
        toast.success('Daily log updated successfully');
      } else {
        await axiosInstance.post(API_PATHS.DAILYLOG.CREATE_DAILYLOG, formData);
        toast.success('Daily log created successfully');
      }
      fetchLogs();
      fetchLogByDate(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save daily log');
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await axiosInstance.delete(API_PATHS.DAILYLOG.DELETE_LOG(logId));
        toast.success('Daily log deleted successfully');
        fetchLogs();
        fetchLogByDate(selectedDate);
      } catch (error) {
        toast.error('Failed to delete daily log');
      }
    }
  };

  const handleAddNew = () => {
    setCurrentLog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (log) => {
    setCurrentLog(log);
    setIsModalOpen(true);
  };

  const handleViewDetail = (log) => {
    setSelectedLogForDetail(log);
    setIsDetailModalOpen(true);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'energyLevel' || name === 'productivity' || name === 'sleepHours' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Log</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Track your daily mood, productivity, and reflections</p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Log
            </button>
          </div>

          {/* Current Date Log */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Log for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            {currentLog ? (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mood: {currentLog.mood}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Energy: {currentLog.energyLevel}/10 | Productivity: {currentLog.productivity}/10 | Sleep: {currentLog.sleepHours}h
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(currentLog)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(currentLog._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {currentLog.note && (
                  <p className="text-gray-700 dark:text-gray-300">{currentLog.note}</p>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No log found for this date</p>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Log for {format(selectedDate, 'MMMM d, yyyy')}
                </button>
              </div>
            )}
          </div>

          {/* Recent Logs */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Logs</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : logs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No logs found</p>
            ) : (
              <div className="space-y-4">
                {logs.slice(0, 5).map(log => (
                  <div key={log._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {format(new Date(log.date), 'MMMM d, yyyy')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mood: {log.mood}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Energy: {log.energyLevel}/10 | Productivity: {log.productivity}/10 | Sleep: {log.sleepHours}h
                        </p>
                        {log.note && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{log.note}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDate(new Date(log.date));
                          fetchLogByDate(new Date(log.date));
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddDailyLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        existingLog={currentLog}
        onSuccess={() => {
          fetchLogs();
          fetchLogByDate(selectedDate);
        }}
      />
      <DailyLogDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        log={selectedLogForDetail}
      />
    </DashboardLayout>
  );
};

export default DailyLog;
