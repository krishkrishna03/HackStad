import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import HackathonPoster from './HackathonPoster';
import ParticipantCard from './ParticipantCard';
import TeamCard from './TeamCard';
import SubmissionEvaluation from './SubmissionEvaluation';
import MentorChat from '../../user/components/MentorChat';

const HackathonDetails = ({ hackathon, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');
 
  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-md transition-all ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button 
        onClick={onBack}
        className="m-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ChevronRight size={20} className="mr-1 transform rotate-180" />
        Back to all hackathons
      </button>

      <HackathonPoster hackathon={hackathon} />

      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <TabButton tab="details" label="Details" />
          <TabButton tab="participants" label="Participants" />
          <TabButton tab="teams" label="Teams" />
          <TabButton tab="submissions" label="Submissions" />
        </div>

        <div className="mt-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Start Date</h3>
                  <p className="text-xl font-bold text-blue-600">{hackathon.startDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700">End Date</h3>
                  <p className="text-xl font-bold text-green-600">{hackathon.endDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Prize Pool</h3>
                  <p className="text-xl font-bold text-purple-600">{hackathon.prizePool}</p>
                </div>
              </div>
              <div className="prose max-w-none">
                <h3>About the Hackathon</h3>
                <p>{hackathon.description}</p>
                <h3>Rules and Guidelines</h3>
                <ul>
                  {hackathon.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathon.participants.map((participant, index) => (
                <ParticipantCard key={index} participant={participant} />
              ))}
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hackathon.participants.map((participant, index) => (
                <TeamCard key={index} teams={participant} />
              ))}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="space-y-6">
              {hackathon.participants.map((participants, index) => (
                <SubmissionEvaluation
                  key={index}
                  submission={participants}
                  // onEvaluate={(evaluation) => {
                  //   console.log('Submission evaluated:', evaluation);
                  //   // Handle evaluation logic here
                  // }}
                />
              ))}
            </div>
          )}
        </div>
        
      </div>
      <MentorChat hackathonId={hackathon?.id} />
    </div>
  );
};

export default HackathonDetails;