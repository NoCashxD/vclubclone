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
const CreditCardForm = () => {

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
    const handleClear = () => {
        setFormData({
            subject: '',
            department: '',
            message: '',
        })
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value !== undefined ? value : '',
        });
    };

    const handleSubmit = async ()=> {
        try {
          const response = await fetch('/api/create/ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
             subject: formData.subject,
             department: formData.department,
             message: formData.message,
             username: localStorage.getItem("username"),
            }),
          });
          if (response.ok) {
            toast.success("Ticket Created successfully");
          handleClear();
        } else {
          const errorData = await response.json();
          console.log(errorData.message);
          
          toast.error(`Failed to add card data: ${errorData.message}`);
        }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
 
    return (
        <div className="app">
            <div className="main-content">
                <HorizontalNav />
                <div className="container-create mx-auto mt-20">
  <div className="flex dflex">
    <div className="lg:w-1/6">
      <div className=" shadow-md rounded-lg">
        <div className="p-4 card">
          <ul id="yw0" className="space-y-2" role="menu">
            <li className="font-semibold">Support</li>
            <li className="nav-item">
              <a tabIndex="-1" role="tab" className="hover:underline" href="/support">My tickets</a>
            </li>
            <li className="nav-item">
              <a tabIndex="-1" role="tab" className="hover:underline" href="/support/create">New ticket</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="lg:w-5/6 mt-10">
      <div id="submitForm" className="shadow-md rounded-lg card">
        <div className="p-6">
          <form id="verticalForm" action="/support/create" method="post">
            <input type="hidden" value="TOKEN_HERE" name="YII_CSRF_TOKEN" />
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="newTicket_subject">Subject <span className="text-red-500">*</span></label>
              <input className="w-full p-2 border border-gray-300 rounded" name='subject' value={formData.subject} onChange={handleInputChange} type="text" maxLength="20" />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="newTicket_department">Department <span className="text-red-500">*</span></label>
              <select className="lg:w-full w-60  p-2 border border-gray-300 rounded" name='department' value={formData.department} onChange={handleInputChange}>
                <option value="">--- Select department ---</option>
                <option value="2">Preoder BIN or CC</option>
                <option value="4">Refunds &amp; Dead CC</option>
                <option value="5">Bitcoin, Monero &amp; Topup Problems</option>
                <option value="6">Technical Support Department</option>
              </select>
            </div>
            <div className="bg-red-700 text-white px-4 py-3 rounded mb-4">
              Never share your passwords or other important data with supports. We do not accept any liability in this case.
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="newTicket_message">Your message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded" rows="5" name="message" value={formData.message} onChange={handleInputChange}></textarea>
            </div>
            <div className="font-bold mb-4">
              We <span className="font-extrabold text-red-600 ">DO NOT REFUND CCS</span> in the tickets anymore!!!
            </div>
            <div className="flex space-x-4">
              <button className=" text-white font-bold py-2 px-4 rounded btn-primary" type="button" name="yt0" onClick={handleSubmit}>Create ticket</button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="reset" name="yt1" onClick={()=> handleClear}>Reset</button>
            </div>
          </form>
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



export default CreditCardForm;
