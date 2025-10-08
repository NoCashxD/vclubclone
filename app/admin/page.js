"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import HorizontalNav from '../home/horizontal';
import './page.css';
import Addbin from "./addbin";
import Addcc from './addcc';
import Useraction from './useraction';
import Payment from './Payment';
import Add2DCard from './add2dcard';
import RefundRequests from './refundRequests';
import TicketManagement from './ticketManagement';
import FloatingLoader from "../credit-cards/floating";
import RandomAddressManager from './randomAddressManager.jsx';
const AdminPage = () => {
  const [currentView, setCurrentView] = useState('bin'); // Use 'currentView' to manage state
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter()


  useEffect(() => {
    // localStorage.setItem('role', 'admin');
    setCurrentView(localStorage.getItem("tab"))
    // Check if the user is an admin
    const role = localStorage.getItem("role");

     const timer = setTimeout(()=>{
          setIsAdmin(true)
        },3000)
     if (role !== 'admin') {
   // console.log(role,isAdmin,"")
    router.push('/login');
  }
    return () => clearTimeout(timer);

    setIsAdmin(role === 'admin');

  }, []);

  const handleToggle = (view) => {
    setCurrentView(view);
  };


  


  return (
    <div className="app">
    {!isAdmin && <FloatingLoader visible={!isAdmin} message="Sending your request..." />}
 {isAdmin && <div className="main-content">
        <HorizontalNav />
        <div className='flex'>
          <div className="main-form flex gap-20 h-min trans flex-col">
            <div className="btndiv justify-between">

 
          <div className="btndiv flex justify-between w-max overflow-scroll" style={{scrollbarWidth : "none"}}>

              <button type="button" className='' onClick={() => {handleToggle('bin'); localStorage.setItem("tab" , "bin") }}>Add Bin Data</button>
            <button type="button" className='' onClick={() => {handleToggle('card');localStorage.setItem("tab" , "card") }}>Add Card Data</button>
              <button type="button" className='' onClick={() => {handleToggle('2dcard');localStorage.setItem("tab" , "2dcard") }}>Add 2D Card Data</button>
              <button type="button" className='' onClick={() =>{if(currentView === "user"){ window.location.href = '/admin'} else {  handleToggle('user'); localStorage.setItem("tab" , "user")}} }>User Action</button>
              <button type="button" className='' onClick={() =>{if(currentView === "payment"){ window.location.href = '/admin'} else {  handleToggle('payment'); localStorage.setItem("tab" , "payment")}} }>User Payment</button>
              <button type="button" className='' onClick={() =>{if(currentView === "refunds"){ window.location.href = '/admin'} else {  handleToggle('refunds'); localStorage.setItem("tab" , "refunds")}} }>Refund Requests</button>


              <button type="button" className='' onClick={() =>{if(currentView === "tickets"){ window.location.href = '/admin'} else {  handleToggle('tickets'); localStorage.setItem("tab" , "tickets")}} }>Ticket Management</button>
              <button type="button" className='' onClick={() =>{if(currentView === "random-address"){ window.location.href = '/admin'} else {  handleToggle('random-address'); localStorage.setItem("tab" , "random-address")}} }>Random Address Manager</button>

            </div>
            <div>
              {currentView === 'bin' && <Addbin />}
              {currentView === 'card' && <Addcc />}
              {currentView === '2dcard' && <Add2DCard />}
              {currentView === 'user' && <Useraction />}
              {currentView === 'payment' && <Payment />}
              {currentView === 'refunds' && <RefundRequests />}


              {currentView === 'tickets' && <TicketManagement />}
              {currentView === 'random-address' && <RandomAddressManager />}

              
            </div>
          </div>
        </div>
      </div>
      </div>
}


    </div>
  );
};
export default AdminPage;
