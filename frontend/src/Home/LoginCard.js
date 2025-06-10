import React from 'react';

export default function LoginCard({ title, description, icon: Icon, onClick, gradient }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/10 ${gradient} backdrop-blur-sm p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="mb-3 text-center text-xl font-semibold text-white">
          {title}
        </h3>
        
        <p className="text-center text-sm text-violet-200 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}