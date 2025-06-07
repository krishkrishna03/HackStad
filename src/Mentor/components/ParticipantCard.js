// // import React from 'react';
// import React, { useEffect, useState } from "react";
// import { User, Building, Phone, Mail } from 'lucide-react';
// // import { useEffect } from 'react';
// import axios from 'axios';
// const getBaseURL = () => {
//   const ip = window.location.hostname;
//   return `http://${ip}:8000`;
// };
// const [participants, setParticipants] = useState([]);
// const [error, setError] = useState(null);
// const ParticipantCard = ({ participant }) => (
//   console.log('this is 5',participant),

  

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${getBaseURL()}/hackathon/participants/${encodeURIComponent(participant)}`
//         );
//         console.log("Participants:", response.data);
//         setParticipants(response.data);
//       } catch (error) {
//         console.error("Error Fetching Participants:", error);
//         if (error.response && error.response.status === 404) {
//           setError("No participants found for this hackathon.");
//         } else {
//           setError("An error occurred while fetching participants.");
//         }
//       }
//     };
//     fetchParticipants();
//   }, [participant]),
//   <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
//     <div className="flex items-start space-x-4">
//       <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//         <User className="w-6 h-6 text-gray-600" />
//       </div>
//       <div className="flex-1">
//         <h4 className="font-semibold text-gray-800">{participant.name}</h4>
//         <div className="text-sm text-gray-600 space-y-1">
//           <div className="flex items-center">
//             <Building className="w-4 h-4 mr-2" />
//             {participant.college}
//           </div>
//           <div className="flex items-center">
//             <Phone className="w-4 h-4 mr-2" />
//             {participant.phone}
//           </div>
//           <div className="flex items-center">
//             <Mail className="w-4 h-4 mr-2" />
//             {participant.email}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default ParticipantCard;


import React, { useEffect, useState } from "react";
import { User, Building, Phone, Mail } from "lucide-react";
import axios from "axios";

const getBaseURL = () => {
  const ip = window.location.hostname;
  return `http://${ip}:8000`;
};

const ParticipantCard = ({ participant }) => {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${getBaseURL()}/hackathon/participants/${encodeURIComponent(participant)}`
        );
        console.log("Participants:", response.data);
        setParticipants(response.data);
      } catch (error) {
        console.error("Error Fetching Participants:", error);
        if (error.response && error.response.status === 404) {
          setError("No participants found for this hackathon.");
        } else {
          setError("An error occurred while fetching participants.");
        }
      }
    };
    fetchParticipants();
  }, [participant]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
      {error ? (
        <p className="text-gray-600">{error}</p>
      ) : participants.length > 0 ? (
        participants.map((participant, index) => (
          <div key={index} className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                {participant.user_name || "No Name Provided"}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {participant.user_college || "No College Info"}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {participant.user_email}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Loading participants...</p>
      )}
    </div>
  );
};

export default ParticipantCard;
