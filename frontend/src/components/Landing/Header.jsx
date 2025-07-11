import { Link } from "react-router-dom";
import { Calendar } from "lucide-react"

export default function Header(){
  return(
    <div className="px-4 lg:px-6 h-14 flex items-center justify-between  border-b">
      <div className="flex items-center space-x-2">
      <Calendar className="text-blue-600 w-8 h-8" />
        <h1 className="text-3xl font-bold">RoomBook</h1>
      </div>
      <div className="flex items-center justify-between space-x-10">
        <Link to="/Features" className="font-medium hover:text-blue-600">Features</Link>
        <Link to="/About Us" className="font-medium hover:text-blue-600">About Us</Link>
        <Link to="/login" className=" bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 active:bg-gray-700 transition">Login</Link>
        <Link to="/Signup" className="bg-blue-800  text-white px-4 py-2 rounded-md hover:bg-blue-600 active:bg-blue-900 transition">SignUp</Link>
      </div>
    </div>
  );
}
