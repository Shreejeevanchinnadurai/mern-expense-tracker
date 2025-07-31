const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Salary', SalarySchema);
