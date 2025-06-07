import { useState } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

const Header = () => {
  const [notifications] = useState([
    { id: 1, text: 'New challenge unlocked!', time: '5m ago' },
    { id: 2, text: 'Your team qualified for Round 2', time: '1h ago' },
  ]);

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges, teams, or resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <FaBell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-blue-600"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">Team Lead</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;