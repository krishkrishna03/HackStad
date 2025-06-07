import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

const MentorChat = ({ hackathonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsConnection, setWsConnection] = useState(null);
  const chatContainerRef = useRef(null);
  const token = localStorage.getItem('token') ;

  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `ws://${ip}:8000/mentor_participant_chat?token=${token}&hackathon_id=${hackathonId}`;
  };
  
  useEffect(() => {
    if (isOpen && !wsConnection) {
      const ws = new WebSocket(getBaseURL());
  
      ws.onopen = () => {
        console.log('Connected to mentor-participant chat');
      };
  
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
  
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      };
  
      setWsConnection(ws);
  
      return () => {
        ws.close();
      };
    }
  }, [isOpen, hackathonId]);
  

  const handleSendMessage = () => {
    if (newMessage.trim() && wsConnection) {
      const messageData = {
        text: newMessage
      };
      wsConnection.send(JSON.stringify(messageData));
      setNewMessage('');
    }
  };
  

  return (
    <div className="fixed z-50 bottom-4 right-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 text-white transition-all duration-200 transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1"
        >
          <MessageCircle size={24} className="filter drop-shadow" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl">
            <h3 className="text-lg font-semibold tracking-wide">Mentor Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 transition-colors rounded-full text-white/90 hover:text-white hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/50"
            style={{
              backgroundImage: `radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)`
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.is_mentor ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${
                    msg.is_mentor
                      ? 'bg-white border border-gray-100 hover:border-indigo-100'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-1 ${msg.is_mentor ? 'text-indigo-600' : 'text-white/90'}`}>
                    {msg.sender_name}
                  </p>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  <p className={`text-[11px] mt-2 ${msg.is_mentor ? 'text-gray-400' : 'text-white/75'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-indigo-300 transition-all placeholder-gray-400 text-[15px]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Send size={20} className="filter drop-shadow" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorChat;
