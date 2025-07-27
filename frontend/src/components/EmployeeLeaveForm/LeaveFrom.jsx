import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LeaveForm.css'

const LeaveForm = () => {
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    leaveType: 'Casual',
    leaveMode: 'Single',
    leaveDate: '',
    leaveFrom: '',
    leaveTo: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.employeeId.trim()) return "Employee ID is required";
    if (!form.employeeName.trim()) return "Employee Name is required";
    if (form.leaveMode === 'Single' && !form.leaveDate) return "Select a leave date";
    if (form.leaveMode === 'Multiple' && (!form.leaveFrom || !form.leaveTo)) return "Select both From and To dates";
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const body = {
        employeeId: form.employeeId,
        employeeName: form.employeeName,
        leaveType: form.leaveType,
        leaveMode: form.leaveMode,
        leaveDate: form.leaveMode === 'Single' ? form.leaveDate : undefined,
        leaveFrom: form.leaveMode === 'Multiple' ? form.leaveFrom : undefined,
        leaveTo: form.leaveMode === 'Multiple' ? form.leaveTo : undefined,
      };

      const res = await fetch('http://localhost:3000/api/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to apply leave');

      toast.success('Leave applied successfully!');
      setForm({
        employeeId: '',
        employeeName: '',
        leaveType: 'Casual',
        leaveMode: 'Single',
        leaveDate: '',
        leaveFrom: '',
        leaveTo: '',
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="leave-form-container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="leave-form">
        <label>
          Employee ID
          <input
            type="text"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />
        </label>

        <label>
          Employee Name
          <input
            type="text"
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            placeholder="Enter Employee Name"
            required
          />
        </label>

        <label>
          Leave Mode
          <select name="leaveMode" value={form.leaveMode} onChange={handleChange}>
            <option value="Single">Single Day</option>
            <option value="Multiple">Multiple Days</option>
          </select>
        </label>

        {form.leaveMode === 'Single' ? (
          <label>
            Leave Date
            <input
              type="date"
              name="leaveDate"
              value={form.leaveDate}
              onChange={handleChange}
              required={form.leaveMode === 'Single'}
            />
          </label>
        ) : (
          <>
            <label>
              Leave From
              <input
                type="date"
                name="leaveFrom"
                value={form.leaveFrom}
                onChange={handleChange}
                required={form.leaveMode === 'Multiple'}
              />
            </label>

            <label>
              Leave To
              <input
                type="date"
                name="leaveTo"
                value={form.leaveTo}
                onChange={handleChange}
                required={form.leaveMode === 'Multiple'}
              />
            </label>
          </>
        )}

        <label>
          Leave Type
          <select name="leaveType" value={form.leaveType} onChange={handleChange}>
            {['Casual', 'Personal', 'Sick', 'Halfday', 'Overtime', 'Unpaid'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <button type="submit">Apply Leave</button>
      </form>

      {/* Toast Container to show notifications */}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default LeaveForm;
