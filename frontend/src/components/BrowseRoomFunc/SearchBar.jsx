import React,{useState,useEffect,useRef} from 'react'
import {useAuth} from '../../context/AuthContext'
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { Search,ChevronDown } from 'lucide-react'
import "react-calendar/dist/Calendar.css"; 
import Calendar from "react-calendar";

import {
  setDate,
  setStartTime,
  setEndTime,
  fetchAvailableRooms,
  setSearchState,
} from '../../features/roomSearch/roomSearchSlice';

export default function SearchBar(){
  const dispatch = useDispatch();
  const { date, startTime, endTime, loading } = useSelector((state) => state.roomSearch);  
  //dropdown visibility
  const [showDatePicker,setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker,setShowEndTimePicker] = useState(false);


  const datePickerRef = useRef(null);
  const startTimePickerRef = useRef(null);
  const endTimePickerRef = useRef(null);

  const generateSlots = ()=>{
    const slots =[];
    for(let hours = 8 ;hours<24;hours++){
      for(let minutes = 0; minutes < 60 ; minutes+=30){
        const timeString = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
        let displayTime;
        if(hours===0){
          displayTime = `12:${minutes.toString().padStart(2,'0')} AM`;
        }
        else if(hours < 12){
          displayTime = `${hours}:${minutes.toString().padStart(2,'0')} AM`;
        }
        else if (hours === 12){
          displayTime = `12:${minutes.toString().padStart(2,'0')} PM`;
        }
        else{
          displayTime = `${hours-12}:${minutes.toString().padStart(2,'0')} PM`;
        }
        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  }
  const timeSlots = generateSlots();

  //apart from curr good user friendly format date
  const formatDateDisplay = (dateString)=>{
    if (!dateString) return 'Add dates';
    const dateObj = new Date(dateString + 'T00:00:00');
    return dateObj.toLocaleDateString("en-US",{
      month : 'short',
      day : 'numeric',
      year : 'numeric'
    });
  }
  //search bar time slot display
  const getSlotDisplay = (slotValue) => {
    const slot = timeSlots.find(s => s.value === slotValue)
    return slot ? slot.display : 'Add Time';
  };

  const getAvailableEndSlots = ()=>{
    if(!startTime){
      return [];
    }
    const startIndex = timeSlots.findIndex(s => s.value === startTime);
    return timeSlots.slice(startIndex+1);
  };

  //default date setting 
  useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split("T")[0];
      dispatch(setDate(today));
    }
  }, [date, dispatch]);

  useEffect(()=>{
    const handleClicksOutside = (event)=> {
      if(datePickerRef.current && !datePickerRef.current.contains(event.target)){
        setShowDatePicker(false);
      }
      if(startTimePickerRef.current && !startTimePickerRef.current.contains(event.target)){
        setShowStartTimePicker(false);
      }
      if(endTimePickerRef.current && !endTimePickerRef.current.contains(event.target)){
        setShowEndTimePicker(false);
      }
    };
    document.addEventListener("mousedown",handleClicksOutside);
    return ()=> document.removeEventListener("mousedown",handleClicksOutside);
  },[])

  const handleStartSlotChange = (slot) => {
    dispatch(setStartTime(slot)); // Update Redux store
    const currentIndex = timeSlots.findIndex(s => s.value === slot);
    if (currentIndex >= 0 && currentIndex < timeSlots.length - 1) {
      dispatch(setEndTime(timeSlots[currentIndex + 1].value)); // Auto-select next slot for end time
    } else {
      dispatch(setEndTime('')); // Clear if it's the last slot
    }
    setShowStartTimePicker(false); // Close dropdown
  };

  const handleSubmit = () => {
    if (!date || !startTime || !endTime) {
      alert('Please select date, start time, and end time.');
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    if (endDateTime <= startDateTime) {
      alert("End time must be after start time.");
      return;
    }
    const startISO = startDateTime.toISOString();
    const endISO = endDateTime.toISOString();
    dispatch(fetchAvailableRooms({ start: startISO, end: endISO }));
  };

  return(
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 w-max">
      <div className="flex items-center">
        <div className="flex-1 px-6 py-3 border-r border-gray-200 relative" ref={datePickerRef}>
          <div className="text-md font-bold text-black mb-1">Date</div>
          <button
          onClick={()=>{
              setShowDatePicker(!showDatePicker);
              setShowStartTimePicker(false);
              setShowEndTimePicker(false);
          }}
          className="flex items-center justify-between text-sm text-gray-500 bg-transparent border-none outline-none w-full text-left">
          {formatDateDisplay(date)}
          <ChevronDown size={16} className="text-gray-400"/>
          </button>

          {/* date picker drop down */}
          {showDatePicker && (
            <div className="absolute top-full left-0 z-40 mt-2 bg-white shadow-lg rounded-lg p-2">
              <Calendar
                onChange={(value) => {
                  const year = value.getFullYear();
                  const month = (value.getMonth() + 1).toString().padStart(2, '0');
                  const day = value.getDate().toString().padStart(2, '0');
                  const formatted = `${year}-${month}-${day}`;
                  dispatch(setDate(formatted));
                  setShowDatePicker(false);
                }}
                value={date ? new Date(date) : new Date()}
                minDate={new Date()}
              />
            </div>
          )}
        </div>

        {/*  start Time */}
        <div className='relative flex-1 px-6 py-3 border-r border-gray-200' ref={startTimePickerRef}>
          <div className="text-md font-bold text-black mb-1">Start time</div>
          <button
            onClick={()=>{
            setShowStartTimePicker(!showStartTimePicker);
            setShowDatePicker(false);
            setShowEndTimePicker(false);
          }}
          className="flex items-center justify-between text-sm text-gray-500 bg-transparent border-none outline-none w-full text-left"
          >
          {getSlotDisplay(startTime)}
          <ChevronDown size={16} className="text-gray-400" />
          </button>

        {/* start time dropdown */}
        {showStartTimePicker && (
          <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-32 h-64 overflow-y-auto">
            <div className="p-2">
              {timeSlots.slice(0,-1).map(slot => (
                <button
                key= {slot.value}
                onClick={()=>{handleStartSlotChange(slot.value)}}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors duration-200 ${startTime === slot.value ? 'bg-blue-500 text-white':'text-gray-700 hover:bg-gray-100'}`}
                >
                  {slot.display}
                </button>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* endtime display */}
        <div className="relative flex-1 px-6 py-3 border-r border-gray-200 " ref={endTimePickerRef}>
          <div className="text-md font-bold text-black mb-1">End time</div>
          <button
           onClick = {()=>{
            if (startTime){
              setShowEndTimePicker(!showEndTimePicker)
              setShowDatePicker(false)
              setShowStartTimePicker(false)
            }
           }}
           disabled = {!startTime}
           className="flex items-center justify-between text-sm text-gray-500 bg-transparent border-none outline-none w-full text-left "
          >
            {getSlotDisplay(endTime)}
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {/* end time drop down */}
          {showEndTimePicker && startTime && (
            <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-48 max-h-60 overflow-y-auto">
            <div className="p-2">
              {getAvailableEndSlots().map(slot => (
                <button
                key = {slot.value}
                onClick= {()=>{
                  dispatch(setEndTime(slot.value));
                  setShowEndTimePicker(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  endTime === slot.value ? 'bg-blue-500 text-white':'text-gray-700 hover:bg-gray-100'
                }`}
                >
                  {slot.display}
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
        
        
        
        {/* search button */}
        <div className="px-2">
            <button
            onClick= {handleSubmit}
            disabled = {loading}
            className='bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-full'
            >
              {loading?(
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
              ):(
                <Search size = {16} />
              )
              }
            </button>

        </div>
      </div>
    </div>
  )
}