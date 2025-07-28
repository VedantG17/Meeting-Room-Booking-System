import React , {useState} from "react";
import {useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function OtpVerify(){
  const OTP_DIGITS_COUNT = 6;
  const [otp,setOtp] = useState(new Array(OTP_DIGITS_COUNT).fill(""))
  const location = useLocation();
  const navigate = useNavigate();
  const {email} = location.state || {}
  
  const handleChange = (e,index)=>{
    const value = e.target.value; 
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if(value && index < OTP_DIGITS_COUNT-1){
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

  }


  const handleSubmit = async()=>{
    const enteredOtp = otp.join("").trim(); 
    if (enteredOtp.length !== OTP_DIGITS_COUNT) {
      alert("Please enter full OTP");
      return;
    }

    console.log("Sending payload:", { email, enteredOtp}); 

    try{
      const res = await axios.post("http://localhost:8000/api/verify-otp/",{
        email,
        otp: enteredOtp,
      })
      if (res.data.success) {
        alert("OTP Verified! Account created.");
        navigate("/login");
      } else {
        alert(res.data.message || "Invalid OTP.");
      }
    } catch (error){
      console.error("OTP verification failed:", error);
      alert("Something went wrong during OTP verification.");
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray p-4 ">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold ">Enter OTP</h1>
          <p className="text-gray-600">We've sent a 6-digit code to your phone</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {otp.map((digit,index)=>(
            <input 
            key={index}
            id= {`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            className="w-12 h-12 text-center border border-gray-400 rounded-md text-lg font-semibold"
            onChange = {(e)=>handleChange(e,index)}
            
            />
          ))}
        </div>
        <div className="flex items-center justify-center mt-10">
        <button 
        onClick={handleSubmit}
        className="bg-blue-800 px-10 py-3 rounded-md text-white ">Verify</button>
        </div>
         
      </div>

    </div>
  );
}