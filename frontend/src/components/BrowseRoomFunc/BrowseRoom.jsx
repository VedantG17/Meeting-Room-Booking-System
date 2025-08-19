import React from "react";
import {useState,useEffect} from 'react'
import RoomCard from "./RoomCard";
import SearchBar from "./SearchBar";
import axios from "axios";

export default function BrowseRoom(){
  const [rooms,setRooms] = useState([])
  useEffect(()=>{
    const fetchRooms = async()=>{
      try{
        const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
        console.log("backend response",res.data)
        if(res.data.success){
          setRooms(res.data.data);
        }
        else{
          setRooms([]);
          console.error("API response success is Fasle")
        }
      }
      catch(err){
        console.error("error fetching rooms",err)
      }
    }
    fetchRooms();
      
  },[])

  return(
    <div className="p-4 ">
      <div className="flex justify-center mb-52"><SearchBar/></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-4 mx-auto max-w-6xl">
        {rooms.map((room)=>(
        <RoomCard 
        key = {room.id}
        name = {room.name}
        capacity={room.capacity}
        location = {room.location}
        />
      ))}
      </div>
    </div>
  );
}

