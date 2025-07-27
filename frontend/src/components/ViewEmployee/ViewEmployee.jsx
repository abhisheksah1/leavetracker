import React, { useEffect, useState } from 'react';
import './ViewEmployee.css';

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

// Helper: Calculate days between two dates inclusive
const daysBetween = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(end) - new Date(start)) / oneDay) + 1;
};

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
        if (!res.ok) {
          throw new Error('Failed to fetch employees');
        }
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

  const calculateTotalLeave = (employee) => {
    const totalAllowed = 14;
    const overtimeDays = (employee.overtime || 0) / 8; // 8 hours = 1 day
    const totalLeavesTaken =
      (employee.casualLeave || 0) +
      (employee.sickLeave || 0) +
      (employee.personalLeave || 0) +
      (employee.unpaidLeave || 0) +
      ((employee.halfLeave || 0) * 0.5);

    // toFixed returns a string, so convert back to number to keep consistent type
    const balance = totalAllowed + overtimeDays - totalLeavesTaken;
    return Math.max(0, Number(balance.toFixed(1)));
  };

  const handleViewProfile = async (emp) => {
    setDetailLoading(true);
    setDetailError(null);

    try {
      const res = await fetch(`http://localhost:3000/api/leaves/getLeave?employeeId=${emp.employeeId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch leave data');
      }
      const data = await res.json();

      // Calculate leave summary from leaves array
      const summary = data.leaves.reduce(
        (acc, leave) => {
          let days = 1;

          if (leave.leaveFrom && leave.leaveTo) {
            days = daysBetween(leave.leaveFrom, leave.leaveTo);
          } else if (leave.leaveDate) {
            days = 1;
          }

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
              // Half leave is always 0.5 day per leave entry regardless of days calculated
              acc.halfLeave += 0.5;
              break;
            case 'Overtime':
              // Add overtime hours (assuming leave.overtimeHours exists)
              acc.overtime += days;
              break;
            case 'Unpaid':
              acc.unpaidLeave += days;
              break;
            default:
              break;
          }
          return acc;
        },
        {
          casualLeave: 0,
          sickLeave: 0,
          personalLeave: 0,
          halfLeave: 0,
          overtime: 0,
          unpaidLeave: 0,
        }
      );

      const completeData = {
        ...emp,
        ...summary,
        totalLeave: calculateTotalLeave(summary),
      };

      setSelectedEmployee(completeData);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="employee-list">
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div className="employee-card" key={emp._id}>
            <img src={defaultAvatar} alt="User" className="employee-avatar" />
            <div className="employee-info">
              <h3>{emp.employeeName}</h3>
              <p><strong>ID:</strong> {emp.employeeId}</p>
              <p><strong>Department:</strong> {emp.employeeDepartment}</p>
              <button onClick={() => handleViewProfile(emp)}>View Profile</button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedEmployee(null)}>&times;</span>

            {detailLoading ? (
              <p>Loading details...</p>
            ) : detailError ? (
              <p style={{ color: 'red' }}>Error: {detailError}</p>
            ) : (
              <>
                <img src={defaultAvatar} alt="Profile" className="modal-avatar" />
                <div className="employeeNID">
                  <h2 className="employee-name">{selectedEmployee.employeeName}</h2>
                  <h3 className="employee-id"><strong>ID:</strong> {selectedEmployee.employeeId}</h3>
                </div>

                <div className="grid-container">
                  <div className="grid-box light-gray">
                    <h4>Basic Information</h4>
                    <p><strong>Department:</strong> {selectedEmployee.employeeDepartment}</p>
                  </div>
                  <div className="grid-box light-indigo">
                    <h4>Leave Balance</h4>
                    <p><strong>{selectedEmployee.totalLeave.toFixed(1)}</strong> days remaining</p>
                  </div>
                </div>

                <h4 className="section-title">Leave Details</h4>
                <div className="grid-container">
                  <div className="grid-box blue">
                    <p>Casual Leave</p>
                    <strong>{(selectedEmployee.casualLeave || 0).toFixed(1)} days</strong>
                  </div>
                  <div className="grid-box red">
                    <p>Sick Leave</p>
                    <strong>{(selectedEmployee.sickLeave || 0).toFixed(1)} days</strong>
                  </div>
                  <div className="grid-box purple">
                    <p>Personal Leave</p>
                    <strong>{(selectedEmployee.personalLeave || 0).toFixed(1)} days</strong>
                  </div>
                  <div className="grid-box yellow">
                    <p>Half Leave</p>
                    <strong>{(selectedEmployee.halfLeave || 0).toFixed(1)} days</strong>
                  </div>
                  <div className="grid-box green">
                    <p>Overtime</p>
                    <strong>{(selectedEmployee.overtime || 0).toFixed(1)} days</strong>
                  </div>
                  <div className="grid-box gray">
                    <p>Unpaid Leave</p>
                    <strong>{(selectedEmployee.unpaidLeave || 0).toFixed(1)} days</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
