import React, { useEffect, useState } from "react";
import axios from "axios";

const PastEvents = () => {
  const [pastHackathons, setPastHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => {
    const fetchPastHackathons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await axios.get("https://hackstad-0nqg.onrender.com/past_hackathons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPastHackathons(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching past hackathons:", err);
        setError("Failed to load past hackathons. Please try again later.");
        setLoading(false);
      }
    };

    fetchPastHackathons();
  }, []);

  const toggleDetails = (hackathon) => {
    setSelectedHackathon(
      selectedHackathon?._id === hackathon._id ? null : hackathon
    );
  };

  if (loading) {
    return <div className="text-center text-lg py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Past Hackathons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastHackathons.length === 0 ? (
          <p className="text-center col-span-full">No past hackathons found.</p>
        ) : (
          pastHackathons.map((hackathon) => (
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
              key={hackathon._id}
            >
              <img
                src={hackathon.poster_url}
                alt={`${hackathon.title} Poster`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {hackathon.title}
                </h3>
                <p >{hackathon._id}</p>
                <p className="text-gray-600 mb-2">{hackathon.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Start:</strong> {new Date(hackathon.start_date).toLocaleString()}
                  
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>End:</strong> {new Date(hackathon.end_date).toLocaleString()}
                </p>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => toggleDetails(hackathon)}
                >
                  {selectedHackathon?._id === hackathon._id
                    ? "Hide Details"
                    : "More Details"}
                </button>
              </div>
              {selectedHackathon?._id === hackathon._id && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-600 mb-3">
                    Additional Details
                  </h4>
                  <div className="space-y-4">
                    {hackathon.winners && hackathon.winners.length > 0 ? (
                      <div>
                        <strong>Winners:</strong>
                        <ul className="list-disc list-inside">
                          {hackathon.winners.map((winner, index) => (
                            <li key={index} className="text-gray-700">
                              {winner}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No winners available.</p>
                    )}
                    {hackathon.problem_statements_url && (
                      <div>
                        <strong>Problem Statements:</strong>
                        <a
                          href={hackathon.problem_statements_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-500 hover:underline mt-2"
                        >
                          View Problem Statements
                        </a>
                      </div>
                    )}
                    {hackathon.timetable_url && (
                      <div>
                        <strong>Timetable:</strong>
                        <a
                          href={hackathon.timetable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-500 hover:underline mt-2"
                        >
                          View Timetable
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastEvents;
