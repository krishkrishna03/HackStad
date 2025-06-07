import React from 'react';

const FacultyHome = () => {
  const numberOfHackathons = 5; // Replace with dynamic data if needed
  const numberOfStudentsGuided = 120; // Replace with dynamic data if needed

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Faculty Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Number of Hackathons */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-gray-700">Hackathons</h2>
          <p className="text-3xl font-bold text-blue-600">{numberOfHackathons}</p>
          <p className="text-sm text-gray-500">Total Hackathons Assigned</p>
        </div>

        {/* Number of Students Guided */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-gray-700">Students Guided</h2>
          <p className="text-3xl font-bold text-green-600">{numberOfStudentsGuided}</p>
          <p className="text-sm text-gray-500">Total Students You Have Guided</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyHome;
