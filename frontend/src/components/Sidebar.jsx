import React from 'react';
import  { useState } from 'react';
import { Home, MapPin, Calendar, Clock, Settings, LogOut } from 'lucide-react';

export default function Sidebar(){
  const [isOpen, setIsOpen] = useState(false);

  return(
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 ">
         <h2 className="font-bold text-base">RoomBook</h2>
      </div>
      <nav></nav>
      <div></div>
    </div>
  )

}

