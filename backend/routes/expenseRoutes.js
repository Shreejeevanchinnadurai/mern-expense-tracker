const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Expense model
const Expense = mongoose.model('Expense', new mongoose.Schema({
  description: String,
  amount: Number,
  date: String,
  month: String
}));

// Get all expenses
router.get('/', async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

// Add expense
router.post('/', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

// Update expense
router.put('/:id', async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete expense
router.delete('/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
