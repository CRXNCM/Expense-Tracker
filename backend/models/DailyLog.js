const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: true
  },
  mood: {
    type: String,
    enum: ['Happy', 'Sad', 'Tired', 'Stressed', 'Excited', 'Calm', 'Anxious', 'Motivated', 'Neutral'],
    default: 'Neutral'
  },
  note: {
    type: String,
    maxlength: [1000, 'Note cannot exceed 1000 characters']
  },
  energyLevel: {
    type: Number,
    min: [1, 'Energy level must be between 1-10'],
    max: [10, 'Energy level must be between 1-10']
  },
  productivity: {
    type: Number,
    min: [1, 'Productivity must be between 1-10'],
    max: [10, 'Productivity must be between 1-10']
  },
  sleepHours: {
    type: Number,
    min: [0, 'Sleep hours cannot be negative'],
    max: [24, 'Sleep hours cannot exceed 24']
  },
  importantEvents: [{
    type: String,
    maxlength: [100, 'Event description cannot exceed 100 characters']
  }],
  goals: [{
    type: String,
    maxlength: [200, 'Goal cannot exceed 200 characters']
  }],
  reflection: {
    type: String,
    maxlength: [1000, 'Reflection cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for efficient date-based queries
// dailyLogSchema.index({ date: 1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
