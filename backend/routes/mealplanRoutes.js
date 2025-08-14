const express = require('express');
const router = express.Router();

const {
    addMealPlan,
    getAllMealPlans,
    getMealPlanByDate,
    updateMealPlan,
    deleteMealPlan,
    getMealPlansByDateRange,
    getMealStats
} = require('../controllers/mealPlanController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/v1/auth/mealplan/add
router.post('/add', protect, addMealPlan);

// GET /api/v1/auth/mealplan
router.get('/get', protect, getAllMealPlans);

// GET /api/v1/auth/mealplan/date/:date
router.get('/date/:date', protect, getMealPlanByDate);

// GET /api/v1/auth/mealplan/range
router.get('/range', protect, getMealPlansByDateRange);

// GET /api/v1/auth/mealplan/stats
router.get('/stats', protect, getMealStats);

// PUT /api/v1/auth/mealplan/:id
router.put('/:id', protect, updateMealPlan);

// DELETE /api/v1/auth/mealplan/:id
router.delete('/:id', protect, deleteMealPlan);

module.exports = router;
