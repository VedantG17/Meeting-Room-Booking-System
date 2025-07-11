import { Link } from "react-router-dom";
import { Calendar } from "lucide-react"
export default function Footer(){
  return(
    <div className="px-4 lg:px-6 h-20 flex items-center justify-between  border-t">
      <div className="flex items-center space-x-10">
        <Calendar className="text-blue-600 w-4 h-4" />
        <p className="text-xl font-bold">RoomBook</p>
        <p className="text-shadow-gray-300">@2025 RoomBook. All rights reserved</p>
      </div>
      <div className="flex items-center justify-between space-x-10">
        <Link to="/Terms" className="font-medium  text-shadow-gray-300 hover:text-blue-600">Terms of Service</Link>
        <Link to="/Privacy" className="font-medium text-shadow-gray-300 hover:text-blue-600">Privacy Policy</Link>
        <Link to="/Contact" className="font-medium text-shadow-gray-300 hover:text-blue-600">Contact</Link>
      </div>
    </div>
  );
}