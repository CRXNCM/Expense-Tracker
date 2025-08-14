const FixedExpense = require('../models/FixedExpense');

// Create new fixed expense
exports.createFixedExpense = async (req, res) => {
  try {
    const { category, periodType, periodStart, periodEnd, items } = req.body;

    const newExpense = new FixedExpense({
      userId: req.user._id,
      category,
      periodType,
      periodStart,
      periodEnd,
      items
    });

    await newExpense.save();
    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all fixed expenses
exports.getFixedExpenses = async (req, res) => {
  try {
    const { periodType, startDate, endDate } = req.query;
    let filter = { userId: req.user._id };

    if (periodType) filter.periodType = periodType;
    if (startDate && endDate) {
      filter.periodStart = { $gte: new Date(startDate) };
      filter.periodEnd = { $lte: new Date(endDate) };
    }

    const expenses = await FixedExpense.find(filter);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update fixed expense
exports.updateFixedExpense = async (req, res) => {
  try {
    const updatedExpense = await FixedExpense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete fixed expense
exports.deleteFixedExpense = async (req, res) => {
  try {
    const deletedExpense = await FixedExpense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addBulkFixedExpenses = async (req, res) => {
  try {
    const { userId, expenses } = req.body;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "No expenses provided" });
    }

    const expensesWithUser = expenses.map(exp => ({
      ...exp,
      userId
    }));

    const savedExpenses = await FixedExpense.insertMany(expensesWithUser);

    res.status(201).json({
      message: "Bulk expenses added successfully",
      data: savedExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
