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

    const employee = await Employee.findOne({ employeeId, employeeName });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or details do not match' });
    }

    const leaveData = {
      employeeId,
      employeeName,
      leaveType,
      leaveMode,
    };

    let leaveDays = 0;

    if (leaveMode === 'Single') {
      if (!leaveDate) {
        return res.status(400).json({ message: 'Leave date is required for single day leave' });
      }
      leaveData.leaveDate = leaveDate;
      leaveDays = 1; // Single day leave
    } else if (leaveMode === 'Multiple') {
      if (!leaveFrom || !leaveTo) {
        return res.status(400).json({ message: 'Both start and end dates are required for multiple day leave' });
      }
      leaveData.leaveFrom = leaveFrom;
      leaveData.leaveTo = leaveTo;
      leaveDays = (new Date(leaveTo) - new Date(leaveFrom)) / (1000 * 60 * 60 * 24) + 1; // Calculate total days
    } else {
      return res.status(400).json({ message: 'Invalid leave mode selected' });
    }

    leaveData.leaveDays = leaveDays; // Add leaveDays to leaveData

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

    const summary = {
      casualLeave: 0,
      sickLeave: 0,
      personalLeave: 0,
      halfLeave: 0,
      unpaidLeave: 0,
      overtime: 0,
    };

    leaves.forEach((leave) => {
      let days = 0;
      const leaveMode = leave.leaveMode?.toLowerCase().trim();
      let type = leave.leaveType?.toLowerCase().trim();

      // Normalize halfday to half
      if (type === 'halfday') {
        type = 'half';
      }

      // Calculate days based on leave mode
      if (leave.leaveDays !== undefined) {
        // Use leaveDays if provided explicitly
        days = leave.leaveDays;
      } else if (leaveMode === 'single') {
        days = 1;
      } else if (leaveMode === 'half') {
        days = 0.5;
      } else if (leaveMode === 'multiple') {
        // Calculate difference between leaveFrom and leaveTo (inclusive)
        const fromDate = new Date(leave.leaveFrom);
        const toDate = new Date(leave.leaveTo);
        if (!isNaN(fromDate) && !isNaN(toDate)) {
          days = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
        }
      }

      // Override days if leave type is half
      if (type === 'half') {
        days = 0.5;
      }

      // Add days to corresponding leave type summary
      switch (type) {
        case 'casual':
          summary.casualLeave += days;
          break;
        case 'sick':
          summary.sickLeave += days;
          break;
        case 'personal':
          summary.personalLeave += days;
          break;
        case 'half':
          summary.halfLeave += days;
          break;
        case 'unpaid':
          summary.unpaidLeave += days;
          break;
        case 'overtime':
          summary.overtime += days;
          break;
        default:
          break;
      }
    });

    const totalAllowed = 14;
    const totalTaken =
      summary.casualLeave +
      summary.sickLeave +
      summary.personalLeave +
      summary.unpaidLeave +
      summary.halfLeave;

    // Allow leaveBalance to be negative if totalTaken exceeds totalAllowed
    const leaveBalance = totalAllowed - totalTaken + summary.overtime;

    res.status(200).json({
      leaves,
      summary: {
        ...summary,
        totalLeave: totalTaken,
        leaveBalance,
      },
    });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
