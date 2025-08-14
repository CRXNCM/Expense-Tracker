const express = require('express');
const router = express.Router();

const {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel,
    getExpenseSummary,
    addBulkExpenses
} = require('../controllers/expenseController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/v1/auth/expense/add
router.post('/add', protect, addExpense);

// GET /api/v1/auth/expense
router.get('/get', protect, getAllExpenses);

router.delete('/:id', protect, deleteExpense);

// GET /api/v1/auth/expense/downloadexcel
router.get('/downloadexcel', protect, downloadExpenseExcel);

// GET /api/v1/auth/expense/summary
router.get('/summary', protect, getExpenseSummary);

// POST /api/v1/auth/expense/bulk
router.post('/bulk', protect, addBulkExpenses);


module.exports = router;
