import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function SubmitProject() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hackathon_Id = queryParams.get('hackathon_id');
  const token = localStorage.getItem('token');
  const [timetableUrl, setTimetableUrl] = useState(null);
  const [problemStatementsUrl, setProblemStatementsUrl] = useState(null);

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await fetch(
          `${getBaseURL()}/hackathon_details/?id=${encodeURIComponent(hackathon_Id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setTimetableUrl(data.timetable_url);
        setProblemStatementsUrl(data.problem_statements_url);
      } catch (error) {
        console.error('Failed to fetch hackathon details:', error);
      }
    };

    if (hackathon_Id && token) {
      fetchHackathonDetails();
    }
  }, [hackathon_Id, token]);

  const isImage = (url) => url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'));

  return (
    <div className="max-w-6xl p-8 mx-auto border border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      {/* Enhanced Header Section */}
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Project Resources
        </h2>
        <p className="text-gray-600">View timetable and problem statements for your project</p>
      </div>

      {/* Documents Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Timetable Section */}
        <div className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Hackathon Timetable</h3>
          {timetableUrl ? (
            isImage(timetableUrl) ? (
              <div className="relative group">
                <img
                  src={timetableUrl}
                  alt="Hackathon Timetable"
                  className="w-full rounded-lg shadow-sm transform transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <a
                  href={timetableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <span className="px-4 py-2 font-medium text-gray-800 bg-white rounded-lg">View Full Size</span>
                </a>
              </div>
            ) : (
              <a
                href={timetableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold 
                  rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all 
                  duration-300 shadow-md hover:shadow-lg"
              >
                View Timetable
              </a>
            )
          ) : (
            <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
              No timetable available at the moment.
            </div>
          )}
        </div>

        {/* Problem Statements Section */}
        <div className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Problem Statements</h3>
          {problemStatementsUrl ? (
            isImage(problemStatementsUrl) ? (
              <div className="relative group">
                <img
                  src={problemStatementsUrl}
                  alt="Problem Statements"
                  className="w-full rounded-lg shadow-sm transform transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <a
                  href={problemStatementsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <span className="px-4 py-2 font-medium text-gray-800 bg-white rounded-lg">View Full Size</span>
                </a>
              </div>
            ) : (
              <a
                href={problemStatementsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold 
                  rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all 
                  duration-300 shadow-md hover:shadow-lg"
              >
                View Problem Statements
              </a>
            )
          ) : (
            <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
              No problem statements available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
