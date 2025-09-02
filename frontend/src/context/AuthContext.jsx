import React, { createContext, useState, useEffect,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({children}) =>{

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const checkSession = async () => {
      const employeeId = localStorage.getItem('employee_id');
      if(employeeId){
        try{
          const res = await axios.get(`http://localhost:8000/api/user/${employeeId}/`)
          console.log(" Session check API response:", {
            status: res.status,
            success: res.data?.success,
            hasEmployee: !!res.data?.data?.employee,
            fullResponse: res.data
          });

          if(res.data.success){
            setUser({
              employee_id: employeeId,
              employee_name : res.data.data.employee.name,
              email: res.data.data.employee.email,
              past_bookings: res.data.data.past_bookings,
              future_booking :  res.data.data.future_bookings
            });
            
          }
          else{
             
              localStorage.removeItem('employee_id');
          }
        }
        catch(error){
          console.error("Error during session check:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            fullError: error
          });
          localStorage.removeItem('employee_id');
          setUser(null);
        }
      }
      else{
        console.log("No employeeId found in localStorage");
        setUser(null);
      }
      console.log("Session check completed, setting loading to false");
      setLoading(false);
    };
    checkSession();  
  },[]);

  const login = async(email,password) =>{
    try{
      const res = await axios.post('http://localhost:8000/api/login/',{email,password})
      
      if(res.data.success){
        localStorage.setItem('employee_id',res.data.employee_id);
        const userRes = await axios.get(`http://localhost:8000/api/user/${res.data.employee_id}/`);
        console.log("userRes.data:", userRes.data);
        if(userRes.data.success){
          setUser({
            employee_id : userRes.data.data.employee.employee_id,
            employee_name : userRes.data.data.employee.name,
            email: userRes.data.data.employee.email,
            past_bookings: userRes.data.data.past_bookings,
            future_booking:userRes.data.data.future_booking
          });
        } 
        return { success: true, message: 'Login successful' };
      }else {
        return { success: false, message: res.data.message || 'Login failed' };
      }
    }
    catch(error){
      return {success:false,message:error.response?.data?.message || 'cant login'};
    }    
  };

  const logout = () => {
    localStorage.removeItem('employee_id');
    setUser(null);
    navigate('/login');  


  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
);
}


