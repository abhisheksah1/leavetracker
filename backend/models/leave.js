// /backend/models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leave', leaveSchema);
