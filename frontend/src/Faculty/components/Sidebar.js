import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Users, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Faculty Home', path: '/faculty-dashboard/faculty-home' },
    { icon: ClipboardList, label: 'Assigned Hackathons', path: '/faculty-dashboard/assigned-hackathons' },
  ];

  const handleLogout = () => {
    // Perform any logout logic if necessary
    navigate('/login');
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Add space for the header */}
        <div className="py-6 px-4">
          {isOpen && <h2 className="text-xl font-bold">Faculty Dashboard</h2>}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-4 py-4">
          <nav className="space-y-4">
            {/* Menu Items */}
            {menuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-lg transition ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                {isOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        </div>
      </div>
  );
};

export default Sidebar;
