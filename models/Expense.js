const mongoose = require('mongoose');
const tz = require('mongoose-timezone');
const expenseSchema = new mongoose.Schema({
  purpose: {
    type: String
  },
    monitors: {
    type: Number,
    required: true,
    default: 0,
  },
  keyboards: {
    type: Number,
    required: true,
    default: 0,
  },
  harddisks: {
    type: Number,
    required: true,
    default: 0,
  },
  motherboard: {
    type: Number,
    required: true,
    default: 0,
  },
  rams: {
    type: Number,
    required: true,
    default: 0,
  },
  mouse: {
    type: Number,
    required: true,
    default: 0,
  },
  processors: {
    type: Number,
    required: true,
    default: 0,
  },
  lightings: {
    type: Number,
    required: true,
    default: 0,
  },
  fans: {
    type: Number,
    required: true,
    default: 0,
  },
  others: {
    type: Number,
    required: true,
    default: 0,
  },
  amount: {
    type: Number,
    required: true,
  },
  expenseDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

expenseSchema.plugin(tz);
module.exports = mongoose.model('Expense', expenseSchema);
