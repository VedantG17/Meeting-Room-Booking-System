import { Home, Users, Calendar, Clock, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation(); //missed the onst here and it cause object to be sent to url and flickering
  const isActive = (path) => location.pathname === `/dashboard/${path}`;

  return (
    <div className="w-84 h-screen bg-white text-black flex flex-col p-4 border-2 border-gray-200">
      <div className="border-b-2 border-gray-200 mb-4">
        <div className="flex items-center p-4">
          <BookOpen className="h-7 w-7 text-blue-800" />
          <div className="ml-3">
            <h1 className="text-2xl font-bold">Roombook</h1>
          </div>
        </div>
        <div className="flex flex-col bg-blue-100 rounded-lg mt-5 mb-5 p-5">
          <div className="text-l text-blue-800">Authorised Domain</div>
          <div className="text-blue-800 text-m">@purplepanda.in</div>
        </div>
      </div>

      <nav className="flex-grow flex flex-col space-y-4 mt-6">
        <Link
          to="/dashboard"
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("") ? "bg-gray-300" : "hover:bg-gray-300"
          }`}
        >
          <Home className="h-7 w-7" />
          <span className="ml-3 text-xl">Dashboard</span>
        </Link>

        <Link
          to="/dashboard/browse-rooms"
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/browse-rooms") ? "bg-gray-300" : "hover:bg-gray-300"
          }`}
        >
          <Calendar className="h-7 w-7" />
          <span className="ml-3 text-xl">Browse Rooms</span>
        </Link>

        <Link
          to="/dashboard/my-bookings"
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/my-bookings") ? "bg-gray-300" : "hover:bg-gray-300"
          }`}
        >
          <Users className="h-7 w-7" />
          <span className="ml-3 text-xl">My Bookings</span>
        </Link>

        <Link
          to="/dashboard/history"
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/history") ? "bg-gray-300" : "hover:bg-gray-300"
          }`}
        >
          <Clock className="h-7 w-7" />
          <span className="ml-3 text-xl">History</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="flex flex-col py-5 border-t-2 border-gray-200">
        <div className="flex flex-col mb-10 px-5">
          <div className="text-m text-black">{user.employee_name}</div>
          <div className="text-m text-gray-400">{user.email}</div>
        </div>
        <div className="flex justify-center text-xs text-black">
          Roombook v1.0
        </div>
      </div>
    </div>
  );
}
