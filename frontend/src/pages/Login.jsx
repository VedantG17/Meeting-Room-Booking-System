import React, { useContext,useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errorMessage,setErrorMessage] = useState('');
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setErrorMessage('');

    try{
      const result = await login(formData.email,formData.password);
      console.log(result)
      if(!result.success){
        setErrorMessage(result.message || 'Login failed. Please check your credentials.');
        alert("Wrong credentials");
      }else{
        navigate('/dashboard');
      }
      }catch(error){
        setErrorMessage('An unexpected error occurred during login. Please try again.');
        console.error('Login error:', error);

      }
  };
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-m font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Office Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div className="mb-10">
              <label className="block text-gray-700 text-m font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}