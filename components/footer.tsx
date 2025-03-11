import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

 
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-6 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
          <h2 className="text-2xl font-semibold text-white">ReachTotal</h2>
          <p className="mt-4 text-sm text-gray-400">Empowering you to manage your products efficiently and effectively with our top-notch tools.</p>
          
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <Link to="/pricing-details" className="hover:underline">Pricing</Link><br/>
            <Link to="/about-us" className="hover:underline">About Us</Link><br/>
            <Link to="/contact-us" className="hover:underline">Contact Us</Link><br/> 
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6">Support & Resources</h3>
          <ul className="mt-4 space-y-2 text-sm">
          <Link to="/help-center" className="hover:underline">Help Center</Link><br/> 
          <Link to="/faq" className="hover:underline">FAQs</Link><br/> 
          <Link to="/blogs" className="hover:underline">Blogs</Link><br/> 

          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white">Contact Information</h3>
          <p className="mt-4 text-sm">Kathmandu,Nepal</p>
          <p className="mt-2 text-sm">Email: support@yourcompany.com</p>
          <p className="text-sm">Phone: +977 9848299217</p>

          <h3 className="text-xl font-semibold text-white mt-6">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm">
          <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link><br/> 
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link><br/> 
          <Link to="/cookies-policy" className="hover:underline">Cookie Policy</Link><br/> 

          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        © 2024 ReachTotal. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;