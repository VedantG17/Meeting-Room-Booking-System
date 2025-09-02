import {configureStore} from '@reduxjs/toolkit'
import roomSearchReducer from '../features/roomSearch/roomSearchSlice';
export const store = configureStore({
  reducer:{
    roomSearch: roomSearchReducer,
    
  }
})