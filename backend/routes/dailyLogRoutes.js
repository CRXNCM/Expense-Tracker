const express = require('express');
const router = express.Router();
const {
  createDailyLog,
  getAllLogs,
  getLogByDate,
  updateLog,
  deleteLog
} = require('../controllers/dailyLogController');

// POST /api/v1/auth/dailylog — create a log
router.post('/add', createDailyLog);

// GET /api/v1/auth/dailylog — get all logs
router.get('/getUser', getAllLogs);

// GET /api/v1/auth/dailylog/:date — get log by date
router.get('/:date', getLogByDate);

// PUT /api/v1/auth/dailylog/:id — update log
router.put('/:id', updateLog);

// DELETE /api/v1/auth/dailylog/:id — delete log
router.delete('/:id', deleteLog);

module.exports = router;
