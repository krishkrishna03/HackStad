import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUniversity } from 'react-icons/fa';
import LoginCard from './LoginCard';
import Navbar from './navbar';

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-white">
              Sign In to HackStad
            </h1>
            <p className="text-violet-200 text-lg">
              Choose your role to access your personalized dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <LoginCard
              title="Student"
              description="Access your courses, track projects, and participate in hackathons"
              icon={FaUserGraduate}
              onClick={() => navigate('/login-student')}
              gradient="bg-violet-500/20 group-hover:bg-violet-500/30"
            />
            <LoginCard
              title="Mentor"
              description="Guide students, review projects, and share your expertise"
              icon={FaChalkboardTeacher}
              onClick={() => navigate('/login-mentor')}
              gradient="bg-purple-500/20 group-hover:bg-purple-500/30"
            />
            <LoginCard
              title="Faculty"
              description="Manage courses, assess students, and organize hackathons"
              icon={FaUserTie}
              onClick={() => navigate('/login-faculty')}
              gradient="bg-pink-500/20 group-hover:bg-pink-500/30"
            />
            <LoginCard
              title="College"
              description="Oversee institutional activities and manage resources"
              icon={FaUniversity}
              onClick={() => navigate('/college-login')}
              gradient="bg-indigo-500/20 group-hover:bg-indigo-500/30"
            />
          </div>

          <div className="text-center mt-16">
            <p className="text-violet-200">
              Don't have an account?{' '}
              <a href="/signup-selection" className="text-white underline hover:text-violet-200">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
