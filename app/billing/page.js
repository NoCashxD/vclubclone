"use client";
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import HorizontalNav from '../home/horizontal';
import './page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'; // Import the correct icon from FontAwesome
import FloatingLoader from "../credit-cards/floating";

// Put this near the top of BillingPage component
const btcAddresses = [
  "bc1qu9getsrwf3yes8sm65ur60p2p4ke09ngj5x3d9",
  "bc1qvlqemqht063n0nt9ydathgtqgqyjk0uqucfnad",
  "bc1qns5qnd6l6rrlrk4493ryqelf256qdc8mrxqz88",
  "bc1q6a6tlejetpx7ntg3wd8zx56vs56p9qv5e95tsf",
  "bc1q9c92nve0jn6eef0uwl6ak44sg8chtwu9klw8w6",
  "bc1qmcf9q2chjdmld6cglfft0kldmegghmdhpn4nh5",
  "bc1qxuugf84c59h464yp9wg3yejf0nndghxl5gssa3",
  "bc1qm6kmsswulxuf94yl86f4fake58cx6nht736kam",
  "bc1qpdld4cvzcw35n7au49yefd9crpespy06376w7w",
  "bc1qs3e9zc8heenzpexaj6xfkljtprdz7tdq5h2pvt",
  "bc1qrrnp7zv58h2372ruk6fkg6ve0047cv45ksnmf0",
  "bc1qmeu8ywft9hjyh3spxcrrhydljkdvpv7w5kztmk",
  "bc1qy6tnjdsufwl2uxcx6nfcjvqqn2samcpffvctw5",
  "bc1qn44x7aqarts7hgjh3rj66u9jamv9llyvjueawr",
  "bc1q5x2pc3haqjk2nv0xp8g0cgcgpvyk2a3zhwxx7x",
  "bc1q8m7ymkymw2km6vwnd862n2dnx2makw2lexmcyn"
];

const trc20Addresses = [
  "TEbYw81Puh59QpuJiZrTdkpQX7dKHQefLC",
  "TYjNwTE9SxdbabAmpRvvRmyrKG5zbYDMeg"
];

const bep20Addresses = [
  "0x017113e089b59adf994fa992361abfb70f891770",
  "0x213168ec09998fc2d8418a695597f1a59c80cde4"
];

// helper to pick random address
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const BillingPage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const inputRef = useRef(null);
  const walletAddress = 'bc1qu9getsrwf3yes8sm65ur60p2p4ke09ngj5x3d9'; // Replace with your actual wallet address
  const [isloader, setIsloader] = useState(false);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("bitcoin");
  const [btcAddress] = useState(getRandom(btcAddresses));
  const [trc20Address] = useState(getRandom(trc20Addresses));
  const [bep20Address] = useState(getRandom(bep20Addresses));

  const handleInputChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleCopy = async () => {
    if (inputRef.current) {
      try {
        await navigator.clipboard.writeText(inputRef.current.value);
        setCopySuccess('Copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        setCopySuccess('Failed to copy!');
        console.error('Failed to copy: ', err);
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Address copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
      console.error('Failed to copy: ', err);
    }
  };

  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data = await response.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };

    fetchPrice(); // Fetch on component mount

    const interval = setInterval(fetchPrice, 24 * 60 * 60 * 1000); // Refresh every 24 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await fetch(`/api/payments?username=${username}`);
        if (!response.ok) {
          // Even with 404, ensure data is set to empty array
          if (response.status === 404) {
            setData([]);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } else {
          const result = await response.json();
          // Ensure result is an array
          setData(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setError(error.message);
      }
    };

    fetchTransactions();
  }, []);
  const handleSubmit = async () => {
    const username = localStorage.getItem('username');
    setIsloader(true);
    try {
      await axios.post(`/api/submit-transaction`, {
        transactionId,
        username,
      }, { withCredentials: true });
      alert('Transaction ID sent successfully!');
      setIsloader(false);
      setTransactionId('');
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to send transaction ID.');
      setIsloader(false);
    }
  };

  return (
    <div className="app">
      <FloatingLoader visible={isloader} message="Processing..." />
      <div className="main-content">
        <HorizontalNav />
        <div className="container-billing">
          <div className="tabs-above">
            <ul className="flex border-gray-200">

              <li className="mr-1">
                <a
                  className={tab === "bitcoin" ? "inline-block py-2 px-4 text-blue-500 border-b-2 border-blue-500 active" : "inline-block py-2 px-4"}
                  data-toggle="tab"
                  href="#bitcoin"
                  role="tab"
                  onClick={() => setTab("bitcoin")}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040"
                      alt="btc"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <h6 className="text-base">BITCOIN</h6>
                  </span>
                </a>
              </li>

              <li className="mr-1">
                <a
                  className={tab === "usdt" ? "inline-block py-2 px-4 text-blue-500 border-b-2 border-blue-500 active" : "inline-block py-2 px-4"}
                  data-toggle="tab"
                  href="#usdt"
                  role="tab"
                  onClick={() => setTab("usdt")}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src="https://www.cryptologos.cc/logos/tether-usdt-logo.svg?v=040"
                      alt="usdt"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <h6 className="text-base">USDT</h6>
                  </span>
                </a>
              </li>

              <li className="mr-1">
                <a
                  className={tab === "bnb" ? "inline-block py-2 px-4 text-blue-500 border-b-2 border-blue-500 active" : "inline-block py-2 px-4"}
                  data-toggle="tab"
                  href="#bnb"
                  role="tab"
                  onClick={() => setTab("bnb")}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src="https://www.cryptologos.cc/logos/bnb-bnb-logo.svg?v=040"
                      alt="bnb"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <h6 className="text-base">USDT BNB</h6>
                  </span>
                </a>
              </li>

            </ul>

            <div className="tab-content">
              <div id="bitcoin" className={tab === "bitcoin" ? "tab-pane block" : "tab-pane hidden"}>
                <div className="card p-4 shadow-md rounded">
                  <div className="card-body">
                    <h4 className="text-lg font-semibold">
                      Please send your payment of BTC to Bitcoin address:
                    </h4>
                    <b>
                      <span className=" text-xl">
                        Notice: Every time, when you want to Topup, please, check address on this page. It will be changed every time after each transaction.
                      </span>
                    </b>
                    <br />
                    <br />
                    <b>Exchange fee is 3%. You need to 2 confirmations of transaction in the system to deposit money to your account.</b>
                    <br />
                    <br />
                    <div className="alert alert-success bg-green-100 text-green-800 p-4 rounded">
                      <div
                        id="btc-address"
                        className="text-2xl font-bold cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => copyToClipboard(btcAddress)}
                        title="Click to copy address to clipboard"
                      >

                        {btcAddress}
                      </div>
                    </div>
                    <div className="flex para">
                      <div className="flex-1 text-white">
                        <h4 className="text-lg font-bold">
                          1BTC = {btcPrice ? `$${btcPrice}` : "Loading..."}
                        </h4>
                        Payments from Bitcoin take about 10–15 mins. Please{" "}
                        <a href="https://t.me/vclub_x" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-500">
                          contact support
                        </a>{" "}
                        if you don't receive your funds in your account after 15 mins.
                        <br />

                        <br />
                        To fill up your shop balance with BTC payment you need to:
                        <br />
                        <br />
                        1. Please send coins to the address shown on your screen.
                        <br />
                        2. Once the transaction is complete, enter the sender's address below. Your balance will be updated automatically. You can send as many separate payments as you like, but please don’t spam — all valid payments will be added to your balance.
                        <br />
                        <br />
                      </div>
                      <div className="w-1/3">
                        <div
                          id="qr-bitcoin"
                          className="w-48 h-48 border border-gray-300 relative flex items-center justify-center ml-4"
                        >
                          <QRCode value={btcAddress} size={200} />
                        </div>
                      </div>
                    </div>
                    <div className="farm flex flex-col g-5 mt-10 ">

                      <div className="farm flex flex-col g-5 ml-20 mt-10">
                        <p>Once you have deposited funds, please provide the sender ID below:</p>
                        <div className="transaction-id">
                          <input
                            type="text"
                            value={transactionId}
                            onChange={handleInputChange}
                            placeholder="Enter receiving address not TXN ID"
                          />
                          <button onClick={handleSubmit}>Submit</button>
                          {isloader && <h1>Sending.....</h1>}
                        </div>
                      </div>
                      <div className="alert p-4 rounded mt-4">
                        Transactions waiting confirmation:
                        <br />
                        <div id="bitcoin_pending" className="mt-2">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="py-2 px-4 text-left">Date</th>
                                  <th className="py-2 px-4 text-left">Address</th>
                                  <th className="py-2 px-4 text-left">Amount</th>
                                  <th className="py-2 px-4 text-left">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                      No unconfirmed transactions yet
                                    </td>
                                  </tr>
                                ) : (
                                  data.map((transaction, index) => (
                                    <tr key={index}>
                                      <td className="py-2 px-4 text-left">{transaction.created.split('T')[0]}</td>
                                      <td className="py-2 px-4 text-left">{transaction.address}</td>
                                      <td className="py-2 px-4 text-left">{transaction.amount}</td>
                                      <td className="py-2 px-4 text-left">{transaction.status == "paid" ? <span className='text-green-300'>Confirmed</span> : <span className='text-red-400'>Pending</span>} </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                <div id="usdt" className={tab === "usdt" ? "tab-pane block" : "tab-pane none hidden"}>
                  <div className="card p-4 shadow-md rounded">
                    <div className="card-body">
                      <h4 className="text-lg font-semibold">
                        Please send your payment of USDT to Tether address:
                      </h4>
                      <b>
                        <span className=" text-xl">
                          Notice: Every time, when you want to Topup, please, check address on this page. It will be changed every time after each transaction.
                        </span>
                      </b>
                      <br />
                      <br />
                      <b>Exchange fee is 3%. You need to 2 confirmations of transaction in the system to deposit money to your account.</b>
                      <br />
                      <br />
                      <div className="alert alert-success bg-green-100 text-green-800 p-4 rounded">

                        <div
                          id="usdt-trc-address"
                          className="text-2xl font-bold cursor-pointer hover:text-green-600 transition-colors"
                          onClick={() => copyToClipboard(trc20Address)}
                          title="Click to copy address to clipboard"
                        >
                          {trc20Address}
                        </div>
                      </div>
                      <div className="flex para">
                        <div className="flex-1 text-white">
                          <h4 className="text-lg font-bold">
                            1USDT = 1.00$ — Ensure the network is Tron (TRC20)
                          </h4>
                          Payments from USDT take about 10–15 mins. Please{" "}
                          <a
                            href="https://t.me/vclub_x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-500"
                          >
                            contact support
                          </a>{" "}
                          if you don't receive your funds in your account after 15 mins.
                          <br />
                          <br />
                          To fill up your shop balance with USDT payment you need to:
                          <br />
                          <br />
                          1. Please send coins to the address shown on your screen.
                          <br />
                          2. Once the transaction is complete, enter the sender's address below. Your balance will be updated automatically. You can send as many separate payments as you like, but please don’t spam — all valid payments will be added to your balance.
                          <br />
                          <br />
                        </div>
                        <div className="w-1/3">
                          <div
                            id="qr-bitcoin"
                            className="w-48 h-48 border border-gray-300 relative flex items-center justify-center ml-4"
                          >
                            <QRCode value={trc20Address} size={200} />
                          </div>
                        </div>
                      </div>


                      {/* <div className="farm flex flex-col g-5 mt-10 "> */}
                      <div className="farm flex flex-col g-5 ml-20 mt-10">

                        <p>Once you have deposited funds, please provide the sender ID below:</p>
                        <div className="transaction-id">
                          <input
                            type="text"
                            value={transactionId}
                            onChange={handleInputChange}
                            placeholder="Enter receiving address not TXN ID"
                          />
                          <button onClick={handleSubmit}>Submit</button>
                          {isloader && <h1>Sending.....</h1>}
                        </div>
                      </div>
                      <div className="alert p-4 rounded mt-4">
                        Transactions waiting confirmation:
                        <br />
                        <div id="bitcoin_pending" className="mt-2">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="py-2 px-4 text-left">Date</th>
                                  <th className="py-2 px-4 text-left">Address</th>
                                  <th className="py-2 px-4 text-left">Amount</th>
                                  <th className="py-2 px-4 text-left">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                      No unconfirmed transactions yet
                                    </td>
                                  </tr>
                                ) : (
                                  data.map((transaction, index) => (
                                    <tr key={index}>
                                      <td className="py-2 px-4 text-left">{transaction.created.split('T')[0]}</td>
                                      <td className="py-2 px-4 text-left">{transaction.address}</td>
                                      <td className="py-2 px-4 text-left">{transaction.amount}</td>
                                      <td className="py-2 px-4 text-left">{transaction.status == "paid" ? <span className='text-green-300'>Confirmed</span> : <span className='text-red-400'>Pending</span>} </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="bnb" className={tab === "bnb" ? "tab-pane block" : "tab-pane none hidden"}>
                  <div className="card p-4 shadow-md rounded">
                    <div className="card-body">
                      <h4 className="text-lg font-semibold">
                        Please send your payment of USDT to USDT Bnb address:
                      </h4>
                      <b>
                        <span className=" text-xl">
                          Notice: Every time, when you want to Topup, please, check address on this page. It will be changed every time after each transaction.
                        </span>
                      </b>
                      <br />
                      <br />
                      <b>Exchange fee is 3%. You need to 2 confirmations of transaction in the system to deposit money to your account.</b>
                      <br />
                      <br />
                      <div className="alert alert-success bg-green-100 text-green-800 p-4 rounded">

                        <div
                          id="usdt-bep-address"
                          className="text-2xl font-bold cursor-pointer hover:text-green-600 transition-colors"
                          onClick={() => copyToClipboard(bep20Address)}
                          title="Click to copy address to clipboard"
                        >


                          {bep20Address}
                        </div>
                      </div>
                      <div className="flex para">
                        <div className="flex-1 text-white">
                          <h4 className="text-lg font-bold">
                            1USDT = 1.00$ — Ensure the network is BNB (BEP20)
                          </h4>
                          Payments from USDT take about 10–15 mins. Please{" "}
                          <a
                            href="https://t.me/vclub_x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-500"
                          >
                            contact support
                          </a>{" "}
                          if you don't receive your funds in your account after 15 mins.
                          <br />
                          <br />
                          To fill up your shop balance with USDT payment you need to:
                          <br />
                          <br />
                          1. Please send coins to the address shown on your screen.
                          <br />
                          2. Once the transaction is complete, enter the sender's address below. Your balance will be updated automatically. You can send as many separate payments as you like, but please don’t spam — all valid payments will be added to your balance.
                          <br />
                          <br />
                        </div>
                        <div className="w-1/3">
                          <div
                            id="qr-bitcoin"
                            className="w-48 h-48 border border-gray-300 relative flex items-center justify-center ml-4"
                          >
                            <QRCode value={bep20Address} size={200} />
                          </div>
                        </div>
                      </div>



                      <div className="farm flex flex-col g-5 ml-20 mt-10">

                        <p>Once you have deposited funds, please provide the sender ID below:</p>
                        <div className="transaction-id">
                          <input
                            type="text"
                            value={transactionId}
                            onChange={handleInputChange}
                            placeholder="Enter receiving address not TXN ID"
                          />
                          <button onClick={handleSubmit}>Submit</button>
                          {isloader && <h1>Sending.....</h1>}
                        </div>
                      </div>
                      <div className="alert p-4 rounded mt-4">
                        Transactions waiting confirmation:
                        <br />
                        <div id="bitcoin_pending" className="mt-2">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="py-2 px-4 text-left">Date</th>
                                  <th className="py-2 px-4 text-left">Address</th>
                                  <th className="py-2 px-4 text-left">Amount</th>
                                  <th className="py-2 px-4 text-left">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data && data.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                      No unconfirmed transactions yet
                                    </td>
                                  </tr>
                                ) : (
                                  data.map((transaction, index) => (
                                    <tr key={index}>
                                      <td className="py-2 px-4 text-left">{transaction.created.split('T')[0]}</td>
                                      <td className="py-2 px-4 text-left">{transaction.address}</td>
                                      <td className="py-2 px-4 text-left">{transaction.amount}</td>
                                      <td className="py-2 px-4 text-left">{transaction.status == "paid" ? <span className='text-green-300'>Confirmed</span> : <span className='text-red-400'>Pending</span>} </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* You can add more tab content here */}
              </div>
            </div>
          </div>
        </div>

      </div>
      );
};

      export default BillingPage;
