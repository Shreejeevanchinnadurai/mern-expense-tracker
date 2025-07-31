const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Salary model
const Salary = mongoose.model('Salary', new mongoose.Schema({
  month: String,
  amount: Number
}));

// Get all salaries
router.get('/', async (req, res) => {
  const data = await Salary.find();
  res.json(data);
});

// Add salary
router.post('/', async (req, res) => {
  const salary = new Salary(req.body);
  await salary.save();
  res.json(salary);
});

// Update salary
router.put('/:id', async (req, res) => {
  const updated = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete salary
router.delete('/:id', async (req, res) => {
  await Salary.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
