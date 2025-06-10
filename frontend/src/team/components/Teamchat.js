import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function Teamchat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [errorMessage, setErrorMessage] = useState(null);
  const websocketRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hackathon_Id = queryParams.get('hackathon_id');

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const ws = new WebSocket(`${getBaseURL()}/team_chat?hackathon_id=${hackathon_Id}`, ['Bearer', token]);
    websocketRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('Connected');
      console.log('✅ Connected to team chat WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Incoming:', data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setErrorMessage('WebSocket encountered an error.');
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [hackathon_Id]);

  const handleSendMessage = () => {
    const ws = websocketRef.current;
    const token = localStorage.getItem('token');

    if (newMessage.trim() !== '' && ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        token: token,
        text: newMessage,
        hackathon_id: hackathon_Id
      };
      ws.send(JSON.stringify(payload));
      setNewMessage('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl h-[calc(100vh-120px)] flex flex-col border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white">Team Chat</h2>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            connectionStatus === 'Connected' ? 'bg-green-400' : 'bg-red-400'
          } animate-pulse`}></div>
          <p className="text-sm text-gray-100">{connectionStatus}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto scroll-smooth">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} 
              className={`flex ${msg.sender === localStorage.getItem('username') ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl shadow-lg max-w-xs lg:max-w-md transform transition-all duration-200 hover:scale-[1.02] ${
                msg.sender === localStorage.getItem('username')
                  ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-br-none shadow-blue-100'
                  : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-bl-none shadow-pink-100'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {msg.sender || 'Unknown'}
                  </span>
                </div>
                <p className="mb-1 text-white/90">{msg.text}</p>
                <div className="text-xs text-white/70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-400 animate-pulse">
              No messages yet. Start the conversation! 💭
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 bg-white border-t border-gray-200 rounded-b-2xl">
        <div className="flex items-center max-w-4xl gap-3 p-2 mx-auto shadow-sm bg-gray-50 rounded-2xl">
          <input
            type="text"
            className="flex-1 p-3 text-gray-800 placeholder-gray-400 transition-all duration-200 bg-transparent outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage} 
            className="px-5 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold rounded-xl
            transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center
            hover:from-blue-700 hover:via-blue-600 hover:to-blue-800 shadow-lg hover:shadow-blue-200"
            disabled={!newMessage.trim() || connectionStatus !== 'Connected'}
          >
            <span>Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 border-t border-red-200 bg-red-50 rounded-b-xl">
          <p className="flex items-center gap-2 text-sm text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
