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
const SocksOrders = () => {

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
      const response = await axios.get(`/api/sock/order/`, { params: { username }, withCredentials: true });
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
        <div className="container-order mx-auto mt-20">
  <div >
    <h3 className="text-2xl uppercase font-semibold">Accounts orders:</h3>
    <div className="w-full">
      <div className='ml-5 mt-2'>
     
        <div className="table-responsive mt-2">
          <table className="w-full table-auto table-bordered table-sm table-striped table border-collapse border border-gray-300">
            <thead >
              <tr>
                <th >Code</th>
                <th >Created</th>
                <th >Total Price</th>
              </tr>
            </thead>
            <tbody>
              {data.length == 0 && (
                 <tr className='sample'>
                 <td className="border p-2 text-center " colSpan="7">
                   <div className="empty">You do not have any preorders right now</div>
                 </td>
               </tr>
              )}

              {data.map((item,index)=>(
                <tr key={item.code || index} className='text-sm'>
                  <td className='w-20 order' ><a href={`/orders/ccs/order/${item.id}`}>{item.code}</a></td>
                  <td >{item.created}</td>
                  <td className='w-20'>{item.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div className="h-24"></div>
</div>

      </div>

    </div>
  );
};



export default SocksOrders;