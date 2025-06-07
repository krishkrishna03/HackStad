import React, { useState } from 'react';
import logoImage from './logo.png'; // Keeping the original logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand - "Stad" is blue by default with hover effect */}
          <div className="flex items-center cursor-pointer group">
            <img src={logoImage} alt="Logo" className="w-10 h-10 mr-3" />
            <div className="text-3xl font-extrabold tracking-wide">
              <span className="text-white transition-colors duration-300 group-hover:text-gray-100">Hack</span>
              <span className="text-blue-400 transition-colors duration-300 group-hover:text-blue-300">Stad</span>
            </div>
          </div>
          
          {/* Desktop Menu with Enhanced Hover Effects */}
          <div className="items-center hidden space-x-8 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
          
          {/* Mobile Menu Button with Animation */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-300 transition-colors duration-200 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="w-8 h-8 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg className="w-8 h-8 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu with Smooth Animation */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 py-1 bg-gray-800 shadow-inner">
          <MobileLink href="/">Home</MobileLink>
          <MobileLink href="#about">About</MobileLink>
          <MobileLink href="#services">Services</MobileLink>
          <MobileLink href="#contact">Contact</MobileLink>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink component with animated underline effect
const NavLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="relative px-3 py-2 text-lg font-medium text-gray-300 transition-all duration-300 hover:text-white group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300 ease-out"></span>
    </a>
  );
};

// Mobile NavLink component with hover effect
const MobileLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="block px-4 py-3 text-lg font-medium text-gray-300 transition-all duration-300 border-b border-gray-700 hover:bg-gray-700 hover:text-white hover:pl-6"
    >
      {children}
    </a>
  );
};

export default Navbar;