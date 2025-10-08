'use client';
import React, { useEffect, useState } from 'react';
import './css/horizontal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Dialog from './dialog';

library.add(fas);

function HorizontalNav() {
  const [balance, setBalance] = useState(0);
  const [showDrop, setShowDrop] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleDialog = () => {
    setIsModalOpen(true);
    setIsOpen(true);
  };

  const closeDialog = () => setIsModalOpen(false);

  const toggleDropdown = (type) => {
    setShowDrop(prev => (prev === type ? '' : type));
  };

  const closeAllDropdowns = () => {
    setShowDrop('');
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const username = localStorage.getItem("username");
      if (!username) return console.log("username is undefined");

      try {
        const response = await axios.get(`/api/balance`, {
          params: { username },
          withCredentials: true
        });
        setBalance(response.data.balance);
      } catch (error) {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
           //window.location.href = '/login';
           console.log(error);
        } else {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const checks = async () => {
      const username = localStorage.getItem("username");
      if (!username && typeof window !== "undefined") {
        //window.location.href = '/login';
        console.log(error);
        return;
      }

      try {
        const response = await axios.get(`/api/checks`, {
          params: { username },
          withCredentials: true
        });

        if (response.data.access !== "yes" && typeof window !== "undefined") {
          window.location.href = '/billing';
        }
      } catch (error) {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
           //window.location.href = '/login';
           console.log(error);
        } else {
          console.error('Error fetching access:', error);
        }
      }
    };

    if (typeof window !== 'undefined' && window.location.pathname !== '/billing') {
      checks();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdowns = document.querySelectorAll('.dropdown');
      let clickedInside = false;

      dropdowns.forEach(drop => {
        if (drop.contains(e.target)) clickedInside = true;
      });

      if (!clickedInside) closeAllDropdowns();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar fixed top-0 w-full bg-dark-900 text-white">
      <div className={`${isOpen ? 'flex' : 'block'} container mx-auto justify-between items-center`}>
        <button className="navbar-toggler lg:hidden text-white" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon font-extrabold"></span>
        </button>

        <div className={`${isOpen ? 'hidden' : 'flex'} lg:flex w-full justify-between`} id="navbarResponsive_top">
        <ul className="navbar-nav flex max-[768px]:w-[100%]">
            <li className="nav-item" >
              <a className="nav-link hover:text-gray-400">News</a>
            </li>
            <li className="nav-item">
              <a href="/preorder" className="nav-link hover:text-gray-400">Preorder</a>
            </li>
            <li className="nav-item">
              <a href="/bins" className="nav-link hover:text-gray-400">
                NoVBV Bins <span className="bg-red-600 text-white rounded-full px-2 text-xs">new</span>
              </a>
            </li>

           {/** CCS Dropdown */}
          <li className="nav-item dropdown relative">
            <a className="nav-link drop hover:text-gray-400 flex gap-2" href="#" onClick={() => toggleDropdown('ccs')}>
              CCS <FontAwesomeIcon icon="fa-solid fa-caret-down" />
            </a><ul className={`${showDrop === 'ccs' ? 'block' : 'hidden'} dropdown-menu absolute left-0 mt-2 max-[768px]:w-[100%] w-40 bg-white text-black`}>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/credit-cards">Buy CCS</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/credit-cards/cart">Cart CCS</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/credit-cards/orders">Orders CCS</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href=''>Binlookup</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/preorder">Bin Preorder</a></li>
            </ul>
          </li>
          <li className="nav-item dropdown relative">
              <a className="nav-link drop hover:text-gray-400 flex gap-2" href="#" onClick={() => toggleDropdown("2d-card")}>2D Cards <FontAwesomeIcon icon="fa-solid fa-caret-down" /></a>
              <ul className={`${showDrop === '2d-card' ? 'block' : 'hidden'} dropdown-menu absolute left-0 mt-2 max-[768px]:w-[100%] w-40 bg-white text-black`}>
                <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/2d-card">Buy 2D Cards</a></li>
                <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/2d-card/cart">Cart 2D Cards</a></li>
                <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/2d-card/orders">Orders 2D Cards</a></li>
              </ul>
            </li>
          {/** Refund Policy Moved Here */}
          <li className="nav-item">
            <a className="nav-link" href="/refund">Refund policy</a>
          </li>

          {/** Billing Dropdown */}
          <li className="nav-item dropdown relative">
            <a className="nav-link drop hover:text-gray-400 flex gap-2" href="#" onClick={() => toggleDropdown('billing')}>
              Billing <FontAwesomeIcon icon="fa-solid fa-caret-down" />
            </a>
            <ul className={`${showDrop === 'billing' ? 'block' : 'hidden'} dropdown-menu absolute left-0 mt-2 max-[768px]:w-[100%] w-40 bg-white text-black`}>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/billing">Topup</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/billing/history">History</a></li>
            </ul>
          </li>

          {/** Support Dropdown */}
          <li className="nav-item dropdown relative">
            <a className="nav-link drop hover:text-gray-400 flex gap-2" href="#" onClick={() => toggleDropdown('support')}>
              Support <FontAwesomeIcon icon="fa-solid fa-caret-down" />
            </a>
            <ul className={`${showDrop === 'support' ? 'block' : 'hidden'} dropdown-menu absolute left-0 mt-2 max-[768px]:w-[100%] w-40 bg-white text-black`}>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/support">My tickets</a></li>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/support/create">Create ticket</a></li>
            </ul>
          </li>

          {/** Profile Dropdown */}
          <li className="nav-item dropdown relative">
            <a className="nav-link drop hover:text-gray-400 flex gap-2" href="#" onClick={() => toggleDropdown('profile')}>
              Profile <FontAwesomeIcon icon="fa-solid fa-caret-down" />
            </a>
            <ul className={`${showDrop === 'profile' ? 'block' : 'hidden'} dropdown-menu absolute left-0 mt-2 max-[768px]:w-[100%] w-40 bg-white text-black`}>
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/profile/details">Settings</a></li>
              {/* <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/two-factor-auth">Two-Factor Auth</a></li> */}
              <li><a className="dropdown-item px-4 py-2 hover:bg-gray-200" href="/login">Logout</a></li>
            </ul>
          </li>
            <Dialog isOpen={isModalOpen} onClose={closeDialog} />
          </ul>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default HorizontalNav;
