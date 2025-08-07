import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard(){
  const [employeeName, setEmployeeName] = useState('');
  const employeeId = localStorage.getItem('employee_id');
  return (
    <div className="bg-amber-300">
      <h1>success</h1>
    </div>
  );
}