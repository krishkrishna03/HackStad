import React from 'react';
import { FaUsers, FaCode, FaTrophy, FaClock } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Dashboard = () => {
  const stats = [
    { icon: FaUsers, label: 'No of Hackathons Participated', value: '4/5' },
    { icon: FaCode, label: 'Submissions', value: '3' },
    { icon: FaTrophy, label: 'Points', value: '2,450' },
    { icon: FaClock, label: 'Time Left', value: '48h' },
  ];

  const StatsCard = ({ icon: Icon, label, value }) => {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  StatsCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John! 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your hackathon journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
