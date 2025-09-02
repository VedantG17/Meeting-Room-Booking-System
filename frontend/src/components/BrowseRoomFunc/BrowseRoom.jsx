import React from "react";
import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RoomCard from "./RoomCard";
import SearchBar from "./SearchBar";
import axios from "axios";
import { fetchAllRooms } from "../../features/roomSearch/roomSearchSlice";

export default function BrowseRoom(){
  const dispatch = useDispatch();
  const {rooms , loading , error , isFiltered} = useSelector(
    (state)=> state.roomSearch,
  )
  useEffect(()=>{
    dispatch(fetchAllRooms());
    if (loading && !isFiltered) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="ml-4 text-lg text-gray-700">Loading rooms...</p>
        </div>
      );
    }
    if (error && !isFiltered) {
      return (
        <div className="p-4 text-center text-red-600">
          <p>Error loading rooms: {error}</p>
          <p>Please try again later.</p>
        </div>
      );
    }
    if (isFiltered && rooms.length === 0 && !loading && !error) {
      return (
        <div className="p-4">
          <div className="flex items-center justify-center mb-12">
            <SearchBar />
          </div>
          <div className="text-center text-lg text-gray-600">
            No rooms found matching your search criteria.
          </div>
        </div>
      );
    }

      
  },[])

  return(
    <div className="p-4">
      <div className="flex items-center justify-center mt-10 mb-32">
        <SearchBar/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 ">
        {rooms.map((room)=>(
        <RoomCard 
        key = {room.id}
        name = {room.name}
        capacity={room.capacity}
        location = {room.location}
        roomData={room}
        />
      ))}
      </div>
    </div>
  );
}

