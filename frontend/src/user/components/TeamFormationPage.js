// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Users, PlusCircle, Search, UserPlus, X, Check } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
// const TeamFormationPage = ({ onTeamCreated }) => {
//   const MAX_TEAM_MEMBERS = 4;
//   const [activeTab, setActiveTab] = useState('createTeam');
//   const [teamName, setTeamName] = useState('');
//   const [teamDescription, setTeamDescription] = useState('');
//   const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', phone: '' }]);
//   const [availableTeams, setAvailableTeams] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [teamCreationStatus, setTeamCreationStatus] = useState(null);
//   const routeLocation = useLocation(); // Rename variable
//   const { hackathonId, noOfPeopleInTeam } = routeLocation.state || {};  // Extract data

//   console.log("Hackathon ID:", hackathonId);
//   console.log("Number of People in Team:", noOfPeopleInTeam);


//   useEffect(() => {
//     // Fetch available teams from the backend
//     fetch('/api/teams') // Replace with your actual API endpoint
//       .then((res) => res.json())
//       .then((data) => setAvailableTeams(data))
//       .catch((err) => console.error('Error fetching teams:', err));
//   }, []);

//   const addMemberField = () => {
//     if (teamMembers.length < MAX_TEAM_MEMBERS) {
//       setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
//     }
//   };

//   const updateMemberField = (index, field, value) => {
//     const updatedMembers = [...teamMembers];
//     updatedMembers[index][field] = value;
//     setTeamMembers(updatedMembers);
//   };

//   const removeMemberField = (index) => {
//     if (teamMembers.length > 1) {
//       setTeamMembers(teamMembers.filter((_, i) => i !== index));
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!teamName.trim() || teamMembers.some(m => !m.name || !m.email || !m.phone)) {
//       alert('Please fill in all fields before creating the team.');
//       return;
//     }

//     const teamData = { teamName, teamDescription, teamMembers };

//     try {
//       const response = await fetch('/api/create_team', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(teamData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setTeamCreationStatus(result);
//         if (onTeamCreated) onTeamCreated(result);
//       } else {
//         alert('Failed to create team');
//       }
//     } catch (error) {
//       console.error('Error creating team:', error);
//     }
//   };

//   const handleJoinRequest = async (teamId) => {
//     try {
//       const response = await fetch('/api/join_team', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ teamId, user: { name: 'Current User', email: 'current.user@example.com' } }),
//       });

//       if (response.ok) {
//         alert('Join request sent successfully!');
//       } else {
//         alert('Failed to send join request.');
//       }
//     } catch (error) {
//       console.error('Error joining team:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-green-50 flex flex-col items-center p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
//         <div className="flex justify-between">
//           <button className={`p-2 rounded-md ${activeTab === 'createTeam' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('createTeam')}>
//             Create Team
//           </button>
//           <button className={`p-2 rounded-md ${activeTab === 'joinTeam' ? 'bg-green-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('joinTeam')}>
//             Join Team
//           </button>
//         </div>

//         {activeTab === 'createTeam' && (
//           <div className="space-y-6 mt-4">
//             <h2 className="text-2xl font-bold text-indigo-600 flex items-center">
//               <PlusCircle className="mr-3 text-indigo-500" /> Create Your Team
//             </h2>
//             <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
//             <textarea placeholder="Team Description (Optional)" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} className="w-full px-4 py-3 border rounded-lg h-24" />

//             <div className="bg-indigo-50 rounded-lg p-4">
//               <h3 className="text-lg font-semibold text-indigo-600">Team Members</h3>
//               {teamMembers.map((member, index) => (
//                 <div key={index} className="flex gap-2 my-2">
//                   <input type="text" placeholder="Name" value={member.name} onChange={(e) => updateMemberField(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
//                   <input type="email" placeholder="Email" value={member.email} onChange={(e) => updateMemberField(index, 'email', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
//                   <input type="tel" placeholder="Phone" value={member.phone} onChange={(e) => updateMemberField(index, 'phone', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
//                   {teamMembers.length > 1 && <X className="text-red-500 cursor-pointer" onClick={() => removeMemberField(index)} />}
//                 </div>
//               ))}
//               <button onClick={addMemberField} className="bg-indigo-200 text-indigo-600 px-3 py-2 rounded-md mt-2">Add Member</button>
//             </div>

//             <button onClick={handleCreateTeam} className="bg-indigo-600 text-white py-3 rounded-lg w-full">Create Team</button>
//           </div>
//         )}

//         {activeTab === 'joinTeam' && (
//           <div className="space-y-6 mt-4">
//             <h2 className="text-2xl font-bold text-green-600 flex items-center">
//               <Users className="mr-3 text-green-500" /> Join a Team
//             </h2>
//             {availableTeams.map((team) => (
//               <div key={team.id} className="p-4 border rounded-lg flex justify-between items-center">
//                 <div>
//                   <h3 className="font-bold">{team.name}</h3>
//                   <p className="text-gray-600">Theme: {team.theme}</p>
//                   <p className="text-gray-600">{team.members} Members</p>
//                 </div>
//                 <button onClick={() => handleJoinRequest(team.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg">Join</button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeamFormationPage;
import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, PlusCircle, Search, UserPlus, X, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TeamFormationPage = ({ onTeamCreated }) => {
  const MAX_TEAM_MEMBERS = 4;
  const [activeTab, setActiveTab] = useState('createTeam');
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', phone: '' }]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teamCreationStatus, setTeamCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const routeLocation = useLocation();
  const { hackathonId, noOfPeopleInTeam } = routeLocation.state || {};

  // Use useNavigate hook for navigation
  const navigate = useNavigate();

  console.log("Hackathon ID:", hackathonId);
  console.log("Number of People in Team:", noOfPeopleInTeam);
  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip}:8000`;
  };
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/hackathon_teams?hackathon_id=${hackathonId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Full response data:', data);
  
        const teams = (data || []).map((team) => ({
          id: team.team_code, // Using team_code as unique identifier
          name: team.team_name,
          description: team.team_description,
          code: team.team_code,
          lead: team.team_lead,
          members: team.team_members,
          maxSize: team.max_team_size,
        }));
  
        console.log('Mapped teams:', teams);
        setAvailableTeams(teams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
      }
    };
  
    if (hackathonId) {
      fetchTeams();
    }
  }, [hackathonId]);
  
  
  // const handleJoinRequest = (teamId) => {
  //   console.log(`Request to join team ${teamId}`);
    // Implement join team functionality


  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const addMemberField = () => {
    if (teamMembers.length < MAX_TEAM_MEMBERS) {
      setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const updateMemberField = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const removeMemberField = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const authToken = localStorage.getItem("token");



  const handleCreateTeam = async () => {
    if (!teamName.trim() || teamMembers.some(m => !m.name || !m.email || !m.phone)) {
      alert('Please fill in all fields before creating the team.');
      return;
    }

    // Note: Use snake_case keys to match the backend model
    const teamData = { 
      hackathon_id: hackathonId,
      team_name: teamName,
      team_description: teamDescription,
      team_members: teamMembers 
    };

    try {
      const response = await fetch(`${getBaseURL()}/create_team`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        const result = await response.json();
        // Optionally update state or call a callback:
        // setTeamCreationStatus(result);
        // if (onTeamCreated) onTeamCreated(result);

        // Navigate to the registered hackathons page
        navigate('/user-dashboard/hackathons/registered');
      } else {
        alert('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinRequest = async (teamId) => {
    try {
      const response = await fetch(`${getBaseURL()}/api/join_team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });

      if (response.ok) {
        alert('Join request sent successfully!');
      } else {
        alert('Failed to send join request.');
      }
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-green-50 flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between">
          <button className={`p-2 rounded-md ${activeTab === 'createTeam' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('createTeam')}>
            Create Team
          </button>
          <button className={`p-2 rounded-md ${activeTab === 'joinTeam' ? 'bg-green-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('joinTeam')}>
            Join Team
          </button>
        </div>

        {activeTab === 'createTeam' && (
          <div className="space-y-6 mt-4">
            <h2 className="text-2xl font-bold text-indigo-600 flex items-center">
              <PlusCircle className="mr-3 text-indigo-500" /> Create Your Team
            </h2>
            <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
            <textarea placeholder="Team Description (Optional)" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} className="w-full px-4 py-3 border rounded-lg h-24" />

            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-indigo-600">Team Members</h3>
              {teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2 my-2">
                  <input type="text" placeholder="Name" value={member.name} onChange={(e) => updateMemberField(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
                  <input type="email" placeholder="Email" value={member.email} onChange={(e) => updateMemberField(index, 'email', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
                  <input type="tel" placeholder="Phone" value={member.phone} onChange={(e) => updateMemberField(index, 'phone', e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
                  {teamMembers.length > 1 && <X className="text-red-500 cursor-pointer" onClick={() => removeMemberField(index)} />}
                </div>
              ))}
              <button onClick={addMemberField} className="bg-indigo-200 text-indigo-600 px-3 py-2 rounded-md mt-2">Add Member</button>
            </div>

            <button onClick={handleCreateTeam} className="bg-indigo-600 text-white py-3 rounded-lg w-full">Create Team</button>
          </div>
        )}
{activeTab === 'joinTeam' && (
  <div className="space-y-6 mt-4">
    <h2 className="text-2xl font-bold text-green-600 flex items-center">
      <Users className="mr-3 text-green-500" /> Available Teams
    </h2>
    {availableTeams.length > 0 ? (
      <ul className="space-y-4">
        {availableTeams.map((team) => (
          <li key={team.code} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
            <p className="text-gray-600 mt-1"><strong>Description:</strong> {team.description || 'No description provided'}</p>
            <p className="text-gray-600"><strong>Team Code:</strong> {team.code}</p>
            <p className="text-gray-600"><strong>Team Lead:</strong> {team.lead.name} ({team.lead.email})</p>
            <p className="text-gray-600"><strong>Members:</strong> {team.members.map(member => member.name).join(', ') || 'No members yet'}</p>
            <button onClick={() => handleJoinRequest(team.code)} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-green-600">
              Request to Join
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-center">No teams available to join.</p>
    )}
  </div>
)}


      </div>
    </div>
  );
};

export default TeamFormationPage;
