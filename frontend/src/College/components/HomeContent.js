import React from 'react';
import { Code, History, Users } from 'lucide-react';

const HomeContent = () => {
  // Stats card data
  const statsCards = [
    { 
      title: 'Active Hackathons', 
      count: '3', 
      icon: Code, 
      color: 'bg-emerald-50 text-emerald-600' 
    },
    { 
      title: 'Pending Approvals', 
      count: '12', 
      icon: History, 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      title: 'Total Participants', 
      count: '486', 
      icon: Users, 
      color: 'bg-violet-50 text-violet-600' 
    }
  ];

  // Recent activities data
  const recentActivities = [
    'New hackathon proposal submitted',
    'Transaction approved by admin',
    'Schedule updated for upcoming event'
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back!</h2>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map(({ title, count, icon: Icon, color }) => (
          <div 
            key={title} 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">{title}</h3>
              <Icon size={28} className={color} strokeWidth={1.5} />
            </div>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
          </div>
        ))}
      </div>
      
      {/* Recent Activities Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-3 mb-6">
          <History size={24} className="text-gray-700" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-gray-800">Recent Activities</h3>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <p className="text-gray-600">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeContent;