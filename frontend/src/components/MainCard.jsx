import React,{useState,useEffect} from 'react'
import {useAuth} from '../context/AuthContext'
import axios from 'axios'

export default function MainCard(){
  const {user} = useAuth();

  const [metrics, setMetrics] = useState({
    availableRooms: 0,
    totalRooms: 0,
    todaysMeetings: 0,
    nextWeekMeetings: 0
});

useEffect(()=>{
  async function fetchMetrics(){
    try{
      const res =  await axios.get(`http://localhost:8000/api/dashboard-metrics/${user.employee_id}/`);
      setMetrics(res.data.data);
    }
    catch(err){
      console.error("Error fetching metrics:", err);
    }
  }
  if(user?.employee_id){
    fetchMetrics();
  }
  
},[user?.employee_id]);

  return(
    <div className="flex justify-around py-10">
      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50">
        <div className="text-xl text-gray-500 mb-4">Available Rooms Today</div>
        <div className="text-5xl font-bold mb-10">{metrics.availableRooms}</div> 
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl  p-4 w-60 h-50">
        <div className="text-xl text-gray-500 mb-4">Total Rooms</div>
        <div className="text-5xl font-bold mb-10">{metrics.totalRooms}</div>
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50">
        <div className="text-xl text-gray-500 mb-4">Todays Meetings</div>
        <div className="text-5xl font-bold mb-10">{metrics.todaysMeetings}</div>
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50">
          <div className="text-xl text-gray-500 mb-4">Next Week</div>
          <div className="text-5xl font-bold mb-10">{metrics.nextWeekMeetings}</div>
      </div>
    </div>    
  );
}