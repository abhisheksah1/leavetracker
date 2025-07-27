import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';  // Import toast and container
import 'react-toastify/dist/ReactToastify.css';          // Import styles
import './AddEmployee.css';

const AddEmployee = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeeDepartment: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      const data = await response.json();
      toast.success(data.message || 'Employee added successfully!');

      // Reset form and close popup
      setFormData({
        employeeId: '',
        employeeName: '',
        employeeDepartment: '',
      });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add employee. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-employee-container">
      <button className="add-employee-button" onClick={() => setShowForm(true)}>
        Add Employee
      </button>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Add New Employee</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Employee ID:
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Employee Name:
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Employee Department:
                <input
                  type="text"
                  name="employeeDepartment"
                  value={formData.employeeDepartment}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast container to render toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddEmployee;
