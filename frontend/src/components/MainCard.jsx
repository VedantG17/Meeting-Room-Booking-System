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
    <div className="flex justify-around py-10 ">
      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50 shadow-lg hover:shadow-2xl transition-all duration-300 ">
        <div className="bg-green-200 p-3 rounded-2xl mb-3">
          <div className="text-xl text-green-800 mb-1">Available Rooms</div>
          </div>
        <div className="text-5xl font-bold mb-10">{metrics.availableRooms}</div> 
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl  p-4 w-60 h-50 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="bg-green-200 p-3 rounded-2xl mb-3">
          <div className="text-xl text-green-800 mb-1">Total Rooms</div>
        </div>
        <div className="text-5xl font-bold mb-10">{metrics.totalRooms}</div>
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="bg-green-200 p-3 rounded-2xl mb-3">
          <div className="text-xl text-green-800 mb-1">Todays Meetings</div>
        </div>
        <div className="text-5xl font-bold mb-10">{metrics.todaysMeetings}</div>
      </div>

      <div className="flex flex-col items-center justify-center bg-white outline rounded-xl border-rounded-xl p-4 w-60 h-50 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="bg-green-200 p-3 rounded-2xl mb-3">
            <div className="text-xl text-green-800 mb-1">Next Week</div>
          </div>
          <div className="text-5xl font-bold mb-10">{metrics.nextWeekMeetings}</div>
      </div>
    </div>    
  );
}