const User = require('../models/User');
const xlsx = require('xlsx');
const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const { icon, source, amount, date, category } = req.body; 

        if (!source || !amount || !date || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
            category
        });

        await newIncome.save();
    
        res.status(200).json(newIncome);
    }catch (error) {
        console.error("Add income error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;
    try{
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.json(incomes);
    }catch (error) {
        console.error("Get incomes error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, source, amount, date, category } = req.body;

        if (!source || !amount || !date || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updatedIncome = await Income.findOneAndUpdate(
            { _id: req.params.id, userId },
            {
                icon,
                source,
                amount,
                date: new Date(date),
                category
            },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: 'Income not found'
            });
        }

        res.json(updatedIncome);
    } catch (error) {
        console.error("Update income error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Income deleted successfully" });
    }catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        
        const data = incomes.map((item) => ({
            source: item.source,
            amount: item.amount,
            date: item.date,
            category: item.category
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes');
        xlsx.writeFile(wb, 'incomes.xlsx');
        res.download('incomes.xlsx');
    }catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
}
exports.addBulkIncomes = async (req, res) => {
    const userId = req.user.id;
    try {
        let incomes = req.body.incomes || req.body; // Support both { incomes: [...] } and raw array

        if (!Array.isArray(incomes) || incomes.length === 0) {
            return res.status(400).json({ success: false, message: "No incomes provided" });
        }

        // Validate and format
        const formattedIncomes = incomes.map(inc => ({
            userId,
            icon: inc.icon || "💰", // Default icon if not provided
            source: inc.source,
            amount: inc.amount,
            date: new Date(inc.date),
            category: inc.category
        }));

        const savedIncomes = await Income.insertMany(formattedIncomes);

        res.status(201).json({
            success: true,
            message: "Bulk incomes added successfully",
            data: savedIncomes
        });
    } catch (error) {
        console.error("Bulk income error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
