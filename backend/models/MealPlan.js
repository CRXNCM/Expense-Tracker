const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    meals: [
      {
        type: {
          type: String,
          enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        ingredients: [String], // optional
        cost: Number, // optional
        calories: Number, // optional
      },
    ],
    totalCost: Number,
    totalCalories: Number,
  }, { timestamps: true });

  module.exports = mongoose.model('MealPlan', MealPlanSchema);
