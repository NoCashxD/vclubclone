import React, { useState } from 'react';
import axios from 'axios';

const PayData = ({ data }) => {
  const [form, setForm] = useState({
    amount: '',
    status: '',
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put('/api/update-payment', {
        id: data.id, // You need `id` of the payment record
        username : data.username,
        amount: form.amount,
        status: form.status,
      });
      alert(res.data.message);
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment.');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-10">
        <div className="form-row">
          <label>Username</label>
          <input type="text" placeholder={data.username} disabled />
        </div>
        <div className="form-row">
          <label>Transaction id</label>
          <input type="text" placeholder={data.address} disabled />
        </div>
        <div className="form-row">
          <label>
            Amount <small>{data.balance}</small>
          </label>
          <input type="text" name="amount" onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <label>Status</label>
          <select name="status" id="status" onChange={handleInputChange}>
            <option value="unpaid">unpaid</option>
            <option value="paid">paid</option>
          </select>
        </div>
      </div>
      <a className="btns btn-sm btn-primary text-xs mt-10 cursor-pointer" onClick={handleSubmit}>
        Submit
      </a>
    </div>
  );
};

export default PayData;
