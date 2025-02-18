const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Import the Transaction model

// POST: Add a new transaction
router.post('/', async (req, res) => {
  const { amount, date, description, category } = req.body;
  console.log('Received request body:', req.body);
  try {
    const newTransaction = new Transaction({
      amount,
      date,
      description,
      category,
    });
console.log('POST: Add a new transaction...', newTransaction)
    await newTransaction.save(); // Save the transaction to MongoDB
    res.status(201).json(newTransaction); // Return the created transaction as response
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

module.exports = router;
