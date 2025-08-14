const User = require('../models/User');
const MealPlan = require('../models/MealPlan');
const mongoose = require('mongoose');

exports.addMealPlan = async (req, res) => {
    const userId = req.user.id;
    try {
        const { date, meals, totalCost, totalCalories } = req.body;

        if (!date || !meals || !Array.isArray(meals) || meals.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Date and meals array are required'
            });
        }

        // Validate meal structure
        for (const meal of meals) {
            if (!meal.type || !meal.name) {
                return res.status(400).json({
                    success: false,
                    message: 'Each meal must have type and name'
                });
            }
        }

        const newMealPlan = new MealPlan({
            userId,
            date: new Date(date),
            meals,
            totalCost: totalCost || 0,
            totalCalories: totalCalories || 0
        });

        await newMealPlan.save();
        res.status(201).json(newMealPlan);
    } catch (error) {
        console.error("Add meal plan error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.getAllMealPlans = async (req, res) => {
    const userId = req.user.id;
    try {
        const mealPlans = await MealPlan.find({ userId }).sort({ date: -1 });
        res.json(mealPlans);
    } catch (error) {
        console.error("Get meal plans error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.getMealPlanByDate = async (req, res) => {
    const userId = req.user.id;
    const { date } = req.params;
    try {
        const mealPlan = await MealPlan.findOne({ userId, date: new Date(date) });
        if (!mealPlan) {
            return res.status(404).json({ success: false, message: "Meal plan not found" });
        }
        res.json(mealPlan);
    } catch (error) {
        console.error("Get meal plan by date error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.updateMealPlan = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const { date, meals, totalCost, totalCalories } = req.body;

        if (!date || !meals || !Array.isArray(meals) || meals.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Date and meals array are required'
            });
        }

        const updatedMealPlan = await MealPlan.findOneAndUpdate(
            { _id: id, userId },
            { date: new Date(date), meals, totalCost, totalCalories },
            { new: true }
        );

        if (!updatedMealPlan) {
            return res.status(404).json({ success: false, message: "Meal plan not found" });
        }

        res.json(updatedMealPlan);
    } catch (error) {
        console.error("Update meal plan error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.deleteMealPlan = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const deletedMealPlan = await MealPlan.findOneAndDelete({ _id: id, userId });
        if (!deletedMealPlan) {
            return res.status(404).json({ success: false, message: "Meal plan not found" });
    }
        res.json({ success: true, message: "Meal plan deleted successfully" });
    } catch (error) {
        console.error("Delete meal plan error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.getMealPlansByDateRange = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    try {
        const mealPlans = await MealPlan.find({
            userId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).sort({ date: 1 });

        res.json(mealPlans);
    } catch (error) {
        console.error("Get meal plans by date range error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

exports.getMealStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const stats = await MealPlan.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalMeals: { $sum: { $size: "$meals" } },
                    totalCost: { $sum: "$totalCost" },
                    totalCalories: { $sum: "$totalCalories" },
                    avgCost: { $avg: "$totalCost" },
                    avgCalories: { $avg: "$totalCalories" }
                }
            }
        ]);

        res.json(stats[0] || {});
    } catch (error) {
        console.error("Get meal stats error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};
