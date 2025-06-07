import React from 'react';
import { GraduationCap, School } from 'lucide-react';
import SignupCard from './SignupCard';
import Navbar from './navbar';
export default function Home() {
  return (
    <><Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-white">
            Choose Your Path
          </h1>
          <p className="text-violet-200 text-lg">
          Join hackATHon platform to innovate, collaborate, compete, and build projects!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SignupCard
            title="Student"
            description="Access courses, connect with colleges, and build your academic future"
            icon={GraduationCap}
            path="/student-signup"
            gradient="bg-violet-500/20 group-hover:bg-violet-500/30"
          />
          <SignupCard
            title="College"
            description="Showcase your institution, manage admissions, and connect with students"
            icon={School}
            path="/college-signup"
            gradient="bg-purple-500/20 group-hover:bg-purple-500/30"
          />
        </div>

        <div className="text-center mt-16">
          <p className="text-violet-200">
            Already have an account?{' '}
            <a href="/login" className="text-white underline hover:text-violet-200">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}