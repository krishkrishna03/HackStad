import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignedHackathons = () => {
  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      name: 'Hackathon 1',
      image: 'https://via.placeholder.com/150',
      description: 'This is a description for Hackathon 1.',
      isTeamHackathon: false,
      isOnline: true,
      room: 'Online',
      studentCount: 120,
      mentorName: 'Emily Davis',
      teamCount: 0,
    },
  ]);

  const [pastHackathons] = useState([
    {
      id: 2,
      name: 'Past Hackathon 1',
      image: 'https://via.placeholder.com/150',
      description: 'This was a past hackathon.',
      studentCount: 180,
      mentorName: 'Michael Scott',
      teamCount: 40,
    },
  ]);

  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [view, setView] = useState('analysis');

  return (
    <div className="p-6">
      {!selectedHackathon ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Hackathons</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105">
                <img src={hackathon.image} alt={hackathon.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-700">{hackathon.name}</h2>
                  <button onClick={() => setSelectedHackathon(hackathon)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <button onClick={() => setSelectedHackathon(null)} className="text-3xl text-gray-600 hover:text-gray-800 transition mr-3">
              ←
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{selectedHackathon.name}</h1>
          </div>

          <div className="flex gap-4 mb-4">
            <button onClick={() => setView('analysis')} className={`px-4 py-2 rounded-lg ${view === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>Analysis</button>
            <button onClick={() => setView('allocation')} className={`px-4 py-2 rounded-lg ${view === 'allocation' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>Allocation</button>
            <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-lg ${view === 'leaderboard' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>Leaderboard</button>
          </div>

          {view === 'analysis' ? (
            <div className="w-full h-[70vh] flex justify-center items-center transition-all duration-500">
              <Bar
                data={{
                  labels: ['Submissions', 'Teams Formed', 'Registrations'],
                  datasets: [
                    {
                      label: 'Counts',
                      data: [50, 20, selectedHackathon.studentCount],
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1200,
                    easing: 'easeOutExpo',
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 10,
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => `Value: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : view === 'allocation' ? (
            <div>
              {selectedHackathon.isOnline ? (
                <p className="text-lg font-semibold text-gray-700">No allocations since this hackathon is online.</p>
              ) : (
                <>
                  <p><strong>Room:</strong> {selectedHackathon.room}</p>
                  <p><strong>Students:</strong> {selectedHackathon.studentCount}</p>
                  <p><strong>Mentor:</strong> {selectedHackathon.mentorName}</p>
                  <p><strong>Teams:</strong> {selectedHackathon.teamCount}</p>
                </>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
              <ul className="bg-white shadow-md rounded-lg p-4">
                <li className="border-b py-2"><strong>1st:</strong> Team Alpha - 95 Points</li>
                <li className="border-b py-2"><strong>2nd:</strong> Team Beta - 90 Points</li>
                <li className="border-b py-2"><strong>3rd:</strong> Team Gamma - 85 Points</li>
                <li className="py-2"><strong>4th:</strong> Team Delta - 80 Points</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedHackathons;
