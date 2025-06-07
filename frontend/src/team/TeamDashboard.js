import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import axios from 'axios'; // Import axios for API requests
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode JWT tokens
function TeamDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen] = useState(true);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const queryParams = new URLSearchParams(location.search);
  const hackathon_Id = queryParams.get('hackathon_id');
  const [registrationId, setRegistrationId] = useState('');
  console.log('6y76y76',hackathon_Id);
  const [isLoading, setIsLoading] = useState(true);
  const navItems = [
    { id: 'home', label: 'Home', path: `/team-dashboard/team-home?hackathon_id=${hackathon_Id}`  },
    { id: 'chat', label: 'Team Chat', path: `/team-dashboard/team-chat?hackathon_id=${hackathon_Id}`},
    { id: 'problem', label: 'Problem Statement', path: `/team-dashboard/problem-statement?hackathon_id=${hackathon_Id}`},
    { id: 'submit', label: 'Submit Project', path: `/team-dashboard/submit-project?hackathon_id=${hackathon_Id}` },
    { id: 'leaderboard', label: 'Leaderboard', path: `/team-dashboard/leaderboard?hackathon_id=${hackathon_Id}` },
    // { id: 'timetable', label: 'TimeTable', path: `/team-dashboard/timetable?hackathon_id=${hackathon_Id}` },
  ];
  const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token); // Decode the token to get the payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp < currentTime; // Compare expiration time
      } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Assume expired if decoding fails
      }
    };
    const logout = () => {
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('refresh_token'); // Remove refresh token
      setToken(null); // Clear token state
      setRefreshToken(null); // Clear refresh token state
      navigate('/login-student'); // Redirect to login page
    };
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post('${BASE_URL}/refresh-token', {
          refresh_token: refreshToken,
        });
        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;
  
        // Store the new tokens
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
  
        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
      } catch (error) {
        console.error('Error refreshing token:', error);
        logout(); // If refresh fails, log out the user
      }
    };
    useEffect(() => {
      const userToken = localStorage.getItem('token');
      if (!userToken || isTokenExpired(userToken)) {
        if (refreshToken) {
          refreshAccessToken(); // Try refreshing the token
        } else {
          logout(); // Logout if no token or refresh token is available
        }
      } else {
        setToken(userToken);
        setIsLoading(false); // Set loading to false once token is verified
    
        // Optionally, set up periodic checks for token expiry
        const interval = setInterval(() => {
          if (isTokenExpired(userToken)) {
            if (refreshToken) {
              refreshAccessToken();
            } else {
              logout();
            }
          }
        }, 60 * 1000);
        return () => clearInterval(interval);
      }
    }, [navigate, refreshToken]);
    
    useEffect(() => {
      // Extract registration_id from the state if available
      const savedRegistrationId = location.state?.registration_id;
      if (savedRegistrationId) {
        setRegistrationId(savedRegistrationId);
      }
    }, [location]);
    
    // Move the loading state here so hooks stay in order
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
 

  const handleLogout = () => {
    navigate('/login-student'); // Redirect to login page
  };

  const handleTeam = () => {
    navigate('/user-dashboard'); // Redirect to team page
  };

  const handleBackToDashboard = () => {
    if (registrationId) {
      navigate(`/user-dashboard/hackathons/dashboard?registration_id=${registrationId}`);
    } else {
      // Try to get registration_id from URL params if not in state
      const params = new URLSearchParams(window.location.search);
      const regId = params.get('registration_id');
      if (regId) {
        navigate(`/user-dashboard/hackathons/dashboard?registration_id=${regId}`);
      } else {
        navigate('/user-dashboard'); // Fallback if no registration_id found
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              HackStad
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)} // Update to use navigate() instead of direct links
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="ml-3">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Replace user section with Back to Dashboard button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white 
              transition-all duration-300 transform bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg 
              shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 
              active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${isOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-4 lg:p-8">
          <Outlet /> {/* This will render the nested components here */}
        </div>
      </main>
    </div>
  );
}

export default TeamDashboard;
