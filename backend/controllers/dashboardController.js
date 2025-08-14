const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const DailyLog = require('../models/DailyLog');
const MealPlan = require('../models/MealPlan');
const FixedExpense = require('../models/FixedExpense');
const { Types } = require('mongoose');

// Helper function to get date ranges
const getDateRanges = () => {
    const now = new Date();
    
    // Today
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // This week (Monday to Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    // This month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return { today, startOfWeek, startOfMonth, endOfMonth };
};

// @desc    Get comprehensive dashboard data
// @route   GET /api/v1/auth/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const { today, startOfWeek, startOfMonth } = getDateRanges();

        // Get total income and expenses
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalExpenses = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get daily data
        const dailyIncome = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: today }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const dailyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: today }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get weekly data
        const weeklyIncome = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startOfWeek }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const weeklyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startOfWeek }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get monthly data
        const monthlyIncome = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startOfMonth }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const monthlyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startOfMonth }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get recent daily logs
        const recentDailyLogs = await DailyLog.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .select('date mood notes createdAt');

        // Get today's meal plans
        const todayMeals = await MealPlan.find({ 
            userId: userObjectId,
            date: { 
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).select('mealType mealName calories');

        // Get meal plan count for this week
        const weeklyMeals = await MealPlan.countDocuments({
            userId: userObjectId,
            date: { $gte: startOfWeek }
        });

        // Get expense categories summary
        const expenseCategories = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        // Get income sources summary
        const incomeSources = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: '$source', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        // Calculate balances
        const totalIncomeAmount = totalIncome[0]?.total || 0;
        const totalExpensesAmount = totalExpenses[0]?.total || 0;

        res.json({
            success: true,
            data: {
                summary: {
                    totalIncome: totalIncomeAmount,
                    totalExpenses: totalExpensesAmount,
                    totalBalance: totalIncomeAmount - totalExpensesAmount
                },
                daily: {
                    income: dailyIncome[0]?.total || 0,
                    expenses: dailyExpenses[0]?.total || 0,
                    balance: (dailyIncome[0]?.total || 0) - (dailyExpenses[0]?.total || 0)
                },
                weekly: {
                    income: weeklyIncome[0]?.total || 0,
                    expenses: weeklyExpenses[0]?.total || 0,
                    balance: (weeklyIncome[0]?.total || 0) - (weeklyExpenses[0]?.total || 0)
                },
                monthly: {
                    income: monthlyIncome[0]?.total || 0,
                    expenses: monthlyExpenses[0]?.total || 0,
                    balance: (monthlyIncome[0]?.total || 0) - (monthlyExpenses[0]?.total || 0)
                },
                recentActivities: {
                    dailyLogs: recentDailyLogs,
                    todayMeals: todayMeals,
                    weeklyMealCount: weeklyMeals
                },
                analytics: {
                    topExpenseCategories: expenseCategories,
                    topIncomeSources: incomeSources
                }
            }
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

// @desc    Get dashboard charts data with trends
// @route   GET /api/v1/auth/dashboard/charts
// @access  Private
const getDashboardCharts = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const { period = 'month' } = req.query;

        let startDate, endDate;
        const now = new Date();

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                endDate = new Date();
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        // Get income trend
        const incomeTrend = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        day: { $dayOfMonth: '$date' }
                    },
                    amount: { $sum: '$amount' }
                } 
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get expense trend
        const expenseTrend = await Expense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        day: { $dayOfMonth: '$date' }
                    },
                    amount: { $sum: '$amount' }
                } 
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get category breakdown
        const expenseByCategory = await Expense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);

        const incomeByCategory = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            { $group: { _id: '$source', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                period,
                trends: {
                    income: incomeTrend,
                    expenses: expenseTrend
                },
                breakdown: {
                    incomeByCategory,
                    expensesByCategory: expenseByCategory
                }
            }
        });
    } catch (error) {
        console.error('Dashboard charts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard charts'
        });
    }
});

// @desc    Get quick stats for dashboard
// @route   GET /api/v1/auth/dashboard/quick-stats
// @access  Private
const getQuickStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const { today, startOfWeek, startOfMonth } = getDateRanges();

        // Count documents
        const totalIncomes = await Income.countDocuments({ userId: userObjectId });
        const totalExpenses = await Expense.countDocuments({ userId: userObjectId });
        const totalDailyLogs = await DailyLog.countDocuments({ userId: userObjectId });
        const totalMealPlans = await MealPlan.countDocuments({ userId: userObjectId });

        // Today's stats
        const todayIncomes = await Income.countDocuments({ 
            userId: userObjectId,
            date: { $gte: today }
        });
        const todayExpenses = await Expense.countDocuments({ 
            userId: userObjectId,
            date: { $gte: today }
        });

        res.json({
            success: true,
            data: {
                totals: {
                    incomes: totalIncomes,
                    expenses: totalExpenses,
                    dailyLogs: totalDailyLogs,
                    mealPlans: totalMealPlans
                },
                today: {
                    incomes: todayIncomes,
                    expenses: todayExpenses
                }
            }
        });
    } catch (error) {
        console.error('Quick stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quick stats'
        });
    }
});

// @desc    Get dashboard summary (legacy endpoint)
// @route   GET /api/v1/auth/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        
        // Get total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get total expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
            totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0)
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard summary'
        });
    }
});

// @desc    Get weekly progress (fixed weekly expenses vs weekly income)
// @route   GET /api/v1/auth/dashboard/weekly-progress
// @access  Private
const getWeeklyProgress = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        const { startOfWeek } = getDateRanges();

        // Get weekly fixed expenses (only weekly period type)
        const weeklyFixedExpenses = await FixedExpense.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    periodType: 'weekly'
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { 
                        $sum: { 
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: "$$item.amount"
                                }
                            }
                        } 
                    } 
                } 
            }
        ]);

        // Get weekly income
        const weeklyIncome = await Income.aggregate([
            { 
                $match: { 
                    userId: userObjectId,
                    date: { $gte: startOfWeek }
                } 
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const fixedWeeklyExpensesAmount = weeklyFixedExpenses[0]?.total || 0;
        const weeklyIncomeAmount = weeklyIncome[0]?.total || 0;
        const remainingAmount = fixedWeeklyExpensesAmount - weeklyIncomeAmount;

        // Calculate progress percentage
        let progressPercentage = 0;
        if (fixedWeeklyExpensesAmount > 0) {
            progressPercentage = Math.min(
                Math.max((weeklyIncomeAmount / fixedWeeklyExpensesAmount) * 100, 0),
                100
            );
        }

        res.json({
            success: true,
            data: {
                fixedWeeklyExpenses: fixedWeeklyExpensesAmount,
                weeklyIncome: weeklyIncomeAmount,
                remainingAmount: remainingAmount,
                progressPercentage: progressPercentage,
                status: remainingAmount <= 0 ? 'surplus' : 'deficit'
            }
        });
    } catch (error) {
        console.error('Weekly progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weekly progress data'
        });
    }
});

module.exports = {
    getDashboardSummary,
    getDashboardData,
    getDashboardCharts,
    getQuickStats,
    getWeeklyProgress
};
