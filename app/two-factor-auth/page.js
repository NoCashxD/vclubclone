"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HorizontalNav from '../home/horizontal';
import QRCode from 'qrcode.react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

function TwoFactorAuth() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (username) {
      checkTwoFactorStatus();
    }
  }, [username]);

  const checkTwoFactorStatus = async () => {
    try {
      const response = await fetch('/api/check-2fa-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.isSetup) {
        // User already has 2FA enabled, redirect to billing
        toast.info('You already have 2FA enabled. Redirecting to billing...');
        setTimeout(() => {
          router.push('/billing');
        }, 2000);
      } else {
        // Generate new secret for setup
        generateNewSecret();
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const generateNewSecret = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-2fa-secret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.success) {
        setSecret(data.secret);
        // Generate QR code URL for the frontend
        const qrCodeUrl = `otpauth://totp/VClub:${username}?secret=${data.secret}&issuer=VClub`;
        setQrCode(qrCodeUrl);
      } else {
        toast.error(data.message || 'Failed to generate 2FA secret');
      }
    } catch (error) {
      console.error('Error generating secret:', error);
      toast.error('Failed to generate 2FA secret');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndSetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-2fa-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          secret,
          verificationCode,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Two-factor authentication setup successful! Redirecting to billing...');
        setTimeout(() => {
          router.push('/billing');
        }, 2000);
      } else {
        toast.error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA setup');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyLogin = async () => {
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

  const disable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/disable-2fa', {
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
        toast.success('Two-factor authentication disabled successfully! Redirecting to billing...');
        setTimeout(() => {
          router.push('/billing');
        }, 2000);
      } else {
        toast.error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatSecret = (secret) => {
    if (!secret) return '';
    return secret.match(/.{1,4}/g).join(' ');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Secret copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="app overflow-hidden lg:h-[90vh]">
      <div className="main-content">
        <HorizontalNav />
        <div className="container-setting mt-[1.5rem]">
          <div className="coontainer mx-auto px-4 lg:max-w-[1140px] ">
            <div className="flex justify-start mt-10">
              <div className="w-[100%]">
                <h2 className="text-[28px] font-semibold mb-6 text-white max-[768px]:text-center">
                  {isSetup ? 'Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
                </h2>

               
                  <div className=" rounded shadow flex flex-col items-center w-[100%]">
                    <p className="mb-2 text-center">
                      Open one of the authenticator apps <br />
                      (we suggest the open source app{' '}
                      <a
                        href="https://getaegis.app"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Aegis
                      </a>{' '}
                      for Android or{' '}
                      <a
                        href="https://www.tofuauth.com/"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tofu
                      </a>{' '}
                      for iOS) and scan this QR code.
                    </p>

                    <div id="tfa-qr-code" className="my-2">
                      {isLoading ? (
                        <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
                          <p className="text-gray-600">Generating QR code...</p>
                        </div>
                      ) : qrCode ? (
                        <div className="w-48 h-48 bg-white rounded p-4 flex items-center justify-center">
                          <QRCode value={qrCode} size={160} />
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
                          <p className="text-gray-600">No QR code available</p>
                        </div>
                      )}
                    </div>

                    <p className="mt-4">Or enter the following code manually:</p>
                    <div id="tfa-code" className="bg-transparent p-2 rounded my-2">
                      {isLoading ? (
                        <pre className="whitespace-pre-wrap text-white">Generating secret...</pre>
                      ) : secret ? (
                        <pre 
                          className="whitespace-pre-wrap text-white font-mono text-lg cursor-pointer hover:text-blue-300 transition-colors"
                          onClick={() => copyToClipboard(secret)}
                          title="Click to copy secret to clipboard"
                        >
                          {formatSecret(secret)}
                        </pre>
                      ) : (
                        <pre className="whitespace-pre-wrap text-white">No secret available</pre>
                      )}
                    </div>

                    <p className="my-4">Enter a code from authenticator app to make sure everything works.</p>

                    <div className="flex flex-col gap-4 mb-4">
                      <label htmlFor="TfaForm_code" className="font-medium text-white flex gap-4 items-center">
                        6-digit code <span className="text-red-500">*</span>
                        <input
                          id="TfaForm_code"
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          
                          maxLength={6}
                          className="max-w-[164px] p-1 rounded text-black"
                        />
                      </label>
                    </div>

                    <button
                      onClick={verifyAndSetup}
                      disabled={isVerifying}
                      className="text-black py-1 px-4 rounded bg-[#f0f0f0] hover:bg-gray-200 disabled:opacity-50"
                    >
                      {isVerifying ? 'Checking...' : 'Check code'}
                    </button>
                  </div>
                
              </div>
            </div>

            <div className="h-24"></div>
          </div>
          <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorAuth; 