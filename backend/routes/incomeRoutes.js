const express = require('express');
const router = express.Router();

const {
    addIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
    downloadIncomeExcel,
    addBulkIncomes
} = require('../controllers/incomeController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/v1/auth/income/add
router.post('/add', protect, addIncome);

// GET /api/v1/auth/income
router.get('/get', protect, getAllIncomes);

// PUT /api/v1/auth/income/:id
router.put('/update/:id', protect, updateIncome);

// DELETE /api/v1/auth/income/:id
router.delete('/delete/:id', protect, deleteIncome);

// GET /api/v1/auth/income/downloadexcel
router.get('/downloadexcel', protect, downloadIncomeExcel);
// POST /api/v1/auth/income/bulk
router.post('/bulk', protect, addBulkIncomes);


module.exports = router;
