import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({children}) => {
  const {user,loading} =  useContext(AuthContext);
  console.log("ProtectedRoute — user:", user);
  console.log("ProtectedRoute — loading:", loading);
  if(loading){
    return <div className="min-h-screen flex item-center justify-center bg-gray-100 p-4">Loading...</div>
  }
  if(!user){
    return <Navigate to="/login" replace/>
  }

  return children
}

export default ProtectedRoute;
