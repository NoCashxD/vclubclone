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
import FloatingLoader from "../../credit-cards/floating";
const CreditCardCart = () => {

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [loading, setLoading] = useState(true);

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
      const allSelected = new Set(data.map(item => item.id));
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
  
      return newSelectedRows; // Return the new Set to update the state
    });
  };
  

  const handleClear = () => {
    setHcvv(false);
    setWcc(false);
    setWaddr(false);
    setWemail(false);
    setWphone(false);
    setWdob(false);
    setFullz(false);
  };

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
      const response = await axios.get(`/api/card/cart/`, { params: { username }, withCredentials: true });
      // setData(response);
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setData(response.data,"data");
        console.log(data[0],"data0");
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
  const selectedData = (id) => {
    return data.find(item => item.id === id); // Find item by id
  };
  const handleRemove =async (id)=>{
    const info = [selectedData(id)]; // Wrap the single item in an array
      
        if (!info || info.length === 0) {
          toast.error('Item not found');
          return;
        }
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      return;
    }
    const requestBody = JSON.stringify({ username: username,
                                           info : info})
    const requestoptions={
      method:"post",
      headers : {'content-type': 'application/json'},
      body : requestBody
   }
   try {
    const response = await fetch('/api/cart/remove', {
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
  for(let i=0; i<data.length; i++) {
    handleRemove(data[i].id);
  }
};
  const handleOrder = async () => {
    if(loading) return;
    setLoading(true)

    const selectedData = Array.from(selectedRows).map(id => data.find(item => item.id === id)); // Wrap the single item in an array

    if (!selectedData || selectedData.length === 0) {
      toast.error('Item not found');
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      return;
    }

    const requestBody = JSON.stringify({
      username: username,
      info: selectedData // Send info as an array
    });
    console.log(selectedData);
    

    try {
      const response = await fetch('/api/purchase', {
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
    finally{
    setLoading(false)
    }
  };
  return (
    <div className="app mb-20">
      <FloatingLoader visible={loading} message="Loading cart..." />
      <div className="main-content">
        <HorizontalNav />
        <div className="container-cart mt-20">
          <div id="yw2" className="tabbable">
            <ul className="nav nav-tabs" role="menu">
              <li className="nav-item">
                <a
                  data-toggle="tab"
                  tabIndex="-1"
                  role="tab"
                  className="nav-link"
                  href="#ccs"
                >
                  CCS
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div id="ccs" className="tab-pane fade">
                <div className="card">
                  <div className="card-body">
                    <table className="table table-striped table-bordered min-w-full table-auto border-collapse">
                      <tbody>
                        <tr>
                          <td className="w-48 border px-4 py-2">Order Cost:</td>
                          <td className="border px-4 py-2 text-xs">{tcost}$</td>
                        </tr>
                        <tr>
                          <td className="w-48 border px-4 py-2">Total:</td>
                          <td className="border px-4 py-2 text-xs">{data.length}pcs</td>
                        </tr>
                        <tr>
                          <td className="w-48 border px-4 py-2">Current Balance:</td>
                          <td className="border px-4 py-2 text-xs">{balance}$</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex justify-between mt-4">
                      <div className="w-1/2 pr-2">
                        <button
                          rel="CCS"
                          className="cart_purchase_selected_ccs btn btn-large btn-block btn-outline-primary bg-transparent border-2 border-primary text-primary py-2 w-full"
                          type="button"
                          onClick={handleOrder}
                        >
                          Buy Selected

                        </button>
                      </div>
                      <div className="w-1/2 pl-2">
                        <button
                          rel="CCS"
                          className="cart_purchase btn btn-large btn-block btn-primary text-white w-full py-2"
                          type="button"
                          onClick={()=>{
                            handleSelectAll()
                            handleOrder()
                          }}
                        >
                          Buy All
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        rel="CCS"
                        className="cart_clear cart_clear btn btn-large btn-block btn-secondary text-white w-full py-2"
                        type="button"
                          onClick={()=>{
                            clearall()
                          }}
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div id="cart_ccs_list" className="grid-view">
                <div className="table-responsive mt-4">
  <table className="table table-striped table-bordered min-w-full table-auto border-collapse">
    <thead>
      <tr>
        <th className="checkbox-column border px-4 py-2">
          <input
            className="select-on-check-all"
            type="checkbox"
            name="item_id_all"
            id="item_id_all"
            onChange={handleSelectAll}
            checked={selectedRows.size === data.length}
          />
        </th>
        <th className="border px-4 py-2">
          <a className="sort-link" href="/shop/cart/search?CCSCart_sort=bin">
            BIN<span className="caret"></span>
          </a>
        </th>
        <th className="border px-4 py-2">EXP</th>
        <th className="border px-4 py-2">Country</th>
        <th className="border px-4 py-2">Holder name</th>
        <th className="border px-4 py-2">Bank</th>
        <th className="border px-4 py-2">Level</th>
        <th className="border px-4 py-2">Base</th>
        <th className="border px-4 py-2">Price/1pcs</th>
        <th className="border px-4 py-2">Total</th>
        <th className="border px-4 py-2">-</th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <tr>
          <td colSpan="11" className="text-center">Your cart is empty now</td>
        </tr>
      ) : (
        data.map((item,index) => (
          <tr key={item.id || index} className={item.id}>
            <td className="checkbox-column border px-4 py-2">
              <input
                type="checkbox"
                value={item.id}
                name="item_id"
                checked={selectedRows.has(item.id)}
                onChange={() => handleRowSelect(item.id)}
              />
            </td>
            <td className="border px-4 py-2 text-xs">{item.bin}</td>
            <td className="border px-4 py-2 text-xs">{item.exp}</td>
            <td className="border px-4 py-2 text-xs">{item.country}</td>
            <td className="border px-4 py-2 text-xs">{item.holderName}</td>
            <td className="border px-4 py-2 text-xs">{item.bank}</td>
            <td className="border px-4 py-2 text-xs">{item.level}</td>
            <td className="border px-4 py-2 text-xs">{item.base}</td>
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2 text-xs">{item.price}$</td>
            <td className="border px-4 py-2 text-xs">
              <a className="btn btn-sm btn-danger text-xs" title="Buy" onClick={() => handleRemove(item.id)} id={`yt${item.id}`}>
                Remove
              </a>
            </td> 
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

                  <div className="keys hidden" title="/shop/cart"></div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: '100px' }}></div>
        </div>
      </div>

    </div>
  );
};



export default CreditCardCart;
