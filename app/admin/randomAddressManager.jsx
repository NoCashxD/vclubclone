"use client";
import React, { useState } from 'react';
import axios from 'axios';

const RandomAddressManager = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || ""; // if proxying, empty is fine

  const handleClear = async () => {
    setLoading(true);
    setStatus("Clearing all address fields...");
    try {
      const res = await axios.post(`${baseUrl}/api/admin/addresses/clear`);
      setStatus(res?.data?.message || "All address fields cleared.");
    } catch (e) {
      setStatus(e?.response?.data?.message || "Failed to clear addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStatus("Generating random addresses for all entries...");
    try {
      const res = await axios.post(`${baseUrl}/api/admin/addresses/generate`);
      setStatus(res?.data?.message || "Random addresses generated.");
    } catch (e) {
      setStatus(e?.response?.data?.message || "Failed to generate random addresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Random Address Manager</h2>
      <div className="flex gap-3">
        <button type="button" disabled={loading} onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded">
          Clear All Address Data
        </button>
        <button type="button" disabled={loading} onClick={handleGenerate} className="px-4 py-2 bg-green-600 text-white rounded">
          Generate Random Addresses
        </button>
      </div>
      {status ? <div className="mt-2 text-sm">{status}</div> : null}
    </div>
  );
};

export default RandomAddressManager;


