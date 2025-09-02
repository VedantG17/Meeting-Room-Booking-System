import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch all rooms
export const fetchAllRooms =createAsyncThunk(
  'roomSearch/fetchAllRooms',
  async(_,{rejectWithValue})=>{
    try{
      const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
      if(res.data.success){
        return res.data.data;
      }else{
        return rejectWithValue(res.data.message || "Failed to fetch all rooms.");
      }
    }
    catch(err){
      return rejectWithValue(err.response?.data?.message || err.message || "Network error fetching all rooms.");
    }
    
  }
);

//Thunk to feth room based on filtering
export const fetchAvailableRooms = createAsyncThunk(
  'roomSearch/fetchAvailableRooms',
  async({start,end},{rejectWithValue}) =>{   // WE NEED TO GIVE { start: ISOString, end: ISOString }` as payload
    try{
      const queryParams = new URLSearchParams({ start, end });
      const res = await axios.get(`http://127.0.0.1:8000/api/available-rooms/?${queryParams}`);
      if (res.data.success) {
        return res.data.data;
      }
      else{
        let errorMessage = res.data.message || "Failed to fetch available rooms.";
        return rejectWithValue(errorMessage);
      }
    }
    catch(err){
      let errorMessage = err.response?.data?.message || err.message || "Network error fetching available rooms.";
      if (err.response?.status === 400 && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const roomSearchSlice = createSlice({
  name: 'roomSearch',
  initialState:{
    date: '',         
    startTime: '',    
    endTime: '',  
    rooms :[],
    allRooms: [],
    loading: false,  
    error: null,    
    isFiltered: false,   
  },

  reducers:{
    setDate:(state,action)=> {
      state.date = action.payload;
      state.error = null;
    },
    setStartTime:(state,action)=>{
      state.startTime = action.payload;
      state.error = null
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
      state.error = null;
    },
    clearSearchFilters:(state)=>{
      state.date = '';
      state.startTime = '';
      state.endTime = '';
      state.rooms = state.allRooms; 
      state.isFiltered = false;
      state.error = null;
    },
    setSearchState:(state,action) => {
      const { date, startTime, endTime } = action.payload;
      state.date = date || '';
      state.startTime = startTime || '';
      state.endTime = endTime || '';
      state.error = null;
    }
  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllRooms.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllRooms.fulfilled, (state, action) => {
          state.loading = false;
          state.rooms = action.payload;
          state.allRooms = action.payload; // Store all rooms
          state.isFiltered = false;
        })
        .addCase(fetchAllRooms.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.rooms = [];
          state.allRooms = [];
        })
        .addCase(fetchAvailableRooms.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
          state.loading = false;
          state.rooms = action.payload;
          state.isFiltered = true;
        })
        .addCase(fetchAvailableRooms.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.rooms = [];
          state.isFiltered = true;
        });
    },
});
export const {
  setDate,
  setStartTime,
  setEndTime,
  clearSearchFilters,
  setSearchState,
} = roomSearchSlice.actions;
export default roomSearchSlice.reducer;