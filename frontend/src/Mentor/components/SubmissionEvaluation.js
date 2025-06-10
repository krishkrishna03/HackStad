import React, { useState, useEffect } from 'react';
import { FileText, Check, XCircle, Github, Linkedin, Globe } from 'lucide-react';
import axios from 'axios';

const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

const SubmissionEvaluation = ({ submission }) => {
  const [feedback, setFeedback] = useState('');
  const [marks, setMarks] = useState('');
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!submission) return;

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${getBaseURL()}/hackathon/submissions/${encodeURIComponent(submission)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        console.log('Fetched Submission:', response.data);
        
        if (response.data.length > 0) {
          setSubmissionData(response.data[0]); // Assuming single submission
        } else {
          setError("No submission data available.");
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        setError("Failed to load submission details.");
      }
    };

    fetchSubmissions();
  }, [submission]);

  const handleEvaluation = async (status) => {
    if (!submissionData) return;

    const evaluationPayload = {
      team_id: submissionData.team_id || null,
      user_id: submissionData.user_id || null,
      hackathon_id: submissionData.hackathon_id,
      mentor_id: "", // Assuming mentor ID is stored locally
      scores: { overall: parseInt(marks, 10) || 0 }, // Ensure number type
      feedback,
    };

    try {
      const response = await axios.post(
        `${getBaseURL()}/hackathon/evaluate-submission`,
        evaluationPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      console.log('Evaluation Response:', response.data);
      alert("Evaluation submitted successfully!");
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      {error && <p className="text-red-600">{error}</p>}

      {submissionData ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {submissionData.project_title || 'No Title'}
              </h4>
              <p className="text-gray-600">
                Submitted: {new Date(submissionData.submitted_at).toLocaleString() || 'N/A'}
              </p>
            </div>
            <div className="flex space-x-2">
              {submissionData.github_url && (
                <a href={submissionData.github_url} className="flex items-center text-gray-800 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              )}
              {submissionData.linkedin_url && (
                <a href={submissionData.linkedin_url} className="flex items-center text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </a>
              )}
              {submissionData.other_url && (
                <a href={submissionData.other_url} className="flex items-center text-green-600 hover:text-green-800" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks (out of 100)</label>
              <input type="number" min="0" max="100" value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border rounded-md" rows="3" />
            </div>

            <div className="flex space-x-4">
              <button onClick={() => handleEvaluation('approved')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button onClick={() => handleEvaluation('rejected')} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Loading submission details...</p>
      )}
    </div>
  );
};

export default SubmissionEvaluation;
