import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Navigate, useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import MentorChat from './MentorChat';
import SubmissionForm from './SubmissionForm';

const HackathonDashboard = ({ hackathonId }) => {
  const [hackathonDetailsResponse, setHackathonDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const registration_id = queryParams.get("registration_id");
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Calculate time left
  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    }
    return null;
  };
  const token = localStorage.getItem("token");  
  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip}:8000`;
  };
  useEffect(() => {
    let timer;
    if (hackathonDetailsResponse) {
      const endDate = hackathonDetailsResponse[0]?.end_date;
      timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(endDate));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hackathonDetailsResponse]);

  // Fetch hackathon details
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await axios.get(
          `http://127.0.0.1:8000/registered_livehackathon?registration_id=${encodeURIComponent(
            registration_id
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const hackathon = response.data;

        if (!hackathon.hackathon_id) {
          throw new Error("No hackathon title found.");
        }

        const hackathonDetailsResponse = await axios.get(
          `http://127.0.0.1:8000/hackathon_details?id=${encodeURIComponent(
            hackathon.hackathon_id
          )}`
        );

        setHackathonDetails([hackathonDetailsResponse.data]);
      } catch (error) {
        setErrorMessage("Failed to load hackathon details. Please try again later.");
      }
    };

    fetchHackathonDetails();
  }, [registration_id]);

  // Fetch leaderboard data
  

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!hackathonDetailsResponse || hackathonDetailsResponse.length === 0) return;
  
      const hackathon = hackathonDetailsResponse[0];
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/leaderboard/all/${encodeURIComponent(hackathon.id)}`
        );
        setLeaderboardData(response.data.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
  
    fetchLeaderboard();
  }, [hackathonDetailsResponse]);
  

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeaderboardData = leaderboardData.slice(startIndex, startIndex + itemsPerPage);
  // useEffect(() => {
  //   const fetchLeaderboardData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) throw new Error("Authentication token is missing.");

  //       const response = await axios.get(${getBaseURL()}/leaderboard/all, {
  //         headers: { Authorization: Bearer ${token} },
  //       });

  //       // Map the response to extract relevant fields and sort by overall score
  //       const leaderboard = response.data
  //         .map(entry => ({
  //           hackathon_id: entry.hackathon_id,
  //           overall: entry.scores.overall,
  //         }))
  //         .sort((a, b) => b.overall - a.overall); // Sort in descending order of overall score

  //       setLeaderboardData(leaderboard);
  //     } catch (error) {
  //       console.error("Failed to fetch leaderboard data:", error);
  //     }
  //   };

  //   fetchLeaderboardData();
  // }, []);

  // // Pagination handlers
  // const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentLeaderboardData = leaderboardData.slice(startIndex, startIndex + itemsPerPage);

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (!hackathonDetailsResponse || hackathonDetailsResponse.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading hackathon details...</p>
      </div>
    );
  }

  const hackathon = hackathonDetailsResponse[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full bg-gradient-to-t from-gray-800 to-gray-600">
        <img
          src={hackathon?.poster_url}
          alt="Hackathon"
          className="absolute inset-0 object-cover w-full h-full opacity-75"
        />
      </div>

      {/* Title, Hosted By, and Timer Section */}
      <div className="container px-4 py-8 mx-auto text-center">
        <h1 className="mb-2 text-4xl font-bold md:text-5xl">{hackathon?.title}</h1>
        <p className="mb-4 text-lg md:text-xl">Hosted by {hackathon?.college_name}</p>
        {timeLeft ? (
          <div className="text-lg font-medium text-blue-600 md:text-xl">
            Time Left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        ) : (
          <div className="text-lg font-medium text-red-600 md:text-xl">Hackathon has ended</div>
        )}
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Key Information */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Key Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { label: "Registration Opens", value: hackathon?.start_date },
                  { label: "Registration Deadline", value: hackathon?.register_deadline },
                  { label: "Start Date", value: hackathon?.start_date },
                  { label: "End Date", value: hackathon?.end_date },
                  {
                    label: "Registration Fee",
                    value: hackathon?.registration_fee
                      ? `₹${hackathon.registration_fee}`
                      : "Free",
                  },
                  // Add Submit button as a grid item
                  hackathon?.team === 'individual' ? {
                    label: "", // Remove the label
                    value: (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsSubmissionFormOpen(true)}
                        sx={{
                          borderRadius: '6px',
                          padding: '4px 12px',
                          fontSize: '14px',
                          height: '32px',
                          width: 'auto',
                          minWidth: '120px',
                          marginLeft: 0,
                          display: 'flex',
                          justifyContent: 'flex-start',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, .2)',
                          '&:hover': {
                            boxShadow: '0 3px 6px rgba(25, 118, 210, .3)',
                          }
                        }}
                      >
                        Submit Project
                      </Button>
                    ),
                    hideIcon: true,
                    alignLeft: true
                  } : null,
                ].filter(Boolean).map((info, idx) => (
                  <div key={idx} className={`flex items-center ${info.alignLeft ? 'justify-start' : 'space-x-3'}`}>
                    {!info.hideIcon && <Calendar className="w-6 h-6 text-blue-600" />}
                    <div className={!info.hideIcon ? '' : 'flex justify-start w-full'}>
                      <p className="text-sm text-gray-500">{info.label}</p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">About the Hackathon</h2>
              <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                {hackathon?.description}
              </p>
            </div>

            {/* Additional Images */}
            {hackathon?.problem_statements_url && (
              <img
                src={hackathon.problem_statements_url}
                alt="Problem Statements"
                className="w-full rounded-lg shadow-md"
              />
            )}
            {hackathon?.timetable_url && (
              <img
                src={hackathon.timetable_url}
                alt="Timetable"
                className="w-full rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Right Column */}
          <div className="sticky space-y-6 lg:col-span-1 top-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Enrollment Details</h2>
              <p className="text-sm">
                <strong>Max Participants:</strong> {hackathon?.max_participants}
              </p>
              <p className="text-sm">
                <strong>Team Size:</strong> {hackathon?.no_of_people_in_team}
              </p>
              <p className="text-sm">
                <strong>Hackathon Type:</strong> {hackathon?.hackathon_type}
              </p>
              <p className="text-sm">
                <strong>Mode:</strong> {hackathon?.hackathon_mode}
              </p>
              <p className="text-sm">
                <strong>Prize Pool:</strong> {hackathon?.prize_pool}
              </p>
              <p className="text-sm">
                <strong>Mentors:</strong> {hackathon?.mentor_emails.join(", ")}
              </p>
              {hackathon?.team === "team" && (
                <Button 
                  onClick={async () => {
                    try {
                      const response = await axios.get(`${getBaseURL()}/get_hackathon_team?hackathon_id=${hackathon.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });

                      if (response.status === 200) {
                        navigate(`/team-dashboard?hackathon_id=${hackathon.id}`);
                      } else {
                        // fallback just in case, though unlikely
                        navigate('/user-dashboard/teamcreate', {
                          state: {
                            hackathonId: hackathon.id,
                            noOfPeopleInTeam: hackathon.no_of_people_in_team,
                          }
                        });
                      }
                    } catch (error) {
                      navigate('/user-dashboard/teamcreate', {
                        state: {
                          hackathonId: hackathon.id,
                          noOfPeopleInTeam: hackathon.no_of_people_in_team,
                        }
                      });
                    }
                  }}
                  variant="contained"
                >
                  View Team Dashboard
                </Button>
              )}
            </div>

                             {/* Leaderboard Section */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
              {leaderboardData.length === 0 ? (
                <p className="text-gray-500">No... leaderboard data available.</p>
              ) : (
                <div className="space-y-4">
                  {currentLeaderboardData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <div className="flex items-center">
                        <span className="w-6 text-gray-500">{startIndex + index + 1}.</span>
                        <span className="font-medium">
                          {entry.name || entry.team_name || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-gray-600"> {entry.score.toFixed(2)}</span>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded disabled:bg-gray-300"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded disabled:bg-gray-300"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add MentorChat component */}
      <MentorChat hackathonId={hackathon?.id} />
      {/* Add SubmissionForm component
      // <SubmissionForm
      //   open={isSubmissionFormOpen}
      //   onClose={() => setIsSubmissionFormOpen(false)}
      //   hackathonId={hackathon?.id}
      // /> */}
    </div>
  );
};

export default HackathonDashboard;