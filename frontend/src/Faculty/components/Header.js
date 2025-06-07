import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import for redirection

const Header = ({ toggleSidebar, isSidebarOpen, onLogoClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigation hook

  // Faculty details (mock data, replace with API data if needed)
  const facultyDetails = {
    name: 'Dr. John Doe',
    email: 'john.doe@example.com',
    role: 'Professor - Computer Science',
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout Function
  const handleLogout = () => {
    // Clear session (example: removing token from local storage)
    localStorage.removeItem('token'); // Assuming authentication token is stored

    // Redirect to login page (change path as per your app's routing)
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-white border-b shadow-sm">
      {/* Left Section: Sidebar Toggle and Logo */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={28} className="text-gray-700" /> : <Menu size={28} className="text-gray-700" />}
        </button>

        <button onClick={onLogoClick} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">HACKSTAD</span>
        </button>
      </div>

      {/* Right Section: User Icon */}
      <div className="relative" ref={userMenuRef}>
        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User size={28} className="text-gray-700" />
        </button>

        {/* User Menu Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white border rounded-lg shadow-lg py-2">
            <div className="px-4 py-2">
              <p className="text-lg font-semibold text-gray-800">{facultyDetails.name}</p>
              <p className="text-sm text-gray-600">{facultyDetails.role}</p>
              <p className="text-sm text-gray-500">{facultyDetails.email}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
