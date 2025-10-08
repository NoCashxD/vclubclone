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
const CreditCardOrders = () => {
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 
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
      const response = await axios.get(`/api/card/order/`, { params: { username }, withCredentials: true });
      // setData(response);
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
          const response = await axios.get(`/balance`, { params: { username }, withCredentials: true });
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
    return data.find(item => item.code === id); // Find item by id
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
    const requestBody = JSON.stringify({ username: username,info : info})
   try {
    const response = await fetch('/api/order/remove', {
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

  fetch(`/api/orders/${transactionId}?username=${username}`)
  .then(response => {
    // Check if response is CSV
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('text/csv')) {
      return response.blob().then(blob => {
        // Handle the CSV blob (e.g., download it or display it)
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order_${transactionId}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    } else {
      // Parse as JSON if response is JSON
      return response.json();
    }
  })
  .then(data => {
    // Process your JSON data here if needed
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

  return (
    <div className="app mb-20">
      <FloatingLoader visible={loading} message="Loading orders..." />
      <div className="main-content">
        <HorizontalNav />
        {id === 0 && (
        <div className="container-order mx-auto mt-20">
  <div >
    <h3 className="text-2xl uppercase font-semibold">CCS Orders</h3>
    <div className="w-full">
      <div className='ml-5 mt-2'>
        <div className="py-3">
          <button
            name="action"
            className="btn-download bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            type="button"
            id="download_orders"
            onClick={handleDownload}
          >
            Download selected
          </button>
          <button
            csrfvalue="NlVsRTNCdDQ1bkxvU0ZtUmhvZFFiRzAzV1FEOX5TSE7Ez1Se07idpthvJhPs-EDyqCEdv2Xy2j1PoWNVjrKLHw=="
            csrfname="YII_CSRF_TOKEN"
            name="action"
            className="btn btn-delete border-t-neutral-50 text-white px-4 py-2 rounded hover:bg-red-600"
            type="button"
            id="delete_orders"
            onClick={clearall}
          >
            Delete selected
          </button>
        </div>
        <div className="table-responsive mt-2">
          <table className="w-full table-auto table-bordered table-sm table-striped table border-collapse border border-gray-300">
            <thead >
              <tr>
                <th ><input type="checkbox" name="item_id_all" id="item_id_all"  onChange={handleSelectAll}
            checked={selectedRows.size === data.length} /></th>
                <th >Code</th>
                <th >Created</th>
                <th >Quantity</th>
                <th >Total Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item,index)=>(
                <tr key={item.code || index} className='text-xs'>
                  <td className='w-6'> <input
                type="checkbox"
                value={item.code}
                name="item_id"
                checked={selectedRows.has(item.code)}
                onChange={() => handleRowSelect(item.code)}
              /></td>
                  <td className='w-20 order' > <a onClick={() => setId(item.code)}>{item.code}</a></td>
                  <td >{item.created}</td>
                  <td className='w-6'>{item.quantity}</td>
                  <td className='w-20'>{item.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
)}
{id !== 0 && (
          <Veiw id={id} />
        )}

      </div>

    </div>
  );
};



export default CreditCardOrders;