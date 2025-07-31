const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: String,
  month: String
});

module.exports = mongoose.model('Expense', ExpenseSchema);
