"use client"
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [answerMessage, setAnswerMessage] = useState('');

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/admin/tickets', { withCredentials: true });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (ticket) => {
    setSelectedTicket(ticket);
    setAnswerMessage('');
    setShowAnswerModal(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answerMessage.trim()) {
      toast.error('Please enter an answer message');
      return;
    }

    try {
      const username = localStorage.getItem('username');
      const response = await axios.post('/api/admin/ticket/answer', {
        ticketId: selectedTicket.id,
        answer: answerMessage,
        adminUsername: username
      }, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Ticket answered successfully');
        setShowAnswerModal(false);
        setSelectedTicket(null);
        setAnswerMessage('');
        fetchTickets(); // Refresh the list
      }
    } catch (error) {
      console.error('Error answering ticket:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to answer ticket');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'opened':
        return 'text-yellow-600 bg-yellow-100';
      case 'closed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAnsweredColor = (answered) => {
    switch (answered) {
      case 'pending':
        return 'text-red-600 bg-red-100';
      case 'replied':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  return (
    <div className="w-full max-[768px]:w-screen overflow-scroll" style={{scrollbarWidth : "none"}}>
      <h2 className="text-2xl font-bold mb-4">Ticket Management</h2>
      
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No unanswered tickets found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-[rgba(255,255,255,.05)]">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Answered</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket,index) => (
                <tr key={index} className="hover:bg-[rgba(255,255,255,.05)]">
                  <td className="border border-gray-300 px-4 py-2">{ticket.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{ticket.subject}</td>
                  <td className="border border-gray-300 px-4 py-2">{ticket.department}</td>
                  <td className="border border-gray-300 px-4 py-2">{ticket.user}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="max-w-xs truncate" title={ticket.message}>
                      {ticket.message}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAnsweredColor(ticket.answered)}`}>
                      {ticket.answered}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {formatDate(ticket.created_at || ticket.created)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {ticket.answered === 'pending' && (
                      <button
                        onClick={() => handleAnswerClick(ticket)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Answer
                      </button>
                    )}
                    {ticket.answered === 'replied' && (
                      <span className="text-gray-500 text-sm">Answered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Answer Modal */}
      {showAnswerModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-bold mb-4">Answer Ticket #{selectedTicket.id}</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Ticket Details:</h4>
              <div className="bg-gray-100 p-3 rounded">
                <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                <p><strong>Department:</strong> {selectedTicket.department}</p>
                <p><strong>User:</strong> {selectedTicket.user}</p>
                <p><strong>Message:</strong></p>
                <div className="bg-white p-2 rounded border">
                  {selectedTicket.message}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Your Answer:</label>
              <textarea
                value={answerMessage}
                onChange={(e) => setAnswerMessage(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded resize-none"
                placeholder="Enter your answer here..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAnswerModal(false);
                  setSelectedTicket(null);
                  setAnswerMessage('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnswer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketManagement;
