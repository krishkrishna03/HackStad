import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";

const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

const TeamCard = ({ teams }) => {
  const [team, setTeam] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(
          `${getBaseURL()}/hackathon/teams-list/${encodeURIComponent(teams)}`
        );
        console.log("Fetched Team:", response.data);
        setTeam(response.data[0]);
      } catch (error) {
        console.error("Error Fetching Team:", error);
        setError("An error occurred while fetching team data.");
      }
    };
    fetchTeam();
  }, [teams]);

  if (error) {
    return <p className="text-gray-600">{error}</p>;
  }

  if (!team) {
    return <p className="text-gray-600">Loading team details...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-semibold text-gray-800">{team.team_name}</h4>
          <p className="text-gray-600">Lead: {team.team_lead.name} ({team.team_lead.email})</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <h5 className="font-semibold text-gray-700">Team Members:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.team_members.map((member) => (
              <div key={member.user_id} className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>{member.name} ({member.email})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
