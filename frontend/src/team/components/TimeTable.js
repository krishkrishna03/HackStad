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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Check the time table & Problem statement</h2>

      {timetableUrl ? (
        isImage(timetableUrl) ? (
          <img
            src={timetableUrl}
            alt="Hackathon Timetable"
            className="w-full max-w-3xl rounded-lg shadow"
          />
        ) : (
          <a
            href={timetableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Open Timetable
          </a>
        )
      ) : (
        <p className="text-gray-600">No timetable available.</p>
      )}

      {problemStatementsUrl ? (
        isImage(problemStatementsUrl) ? (
          <img
            src={problemStatementsUrl}
            alt="Problem Statements"
            className="w-full max-w-3xl rounded-lg shadow mt-4"
          />
        ) : (
          <a
            href={problemStatementsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-4"
          >
            Open Problem Statements
          </a>
        )
      ) : (
        <p className="text-gray-600">No problem statements available.</p>
      )}
    </div>
  );
}
