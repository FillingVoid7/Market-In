import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center no-underline group"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300">
              ReachTotal
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { to: "/", label: "Home" },
            { to: "/feature-details", label: "Features" },
            { to: "/resources", label: "Resources" },
            { to: "/pricing-details", label: "Pricing" },
            { to: "/services", label: "Services" }
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="relative py-1 text-black text-lg no-underline group transition-colors duration-200"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-900 hover:text-blue-500 text-lg no-underline transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-white hover:text-white bg-blue-500 hover:bg-blue-700 text-lg px-4 py-2 rounded-full no-underline transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;