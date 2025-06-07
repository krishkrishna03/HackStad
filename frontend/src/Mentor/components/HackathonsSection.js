import React from 'react';
import HackathonCard from './HackathonCard';

const HackathonsSection = ({ type, hackathons, onHackathonClick }) => (
  <section>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      {type.charAt(0).toUpperCase() + type.slice(1)} Hackathons
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map(h => (
        <HackathonCard key={h.id} hackathon={h} type={type} onClick={onHackathonClick} />
      ))}
    </div>
  </section>
);

export default HackathonsSection;
