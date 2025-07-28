import { Link } from 'react-router-dom';
import React , {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
 const [formData,setFormData] = useState({
  name:'',
  email:'',
  password:'',
 });
 
const navigate = useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/signup/",formData)
      
      if(res.data.success){
        alert('Otp sent to your mail Please check')
        navigate('/otp',{state:{...formData}})
      }
      else{
        alert(res.data.message.email ||  res.data.message || 'Something went wrong.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      alert(errorMsg?.email?.join(' ') || errorMsg || 'Signup failed.');
      console.error(error);
    }
}



  return(
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Signup</h2>
        <form onSubmit={handleSubmit}> 
          <div className="mb-4">
            <label className="block text-gray-700 text-m font-medium mb-2">Name</label>
            <input
                type ="text"
                name='name'
                value={formData.name}
                onChange = {handleChange}
                required
                placeholder='Full Name'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="block text-gray-700 text-m font-medium mb-2">
            <label className="block text-gray-700 text-m font-medium mb-2">Email</label>
            <input
              type = "email"
              value = {formData.email}
              required
              name='email'
              placeholder='Office Email'
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onChange={handleChange}
             />
          </div>

          <div className="block text-gray-700 text-m font-medium mb-10">
            <label className="block text-gray-700 text-m font-medium mb-2">Password</label>
            <input
              required
              name='password'
              value= {formData.password}
              type="password"
              placeholder='Password'
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              onChange={handleChange}

             />
          </div>
            
          <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
          </div>
        </form>
        </div>
      </div>
    </>
  )
}


