// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  employeeDepartment: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// ✅ Prevent model overwrite on hot reload / repeated imports
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;
