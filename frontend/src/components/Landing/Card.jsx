import { Link } from "react-router-dom";
import { Calendar } from "lucide-react"

export default function Card({icon:Icon,title,description}){
  return(
    <div className="flex-col items-center text-center bg-amber-400 border-rounded-xl px-35 py-30">

      <div>title</div>
      <div>description</div>
    </div>
    
  )
}