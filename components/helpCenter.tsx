import React from 'react';

const HelpCenter = () => {
  return (
    <section className="py-16 px-6 bg-gray-50 mt-8 text-black">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Help Center</h2>
        <p className="text-gray-700 mb-8 text-center">
          Welcome to our Help Center. If you need assistance, check out our resources below or contact us for further support.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Support</h3>
          <p className="text-gray-600 mb-2">Email: <a href="mailto:support@example.com" className="text-orange-600">support@example.com</a></p>
          <p className="text-gray-600">Phone: <span className="text-orange-600">+977-1-1234567</span></p>
        </div>

        <h3 className="text-3xl font-semibold text-gray-800 mb-4">Common Issues</h3>
        <ul className="space-y-4">
          <li className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <strong>Account Setup & Verification</strong>
          </li>
          <li className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <strong>Technical Issues & Troubleshooting</strong>
          </li>
          <li className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <strong>Billing & Payment Queries</strong>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HelpCenter;
