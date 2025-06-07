import React from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ isSidebarOpen, onSidebarToggle }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center p-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Mentor Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;