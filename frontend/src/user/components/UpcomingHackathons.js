import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HackathonCard from './HackathonCard';

// Custom Hook: Fetch Upcoming Hackathons
const useFetchUpcomingHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
    const fetchUpcomingHackathons = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/live_hackathons`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Hackathons:", data); 
        const upcomingHackathons = data.map(h => ({
          id: h.h_id ,
          title: h.title || 'Untitled Hackathon',
          description: h.description || '',
          startDate: h.start_date || null,
          endDate: h.end_date || null,
          teamSize: h.no_of_people_in_team || 'N/A',
          prizePool: h.prize_pool || 0,
          hackathon_category: h.hackathon_category || 'No category',  // Make sure this is correctly mapped
          image: h.poster_url || '',
          location: h.location || '',
          hackathonType: h.hackathon_type || '',
          hackathonMode: h.hackathon_mode || '',
          registration_deadline: h.registration_deadline || null,
          problem_statement_text: h.problem_statement_text || "",
          hackathon_theme: h.hackathon_theme || "",
          timeLeft: calculateTimeLeft(h.start_date), // Utility to calculate time left
        }));
        console.log("Processed Hackathons Data:", upcomingHackathons);
        setHackathons(upcomingHackathons);
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingHackathons();
  }, []);

  

  return { hackathons, loading, error };
};

// Utility Function
const calculateTimeLeft = (startDate) => {
  if (!startDate) return null;
  const now = new Date();
  const start = new Date(startDate);
  const difference = start - now;

  if (difference <= 0) return 'Started';
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} days left` : 'Less than a day left';
};

// Component: Upcoming Hackathons
const UpcomingHackathons = () => {
  const { hackathons, loading, error, handleDetailsClick } = useFetchUpcomingHackathons();

  if (loading) {
    return <div className="p-6">Loading hackathons...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            status="upcoming"
             // Pass registration date here
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UpcomingHackathons;
