import React, { useEffect, useState } from 'react';
import './ViewEmployee.css';

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png'; // Placeholder avatar

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewProfile = async (emp) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/leaves/getLeave?employeeId=${emp.employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch leave data');
      const data = await res.json();
      const { summary } = data;
      const completeData = { ...emp, ...summary };
      setSelectedEmployee(completeData);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedEmployee(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <div className="loader">Loading employees...</div>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const renderModal = () => {
    if (detailLoading) return <p>Loading details...</p>;
    if (detailError) return <p className="error-message">Error: {detailError}</p>;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <button className="close-button" onClick={() => setSelectedEmployee(null)}>❌</button>
        </div>
        <div className='profileWithName'>
        <img src={defaultAvatar} alt="Profile" className="modal-avatar" />
        <h2 className="employee-name">{selectedEmployee.employeeName}</h2>
          <p><strong>ID:</strong> {selectedEmployee.employeeId}</p>
        </div>
        <div className="employee-details">
          <p><strong>Department:</strong> {selectedEmployee.employeeDepartment}</p>
         <p>
  <strong>Leave Balance:</strong>{' '}
  <span
    style={{
      color: (selectedEmployee.leaveBalance ?? 0) >= 0 ? 'green' : 'red',
      fontWeight: 'bold'
    }}
  >
    {(selectedEmployee.leaveBalance ?? 0).toFixed(1)} days remaining
  </span>
</p>
        </div>
        <h4 className="section-title">Leave Details</h4>
        <div className="leave-details-grid">
          <div className="leave-detail">
            <p>Casual Leave</p>
            <strong>{(selectedEmployee.casualLeave ?? 0).toFixed(1)} days</strong>
          </div>
          <div className="leave-detail">
            <p>Sick Leave</p>
            <strong>{(selectedEmployee.sickLeave ?? 0).toFixed(1)} days</strong>
          </div>
          <div className="leave-detail">
            <p>Personal Leave</p>
            <strong>{(selectedEmployee.personalLeave ?? 0).toFixed(1)} days</strong>
          </div>
          <div className="leave-detail">
            <p>Half Leave</p>
            <strong>{(selectedEmployee.halfLeave ?? 0).toFixed(1)} days</strong>
          </div>
          <div className="leave-detail">
            <p>Overtime</p>
            <strong>{(selectedEmployee.overtime ?? 0).toFixed(1)} days</strong>
          </div>
          <div className="leave-detail">
            <p>Unpaid Leave</p>
            <strong>{(selectedEmployee.unpaidLeave ?? 0).toFixed(1)} days</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="employee-list">
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div className="employee-card" key={emp._id}>
            <img src={defaultAvatar} alt="User  " className="employee-avatar" />
            <div className="employee-info">
              <h3>{emp.employeeName}</h3>
              <p><strong>ID:</strong> {emp.employeeId}</p>
              <p><strong>Department:</strong> {emp.employeeDepartment}</p>
              <button onClick={() => handleViewProfile(emp)}>View Profile</button>
            </div>
          </div>
        ))
      )}

      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
