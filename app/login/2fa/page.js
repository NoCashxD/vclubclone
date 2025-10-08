"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert("mkc user" + username)
      //router.push('/login');
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-2fa-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          verificationCode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Verification successful!');
        router.push('/billing');
      } else {
        toast.error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA login:', error);
      toast.error('Failed to verify 2FA');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="app overflow-hidden lg:h-[90vh] bg-[#000]">
      <div className="main-content h-[100%] flex justify-center items-center">
        <div className="container-setting mt-[1.5rem]">
          <div className="coontainer mx-auto px-4 lg:max-w-[1140px] ">
            <div className="flex justify-start mt-10">
              <div className="w-[100%] text-center ">
                <h2 className="text-[28px] font-semibold mb-2 text-white uppercase">
                  Two-Factor Authentication
                </h2>
                <div className="well center">
                  <p className="">
                    Enter a code from authenticator app (6 digits) or one of backup codes (8 symbols, spaces didn't count, each code can be <br/> used only once) to proceed.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-group">
                      <input
                        name="TfaForm[code]"
                        className="mt-2 border-[#aed1b2] border-[1px] text-[#aed1b2] px-[10px] rounded-[5px] min-w-[217px] h-[40px] bg-[#000]"
                        id="TfaForm_code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="text-black py-1 px-4 rounded bg-[#f0f0f0] hover:bg-gray-200 disabled:opacity-50 mt-2"
                    >
                      {isVerifying ? 'Checking...' : 'Check code'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;