import {useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar' ;

export default function Dashboard(){
  const { user, logout } = useAuth();


  const handleLogout = ()=>{
    logout();
  }

  return (
    <div className="flex min-h-screen">
      <aside> <Sidebar/> </aside>
      <div className="flex flex-col flex-1">
        <header>
          <Topbar/>
        </header>
        <main className="flex flex-1 bg-gray-100">
          <Outlet/>
        </main>
      </div>      
    </div>
  );
}