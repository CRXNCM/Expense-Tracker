const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Active Income', 'Passive Income', 'Investment Income', 'Business Income', 'Other']
    },
}, {timestamps: true});
module.exports = mongoose.model('Income', incomeSchema);
