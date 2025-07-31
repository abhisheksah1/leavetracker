// models/Leave.js
import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Casual', 'Personal', 'Sick', 'Halfday', 'Overtime', 'Unpaid'],
    required: true,
  },
  leaveMode: {
    type: String,
    enum: ['Single', 'Multiple'],
    required: true,
  },
  leaveDate: Date,
  leaveFrom: Date,
  leaveTo: Date,
}, { timestamps: true });

const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

export default Leave;
