"use client";
import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center no-underline group">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300">
              Market-In
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "/featureDetails", label: "Features" },
            { href: "/resources", label: "Resources" },
            { href: "/pricingDetails", label: "Pricing" },
            { href: "/services", label: "Services" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative py-1 text-black text-lg no-underline group transition-colors duration-200 hover:text-blue-500"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-white hover:text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg px-6 py-2 rounded-full no-underline transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;