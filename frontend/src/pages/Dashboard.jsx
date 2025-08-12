import { useEffect, useState } from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar' ;
import MainContent from '../components/MainContent';

export default function Dashboard(){
  const { user, logout } = useAuth();
  const [activePage,setActivePage] = useState("dashboard");



  const handleLogout = ()=>{
    logout();
  }

  return (
    <div className="flex min-h-screen">
      <aside> <Sidebar activePage={activePage} setActivePage={setActivePage}/> </aside>
      <div className="flex flex-col flex-1">
        <header>
          <Topbar activePage={activePage} />
        </header>
        <main className="flex flex-1 bg-gray-100">
          <MainContent activePage={activePage}/>
        </main>
      </div>      
    </div>
  );
}