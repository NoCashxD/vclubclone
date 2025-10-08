"use client";
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css";
import HorizontalNav from '../home/horizontal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

library.add(fas, faTwitter, faFontAwesome);

const TwoDCardForm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = Array.isArray(data) ? data.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const maskBin = (bin) => {
    const binStr = String(bin || '');
    return binStr.length > 0 ? `${binStr[0]}${'*'.repeat(binStr.length - 1)}` : '';
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSubmit = async () => {
    const username = localStorage.getItem('username');
    if (!username) return toast.error('User not logged in');
    try {
      const response = await axios.get('/api/2d-cards', {
        params: { username },
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching 2D cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (id) => {
    const item = data.find(item => item.id === id);
    if (!item) return toast.error('Item not found');
    const username = localStorage.getItem('username');
    if (!username) return toast.error('User not logged in');

    try {
      const response = await fetch('/api/2d-card/addcart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, info: [item] }),
        credentials: 'include'
      });
      const result = await response.json();
      response.ok ? toast.success(result.message) : toast.error(result.message);
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  const getCardComponent = (card) => {
    const bin = maskBin(card.bin || '5244');
    const expiry = card.expiry || '12/29';
    const bank = card.bankname || 'NxV BANK';
    const cardHolder = card.cardHolder || 'JOHN DOE';
    const cardType = card.card_type || card.cardType || 'VISA PLATINUM';

    if ((card.card_type || '').includes('Mastercard')) {
      return (
        <div style={{
          width: '100%',
          height: '220px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #141414, #1f1f1f)',
          color: '#f5c04c',
          padding: '20px',
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top left, rgba(255, 215, 0, 0.08), transparent 60%)',
            zIndex: 0,
          }} />
          <div className="flex justify-between z-10 relative">
            <div style={{
              width: '60px',
              height: '42px',
              background: "url('https://keysgen.site/vclub/img/chip.svg') no-repeat center",
              backgroundSize: 'contain',
              marginTop: '6px'
            }} />
            <img src="https://keysgen.site/vclub/img/mastercard.svg" alt="Mastercard" style={{ height: '50px' }} />
          </div>
          <div className="mt-6 relative z-10">
            <div className="text-[22px] tracking-widest">{bin}</div>
            <div className="text-[13px] mt-1">VALID THRU {expiry}</div>
          </div>
         
          <div className="mt-6 flex justify-between text-[13px] uppercase relative z-10">
            <div><div className="text-[10px] opacity-60 mb-1">Card Holder</div>{cardHolder}</div>
            <div><div className="text-[10px] opacity-60 mb-1">Card Type</div>{cardType}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          width: '100%',
          height: '220px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0a1e3d, #1a2a4f)',
          color: '#ffffff',
          padding: '20px',
          boxShadow: '0 0 60px rgba(0, 123, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top left, rgba(0, 123, 255, 0.15), transparent 60%)',
            zIndex: 0,
          }} />
          <div className="flex justify-between z-10 relative">
            <div style={{
              width: '60px',
              height: '42px',
              background: "url('https://keysgen.site/vclub/img/chip.svg') no-repeat center",
              backgroundSize: 'contain',
              marginTop: '6px'
            }} />
            <img src="https://keysgen.site/vclub/img/visa.svg" alt="Visa" style={{ height: '50px' }} />
          </div>
          <div className="mt-6 relative z-10">
            <div className="text-[22px] tracking-widest">{bin}</div>
            <div className="text-[13px] mt-1">VALID THRU {expiry}</div>
          </div>
         
          <div className="mt-6 flex justify-between text-[13px] uppercase relative z-10 text-gray-200">
            <div><div className="text-[10px] opacity-50 mb-1">Card Holder</div>{cardHolder}</div>
            <div><div className="text-[10px] opacity-50 mb-1">Card Type</div>{cardType}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="app mb-20">
      <div className="main-content">
        <HorizontalNav />
        <div className="container-card mx-auto mt-20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">2D Cards</h1>
            <div className="pagination mt-4">
              <ul className="flex">
                <li onClick={() => handlePageChange(1)} className="cursor-pointer px-2 text-white">&laquo;</li>
                <li onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer px-2 text-white">&lsaquo;</li>
                {pageNumbers.map((num) => (
                  <li key={num} onClick={() => handlePageChange(num)} className={`cursor-pointer px-2 text-white ${currentPage === num ? 'font-bold underline' : ''}`}>{num}</li>
                ))}
                <li onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer px-2 text-white">&rsaquo;</li>
                <li onClick={() => handlePageChange(totalPages)} className="cursor-pointer px-2 text-white">&raquo;</li>
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 text-white">Loading 2D cards...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentData.map((card, index) => (
                <div
                  key={card.id || index}
                  className="card-container cursor-pointer transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleOrder(card.id)}
                >
                  {getCardComponent(card)}

                  {/* Info Box */}
                  <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    <div className="flex justify-between text-sm text-white">
                      <span className="text-gray-300">Bank:</span>
                      <span>{card.bankname || 'Chase Bank'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white">
                      <span className="text-gray-300">Level:</span>
                      <span>{card.level || 'Gold'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white">
                      <span className="text-gray-300">Balance:</span>
                      <span>{card.balance ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white">
                      <span className="text-gray-300">Country:</span>
                      <span>{card.country || 'USA'}</span>
                    </div>
                  </div>

                  {/* Price Button */}
                  <div className="mt-3">
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrder(card.id);
                      }}
                    >
                      Add to Cart - ${card.price || '25.00'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TwoDCardForm;
