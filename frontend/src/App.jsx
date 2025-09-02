import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import Otp from "./pages/Otp"
import DashboardHome from './pages/DashboardHome';
import Dashboard from "./pages/Dashboard"
import MyBookings from './pages/MyBookings';
import BrowseRooms from './pages/BrowseRooms';
import History from './pages/History';
import ProtectedRoute from "./components/ProtectedRoute"
import { useContext } from 'react';
import {AuthContext} from './context/AuthContext'
import { Provider } from 'react-redux';


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
        <Route path="/dashboard/*" element = {
          <ProtectedRoute>
            < Dashboard/>
          </ProtectedRoute>
      }>
        <Route index element = {<DashboardHome/>} />
        <Route path="browse-rooms" element={<BrowseRooms />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App
