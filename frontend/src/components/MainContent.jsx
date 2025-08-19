import React from 'react'
import MainCard from './MainCard';
import BrowseRoom from '../pages/BrowseRoom';

export default function MainContent({activePage}){
  switch(activePage){
    case "dashboard":
      return(
        <div className="p-6 w-full h-70">
          <MainCard />
        </div>
      );
    case "browseRooms":
      return(
        <div className="w-full">
          <BrowseRoom/>
        </div>
      );
    case "myBookings":
      return <div>My Bookings Page</div>;

    case "history":
      return <div>Booking History Page</div>;

    default:
      return null;

    }
}