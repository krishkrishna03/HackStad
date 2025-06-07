import React from 'react';
import { Users, Award, Clock, CheckCircle } from 'lucide-react';

const HackathonCard = ({ hackathon, type, onClick }) => (
  <div 
    onClick={() => onClick(hackathon)}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
  >
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 -mx-6 -mt-6 p-6 mb-6 rounded-t-xl">
      <h3 className="text-xl font-semibold text-white">{hackathon.title}</h3>
      <p className="text-white/80 mt-2">{hackathon.tagline}</p>
    </div>

    <div className="space-y-4">
      <div className="flex items-center text-gray-600">
        <Users size={18} className="mr-2" />
        <span>{hackathon.participants.length} Participants</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Award size={18} className="mr-2" />
        <span>{hackathon.teams.length} Teams</span>
      </div>
      {type === 'live' && (
        <div className="flex items-center text-green-600">
          <Clock size={18} className="mr-2" />
          <span>{hackathon.daysLeft} days left</span>
        </div>
      )}
      {type === 'upcoming' && (
        <div className="flex items-center text-blue-600">
          <Clock size={18} className="mr-2" />
          <span>Starts in {hackathon.startingIn} days</span>
        </div>
      )}
      {type === 'past' && (
        <div className="flex items-center text-gray-600">
          <CheckCircle size={18} className="mr-2" />
          <span>Completed on {hackathon.endDate}</span>
        </div>
      )}
    </div>
  </div>
);

export default HackathonCard;