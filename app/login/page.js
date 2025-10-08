"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas , faUser } from '@fortawesome/free-solid-svg-icons';

import FloatingTutorial from "../FloatingTutorial";

library.add(fas , faUser);

import "./page.css";
import FloatingLoader from "../credit-cards/floating";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mdsCode, setMdsCode] = useState("");
  const [captchaPool, setCaptchaPool] = useState([]);
  const [selectedCaptcha, setSelectedCaptcha] = useState(null);
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // Use useRouter from next/router

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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMdsCodeChange = (event) => {
    setMdsCode(event.target.value);
  };

  const handleCaptchaInputChange = (event) => {
    setUserCaptchaInput(event.target.value);
  };

  const handleCopy = () => {
    copy(mdsCode);
    toast.success("Copied to Clipboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state
    
      // CAPTCHA validation
    if (
  !selectedCaptcha ||
  userCaptchaInput.trim().toLowerCase() !== selectedCaptcha.answer.trim().toLowerCase()
) {
  toast.error("❌ Invalid CAPTCHA");
  loadNewCaptcha();
  setIsLoading(false);
  return;
}

    const url = isLogin ? `/api/login` : `/api/signup`;
    const data = isLogin ? { username, password, mdsCode } : { username, password, email };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      });

      const result = await response.json();
       
          
          
        if (result.message === "Login successful" || result.message === "Login successful, 2FA required") {
          toast.success(result.message);
          localStorage.setItem("username", username);
          localStorage.setItem("role", result.role);
          
          // Check if 2FA is required
          if (result.requires2FA) {
            window.location.href = '/login/2fa';
          } else {
            window.location.href = '/two-factor-auth';
          }
        } else {
          toast.error(result.message);
        loadNewCaptcha();
        }
    
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  
  
  const handleType = () => {
    setShowPass((prev) => !prev); // Toggle visibility
  };
  return (
    <div className="login-container">
      <FloatingLoader visible={isLoading} message="Processing..." />
      <span className="text-custom leading-loose block  mt-4 text-slate-300">Registration: <strong>Open
      </strong> , Registration Fee: <strong>$50
        </strong></span>
      <div className="form-container ">
     
        <form onSubmit={handleSubmit}>
         
         
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username *"
              required
            />
         
         
           
         <input
      type={showPass ? "text" : "password"}
      id="password"
      value={password}
      onChange={handlePasswordChange}
      placeholder="Password *"
      required
      onClick={handleType} // Toggle when tapped
    />
        
          {!isLogin && (
           
           
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                 placeholder="Jabber *"
                required
              />
   
          )}
          {selectedCaptcha && (
            <div className="form-group flex flex-row captcha-container items-center mt-0">
              <input
                className="w-2/4"
                type="text"
                id="captcha"
                value={userCaptchaInput}
                onChange={handleCaptchaInputChange}
                placeholder=" Captcha *"
                required
              />
              <img
                src={selectedCaptcha.url}
                onClick={loadNewCaptcha}
                alt="CAPTCHA"
                className="captcha-image w-2/4"
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          <div className="flex gap-0">
          <button className="submit login" type="submit" disabled={isLoading}>
           Login
          </button>
          <button className="submit register" type="button"  disabled={isLoading}>
            <a href="/login/register">Registration</a>
          </button>
            </div>
          {isLogin && (
            <div className="forgot-password">
              Forgot your password use <a href="/forgot-password" className="custom-link">this form</a>.
            </div>
          )}
         
        </form>
      </div>
     <FloatingTutorial />
    </div>
  );
}

export default LoginSignup;
