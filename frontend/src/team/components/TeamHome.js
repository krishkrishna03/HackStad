import React from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios'; // Import axios
import { useEffect } from 'react'; // Import useEffect hook
export default function TeamHome() {
  const location = useLocation(); // Use useLocation hook
  const queryParams = new URLSearchParams(location.search);
  const hackathon_Id = queryParams.get('hackathon_id');
  console.log('6y76y7677888',hackathon_Id);
  const [teamDetails, setTeamDetails] = React.useState([]); // State variable to store team members data
  const token = localStorage.getItem('token'); // Get token from local storage
  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };
  const [errorMessage, setErrorMessage] = React.useState(null); // State variable to store error message

  // Sample team members data
  useEffect(() => {
    const fetchteamdetails = async () => {
      try {
        const response = await axios.get(`${getBaseURL()}/get_hackathon_team?hackathon_id=${hackathon_Id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setTeamDetails(response.data.team_members || []);
      } catch (error) {
        setErrorMessage("Failed to load team data details. Please try again later.");
        setTeamDetails([]);
      }
    };
    fetchteamdetails();
  }, []);
  // Create a navigate function to redirect to different pages
  const navigate = useNavigate();

  const handleJoinChat = () => {
    navigate('/chat'); // Navigate to the Team Chat page
  };

  const handleViewProblemStatement = () => {
    navigate('/problem'); // Navigate to the Problem Statement page
  };

  return (
    <div className="max-w-4xl p-8 mx-auto border border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Team Dashboard
        </h2>
        <p className="text-gray-600">Manage your team and track progress</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Team Status Card */}
        <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Team Status</h3>
            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Team Members Online</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">{teamDetails.length}</span>
              <span className="ml-1 text-gray-400">/4</span>
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Team Members</h3>
          <div className="space-y-3">
            {teamDetails.map((member, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 transition-colors duration-200 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    {member.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'Active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {member.status || 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 mt-4 border border-red-200 bg-red-50 rounded-xl">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
