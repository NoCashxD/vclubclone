"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faUser } from '@fortawesome/free-solid-svg-icons';

library.add(fas, faUser);

import "./page.css";
import FloatingLoader from "../../credit-cards/floating";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tpassword, settPassword] = useState("");
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
  const handletPasswordChange = (event) => {
    settPassword(event.target.value);
  };
  const handleType = () => {
    setShowPass((prev) => !prev); // Toggle visibility
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
  if(password!=tpassword) alert("repeat password not same as password") 
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

    const url = `/api/signup`;
    const data = { username, password, email };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      });
  
      // Check if the response status is not in the range 200–299
      if (!response.ok) {
        const result = await response.json(); // Get the error message from backend
        throw new Error(result.message || "An unknown error occurred");
      }
  
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        localStorage.setItem("username", username);
        localStorage.setItem("role", result.role);
        window.location.href = '/login'; // Redirect to login page after signup
      } else {
          toast.error(result.message);
        loadNewCaptcha();
        }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  



  return (
    <div className="login-container">
      <FloatingLoader visible={isLoading} message="Processing..." />
      <span className="leading-loose block  mt-4 text-slate-300 text-center">Registration: <strong>Open
      </strong> , Registration Fee: <strong>$50
        </strong></span>
      <span className="text-center">
  <h2 className="text-sm font-normal" style={{ color: '#eb3322' }}>
    Please note inactive users without balance will be deleted after several days
  </h2>
</span>
      <div className="form-container ">

        <form onSubmit={handleSubmit}>

          <span className="flex gap-4">

            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder=" Username *"
              required
            />

            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder=" Jabber *"
              required
            />
          </span>
          <div className="alert alert-danger">
            <a href="https://xmpp.org/about/technology-overview/" target="_blank">Jabber (XMPP)</a> <strong>IS NOT AN EMAIL</strong>. You will not be able to reset your password and get access to your account without it. You can register a jabber on some site from <a href="https://list.jabber.at/" target="_blank">this list</a> or find a suggestion on a forum                    </div>
          <span className="flex  gap-4">

          <input
      type={showPass ? "text" : "password"}
      id="password"
      value={password}
      onChange={handlePasswordChange}
      placeholder="Password *"
      required
      onClick={handleType} // Toggle when tapped
    />
            <input
type={showPass ? "text" : "password"}
              type="password"
              id="password"
              value={tpassword}
              onChange={handletPasswordChange}
              placeholder="Repeat Password *"
              required
            />
          </span>




          <span className="flex gap-2">

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

            <div className="flex">
              <button className="submit login" type="submit" disabled={isLoading}>
                Register
              </button>
            </div>
          </span>


        </form>

      </div>
    </div>
  );
}

export default LoginSignup;
