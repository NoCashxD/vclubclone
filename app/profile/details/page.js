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
import Chart from "../../home/charts"
library.add(fas, faTwitter, faFontAwesome)
import axios from 'axios';
const CreditCardOrders = () => {
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
 const[username, setUsername] = useState("");
 const[balance, setBalance] = useState("");
 const[is2FASetup, setIs2FASetup] = useState(false);
 const[isLoading2FA, setIsLoading2FA] = useState(true);


  const [selectedRows, setSelectedRows] = useState(new Set());

  const [vdata, setVdata] = useState([]);
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

  const disable2FA = async () => {
    try {
      const response = await fetch('/api/disable-2fa-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.success) {
        setIs2FASetup(false);
        check2FAStatus();
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
    }
  };

  const check2FAStatus = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        setIsLoading2FA(false);
        return;
      }

      const response = await fetch('/api/check-2fa-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.isSetup) {
        setIs2FASetup(true);
      } else {
        setIs2FASetup(false);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      setIs2FASetup(false);
    } finally {
      setIsLoading2FA(false);
    }
  };

  const handleSubmit = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      return;
    }
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(`/api/details`, { params: { username }, withCredentials: true });
      // setData(response);
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setData(response.data);
        console.log(data);
      } else {
        console.error('Expected an array response', data);
      }

    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    handleSubmit();
    setUsername(localStorage.getItem('username'));  
    check2FAStatus();
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
    <div className="app ">
      <div className="main-content">
        <HorizontalNav />
        <div className="container-setting !mt-20">
  <div className=" gap-16 flex lg:flex-row flex-col">
    <div className="col-span-2 max-[768px]:w-[100%] w-max">
      <div className="card">
        <div className="card-header">
          <h5 className='min-[768px]:text-center min-[768px]:p-0 pl-[30px] pt-3 mt-2'>Profile</h5>
        </div>
        <div className="card-body">
          <ul id="yw0" className="list-none  max-[768px]:flex" role="menu">

            <li className="nav-item">
              <a
                tabIndex="-1"
                role="tab"
                className="nav-link text-blue-500 hover:underline"
                href="/profile"
              >
                <i className="icon-pencil"></i> Change password
              </a>
            </li>
            <li className="nav-item">
              <a
                tabIndex="-1"
                role="tab"
                className="nav-link text-blue-500 hover:underline"
                href="/profile/details"
              >
                <i className="icon-user"></i> Details
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="col-span-10 min-[768px]:w-[950px]">
    <h2 className="text-3xl font-bold mt-4 max-[768px]:block hidden !text-white pb-[10px] border-b-[1px] border-[#adafae29]">Multi Factor <br/> Authentication (2FA)</h2>
    <h2 className="text-2xl font-bold mt-4 min-[768px]:block hidden pb-[10px]">Multi Factor Authentication (2FA)</h2>
      {!isLoading2FA && !is2FASetup && (
        <div className="alert bg-[#c00] mt-4 text-[14px]">
        Please, activate multifactor authentification! It will protect your account from steal! <br/>
You can use any 2FA application (even Google Authentificator), but we suggest to use opensource alternatives: Aegis for Android and Tofu for iOS. Store your backup codes on separate device! We suggest to store backup codes in password managers (like KeePass)
<br/> <span className='text-[24px] underline uppercase'> <a href='/two-factor-auth'>Click Enable 2FA! </a>  </span> 
        </div>
       )}
      {!isLoading2FA && is2FASetup && (
        <div className="!p-0 my-4 alert  text-[14px]">
        <span className='flex justify-between'> <h2 className='text-white'>2FA Authentication</h2>
        <h2 className='text-white underline text-[#1d7097]' onClick={disable2FA}>Disable 2FA</h2></span>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-4">Short info</h2>
      <div className="alert alert-warning mt-4">
        Please make sure that your jabber is still active and up-to-date.<br />
        You can restore access to your account quickly by writing support from your current jabber.
      </div>
      <table className="table table-striped table-bordered table-auto mt-4">
        <tbody>
          <tr className="odd">
            <th className="text-left">Username</th>
            <td>{username}</td>
          </tr>
          <tr className="even">
            <th className="text-left">Balance</th>
            <td>{balance}$</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-2xl font-bold mt-4">Statistics of purchases</h2>
      <div className="overflow-x-auto">
        <table className="table table-striped table-bordered table-auto mt-4">
          <thead>
            <tr>
              <th className="p-2">Section</th>
              <th className="p-2">Total</th>
              <th className="p-2">Amounts</th>
              <th className="p-2">Refunds</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item)=>(

          
            <tr className="odd">
              <td>{item.METHOD}</td>
              <td className="w-12">1pcs</td>
              <td className="w-12">{item.PAY}$</td>
              <td className="w-12"></td>
            </tr>
              ))}
          </tbody>
        </table>
        <div className='div5'><Chart/></div>
      </div>
    
   
      
 

  </div>
  </div>

  <div className="h-24"></div>
</div>

  </div>
</div>
  );
};



export default CreditCardOrders;