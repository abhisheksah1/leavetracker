import React from 'react';
import './LeaveDashboard.css';

const LeaveDashboard = () => {
  const leaveData = {
    total: 30,
    taken: 12,
    remaining: 18,
    history: [
      { date: '2025-07-01', type: 'Casual Leave', status: 'Approved' },
      { date: '2025-06-15', type: 'Sick Leave', status: 'Approved' },
      { date: '2025-06-10', type: 'Casual Leave', status: 'Rejected' },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Employee Leave Dashboard</h1>

      <div className="cards">
        <div className="card total">
          <h2>Total Leaves</h2>
          <p>{leaveData.total}</p>
        </div>
        <div className="card taken">
          <h2>Leaves Taken</h2>
          <p>{leaveData.taken}</p>
        </div>
        <div className="card remaining">
          <h2>Remaining</h2>
          <p>{leaveData.remaining}</p>
        </div>
      </div>

      <div className="history">
        <h2>Leave History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.history.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;
