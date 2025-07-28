import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import Otp from "./pages/Otp"


function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element = {<Login  />} />
        <Route path="/otp" element = {< Otp />} />
        <Route path="/login" element = {< Login/>} />
      </Routes>
  )
}

export default App
