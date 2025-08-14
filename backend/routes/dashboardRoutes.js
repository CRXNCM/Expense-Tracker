const express = require('express');
const router = express.Router();
const { getDashboardSummary, getQuickStats, getDashboardData, getDashboardCharts, getWeeklyProgress } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/v1/auth/dashboard/summary
// @desc    Get dashboard summary
// @access  Private
router.get('/summary', protect, getDashboardSummary);
router.get('/getQuick', protect, getQuickStats);
router.get('/data', protect, getDashboardData);
router.get('/charts', protect, getDashboardCharts);
router.get('/weeklyProgress', protect, getWeeklyProgress);


module.exports = router;
