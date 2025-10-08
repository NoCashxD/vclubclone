"use client"
import React, { useState, useEffect, useRef } from 'react';
import Veiw from './veiw';
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
import FloatingLoader from "../../credit-cards/floating";

const TwoDCardOrders = () => {
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [vdata, setVdata] = useState([]);
  const [tcost, setTCost] = useState(0);

  // Function to mask BIN number
  const maskBin = (bin) => {
    const binStr = String(bin);
    if (binStr.length === 0) return '';
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

  // Handler for "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelected = new Set(data.map(item => item.code));
      setSelectedRows(allSelected);
    } else {
      setSelectedRows(new Set());
    }
  };
  

  const handleRowSelect = (itemId) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
  
      if (newSelectedRows.has(itemId)) {
        newSelectedRows.delete(itemId);
      } else {
        newSelectedRows.add(itemId);
      }
  
      document.getElementById('item_id_all').checked = newSelectedRows.size === data.length;
      console.log(newSelectedRows);
      
      return newSelectedRows;
    });
  };
  

  const handleDownload = ()=>{
    for(let i=0; i<Array.from(selectedRows).length; i++) {
      const rid = Array.from(selectedRows)[i]
      handledata(rid);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      setLoading(false);
      return;
    }
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(`/api/2d-card/order/`, { params: { username }, withCredentials: true });
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setData(response.data);
        console.log(data[0]);
      } else {
        console.error('Expected an array response', data);
      }

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setcost();
    }
  }, [data])

  const selectedData = (id) => {
    return data.find(item => item.code === id);
  };

  const handleRemove =async (id)=>{
    const info = [selectedData(id)];
      
        if (!info || info.length === 0) {
          toast.error('Item not found');
          return;
        }
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      return;
    }
    const requestBody = JSON.stringify({ username: username,info : info})
   try {
    const response = await fetch('/api/2d-card/order/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message);
      handleSubmit();
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  }
};

const clearall = ()=>{
  for(let i=0; i<Array.from(selectedRows).length; i++) {
    const rid = Array.from(selectedRows)[i]
    handleRemove(rid);
  }
};

const handledata = async (transactionId) => {
  const username = localStorage.getItem('username');
  if (!username) {
    toast.error('User not logged in');
    return;
  }

  try {
    const response = await fetch(`/api/2d-card/order/view/${transactionId}?username=${username}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      const cardData = await response.json();
      
      // Create download content
      const downloadContent = `2D Card Details
Transaction ID: ${transactionId}
Card Type: ${cardData.card_type || 'Visa Credit'}
Card Number: ${cardData.bin || '411111'}**** **** ****
Expiry: ${cardData.expiry || '12/25'}
CVV: ${cardData.cvv || '123'}
Card Holder: ${cardData.cardHolder || 'JOHN DOE'}
Country: ${cardData.country || 'USA'}
State: ${cardData.state || 'CA'}
City: ${cardData.city || 'Los Angeles'}
ZIP: ${cardData.zip || '90210'}
Level: ${cardData.level || 'Gold'}
Bank: ${cardData.bankname || 'Chase Bank'}
Price: $${cardData.price || '25.00'}

Downloaded on: ${new Date().toISOString()}`;

      // Create and download file
      const blob = new Blob([downloadContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `2d-card-${transactionId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download completed');
    } else {
      const result = await response.json();
      toast.error(result.message || 'Download failed');
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  }
};

// Function to get card style based on card type
const getCardStyle = (cardType) => {
    switch(cardType) {
        case 'Mastercard Debit':
            return { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: 'white' };
        case 'Mastercard Credit':
            return { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: 'white' };
        case 'Visa Debit':
            return { background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white' };
        case 'Visa Credit':
            return { background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white' };
        default:
            return { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' };
    }
};

// Function to get card logo based on card type
const getCardLogo = (cardType) => {
    if (cardType.includes('Mastercard')) {
        return 'MC';
    } else if (cardType.includes('Visa')) {
        return 'VISA';
    }
    return 'CARD';
};

// Function to get status color
const getStatusColor = (status) => {
    switch(status) {
        case 'completed':
            return 'text-green-500';
        case 'pending':
            return 'text-yellow-500';
        case 'failed':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
};

  return (
    <div className="app mb-20">
      <FloatingLoader visible={loading} message="Loading orders..." />
      <div className="main-content">
        <HorizontalNav />
        {id === 0 && (
        <div className="container-order mx-auto mt-20  px-40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl uppercase font-semibold">2D Card Orders</h3>
            <div className="flex items-center space-x-4">
              <span className="text-white">Total Orders: {data.length}</span>
              <span className="text-white">Total Cost: ${tcost}</span>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No orders found</p>
              <a href="/2d-card" className="btn btn-primary mt-4 rounded-[10px]">Browse 2D Cards</a>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="item_id_all"
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <label htmlFor="item_id_all" className="text-white">Select All</label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary"
                    disabled={selectedRows.size === 0}
                  >
                    Download Selected
                  </button>
                  <button
                    onClick={clearall}
                    className="btn btn-secondary"
                    disabled={selectedRows.size === 0}
                  >
                    Remove Selected
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="w-[100%] table-auto table-bordered table-sm table-striped table border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th><input type="checkbox" name="item_id_all" id="item_id_all" onChange={handleSelectAll}
                        checked={selectedRows.size === data.length} /></th>
                      <th>Code</th>
                      <th>Created</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((order, index) => (
                      <tr key={order.code || index} className='text-xs'>
                        <td className='w-6'>
                          <input
                            type="checkbox"
                            value={order.code}
                            name="item_id"
                            checked={selectedRows.has(order.code)}
                            onChange={() => handleRowSelect(order.code)}
                          />
                        </td>
                        <td className='w-20 order'>
                          <a onClick={() => setId(order.code)} className="cursor-pointer text-blue-500 hover:underline">
                            {order.code}
                          </a>
                        </td>
                        <td>{order.created || 'N/A'}</td>
                        <td className='w-6'>{order.quantity || 1}</td>
                        <td className='w-20'>${order.total_price || order.price || '25.00'}</td>
                        <td className='w-20'>
                          <div className="flex space-x-1">
                            <button
                              className="btn btn-primary text-xs px-2 py-1"
                              onClick={() => handledata(order.code)}
                            >
                              Download
                            </button>
                            <button
                              className="btn btn-secondary text-xs px-2 py-1"
                              onClick={() => handleRemove(order.code)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        )}
        {id !== 0 && (
          <Veiw id={id} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TwoDCardOrders; 