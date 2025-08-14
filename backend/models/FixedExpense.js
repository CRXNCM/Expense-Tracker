const mongoose = require('mongoose');

const ExpenseItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Peanut, Oil
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { 
    type: Number,
    required: true,
    default: function() {
      return this.quantity * this.unitPrice;
    }
  }
});

const FixedExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  }, // e.g., Groceries, Transport, Internet
  periodType: { 
    type: String, 
    enum: ['Weekly', 'Monthly'], 
    required: true 
  },
  periodStart: { type: Date, required: true }, // Start of the week or month
  periodEnd: { type: Date, required: true },   // End of the week or month
  items: [ExpenseItemSchema], // Detailed breakdown
  totalAmount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { type: Date, default: Date.now }
});

// Auto calculate total amount before save
FixedExpenseSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  next();
});

module.exports = mongoose.model('FixedExpense', FixedExpenseSchema);
