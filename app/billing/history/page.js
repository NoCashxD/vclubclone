"use client"
import React, { useState, useEffect, useRef } from 'react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css"
import HorizontalNav from '../../home/horizontal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome)
import axios from 'axios';
const history = () => {

  const [data, setData] = useState([]);
 
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [balance, setBalance] = useState(0);
  const [tcost, setTCost] = useState(0);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Function to mask BIN number
  const maskBin = (bin) => {
    // Convert bin to a string if it is a number
    const binStr = String(bin);

    // Check if the string is empty or not
    if (binStr.length === 0) return '';

    // Mask all characters except the first one
    return `${binStr[0]}${'*'.repeat(binStr.length - 1)}`;
  };
  const setcost = () => {
    let cost = 0;
    for (let i = 0; i < data.length; i++) {
      if (typeof (data[0].price) == 'number') {
        cost = cost + data[0].price;
      } else {
        console.log("Invalid price: " + data[i].price);
      }
      setTCost(cost);
      console.log(tcost);
    }
  }

  // State to track selected rows


  // Handler for "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all items
      const allSelected = new Set(data.map(item => item.code));
      setSelectedRows(allSelected);
    } else {
      // Deselect all items
      setSelectedRows(new Set());
    }
  };
  


  const handleRowSelect = (itemId) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows); // Clone the existing Set
  
      if (newSelectedRows.has(itemId)) {
        // Deselect the item if it's already selected
        newSelectedRows.delete(itemId);
      } else {
        // Select the item if it's not already selected
        newSelectedRows.add(itemId);
      }
  
      // Automatically check or uncheck "Select All" based on the selection
      document.getElementById('item_id_all').checked = newSelectedRows.size === data.length;
      console.log(newSelectedRows);
      
      return newSelectedRows; // Return the new Set to update the state
    });
  };
  

  const handleDownload = ()=>{
    for(let i=0; i<Array.from(selectedRows).length; i++) {
      const rid = Array.from(selectedRows)[i]
      handledata(rid);
    }
  }

  const handleSubmit = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      return;
    }
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(`/api/billing/history/`, { params: { username }, withCredentials: true });
      // setData(response);
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setData(response.data);
        console.log(data[0]);

        console.log(data[0].price);
      } else {
        console.error('Expected an array response', data);
      }

    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    handleSubmit();
    // setcost();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setcost();
    }
  }, [data])

  useEffect(() => {
    const fetchBalance = async () => {
      const username = localStorage.getItem("username");
      if (username === undefined || username === null) {
        console.log("username is undefined");
      } else {
        try {
          const response = await axios.get(`/api/balance`, { params: { username }, withCredentials: true });
          setBalance(response.data.balance);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Redirect to the login page
            //window.location.href = '/login';
            console.log(error);
            
          } else {
            console.error('Error fetching balance:', error);
          }
        }
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="app">
      <div className="main-content">
        <HorizontalNav />
        <div className="container-history mt-20">
  <div className="panel-heading">
    <h3 className="panel-title text-2xl text-bold text-white uppercase ">Operations:</h3>
  </div>
  <div className="row mt-4">
    <div id="mygrid" className="grid-view">
      <table className="items table table-striped table-bordered table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th id="mygrid_c0" className="border px-4 py-2">CODE</th>
            <th id="mygrid_c1" className="border px-4 py-2">METHOD</th>
            <th id="mygrid_c2" className="border px-4 py-2">MEMO</th>
            <th id="mygrid_c3" className="border px-4 py-2">CREATED</th>
            <th id="mygrid_c4" className="border px-4 py-2">PAYED</th>
            <th id="mygrid_c5" className="border px-4 py-2">FEE</th>
            <th id="mygrid_c6" className="border px-4 py-2">AMOUNT</th>
            <th id="mygrid_c7" className="border px-4 py-2">PAY</th>
            <th id="mygrid_c8" className="border px-4 py-2">BEFORE</th>
            <th id="mygrid_c9" className="border px-4 py-2">AFTER</th>
            <th id="mygrid_c10" className="border px-4 py-2">STATUS</th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {data.map((item)=>(
          <tr className="odd" key={item.code}>
            <td className="border px-4 py-2 w-10">{item.code}</td>
            <td className="border px-4 py-2 w-40">{item.METHOD}</td>
            <td className="border px-4 py-2 w-3/12">{item.MEMO}</td>
            <td className="border px-4 py-2 w-1/6">{item.CREATED}</td>
            <td className="border px-4 py-2 w-1/6">{item.payed}</td>
            <td className="border px-4 py-2 w-14">{item.FEE}</td>
            <td className="border px-4 py-2">-{item.AMOUNT}</td>
            <td className="border px-4 py-2">-{item.PAY}</td>
            <td className="border px-4 py-2 w-10">{item.befor}</td>
            <td className="border px-4 py-2 w-10">{item.after}</td>
            <td className="border px-4 py-2 w-14">{item.status == "paid" ? <span className='text-green-500'>Paid</span> : <span className='text-red-500'>unpaid</span>}</td>
          </tr>  ))}
          
        </tbody>
      </table>
      <div className="keys hidden" title="/operations/history">
        <span>20877701</span><span>20877655</span>
      </div>
    </div>
  </div>
  <div className="h-24"></div>
</div>


      </div>

    </div>
  );
};



export default history;