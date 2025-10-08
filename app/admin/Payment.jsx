import React, { useState, useEffect } from 'react';
import PayData from './payData';

const Payment = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const response = await fetch('/api/all-payments');
        const result = await response.json();
        console.log(result);
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching all payments:', error);
        setError(error.message);
      }
    };

    fetchAllPayments();
  }, []);

  return (
    <div>
      <h2>Payment History</h2>
      {error && <p className="text-red-500">Error: {error}</p>}

      {!show && (
        <ul>
          {data.map((payment, index) => (
            <li 
              key={index}
              className={`${payment.status === 'paid' ? 'hidden' : 'block'} cursor-pointer border-2 border-white p-2`}
              onClick={() => setShow(payment)}
            >
              {payment.username} - {payment.amount} - {payment.created.split('T')[0]} - {payment.status}
            </li>
          ))}
        </ul>
      )}

      {show && <PayData data={show} />}
    </div>
  );
};

export default Payment;
