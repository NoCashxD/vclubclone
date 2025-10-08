"use client"
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function RefundRequests() {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRefundRequests = async () => {
    try {
      const response = await axios.get('/api/admin/refund-requests', { withCredentials: true });
      setRefundRequests(response.data);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      toast.error('Failed to fetch refund requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundAction = async (requestId, action) => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.post('/api/admin/refund-action', {
        requestId,
        action,
        username
      }, { withCredentials: true });

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchRefundRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error processing refund action:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to process refund action');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'REFUNDED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading refund requests...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Refund Requests</h2>
      
      {refundRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No refund requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-[rgba(255,255,255,.05)]">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Card Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Card Holder</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[rgba(255,255,255,.05)]">
                  <td className="border border-gray-300 px-4 py-2">{request.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.order_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.email || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.card_number}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.card_holder}</td>
                  <td className="border border-gray-300 px-4 py-2">${request.price}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRefundAction(request.id, 'approve')}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRefundAction(request.id, 'reject')}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status !== 'PENDING' && (
                      <span className="text-gray-500 text-sm">
                        {request.processed_at ? `Processed: ${formatDate(request.processed_at)}` : 'N/A'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RefundRequests; 