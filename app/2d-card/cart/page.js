"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./page.css";
import HorizontalNav from "../../home/horizontal";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faFontAwesome, faTelegram } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

import FloatingLoader from "./float";


library.add(fas, faTwitter, faFontAwesome, faTelegram);

const TwoDCardCart = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [balance, setBalance] = useState(0);
  const [tcost, setTCost] = useState(0);

  const[load,setLoad] = useState(true)


  // Fetch cart items
  const handleSubmit = async () => {
    setLoad(true);
    const username = localStorage.getItem("username");
    if (!username) return toast.error("User not logged in");
    try {
      const res = await axios.get("/api/2d-card/cart/", {
        params: { username },
        withCredentials: true,
      });
      if (Array.isArray(res.data)){ setData(res.data); console.log(res.data);}
    } catch (err) {
      console.error(err);
  } finally {
    setLoad(false);
  }
  };

  // Fetch balance
  const fetchBalance = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;
    try {
      const res = await axios.get("/api/balance", {
        params: { username },
        withCredentials: true,
      });
      setBalance(res.data.balance);
    } catch (err) {
      // if (err.response?.status === 401) window.location.href = "/login";
      // else 
      console.error(err);
    }
  };

  // Calculate total cost
  useEffect(() => {
    let sum = 0;
    data.forEach((c) => (typeof c.price === "number" ? (sum += c.price) : null));
    setTCost(sum);
  }, [data]);

  // Initial load
  useEffect(() => {
    handleSubmit();
    fetchBalance();
  }, []);

  const maskBin = (bin) => {
    const s = String(bin || "");
    return s ? `${s[0]}${"*".repeat(s.length - 1)}` : "";
  };

  const selectedData = (id) => data.find((d) => d.id === id);

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? new Set(data.map((d) => d.id)) : new Set());
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const allCheckbox = document.getElementById("item_id_all");
      if (allCheckbox) allCheckbox.checked = next.size === data.length;
      return next;
    });
  };

  const handleRemove = async (id) => {
    const username = localStorage.getItem("username");
    const item = selectedData(id);
    if (!item || !username) return toast.error("Missing data");
    try {
      const res = await fetch("/api/2d-card/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, info: [item] }),
      });
      const result = await res.json();
      toast[res.ok ? "success" : "error"](result.message);
      if (res.ok) handleSubmit();
    } catch {
      toast.error("Unexpected error");
    }
  };

  const handleOrder = async () => {
    
  // Prevent double click if already loading
  if (load) return;

  const username = localStorage.getItem("username");
  const items = Array.from(selectedRows).map(selectedData);

  // Early check for missing data
  if (!username || items.length === 0) {
    toast.error("Missing data");
    return;
  }

  setLoad(true); // lock button

  try {
    const res = await fetch("/api/2d-card/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, info: items }),
    });

    const result = await res.json();
    toast[res.ok ? "success" : "error"](result.message);

    if (res.ok) {
      setSelectedRows(new Set());
      handleSubmit();
    }
  } catch (err) {
    toast.error("Unexpected error");
  } finally {
    setLoad(false); // always unlock button
  }

  };

  const clearAll = () => {
    if (selectedRows.size === 0) return toast.error("Please select items");
    Array.from(selectedRows).forEach((id) => handleRemove(id));
  };

  // Custom card UI component
  const getCardComponent = (card) => {
    const bin = maskBin(card.bin);
    const expiry = card.expiry || "12/29";
    const holder = card.cardHolder || "JOHN DOE";
    const bank = card.bankname || "NxV BANK";
    const type = card.card_type || card.cardType || "VISA PLATINUM";
    const isMC = type.includes("Mastercard");

    return (
      <div
        style={{
          width: "100%",
          borderRadius: "16px",
          background: isMC
            ? "linear-gradient(135deg, #141414, #1f1f1f)"
            : "linear-gradient(135deg, #0a1e3d, #1a2a4f)",
          color: isMC ? "#f5c04c" : "#fff",
          padding: "20px",
          boxShadow: isMC
            ? "0 0 60px rgba(255, 215, 0, 0.08)"
            : "0 0 60px rgba(0, 123, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isMC
              ? "radial-gradient(circle at top left, rgba(255, 215, 0, 0.08), transparent 60%)"
              : "radial-gradient(circle at top left, rgba(0, 123, 255, 0.15), transparent 60%)",
            zIndex: 0,
          }}
        />
        <div className="flex justify-between relative z-10">
          <div
            style={{
              width: "60px",
              height: "42px",
              background:
                "url('https://keysgen.site/vclub/img/chip.svg') no-repeat center",
              backgroundSize: "contain",
              marginTop: "6px",
            }}
          />
          <img
            src={
              isMC
                ? "https://keysgen.site/vclub/img/mastercard.svg"
                : "https://keysgen.site/vclub/img/visa.svg"
            }
            alt={isMC ? "Mastercard" : "Visa"}
            style={{ height: "50px" }}
          />
        </div>
        <div className="mt-6 relative z-10">
          <div className="text-[18px] tracking-widest">{bin} **** **** ****</div>
          <div className="text-[13px] mt-1">VALID THRU {expiry}</div>
        </div>
        <div className="mt-6 flex justify-between text-[13px] uppercase relative z-10">
          <div>
            <div className="text-[10px] opacity-60 mb-1">Card Holder</div>
            {holder}
          </div>
          <div>
            <div className="text-[10px] opacity-60 mb-1">Card Type</div>
            {type}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="app mb-20">



    <FloatingLoader visible={load} message="Processing..." />



      <HorizontalNav />
      <div className="container-card mx-auto mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">2D Card Cart</h1>
          <div className="flex space-x-4 text-white">
            <span>Balance: ${balance}</span>
            <span>Total Cost: ${tcost}</span>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <a href="/2d-card" className="btn btn-primary mt-4">
              Browse 2D Cards
            </a>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input id="item_id_all" type="checkbox" onChange={handleSelectAll} className="accent-blue-500" />
                <label htmlFor="item_id_all" className="text-white">
                  Select All
                </label>
              </div>
              <div className="space-x-2">
                <button onClick={clearAll} className="btn btn-secondary" disabled={!selectedRows.size}>
                  Remove Selected
                </button>
                <button onClick={handleOrder} className="btn btn-primary" disabled={!selectedRows.size}>
                  Order Selected
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="card-container cursor-pointer transform hover:scale-105 hover:shadow-xl transition duration-200 relative"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedRows.has(card.id)}
                    onChange={() => handleRowSelect(card.id)}
                    className="absolute top-4 left-4 z-20 w-5 h-5 accent-blue-500"
                  />

                  {/* Custom Card UI */}
                  {getCardComponent(card)}

                  {/* Info Box */}
                  <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    {["bankname", "Level", "Country", "Balance"].map((label) => (
                      <div key={label} className="flex justify-between text-sm text-white mb-1">
                        <span className="text-gray-300">{label}:</span>
                        <span className="font-bold">{card[label.toLowerCase()] ?? (label === "Balance" ? card.balance ?? 'N/A' : "")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(card.id)}
                    className="px-[20px] text-[14px] mt-3 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg transform hover:scale-105 shadow-lg"
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TwoDCardCart;
