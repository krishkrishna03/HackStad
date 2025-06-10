import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hackathonId = queryParams.get('hackathon_id');

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${getBaseURL()}/leaderboard/all/${encodeURIComponent(hackathonId)}`
        );
        setLeaderboardData(response.data.leaderboard);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data");
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [hackathonId]);

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeaderboardData = leaderboardData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <div className="p-6 text-center">Loading leaderboard...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 border border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      {/* Enhanced Header Section */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Leaderboard Rankings
        </h2>
        <p className="text-gray-500">Top performing teams in this hackathon</p>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="py-8 text-center bg-white shadow-inner rounded-xl">
          <p className="text-gray-500 animate-pulse">No leaderboard data available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentLeaderboardData.map((entry, index) => {
            const position = startIndex + index + 1;
            const isTopThree = position <= 3;
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm 
                  hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full 
                    font-bold text-lg ${
                      position === 1 ? 'bg-yellow-100 text-yellow-700' :
                      position === 2 ? 'bg-gray-100 text-gray-700' :
                      position === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {position}
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {entry.name || entry.team_name || "Anonymous"}
                    </span>
                    {isTopThree && (
                      <span className="inline-block ml-2">
                        {position === 1 ? '🏆' : position === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-1 font-mono font-bold text-blue-700 bg-blue-100 rounded-full">
                    {entry.score.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-blue-100">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 text-sm font-semibold text-white transition-all duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                ← Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-blue-600 rounded-lg bg-blue-50">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 text-sm font-semibold text-white transition-all duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
