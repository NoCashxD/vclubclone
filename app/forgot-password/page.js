"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import "./page.css";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [captchaPool, setCaptchaPool] = useState([]);
  const [selectedCaptcha, setSelectedCaptcha] = useState(null);
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCaptchaList();
  }, []);

  const fetchCaptchaList = async () => {
    try {
      const response = await fetch("https://nocashhost.in/captcha/index.php");
      const data = await response.json();
      setCaptchaPool(data);
      if (data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setSelectedCaptcha(random);
      }
    } catch (error) {
      toast.error("❌ Failed to load CAPTCHA");
      console.error("CAPTCHA fetch error:", error);
    }
  };

  const loadNewCaptcha = () => {
    if (captchaPool.length === 0) return;
    const random = captchaPool[Math.floor(Math.random() * captchaPool.length)];
    setSelectedCaptcha(random);
    setUserCaptchaInput("");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleCaptchaInputChange = (event) => {
    setUserCaptchaInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!selectedCaptcha) {
      toast.error("❌ Captcha not loaded");
      setIsLoading(false);
      return;
    }
    // Send all fields including captcha input and answer to backend
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          userCaptchaInput,
          captchaAnswer: selectedCaptcha.answer
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        loadNewCaptcha();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      loadNewCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-bg">
      <div className="forgot-form-container">
        <div className="info-box">
          Add our bot in jabber: <b>bot@valid.support</b>. Check if you turn off all antispam plugins, or have added our bot to white-list. Bot account is in <b>OFFLINE</b> mode, but it still send messages.
        </div>
        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="text"
            className="forgot-input"
            placeholder="Username *"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <input
            type="email"
            className="forgot-input"
            placeholder="user@jabberserver.domain"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {selectedCaptcha && (
            <div className="forgot-captcha-row">
              <input
                type="text"
                className="forgot-input captcha-input"
                placeholder="Captcha *"
                value={userCaptchaInput}
                onChange={handleCaptchaInputChange}
                required
              />
              <img
                src={selectedCaptcha.url}
                onClick={loadNewCaptcha}
                alt="Captcha"
                className="captcha-img"
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          <button
            className="forgot-btn"
            type="submit"
            disabled={isLoading}
          >
            Request new password
          </button>
        </form>
        <div className="forgot-links">
          <Link href="/login" className="forgot-login-link">
            Return to login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword; 
