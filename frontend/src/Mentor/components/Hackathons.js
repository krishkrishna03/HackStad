import React, { useState,useEffect } from 'react';
import HackathonDetails from './HackathonDetails';
import HackathonsSection from './HackathonsSection';
import axios from 'axios';
const Hackathons = () => {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const token = localStorage.getItem('authToken');
  const [mentorHackathons, setMentorHackathons] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [pastHackathons, setPastHackathons] = useState([]);
  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };
    useEffect(() => {
      const fetchmentorhackathons = async () => {
        try {
          const response = await axios.get(`${getBaseURL()}/mentor/hackathons-live`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);

          const transformedHackathons = response.data.map(h => ({
            id: h.id,
            title: h.title,
            tagline: h.problem_statement_text || "Join this exciting challenge!",
            participants: [
              h.id
            ], // API response doesn't provide participants, leave empty or fetch separately
            teams: [], // API response doesn't provide teams, leave empty or fetch separately
            submissions: [], // API response doesn't provide submissions, leave empty or fetch separately
            startDate: h.start_date,
            endDate: h.end_date,
            daysLeft: Math.ceil((new Date(h.end_date) - new Date()) / (1000 * 60 * 60 * 24)), // Calculate days left
            prizePool: h.prize_pool || "No prize pool specified",
            description: h.description || "No description available",
            rules: [
              `Hackathon Category: ${h.hackathon_category}`,
              `Mode: ${h.hackathon_mode}`,
              `Max Team Members: ${h.no_of_people_in_team}`,
            ],
            posterUrl: h.poster_url, // Include poster if needed
          }));
    
          setMentorHackathons(transformedHackathons);
        } catch (error) {
          console.error('Error Fetching Hackathons:', error);
        }
      };
      fetchmentorhackathons();
    }, []);


    useEffect(() => {
      const fetchmentorupcominghackathons = async () => {
        try {
          const response = await axios.get(`${getBaseURL()}/mentor/hackathons-upcoming`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);

          const transformedHackathons = response.data.map(h => ({
            id: h.id,
            title: h.title,
            tagline: h.problem_statement_text || "Join this exciting challenge!",
            participants: [
              h.id
            ], // API response doesn't provide participants, leave empty or fetch separately
            teams: [], // API response doesn't provide teams, leave empty or fetch separately
            submissions: [], // API response doesn't provide submissions, leave empty or fetch separately
            startDate: h.start_date,
            endDate: h.end_date,
            daysLeft: Math.ceil((new Date(h.end_date) - new Date()) / (1000 * 60 * 60 * 24)), // Calculate days left
            prizePool: h.prize_pool || "No prize pool specified",
            description: h.description || "No description available",
            rules: [
              `Hackathon Category: ${h.hackathon_category}`,
              `Mode: ${h.hackathon_mode}`,
              `Max Team Members: ${h.no_of_people_in_team}`,
            ],
            posterUrl: h.poster_url, // Include poster if needed
          }));
    
          setUpcomingHackathons(transformedHackathons);
        } catch (error) {
          console.error('Error Fetching Hackathons:', error);
        }
      };
      fetchmentorupcominghackathons();
    }, []);
    useEffect(() => {
      const fetchmentorpasthackathons = async () => {
        try {
          const response = await axios.get(`${getBaseURL()}/mentor/hackathons-past`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);

          const transformedHackathons = response.data.map(h => ({
            id: h.id,
            title: h.title,
            tagline: h.problem_statement_text || "Join this exciting challenge!",
            participants: [
              h.id
            ], // API response doesn't provide participants, leave empty or fetch separately
            teams: [], // API response doesn't provide teams, leave empty or fetch separately
            submissions: [], // API response doesn't provide submissions, leave empty or fetch separately
            startDate: h.start_date,
            endDate: h.end_date,
            daysLeft: Math.ceil((new Date(h.end_date) - new Date()) / (1000 * 60 * 60 * 24)), // Calculate days left
            prizePool: h.prize_pool || "No prize pool specified",
            description: h.description || "No description available",
            rules: [
              `Hackathon Category: ${h.hackathon_category}`,
              `Mode: ${h.hackathon_mode}`,
              `Max Team Members: ${h.no_of_people_in_team}`,
            ],
            posterUrl: h.poster_url, // Include poster if needed
          }));
    
          setPastHackathons(transformedHackathons);
        } catch (error) {
          console.error('Error Fetching Hackathons:', error);
        }
      };
      fetchmentorpasthackathons();
    }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {selectedHackathon ? (
        <HackathonDetails 
          hackathon={selectedHackathon} 
          onBack={() => setSelectedHackathon(null)} 
        />
      ) : (
        <>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Hackathon Dashboard</h1>
            <p className="text-xl text-gray-600">Discover, participate, and innovate in exciting hackathons</p>
          </div>
          <HackathonsSection 
            type="live" 
            hackathons={mentorHackathons} 
            onHackathonClick={setSelectedHackathon} 
          />
          <HackathonsSection 
            type="upcoming" 
            hackathons={upcomingHackathons} 
            onHackathonClick={setSelectedHackathon} 
          />
          <HackathonsSection 
            type="past" 
            hackathons={pastHackathons} 
            onHackathonClick={setSelectedHackathon} 
          />
        </>
      )}
    </div>
  );
};

export default Hackathons;
