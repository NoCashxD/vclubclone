import React, { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css";

const Add2DCard = () => {
  const [isloader, setIsloader] = useState(false);
  const [formData, setFormData] = useState({
    bin: '',
    card_type: '',
    cardHolder: '',
    expiry: '',
    price: '',
    cvv: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    level: '',
    bankname: '',
    base: '',
    balance: '',
    address : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value !== undefined ? value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloader(true);
    try {
      const response = await fetch("/api/admin/2dcard/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("2D Card added successfully");
        setFormData({
          bin: '', card_type: '', cardHolder: '', expiry: '', price: '', cvv: '', country: '', state: '', city: '', zip: '', level: '', bankname: '', base: '', balance: '',address : '',
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add 2D card: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsloader(false);
    }
  };

  return (
    <div className="admin-app">
      <div className="main-content admin-main">
        <div className='admin-form'>
          <form onSubmit={handleSubmit}>
            <div className='gap-6 flex flex-wrap'>
              <div className="form-row">
                <label>BIN</label>
                <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="Enter BIN" />
              </div>
              <div className="form-row">
                <label>Card Type</label>
                <input type="text" name="card_type" value={formData.card_type} onChange={handleInputChange} placeholder="e.g. Mastercard Credit" />
              </div>
              <div className="form-row">
                <label>Card Holder</label>
                <input type="text" name="cardHolder" value={formData.cardHolder} onChange={handleInputChange} placeholder="Enter Card Holder Name" />
              </div>
              <div className="form-row">
                <label>Expiry</label>
                <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" />
              </div>
              <div className="form-row">
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter Price" />
              </div>
              <div className="form-row">
                <label>CVV</label>
                <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="Enter CVV" />
              </div>
              <div className="form-row">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Enter Country" />
              </div>
              <div className="form-row">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
              </div>
              <div className="form-row">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City" />
              </div>
              <div className="form-row">
                <label>ZIP</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="Enter ZIP" />
              </div>
              <div className="form-row">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter address" />
              </div>
              <div className="form-row">
                <label>Level</label>
                <input type="text" name="level" value={formData.level} onChange={handleInputChange} placeholder="Enter Level" />
              </div>
              <div className="form-row">
                <label>Bank Name</label>
                <input type="text" name="bankname" value={formData.bankname} onChange={handleInputChange} placeholder="Enter Bank Name" />
              </div>
              <div className="form-row">
                <label>Base</label>
                <input type="text" name="base" value={formData.base} onChange={handleInputChange} placeholder="Enter Base" />
              </div>
              <div className="form-row">
                <label>Balance</label>
                <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} placeholder="Enter Balance" />
              </div>
            </div>
            <button className="btn btn-primary mt-6" type="submit" disabled={isloader}>{isloader ? 'Adding...' : 'Add 2D Card'}</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add2DCard; 