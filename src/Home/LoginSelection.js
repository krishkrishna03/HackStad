import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUniversity } from 'react-icons/fa';

function SignInPage() {
  const navigate = useNavigate();

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-6">
      <div className="flex space-x-6">
        <h2 className="sr-only">Sign In</h2> {/* Hidden heading for accessibility */}

        {/* Student Login Box */}
        <div
          className="flex flex-col items-center justify-center w-48 h-56 bg-gray-800 rounded-lg p-4 hover:bg-purple-700 transition duration-200 cursor-pointer"
          onClick={() => navigate('/login-student')}
        >
          <FaUserGraduate className="text-4xl mb-3" />
          <span className="text-xl font-semibold">Student</span>
          <p className="text-center text-sm mt-2 text-gray-300">
            Access your courses and track your projects.
          </p>
        </div>

        {/* Mentor Login Box */}
        <div
          className="flex flex-col items-center justify-center w-48 h-56 bg-gray-800 rounded-lg p-4 hover:bg-purple-700 transition duration-200 cursor-pointer"
          onClick={() => navigate('/login-mentor')}
        >
          <FaChalkboardTeacher className="text-4xl mb-3" />
          <span className="text-xl font-semibold">Mentor</span>
          <p className="text-center text-sm mt-2 text-gray-300">
            Guide students and monitor their progress.
          </p>
        </div>

        {/* Faculty Login Box */}
        <div
          className="flex flex-col items-center justify-center w-48 h-56 bg-gray-800 rounded-lg p-4 hover:bg-purple-700 transition duration-200 cursor-pointer"
          onClick={() => navigate('/login-faculty')}
        >
          <FaUserTie className="text-4xl mb-3" />
          <span className="text-xl font-semibold">Faculty</span>
          <p className="text-center text-sm mt-2 text-gray-300">
            Manage courses, students, and assessments.
          </p>
        </div>

        {/* College Login Box */}
        <div
          className="flex flex-col items-center justify-center w-48 h-56 bg-gray-800 rounded-lg p-4 hover:bg-purple-700 transition duration-200 cursor-pointer"
          onClick={() => navigate('/college-login')}
        >
          <FaUniversity className="text-4xl mb-3" />
          <span className="text-xl font-semibold">College</span>
          <p className="text-center text-sm mt-2 text-gray-300">
            Oversee college-wide activities and resources.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default SignInPage;
