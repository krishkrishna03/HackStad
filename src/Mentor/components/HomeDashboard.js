import React from 'react';

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
  </div>
);

const HomeDashboard = () => {
  const stats = {
    totalHackathons: 15,
    studentsCount: 450,
    activeHackathons: 3,
    completedHackathons: 8,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Hackathons" value={stats.totalHackathons} color="blue" />
      <StatCard title="Students Mentored" value={stats.studentsCount} color="green" />
      <StatCard title="Active Hackathons" value={stats.activeHackathons} color="purple" />
      <StatCard title="Completed" value={stats.completedHackathons} color="orange" />
    </div>
  );
};

export default HomeDashboard;