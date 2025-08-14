const User = require('../models/User');
const xlsx = require('xlsx');
const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, title, amount, category, description, date } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const newExpense = new Expense({
            userId,
            icon,
            title,
            amount,
            category,
            description,
            date: new Date(date)
        });

        await newExpense.save();
    
        res.status(200).json(newExpense);
    } catch (error) {
        console.error("Add expense error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error("Get expenses error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        
        const data = expenses.map((item) => ({
            title: item.title,
            amount: item.amount,
            category: item.category,
            description: item.description,
            date: item.date,
        }));
        
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expenses');
        xlsx.writeFile(wb, 'expenses.xlsx');
        res.download('expenses.xlsx');
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.getExpenseSummary = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId });
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        res.json({
            totalExpenses: expenses.length,
            totalAmount,
            categoryTotals
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
}
exports.addBulkExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
        let expenses = req.body.expenses || req.body; // Support both { expenses: [...] } and raw array

        if (!Array.isArray(expenses) || expenses.length === 0) {
            return res.status(400).json({ success: false, message: "No expenses provided" });
        }

        // Format and add userId
        const formattedExpenses = expenses.map(exp => ({
            userId,
            icon: exp.icon || "💸", // default icon
            title: exp.title,
            amount: exp.amount,
            category: exp.category,
            description: exp.description || "",
            date: new Date(exp.date)
        }));

        const savedExpenses = await Expense.insertMany(formattedExpenses);

        res.status(201).json({
            success: true,
            message: "Bulk expenses added successfully",
            data: savedExpenses
        });
    } catch (error) {
        console.error("Bulk expense error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
