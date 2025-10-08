"use client";
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import HorizontalNav from '../home/horizontal';
import './page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'; // Import the correct icon from FontAwesome

const Refund = () => {
 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value !== undefined ? value : '',
        });
      };
    const [formData, setFormData] = useState({
        bin: '',
        bidbin: '',
        amount: ''
      });

    // const handlePreorder = async () => {
    //     const body = {
    //       bin: formData.bin,
    //       bidbin: formData.bidbin,
    //       amount: formData.amount
       
    //     };
    
    //     try {
    //       const response = await axios.post('/api/preorder', body);
    //       toast.success('Preorder request sent successfully');
    //     } catch (error) {
    //       console.error('Error sending preorder request', error);
    //       toast.error('Failed to send preorder request');
    //     }
    //   };
    
const handlePreorder = ()=>{
    console.log(formData);
    
}


  return (
    <div className="app">
    <div className="main-content">
      <HorizontalNav />
      <div className="container-refund">
  <div className="shadow-md">
    <h3 className="text-2xl font-bold text-white uppercase">Refund Policy (Last Update: 29-02-2024)</h3>
    <article className="text-base mt-4">
      <p className="text-red-600 font-bold text-left text-base">
        WE DO NOT REFUND CARDS IN SUPPORT TICKETS!!!
      </p>
      <p className="mt-2">
        You have 2 days to open the card you bought in the shop and <strong>5 minutes</strong> 
        after opening to request a check. After 5 minutes, we will not review any refund requests.
      </p>
      <p className="mt-2">
        We <strong>DO NOT GUARANTEE</strong> that cards have any balance or funds. 
        We also <strong>DO NOT REFUND</strong> cards with invalid address, state, city, zip, 
        phone, dob, ssn, mmn, name, etc.
      </p>
      <p className="mt-2"><strong>NO REFUNDS</strong> for the following AUTH codes:</p>
      <table className="w-full table-bordered table-auto border border-white-400 mt-4">
        <thead>
          <tr className="">
            <th className="p-1 border w-1/12">AUTH CODE</th>
            <th className="p-1 border w-3/4">AUTH RESULT</th>
          </tr>
        </thead>
        <tbody>
          {[
            { code: '00', result: 'Approved and completed' },
            { code: '03', result: 'Invalid merchant ID' },
            { code: '08', result: 'Honor MasterCard with ID' },
            { code: '10', result: 'Partial approval' },
            { code: '11', result: 'VIP approval' },
            { code: '13', result: 'Invalid amount' },
            { code: '28', result: 'File is temporarily unavailable' },
            { code: '39', result: 'No credit account' },
            { code: '51', result: 'Insufficient funds' },
            { code: '52', result: 'No checking account' },
            { code: '53', result: 'No savings account' },
            { code: '56', result: 'Transaction not supported by institution' },
            { code: '57', result: 'Transaction not permitted on card' },
            { code: '58', result: 'Transaction not permitted to terminal' },
            { code: '59', result: 'Suspected fraud' },
            { code: '61', result: 'Exceeds withdrawal limit' },
            { code: '63', result: 'Security violation' },
            { code: '65', result: 'Exceeds frequency limit' },
            { code: '82', result: 'Time-out at issuer' },
            { code: '83', result: 'Network connection problem' },
            { code: '85', result: 'No reason to decline' },
            { code: '91', result: 'Issuer is unavailable' },
            { code: '93', result: 'Violation of law' },
            { code: '96', result: 'System malfunction' },
            { code: '98', result: 'Card was checked less than 3 hours ago' },
            { code: '99', result: 'Service under maintenance' },
            { code: 'R0', result: 'Customer requested stop of specific recurring payment' },
            { code: 'R1', result: 'Customer requested stop of all recurring payments' },
            { code: 'T0', result: 'First check is OK and has been converted' },
            { code: 'T3', result: 'Amount greater than the limit' },
            { code: 'T4', result: 'Unpaid items; failed negative file check' },
            { code: 'T5', result: 'Duplicate check number' },
            { code: 'T7', result: 'Too many checks' },
          ].map((item, index) => (
            <tr key={index} className="">
              <td className="border p-1 w-1/12">{item.code}</td>
              <td className="border p-1 w-1/12">{item.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4font-bold">We DO NOT REFUND most codes for cards from <span className=' text-orange-500 '>GOLD</span>  bases.</p>
      <p className="mt-4 font-bold">For <span className=' text-orange-500'>GOLD</span> bases we refund only next codes:</p>
      <table className="w-full table-auto border border-gray-400 mt-4">
        <thead>
          <tr className="">
            <th className="p-1 border w-1/12">AUTH CODE</th>
            <th className="p-1 border w-3/4">AUTH RESULT</th>
          </tr>
        </thead>
        <tbody>
          {[
            { code: '05', result: 'Do not honour (No refund for UK, CH, EU)' },
            { code: '07', result: 'Pick up card; fraud account' },
            { code: '14', result: 'Invalid card number' },
            { code: '15', result: 'No such issuer' },
            { code: '41', result: 'Lost card; fraud account' },
            { code: '43', result: 'Stolen card; fraud account' },
            { code: '46', result: 'Closed account' },
            { code: '54', result: 'Expired card' },
            { code: '55', result: 'Incorrect PIN' },
            { code: '78', result: 'No account' },
            { code: '80', result: 'Invalid date' },
            { code: '97', result: 'Invalid CVV' },
            { code: 'N7', result: 'Invalid CVV2' },
          ].map((item, index) => (
            <tr key={index} className="">
              <td className="border p-1 w-1/12">{item.code}</td>
              <td className="border p-2 w-3/14">{item.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  </div>
  <div className="h-24"></div>
</div>

    </div>
  </div>
  
  );
};

export default Refund;
