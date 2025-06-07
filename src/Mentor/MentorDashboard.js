import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const MentorDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login-mentor'); // Redirect to the home page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />
        <main className={`flex-1 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          {/* Nested routes will render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;