import React from 'react';
import  { useState } from 'react';
import { Home,Users, MapPin, Calendar, Clock, Settings, LogOut,Menu,BookOpen } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import {useAuth} from '../context/AuthContext'

export default function Sidebar({ activePage, setActivePage }){
  
  const {user} = useAuth();

  return(
    <div className="w-84 h-screen bg-white text-black flex flex-col p-4  border-2 border-gray-200">
      <div className=" border-b-2 border-gray-200 mb-4">
      <div className="flex items-center p-4 ">
        <BookOpen className="h-7 w-7 text-blue-800" />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Roombook</h1>
        </div>
      </div>
      <div className="flex flex-col bg-blue-100 rounded-lg mt-5 mb-5 p-5">
        <div className="text-l text-blue-800">Authorised Domain</div>
        <div className="text-blue-800 text-m">@purplepanda.in</div>
      </div>
        
      </div>
      

      <nav className="flex-grow flex flex-col space-y-4 mt-6">
        <button
          onClick={() => setActivePage("dashboard")}
          className="flex items-center p-2 rounded-lg  hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <Home className="h-7 w-7" />
          <span className="ml-3 text-xl cursor-pointer">Dashboard</span>
        </button>
        <button
          onClick={() =>  setActivePage("browseRooms")}
          className="flex items-center p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <Calendar className="h-7 w-7" />
          <span className="ml-3 text-xl cursor-pointer">Browse Rooms</span>
        </button>
        <button
          onClick={() => setActivePage("myBookings")}
          className="flex items-center p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <Users className="h-7 w-7" />
          <span className="ml-3 text-xl">My Bookings</span>
        </button>
        <button
          onClick={()=> setActivePage("history")}
          className="flex items-center p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <Clock className="h-7 w-7" />
          <span className="ml-3 text-xl">History</span>
        </button>
      </nav>
      <div className="felx flex-col py-5 border-t-2 border-gray-200">
      <div className="flex flex-col align-center mb-10 px-5 ">
        <div className="flex  text-m text-black ">
          {user.employee_name}
        </div>
        <div className="flex  text-m text-gray-400 ">
          {user.email}
        </div>
        </div>
        <div className="flex justify-center text-xs text-black">
        Roombook v1.0
        </div>
      </div>
      
        
        
   
      
    </div>
  );
}

