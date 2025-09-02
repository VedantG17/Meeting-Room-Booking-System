import React,{useState,useEffect} from 'react'
import {MapPin,Users,Calendar,Eye} from 'lucide-react'
import {useAuth} from '../../context/AuthContext'
import axios from 'axios'
export default function RoomCard({name,location,capacity}){
  
  return(
    <div className="min-w-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-3">{name}</div>
        <div className="flex item-center text-gray-700">
        <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0"/>
        <div className='font-base'>{location}</div>
        </div>
        <div className="flex items-center text-gray-700">
          <Users className='w-4 h-4 text-green-500 mr-2 flex-shrink'/>
          <div className='text-m font-bold'>Capacity : {capacity} People</div>
        </div>
      </div>
      {/* divided */}
      <div className= "w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10"></div>
      {/* buttons sec */}
      <div className="flex gap-10 mb-4 ">
        <button className="flex px-4 py-3 rounded-md bg-blue-700 hover:bg-blue-600 active:bg-blue-500 transition cursor-pointer">
          <Eye className="text-white mr-2"/>
          <div className="text-white">Availibilty</div>
        </button>
        <button className="flex px-3 py-3 rounded-md bg-black hover:bg-gray-800 active:bg-gray-600 transition cursor-pointer">
          
          <Calendar className="text-white mr-2"/>
          <div className="text-white">Book Room</div>
        </button>
      </div>
    </div>
    
  )
}