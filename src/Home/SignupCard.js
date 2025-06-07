import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupCard({ title, description, icon: Icon, path, gradient }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} rounded-full blur-3xl transition-all duration-300`}></div>
      <div className="relative">
        <div className="mb-4 inline-block p-4 bg-white/10 rounded-2xl">
          <Icon size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-violet-200 mb-6">
          {description}
        </p>
        <div className="inline-flex items-center text-white hover:text-violet-200 transition-colors">
          <span className="mr-2">Get Started</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}