"use client";
import React, { useState, useEffect } from 'react';
import View from './veiw'; // Correcting Veiw to View
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css";
import HorizontalNav from '../home/horizontal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons';
library.add(fas, faTwitter, faFontAwesome);
import axios from 'axios';
import FloatingLoader from "../credit-cards/floating";

const Support = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    const username = localStorage.getItem('username');
    if (!username) {
      toast.error('User not logged in');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`/api/ticket/`, { params: { username }, withCredentials: true });
      if (Array.isArray(response.data)) {
        setData(response.data);
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
    const fetchBalance = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        try {
          const response = await axios.get(`/api/balance`, { params: { username }, withCredentials: true });
          setBalance(response.data.balance);
        } catch (error) {
          if (error.response && error.response.status === 401) {
             //window.location.href = '/login';
             console.log(error);
          } else {
            console.error('Error fetching balance:', error);
          }
        }
      } else {
        console.log("username is undefined");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="app">
      <FloatingLoader visible={loading} message="Loading tickets..." />
      <div className="main-content">
        <HorizontalNav />
        {id === 0 && (
          <div className="container-tickets mx-auto mt-20">
            <div className="flex max-[768px]:flex-col max-[768px]:gap-[20px]">
              <div className="max-[768px]:w-[100%] lg:w-1/6">
                <div className="card shadow-md rounded-lg">
                  <div className="p-4">
                    <ul id="yw0" className="space-y-2" role="menu">
                      <li className="font-semibold">Support</li>
                      <li className="nav-item">
                        <a tabIndex="-1" role="tab" className="sp" href="/support">My tickets</a>
                      </li>
                      <li className="nav-item">
                        <a tabIndex="-1" role="tab" className="sp" href="/support/create">New ticket</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="max-[768px]:w-[100%] lg:w-5/6 lg:ml-10 mt-10">
                <div className="card shadow-md rounded-lg">
                  <div className="p-6">
                    <div id="yw1" className="grid-view">
                      <div className="table-responsive">
                        <table className="table-auto table table-striped table-bordered w-full text-left border-collapse">
                          <thead>
                            <tr>
                              <th className="border-b px-4 py-2">
                                <a className="sp" href="/support/tickets?Support_sort=subject">SUBJECT</a>
                              </th>
                              <th className="border-b px-4 py-2">DEPARTMENT</th>
                              <th className="border-b px-4 py-2">
                                <a className="sp" href="/support/tickets?Support_sort=closed">Status</a>
                              </th>
                              <th className="border-b px-4 py-2">Answered</th>
                              <th className="border-b px-4 py-2">
                                <a className="sp" href="/support/tickets?Support_sort=id">DATE</a>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2">
                                  <a onClick={() => setId(item.id)} className="sp cursor-pointer">{item.subject}</a>
                                </td>
                                <td className="px-4 py-2">{item.department}</td>
                                <td className="px-4 py-2">{item.status}</td>
                                <td className="px-4 py-2">{item.answered}</td>
                                <td className="px-4 py-2">{item.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-24"></div>
          </div>
        )}
        {id !== 0 && (
          <View id={id} />
        )}
      </div>
    </div>
  );
};

export default Support;
