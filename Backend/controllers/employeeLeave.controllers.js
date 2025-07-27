// controllers/leaveController.js
import Employee from '../models/employeeAdd.model.js';
import Leave from '../models/employeeLeaveSchema.js';

export const applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      leaveType,
      leaveMode,
      leaveDate,
      leaveFrom,
      leaveTo
    } = req.body;

    // Step 1: Match employee ID and name
    const employee = await Employee.findOne({ employeeId, employeeName });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or details do not match' });
    }

    // Step 2: Validate and prepare leave data
    const leaveData = {
      employeeId,
      employeeName,
      leaveType,
      leaveMode,
    };

    if (leaveMode === 'Single') {
      if (!leaveDate) {
        return res.status(400).json({ message: 'Leave date is required for single day leave' });
      }
      leaveData.leaveDate = leaveDate;
    } else if (leaveMode === 'Multiple') {
      if (!leaveFrom || !leaveTo) {
        return res.status(400).json({ message: 'Both start and end dates are required for multiple day leave' });
      }
      leaveData.leaveFrom = leaveFrom;
      leaveData.leaveTo = leaveTo;
    } else {
      return res.status(400).json({ message: 'Invalid leave mode selected' });
    }

    // Step 3: Save to Leave database
    const newLeave = new Leave(leaveData);
    await newLeave.save();

    res.status(201).json({
      message: 'Leave applied successfully',
      data: newLeave,
    });
  } catch (error) {
    console.error('Error applying leave:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getLeavesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId query parameter is required' });
    }

    const leaves = await Leave.find({ employeeId });

    // Initialize summary object
    const summary = leaves.reduce((acc, leave) => {
      // Extract days and hours from each leave record
      const days = leave.leaveDays || 0;
      const hours = leave.leaveHours || 0;

      // Add to specific leave type counters
      switch (leave.leaveType) {
        case 'Casual':
          acc.casualLeave += days;
          break;
        case 'Sick':
          acc.sickLeave += days;
          break;
        case 'Personal':
          acc.personalLeave += days;
          break;
        case 'Half':
          // Count half leave as half days (for counting individual half leaves)
          acc.halfLeave += days; 
          break;
        case 'Overtime':
          acc.overtime += days;
          break;
        case 'Unpaid':
          acc.unpaidLeave += days;
          break;
      }

      return acc;
    }, {
      casualLeave: 0,
      sickLeave: 0,
      personalLeave: 0,
      halfLeave: 0,
      overtime: 0,
      unpaidLeave: 0,
    });

    // Calculate totalLeave:
    // totalLeave = sum of all leave days except halfLeave, plus overtime converted to days,
    // subtract halfLeave counted as 0.5 days each (assuming each halfLeave record represents 1 day but half leave counts as 0.5)
    const totalLeave =
      summary.casualLeave +
      summary.sickLeave +
      summary.personalLeave +
      summary.unpaidLeave +
      (summary.overtime / 8) -    // convert overtime hours to days (8 hours = 1 day)
      (summary.halfLeave * 0.5);  // subtract half leaves as half days each

    // Add totalLeave to summary object
    summary.totalLeave = totalLeave;

    res.status(200).json({ leaves, summary });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

