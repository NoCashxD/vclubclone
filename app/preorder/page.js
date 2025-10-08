"use client";
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import HorizontalNav from '../home/horizontal';
import './page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'; // Import the correct icon from FontAwesome

const Preorder = () => {
  const [data,setData] = useState([])
 
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

      const handleVorder = async()=>{
        const username = localStorage.getItem("username");
        const response = await fetch(`/api/preorder/${username}`,{
          method : "GET"
        })
        const data = await response.json();
        if(!response.ok){
          console.log(data.error)
        }else{
          console.log(data);
          setData(data.data)
        }
      }
      useEffect(()=>{
        handleVorder();
      },[])
    const handlePreorder = async () => {
      const username = localStorage.getItem("username")
        const body = {
          bin: formData.bin,
          bidbin: formData.bidbin,
          amount: formData.amount,
          username : username
       
        };
    
        try {
          const response = await axios.post('/api/preorder', body);
          toast.success('Preorder request sent successfully');
        } catch (error) {
          console.error('Error sending preorder request', error);
          toast.error('Failed to send preorder request');
        }
      };
    



  return (
    <div className="app">
    <div className="main-content">
      <HorizontalNav />
      <div className="container-preorder mt-[75px]">
        <div className="container my-[10px]">
          <div className="row">
            <div className="col">
              <form
                className="flex justify-between max-[768px]:items-center"
                id="preorderForm"
                action="/preorder"
                method="post"
              >
                <input
                  type="hidden"
                  value="NmtRaX5WM2xmYmVQeTU5dXd3cW1HdUw5Z2cxcV9xNULDgJiX_nc5MUa_GcLSenZd6qfj641Ww0uZ9ugpwfBMuw=="
                  name="YII_CSRF_TOKEN"
                />
                <div className="form-group">
                  <label className="px-[10px]" htmlFor="PreorderForm_bin">
                    BIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-[100px]"
                    placeholder="6 - 11 bin"
                    name="bin"
                    id="PreorderForm_bin"
                    type="text"
                    maxLength="11"
                    value={formData.bin} onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="px-[10px]" htmlFor="PreorderForm_bid">
                    Bid per BIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-[100px]"
                    placeholder="20$ or more"
                    name="bidbin"
                    id="PreorderForm_bid"
                    type="text"
                    value={formData.bidbin} onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="px-[10px]" htmlFor="PreorderForm_amount">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-[100px]"
                    name="amount"
                    id="PreorderForm_amount"
                    type="text"
                    value={formData.amount} onChange={handleInputChange}
                  />
                </div>
                <div className="!mb-[-10px] form-group shrink-[0]">
                  <button className="btn btn-primary" type="button" onClick={handlePreorder}>
                    Add Preorder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="container">
          <div id="Preorder" className="grid-view">
            <div className="table-responsive">
              <table className="items table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">
                      <a href="/preorder/index?Preorder_sort=bin" className="sort-link blue">
                        BIN<span className="caret"></span>
                      </a>
                    </th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">
                      <a href="/preorder/index?Preorder_sort=bid" className="sort-link blue">
                        Your Bid<span className="caret"></span>
                      </a>
                    </th>
                    <th className="border p-2">Maximal Bid</th>
                    <th className="border p-2">Total</th>
                   
                  </tr>
                </thead>
                <tbody>
                 {data.length === 0 && 
                 
                 <tr className='sample'>
                    <td className="border p-2 text-center " colSpan="7">
                      <div className="empty">You do not have any preorders right now</div>
                    </td>
                  </tr>
                 }
                 {data.length > 0 &&  <>
                  {data.map((i)=>(
                  <tr>
                     <th className="border p-2">
                       <a href="/preorder/index?Preorder_sort=bin" className="sort-link blue">
                      {i.bin}<span className="caret"></span>
                       </a>
                     </th>
                     <th className="border p-2">{i.amount}</th>
                     <th className="border p-2">
                       <a href="/preorder/index?Preorder_sort=bid" className="sort-link blue">
                         {i.bidbin}<span className="caret"></span>
                       </a>
                     </th>
                     <th className="border p-2">{i.amount + 1}</th>
                     <th className="border p-2">{i.amount}</th>
                     
                   </tr>
                  ))}
                 </>
                   } 
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="container">
          <h4 className="text-lg font-bold">How bins preorder works</h4>
          <p>
            In the field &quot;BIN&quot; specify the bin you want to buy. In the field &quot;Bid per
            BIN&quot; enter the highest price you are ready to pay for this bin. In the &quot;Amount&quot;
            field specify the number of cards with this bin you want to buy. Then click the button
            &quot;Add Preorder&quot;.
          </p>
        </div>
        <div className="h-[100px]"></div>
      </div>
    </div>
  </div>
  
  );
};

export default Preorder;
