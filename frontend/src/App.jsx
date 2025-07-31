import React from 'react';

// import LeaveDashboard from './components/LeaveDashboard/LeaveDashboard';
import AddEmployee from './components/AddEmployee/AddEmployee';
import ViewEmployee from './components/ViewEmployee/ViewEmployee';  
import LeaveForm from './components/EmployeeLeaveForm/LeaveFrom';

function App() {
  return (
    <>
      {/* <LeaveDashboard /> */}
     
        <AddEmployee />
        <LeaveForm />
       <ViewEmployee />
      
    </>
  );
}

export default App;
