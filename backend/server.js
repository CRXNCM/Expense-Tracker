require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const dailyLogRoutes = require('./routes/dailyLogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fixedexpensesRoutes = require('./routes/fixedexpensesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRouter = require('./routes/testRouter');
const noteRoutes = require('./routes/noteRoutes');



const app = express();

// Enhanced CORS configuration
app.use(
    cors({
        origin: process.env.CLIENTS_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    })
);

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling for body parsing
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body'
        });
    }
    next(err);
});

connectDB();                                                                    
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/income', incomeRoutes);
app.use('/api/v1/auth/expense', expenseRoutes);
app.use('/api/v1/auth/mealPlan', mealPlanRoutes);
app.use('/api/v1/auth/dailyLog', dailyLogRoutes);
app.use('/api/v1/auth/dashboard', dashboardRoutes);
app.use('/api/v1/auth/fixedexpenses', fixedexpensesRoutes);
app.use('/api/v1/auth/admin', adminRoutes);
app.use('/api/v1/auth/note', noteRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
