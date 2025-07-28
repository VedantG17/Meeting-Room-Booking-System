import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function Card({icon:Icon,title,description}){
  return(
    <div className="flex flex-col items-center bg-gradient-to-b from-white to-gray-200 outline rounded-xl border-rounded-xl w-100 h-80">
      {Icon && <Icon size={50} className="text-blue-800 mt-10 mb-5"/>}
      <div className="text-3xl font-bold mb-10">{title}</div>
      <div className="text-xl text-gray-500">{description}</div>
    </div>
    
  )
}