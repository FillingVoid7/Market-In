"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 py-16 px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Market-In
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Empowering you to manage your products efficiently and effectively with our top-notch tools.
            </p>
            
            <div className="flex space-x-6">
              {[
                { icon: FaFacebook, href: "https://facebook.com" },
                { icon: FaTwitter, href: "https://twitter.com" },
                { icon: FaInstagram, href: "https://instagram.com" },
                { icon: FaLinkedin, href: "https://linkedin.com" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {["Pricing", "About Us", "Contact Us"].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support & Resources</h3>
              <ul className="space-y-3">
                {["Help Center", "FAQs", "Blogs"].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact & Legal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Kathmandu, Nepal</p>
                <p className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  <a href="mailto:support@market-in.com">support@market-in.com</a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Market-In. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;