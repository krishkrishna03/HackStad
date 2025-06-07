import React, { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Book, MessageSquare, LogOut, User, X } from 'lucide-react';

// ProfileDialog Component
const ProfileDialog = ({ isOpen, onClose, mentorDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="mt-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">{mentorDetails.name}</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Email</h3>
              <p className="text-gray-700">{mentorDetails.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">Department</h3>
              <p className="text-gray-700">{mentorDetails.department}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
              <p className="text-gray-700">{mentorDetails.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">Role</h3>
              <p className="text-gray-700">{mentorDetails.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mentorDetails, setMentorDetails] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('${BASE_URL}/mentor/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Assuming JWT token
          },
        });

        if (!response.ok) throw new Error('Failed to fetch mentor profile');

        const data = await response.json();
        setMentorDetails(data);
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      }
    };

    fetchProfile();
  }, []);
  // Sample mentor details - replace with actual data
  // const mentorDetails = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   expertise: "Full Stack Development, Machine Learning",
  //   experience: 8,
  //   about: "Passionate about teaching and helping students learn new technologies. Specialized in web development and AI applications."
  // };

  const menuItems = [
    { id: 'mentor-home', icon: Home, label: 'Home' },
    { id: 'hackathons', icon: Award, label: 'Hackathons' },
    { id: 'quiz', icon: Book, label: 'Create Quiz' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' }
  ];

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={`/mentor-dashboard/${to}`}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'hover:bg-gray-50 text-gray-700'
        }`
      }
    >
      <Icon size={20} />
      {isOpen && <span className="ml-3">{label}</span>}
    </NavLink>
  );

  return (
    <>
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 h-[calc(100vh-64px)] fixed flex flex-col`}
      >
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map(({ id, icon, label }) => (
              <li key={id}>
                <NavItem to={id} icon={icon} label={label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => setIsProfileOpen(true)}
            className={`w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-700 ${
              !isOpen && 'justify-center'
            }`}
          >
            <User size={20} />
            {isOpen && <span className="ml-3">Profile</span>}
          </button>

          <button
            onClick={onLogout}
            className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              isOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        mentorDetails={mentorDetails}
      />
    </>
  );
};

export default Sidebar;