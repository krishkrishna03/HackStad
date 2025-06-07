import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Install with `npm install jwt-decode`
import Sidebar from './components/Sidebar';
import axios from 'axios'; // Import axios for API requests

function UserDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

  // Helper function to check if the token is expired
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
      // Optionally, set up periodic checks for token expiry
      const interval = setInterval(() => {
        if (isTokenExpired(userToken)) {
          if (refreshToken) {
            refreshAccessToken(); // Attempt to refresh the token
          } else {
            logout(); // Automatically logout if refresh fails
          }
        }
      }, 60 * 1000); // Check every minute
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [navigate, refreshToken]);

  if (!token) {
    return <div>Loading...</div>; // Placeholder while checking token
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="mt-16 bg-gray-50 min-h-screen">
          <Outlet context={{ token }} />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
