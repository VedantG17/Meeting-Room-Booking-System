import { Link } from "react-router-dom";
import Card from "./Card"

export default function Hero(){
  return(
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-20 flex-col">
              <div className="text-7xl font-bold text-black mb-5">Book Meeting Room</div>
              <div className="text-7xl font-bold text-blue-700 mb-5">Effortlessly</div>
              <div className="text-2xl text-gray-600 mb-20 ">Easily book and manage meeting rooms across your organization with RoomBook</div>
              <Link to="/Signup" className="bg-blue-800 text-xl text-white px-7 py-6 rounded-md hover:bg-blue-600 active:bg-blue-700 transition">Get Started</Link>
          </div>
        </div>

        <div className="max-w-8xl flex-col">
            <div className="flex justify-center text-5xl font-bold">
              EveryThing you Need
            </div>
            <div className="flex justify-center my-5 text-gray-500 text-2xl mb-16">
              Our platform provides all the tools you need to manage meeting room bookings efficiently.
            </div>

            {/* card section */}
            <div className="flex justify-around">
                <Card /> 
                <Card />
                <Card />
            </div>
        </div>
        
      </div>
  );
}