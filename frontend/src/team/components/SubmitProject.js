import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SubmitProject() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hackathon_Id = queryParams.get('hackathon_id');
  const [hackathonDetails, setHackathonDetails] = useState(null);
  const [teamDetails, setTeamDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [projectData, setProjectData] = useState({
    team_name: '',
    project_title: '',
    problem_statement: '',
    project_description: '',
    linkedin_url: '',
    github_url: '',
    other_url: '',
    team_lead: '',
    mentor_ids: [],
    submitted_at: '',
    hackathon_end_time: ''
  });
  const token = localStorage.getItem('token');

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/hackathon_details?id=${encodeURIComponent(hackathon_Id)}`);
        const data = await response.json();
        console.log('Full response data:146', data);
        setHackathonDetails(data);
      } catch (error) {
        console.error("Error fetching hackathon details:", error);
      }
    };
    fetchHackathonDetails();
  }, [hackathon_Id]);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`${getBaseURL()}/get_hackathon_team?hackathon_id=${hackathon_Id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('161',response.data);
        setTeamDetails(response.data || []);

        setProjectData(prev => ({ ...prev, team_name: response.data.team_name || '' }));
      } catch (error) {
        setErrorMessage("Failed to load team data details. Please try again later.");
        setTeamDetails([]);
      }
    };
    fetchTeamDetails();
  }, [hackathon_Id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      hackathon_id: hackathon_Id,
      team_id: teamDetails.team_id,
      project_title: projectData.project_title,
      problem_statement: projectData.problem_statement,
      project_description: projectData.project_description,
      linkedin_url: projectData.linkedin_url,
      github_url: projectData.github_url,
      other_url: projectData.other_url,
      team_lead: teamDetails.team_lead?.user_id, // Add this line
      mentor_ids:  [] ,
      submitted_at: new Date().toISOString(),
      hackathon_end_time:hackathonDetails.end_date// Add this line,

    };

    try {
      const response = await axios.post(`${getBaseURL()}/submission`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Submission successful:', response.data);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <div className="max-w-4xl p-8 mx-auto border border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Submit Your Project
        </h2>
        <p className="text-gray-600">Share your innovative solution with us</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Form Fields with Enhanced Styling */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Team Name */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Team Name</label>
            <input
              type="text"
              name="team_name"
              value={projectData.team_name}
              onChange={handleChange}
              className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Enter your team name"
              disabled
            />
          </div>

          {/* Problem Statement Section */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Problem Statement</label>
            {hackathonDetails?.hackathon_category === "single_problem_statement" ? (
              <div className="p-4 text-gray-700 border border-blue-200 bg-blue-50 rounded-xl">
                {hackathonDetails.problem_statement_text}
              </div>
            ) : hackathonDetails?.hackathon_category === "multiple_problem_statements" ? (
              <input
                type="text"
                name="problem_statement"
                value={projectData.problem_statement}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                placeholder="Enter PS ID (e.g., PS 01)"
              />
            ) : (
              <textarea
                name="problem_statement"
                value={projectData.problem_statement}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                rows="4"
                placeholder="Enter your problem statement"
              />
            )}
          </div>

          {/* Project Title */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Project Title</label>
            <input
              type="text"
              name="project_title"
              value={projectData.project_title}
              onChange={handleChange}
              className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
              placeholder="Enter your project title"
            />
          </div>

          {/* URLs Section */}
          <div className="grid grid-cols-1 col-span-2 gap-4 md:grid-cols-3">
            {/* GitHub URL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={projectData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                placeholder="GitHub repository link"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={projectData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                placeholder="LinkedIn profile link"
              />
            </div>

            {/* Other URL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Other URL</label>
              <input
                type="url"
                name="other_url"
                value={projectData.other_url}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
                placeholder="Additional link"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold 
                rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg 
                active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit Project
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 mt-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
