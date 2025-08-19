import React from 'react';
import  { useState } from 'react';
import { Home,Users, MapPin, Calendar, Clock, Settings, LogOut,Menu,BookOpen } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import {useAuth} from '../context/AuthContext'

export default function Topbar({activePage}){
  const {user,logout} = useAuth();
  const pageNames = {
    dashboard: "Dashboard",
    browseRooms: "Browse Rooms",
    myBookings: "My Bookings",
    history: "Booking History"
  };
  const pageTitle = pageNames[activePage] || activePage;

  return(
    <div className="flex items-center justify-between align-end bg-color-white h-20 border-gray-400 border-1">
      <div className="mx-2 flex item-center bg-blue-100 rounded-md px-2 py-2">
        <div className=" text-blue-800 text-2xl font-bold">Welcome , {user.employee_name}</div>
      
      </div>
      <div className="flex item-center  bg-gray-200 rounded-md px-2 py-2">
          <div className="font-bold text-3xl text-black">{pageTitle}</div>
      </div>
      <div className="flex space-around">
      <button  className="mx-2 bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800 active:bg-gray-700 transition cursor-pointer ">
        Notification
      </button>
      <button onClick={logout} className="mx-2 bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-400 active:bg-red-300 transition cursor-pointer">
        Logout
      </button>
      
      </div>
      
    </div>
  );
}