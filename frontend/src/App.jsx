import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import Otp from "./pages/Otp"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import { useContext } from 'react';
import {AuthContext} from './context/AuthContext'


function App() {
  const {loading} = useContext(AuthContext)
  if(loading){
    return <div>Loading app</div>
  }
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element = {<Login  />} />
        <Route path="/otp" element = {< Otp />} />
        <Route path="/login" element = {< Login/>} />
        <Route path="/dashboard" element = {
          <ProtectedRoute>
            < Dashboard/>
          </ProtectedRoute>
      }/>
      </Routes>
  )
}

export default App
