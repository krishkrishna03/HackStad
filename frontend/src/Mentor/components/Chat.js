import React, { useState } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Handle sending message
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Chat</h2>
      <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-500 text-center mt-40">Connect with your students in the community...</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;