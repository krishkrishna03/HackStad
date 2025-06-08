import { useState, useEffect } from "react";
import axios from "axios";
import HackathonCard from "./HackathonCard"; // Import the HackathonCard component

const RegisteredHackathons = () => {
  const [hackathonDetails, setHackathonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        // Fetch registered hackathons from the backend
        const response = await axios.get("https://hackstad-0nqg.onrender.com/registered_hackathon", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Registered Hackathons:", response.data);
        // Fetch hackathon details based on titles from the response
        const hackathonData = await Promise.all(
          response.data.map(async (hackathon) => {
            const res = await axios.get(`https://hackstad-0nqg.onrender.com/hackathon_details?id=${encodeURIComponent(hackathon.hackathon_id)}`);
            return { ...res.data, registrationDate: hackathon.registration_date , registration_id:hackathon.registration_id ,hackathon_id:hackathon.hackathon_id};
            
          })
        );

        // Map the response to the required structure
        const mappedHackathons = hackathonData.map((hackathons, index) => ({
          id: `hack-${index + 1}`, // Assign a unique id (e.g., hack-1, hack-2, ...)
          title: hackathons.title,
          description: hackathons.description || "No description available", // Add a fallback
          startDate: new Date(hackathons.start_date).toLocaleDateString(),
          endDate: new Date(hackathons.end_date).toLocaleDateString(),
          teamSize: hackathons.team_size || "N/A", // Fallback if no team size is provided
          prizePool: hackathons.prize_pool || 0, // Fallback if no prize pool is provided
          image: hackathons.poster_url || "https://via.placeholder.com/150", // Fallback image
          timeLeft: calculateTimeLeft(hackathons.end_date),
          registrationDate: hackathons.registrationDate,
          registration_id: hackathons.registration_id,
        }));

        setHackathonDetails(mappedHackathons);
        setLoading(false); // Stop the loading spinner
      } catch (err) {
        console.error("Error fetching hackathon details:", err);
        setError("Failed to load hackathon details. Please try again later."); // Handle errors
        setLoading(false);
      }
    };

    fetchHackathonDetails(); // Call the async function
  }, []);

  // Function to calculate the time left for a hackathon based on the end date
  const calculateTimeLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end - now;
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : "Ended";
  };

  if (loading) {
    return <p>Loading hackathon details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registered Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathonDetails.map((hackathon) => (
          <HackathonCard 
            key={hackathon.id} 
            hackathon={hackathon} 
            status="registered"
            
          />
        ))}
      </div>
    </div>
  );
};

export default RegisteredHackathons;
