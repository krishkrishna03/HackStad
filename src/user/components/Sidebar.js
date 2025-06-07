import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaLaptopCode, 
  FaTrophy,
  FaBookReader,
  FaCode,
  FaSignOutAlt
} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHackathonsOpen, setHackathonsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: FaHome, label: 'Overview', path: '/user-dashboard' },
    { icon: FaUser, label: 'My Profile', path: '/user-dashboard/profile' },
    {
      icon: FaLaptopCode,
      label: 'Hackathons',
      path: '/hackathons',
      subItems: [
        { label: 'Registered', path: '/registered' },
        { label: 'Upcoming', path: '/upcoming' },
        { label: 'Ongoing', path: '/ongoing' },
        { label: 'Past', path: '/past' }
      ]
    },
    { icon: FaCode, label: 'Compiler', path: '/user-dashboard/compiler' },
    { icon: FaBookReader, label: 'Learning Resources', path: '/user-dashboard/courses' },
    { icon: FaTrophy, label: 'Achievements', path: '/user-dashboard/achievements' },
  ];

  const handleToggleHackathons = () => {
    setHackathonsOpen(!isHackathonsOpen);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
        onClick={handleToggleSidebar}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out z-40
        ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h2 className={`text-2xl font-bold text-blue-600 ${!isSidebarOpen && 'lg:hidden'}`}>
              Hackathon
            </h2>
            <h2 className={`text-2xl font-bold text-blue-600 hidden ${!isSidebarOpen && 'lg:block'}`}>
              H
            </h2>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-grow overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isHackathonsItem = item.label === 'Hackathons';

              return (
                <div key={index}>
                  {isHackathonsItem ? (
                    <div
                      onClick={handleToggleHackathons}
                      className={`flex items-center px-6 py-3 text-gray-700 cursor-pointer
                        ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'hover:bg-gray-50'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`ml-3 font-medium ${!isSidebarOpen && 'lg:hidden'}`}>
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-6 py-3 text-gray-700
                        ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'hover:bg-gray-50'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`ml-3 font-medium ${!isSidebarOpen && 'lg:hidden'}`}>
                        {item.label}
                      </span>
                    </Link>
                  )}

                  {isHackathonsItem && isHackathonsOpen && item.subItems && isSidebarOpen && (
                    <div className="ml-1 mt-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={`/user-dashboard/hackathons${subItem.path}`}
                          className={`block py-2 px-6 text-sm
                            ${location.pathname === subItem.path
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-600 hover:text-blue-600'
                            }
                          `}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 text-gray-400" />
              <span className={`ml-3 font-medium ${!isSidebarOpen && 'lg:hidden'}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;