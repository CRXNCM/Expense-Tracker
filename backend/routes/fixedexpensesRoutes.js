// routes/fixedExpenseRoutes.js
const express = require('express');
const router = express.Router();
const {
  createFixedExpense,
  getFixedExpenses,
  updateFixedExpense,
  deleteFixedExpense,
  addBulkFixedExpenses
} = require('../controllers/fixedExpenseController');

const { protect } = require('../middleware/authMiddleware'); // Auth middleware

// @desc    Create a new fixed expense
// @route   POST /api/fixed-expenses
// @access  Private
router.post('/add', protect, createFixedExpense);

// @desc    Get all fixed expenses (with optional filters: periodType, date range)
// @route   GET /api/fixed-expenses
// @access  Private
router.get('/getall', protect, getFixedExpenses);


// @desc    Update a fixed expense by ID
// @route   PUT /api/fixed-expenses/:id
// @access  Private
router.put('/:id', protect, updateFixedExpense);

// @desc    Delete a fixed expense by ID
// @route   DELETE /api/fixed-expenses/:id
// @access  Private
router.delete('/:id', protect, deleteFixedExpense);
router.post("/bulk", addBulkFixedExpenses);


module.exports = router;
