import React from 'react';
import { Calendar, Users, Award } from 'lucide-react';

const HackathonPoster = ({ hackathon }) => (
  <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden mb-6">
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
      <h1 className="text-4xl font-bold mb-2 text-center">{hackathon.title}</h1>
      <p className="text-xl mb-4">{hackathon.tagline}</p>
      <div className="flex space-x-4">
        <div className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">
            {hackathon.startDate} - {hackathon.endDate}
          </p>
        </div>
        <div className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{hackathon.participants.length} Participants</p> {/* Change this line here we should use the paticipation count*/}
        </div>
        <div className="text-center">
          <Award className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{hackathon.teams.length} Teams</p>
        </div>
      </div>
    </div>
  </div>
);

export default HackathonPoster;