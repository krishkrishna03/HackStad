// Navbar.js
import React from 'react';
import logoImage from './logo.png'; // Update with the path to your logo image

const Navbar = () => {
  return (
    <nav className="flex items-center h-6  justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <span className="text-2xl font-bold">HackStad</span>
        <img src={logoImage} alt="Logo" className="ml-2 h-6" /> 
      </div>
      <ul className="flex space-x-4">
        <li><a href="/" className="hover:text-gray-300">Home</a></li>
        <li><a href="#about" className="hover:text-gray-300">About</a></li>
        <li><a href="#services" className="hover:text-gray-300">Services</a></li>
        <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
