"use client"
import React, { useState, useEffect, useRef } from 'react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons'
import FloatingLoader from "./float";
library.add(fas, faTwitter, faFontAwesome)
import axios from 'axios';
const veiw = (id ) => {
    const [isLoading,setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [closed, setClosed] = useState(false);
    const [refundStatus, setRefundStatus] = useState('NO REFUND');
    const [refundCount, setRefundCount] = useState(0);
    const [remainingTime, setRemainingTime] = useState(null);

    const [formData, setFormData] = useState({
        subject: '',
        department: '',
        message: '',
        bankName: '',
        country: '',
        state: '',
        city: '',
        level: '',
        types: '',
        binPriceRange: [0, 100]
    });

// Parse date safely for both ISO and MySQL formats
// createdTime is a number (milliseconds since epoch)
const isWithinRefundWindow = (createdTime) => {
  if (!createdTime) return false;

  const oneHourInMs = 60 * 60 * 1000;
  return Date.now() - createdTime <= oneHourInMs;
};

const getRemainingRefundTime = (createdTime) => {
  if (!createdTime) return null;

  const oneHourInMs = 60 * 60 * 1000;
  const remainingTime = oneHourInMs - (Date.now() - createdTime);

  if (remainingTime <= 0) return null;

  const minutes = Math.floor(remainingTime / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};




// Function to fetch user's refund count
const fetchRefundCount = async () => {
  const username = localStorage.getItem('username');
  if (!username) return;

  try {
    const response = await axios.get('/api/refund/count', { 
      params: { username }, 
      withCredentials: true 
    });
    
    if (response.status === 200) {
      setRefundCount(response.data.refundCount);
    }
  } catch (error) {
    console.error('Error fetching refund count:', error);
  }
};

console.log("id",id.id);

const handleSubmit = async (id) => {
  const username = localStorage.getItem('username');
  if (!username) {
    toast.error('User not logged in');
    return;
  }
  try {
    const username = localStorage.getItem("username");
    const response = await axios.get(`/api/order/view/${id}`, { params: { username}, withCredentials: true });
    // setData(response);
    console.log('Full API response:', response.data);
    console.log('Created field:', response.data.created);
    console.log('All data fields:', Object.keys(response.data));
      setData(response.data);

  } catch (error) {
    console.log(error);

  }
};

const handleRefundRequest = async () => {
  if(isLoading) return;
    setLoading(true);

  const username = localStorage.getItem('username');
  if (!username) {
    toast.error('User not logged in');
    return;
  }

  try {
    const response = await axios.post('/api/refund/request', {
      orderId: id.id,
      username: username,
      cardNumber: data.ccnum,
      cardHolder: data.holder,
      price: data.price || 0
    }, { withCredentials: true });

    if (response.status === 200) {
      toast.success(`Refund request sent successfully! Admin will review your request. Remaining refunds: ${response.data.remainingRefunds}`);
      setRefundStatus('PENDING');
      setRefundCount(response.data.remainingRefunds);
    }
  } catch (error) {
    console.error('Error requesting refund:', error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to send refund request. Please try again.');
    }
  }finally{
    setLoading(false);
  }
};

const checkRefundStatus = async () => {
  const username = localStorage.getItem('username');
  if (!username) return;

  try {
    const response = await axios.get(`/api/refund/status/${id.id}`, { 
      params: { username }, 
      withCredentials: true 
    });
    
    if (response.status === 200) {
      setRefundStatus(response.data.status);
    }
  } catch (error) {
    console.error('Error checking refund status:', error);
  }
};

useEffect(() => {
  handleSubmit(id.id);
  checkRefundStatus();
  fetchRefundCount();
  // setcost();
  console.log(id.id);
  
}, []);

// Update remaining time every second
useEffect(() => {
  if (data.created && data.created !== undefined) {
    const timer = setInterval(() => {
      const remaining = getRemainingRefundTime(data.created);
      setRemainingTime(remaining);
      
      // Clear interval if time is up
      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }
}, [data.created]);

    return (
       
      <div className="container-veiw">
      <div id="scrollerToggle">
        <div>
          <h3 className='text-2xl font-extrabold'>CCS Orders</h3>
          <div className="alert alert-info">
            <div>* Please note that checker may kill the card. We advise you to use the card before checking</div>
          </div>
          <div>
            <div id="mygrid" className="grid-view">
              <div className="overflow-x-auto">
                <table className="table tablelg table-striped table-bordered table-auto text-left border">
                  <thead className="">
                    <tr>
                      <th className="p-2 border">Card:</th>
                      <th className="p-2 border">BIN Info:</th>
                      <th className="p-2 border">Additionally:</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd">
                      <td className="p-2 border w-[150px]">
                        <div className="overflow-auto">
                          <table className="table-auto table table-striped table-bordered">
                            <tbody>
                              <tr>
                                <td className="w-12">CCNUM</td>
                                <td className='tds'>{data.ccnum}</td>
                              </tr>
                              <tr>
                                <td className="w-12">EXP</td>
                                <td className='tds'>{data.yymm}</td>
                              </tr>
                              <tr>
                                <td className="w-12">NAME</td>
                                <td className='tds'>{data.holder}</td>
                              </tr>
                              <tr>
                                <td className="w-12">CVV</td>
                                <td className='tds'>{data.cvv}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className='flex flex-col'>
                            <textarea
                              className=" p-1 mt-2 text-comment"
                              placeholder="Write your comment here... Max 250 chars"
                              maxLength={250}
                            ></textarea>
                            <a
                              onClick={() => addComment('5268099945909578')}
                              className="hover:underline float-right mt-2"
                            >
                              Save comment
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="w-[250px] p-2 border text-xs">
                        <div className="overflow-auto">
                          <table className="table table-striped table-bordered table-auto ">
                            <tbody>
                              <tr>
                                <td className="text-center w-12">COUNTRY</td>
                                <td className='tds'>{data.country}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">BANK</td>
                                <td className='tds'>{data.bank}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">LEVEL</td>
                                <td className='tds'>{data.level}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">TYPE</td>
                                <td className='tds'>{data.type}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">ZIP</td>
                                <td className='tds'>{data.zip}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td className="w-[200px] p-2 border text-xs">
                        <div className="overflow-auto">
                          <table className="table table-striped table-bordered table-auto">
                            <tbody>
                              <tr>
                                <td className="text-center w-12">ADDRESS</td>
                                <td className='tds'>{data.addr}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">PHONE</td>
                                <td className='tds'>{data.phone}</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">ORIGINAL</td>
                                <td className='tds'>{data.ccnum}|{data.yymm}|{data.cvv}|{data.holder}|{data.addr}|{data.zip}|{data.phone}|</td>
                              </tr>
                              <tr>
                                <td className="text-center w-12">BASE</td>
                                <td className='tds'> 
                                  <a href="/shop/ccs?Search[base_id][]=17071" className="text-blue-500 hover:underline">
                                    {data.base}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td className="w-20 p-2 border">
                        <div className="inline-block text-center">
                          <abbr title="Approved and completed">00</abbr>
                          <br />
                          <div className="mb-2">
                            {refundStatus === 'PENDING' ? (
                              <span className="text-yellow-600 font-semibold">PENDING</span>
                            ) : refundStatus === 'REFUNDED' ? (
                              <span className="text-green-600 font-semibold">REFUNDED</span>
                            ) : (
                              <span className="text-red-600 font-semibold">NO REFUND</span>
                            )}
                          </div>
                        {refundStatus === 'NO REFUND' && data.created && isWithinRefundWindow(data.created) && (
                             <div className="text-center">
              
                               <button
                                 onClick={handleRefundRequest}
                                 
                                 className={`px-4 py-2 text-white font-medium rounded-md text-sm mb-1`}
                                 style={{ backgroundColor: '#2a9fd6' }}
                               >
                                 Check
                               </button>
                               
                             </div>
                           )}
                           {refundStatus === 'NO REFUND' && (!data.created || !isWithinRefundWindow(data.created)) && (
                             <div className="text-xs text-gray-500 text-center">
                               {!data.created ? 'Order date not available' : 'Refund window expired'}
                             </div>
                           )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="hidden" id="keys" title="/orders/ccs/order/1NV4Q28">
                <span>21220847</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};



export default veiw;
