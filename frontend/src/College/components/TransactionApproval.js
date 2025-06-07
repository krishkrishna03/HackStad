// TransactionApproval.js
import React, { useState } from 'react';
import { DollarSign, Check, X, AlertCircle } from 'lucide-react';

const TransactionApproval = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      description: "Prize money for winning team",
      amount: 5000,
      requestedBy: "Sarah Johnson",
      date: "2024-04-05",
      status: "pending"
    },
    {
      id: 2,
      description: "Catering services for hackathon",
      amount: 2500,
      requestedBy: "Michael Chen",
      date: "2024-04-04",
      status: "pending"
    }
  ]);

  const handleApprove = (id) => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'approved' } : tx
    ));
  };

  const handleReject = (id) => {
    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'rejected' } : tx
    ));
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <DollarSign size={28} className="text-gray-700" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-gray-800">Transaction Approval</h2>
      </div>

      <div className="space-y-4">
        {transactions.map(transaction => (
          <div key={transaction.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">{transaction.description}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${transaction.amount.toLocaleString()}
                </p>
                <div className="text-gray-600">
                  <p>Requested by: {transaction.requestedBy}</p>
                  <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              {transaction.status === 'pending' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(transaction.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Check size={20} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(transaction.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  transaction.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                    {transaction.status === 'approved' ? (
                    <Check size={20} />
                  ) : (
                    <X size={20} />
                  )}
                  <span className="capitalize">{transaction.status}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-amber-700">
          <AlertCircle size={20} />
          <p>Transactions will be processed within 24 hours of approval.</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionApproval;