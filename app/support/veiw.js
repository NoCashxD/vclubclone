"use client"
import React, { useState, useEffect, useRef } from 'react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css"
import HorizontalNav from '../home/horizontal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome)
import axios from 'axios';
const veiw = (id) => {
    const [data, setData] = useState([]);
    const [closed, setClosed] = useState(false);
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
    const handleSubmit = async (id) => {
        const username = localStorage.getItem('username');
        if (!username) {
          toast.error('User not logged in');
          return;
        }
        try {
          const username = localStorage.getItem("username");
          const response = await axios.get(`/api/view/${id}`, { params: { username}, withCredentials: true });
          // setData(response);
          console.log(response.data);
            setData(response.data);
    
        } catch (error) {
          console.log(error);
    
        }
      };
      useEffect(() => {
        handleSubmit(id.id);
        // setcost();
        console.log(id.id);
        
      }, []);
    
 
    return (
       
                <div className="container-tickets mt-20">
  <div className="flex">
    <div className="w-1/5 mr">
      <div className="shadow-md rounded-lg">
        <div className="p-4 card">
          <ul id="yw0" className="list-none" role="menu">
            <li className="font-bold text-lg mb-2">Support</li>
            <li className="mb-2">
              <a className="sp" href="/support" role="tab">
                My tickets
              </a>
            </li>
            <li className="mb-2">
              <a className="sp" href="/support/create" role="tab">
                New ticket
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="w-4/5">
      <div className="shadow-md rounded-lg">
        <div className="p-4 card">
          <form id="verticalForm" action="/support/view/3718248" method="post">
            <input
              type="hidden"
              value="Y3h0ZH55QURaMk5rQThVMn5YdzA3RE5ybW1DajVOT2rFaR5ydh_aa0emGZjqCDMIuPnIAyjP9CGrYwqglaiarg=="
              name="YII_CSRF_TOKEN"
            />
            <table className="table-auto table-sm table table-bordered table-striped w-full">
              <tbody>
                <tr>
                  <td className="w-40 font-bold">Subject</td>
                  <td>{data.subject}</td>
                </tr>
                <tr>
                  <td className="font-bold">Department</td>
                  <td>{data.department}</td>
                </tr>
                <tr>
                  <td className="font-bold">Status</td>
                  <td>{data.answered}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <div className="font-bold">Message:</div>
                    <p>
                    {data.message}
                    </p>
                  </td>
                </tr>
              </tbody>
                
            </table>

            <div className="mt-6">
              <h6 className="font-semibold text-xs">Comments:</h6>
              <div id="mygrid" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-sm table-bordered table-striped text-left text-sm">
                    <thead>
                      <tr>
                        <th className="font-bold py-2 sp">Added</th>
                        <th className="font-bold py-2 sp">Author</th>
                        <th className="font-bold py-2 sp">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                             <tr>
                             <td  className=" py-4">
                               {data.updates}
                             </td>
                             <td  className=" py-4">
                               admin
                             </td>
                             <td  className=" py-4">
                               {data.comments}
                             </td>
                           </tr>
                        {data.length === 0 && (
  <tr>
  <td colSpan="3" className="text-center py-4">
    Not have any comments
  </td>
</tr>
                        )
                        
                        }
                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {closed === true && (
  <div className="mt-4 text-red-500 font-semibold">Ticket is closed.</div>
            )
              
}
          
          </form>
        </div>
      </div>
    </div>
  </div>

  <div className="h-24"></div>
</div>
    );
};



export default veiw;
