const DailyLog = require('../models/DailyLog');

// Create a new daily log
const createDailyLog = async (req, res) => {
  try {
    const {
      date,
      mood,
      note,
      energyLevel,
      productivity,
      sleepHours,
      importantEvents,
      goals,
      reflection
    } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const existingLog = await DailyLog.findOne({ date: new Date(date) });
    if (existingLog) {
      return res.status(409).json({ success: false, message: 'Daily log already exists for this date' });
    }

    const newLog = new DailyLog({
      date: new Date(date),
      mood,
      note,
      energyLevel,
      productivity,
      sleepHours,
      importantEvents,
      goals,
      reflection
    });

    const savedLog = await newLog.save();

    res.status(201).json({ success: true, message: 'Daily log created successfully', data: savedLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating daily log', error: error.message });
  }
};

// Get all daily logs
const getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = req.query;

    const logs = await DailyLog.find()
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalLogs = await DailyLog.countDocuments();

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
        hasNext: parseInt(page) < Math.ceil(totalLogs / limit),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving daily logs', error: error.message });
  }
};

// Get log by date
const getLogByDate = async (req, res) => {
  try {
    const dateParam = req.params.date || req.query.date;
    if (!dateParam) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }
    const date = new Date(dateParam);
    const log = await DailyLog.findOne({ date: { $eq: date } });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Daily log not found for the specified date' });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving daily log', error: error.message });
  }
};

// Update a daily log by ID
const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLog = await DailyLog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedLog) {
      return res.status(404).json({ success: false, message: 'Daily log not found' });
    }
    res.status(200).json({ success: true, data: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating daily log', error: error.message });
  }
};

// Delete a daily log by ID
const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await DailyLog.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({ success: false, message: 'Daily log not found' });
    }
    res.status(200).json({ success: true, message: 'Daily log deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting daily log', error: error.message });
  }
};

module.exports = {
  createDailyLog,
  getAllLogs,
  getLogByDate,
  updateLog,
  deleteLog
};
