import React, { useState } from "react";
import { CheckCircle2Icon } from "lucide-react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true); 

  const freePlanFeatures = [
    "Basic customization options.",
    "3 product pages available.",
    "Unique URL sharing.",
    "Basic customer support."
  ];

  const basicPlanFeatures = [
    "Advanced customization options.",
    "15 product pages available.",
    "Basic analytics dashboard.",
    "Priority email support.",
    "Social media link sharing."
  ];

  const proPlanFeatures = [
    "Full customization options.",
    "Unlimited product pages.",
    "Comprehensive analytics.",
    "Offer management.",
    "Priority live support.",
    "Social media automation."
  ];

  const renderFeatures = (features) => {
    return features.map((feature, index) => (
      <li key={index} className="mb-2 flex items-center">
        <CheckCircle2Icon className="w-4 h-4 mr-2 text-green-500" />
        {feature}
      </li>
    ));
  };

  const handleYearlyClick = () => {
    setIsYearly(true);
  };

  const handleMonthlyClick = () => {
    setIsYearly(false);
  };

  const prices = isYearly
    ? {
        free: 0,
        basic: 1000,
        pro: 2000
      }
    : {
        free: 0,
        basic: 500,
        pro: 1000
      };

  return (
    <section id="pricing" className="py-10 text-center">
      <h2 className="text-3xl font-bold mb-6 text-black">Choose Your Plan</h2>
      
      <div className="mb-6 flex items-center justify-center">
        <button
          onClick={handleYearlyClick}
          className={`py-2 px-4 rounded-full ${isYearly ? 'bg-orange-600 text-white' : 'bg-gray-300 text-black'} focus:outline-none`}
        >
          Billed Yearly
        </button>
        <span className="mx-2 text-black">|</span>
        <button
          onClick={handleMonthlyClick}
          className={`py-2 px-4 rounded-full ${!isYearly ? 'bg-orange-600 text-white' : 'bg-gray-300 text-black'} focus:outline-none`}
        >
          Billed Monthly
        </button>
      </div>

      <div className="flex justify-center space-x-8 flex-wrap mt-8">
        <div className="bg-gray-300 border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 text-black">
          <h3 className="text-1xl font-semibold mb-2">Free</h3>
          <p className="text-2xl font-bold mb-4">NPR {prices.free}</p>
          <p className="mb-4 text-left text-sm">For new users or local shops with basic needs.</p>
          <ul className="text-left">
            {renderFeatures(freePlanFeatures)}
          </ul>
          <button className="mt-20 py-2 px-4 bg-blue-500 text-white rounded-full">
            Get Started Free
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 text-black">
          <h3 className="text-1xl font-semibold mb-2">Basic</h3>
          <p className="text-2xl font-bold mb-4">NPR {prices.basic}</p>
          <p className="mb-4 text-left text-sm">For small businesses seeking better marketing.</p>
          <ul className="text-left">
            {renderFeatures(basicPlanFeatures)}
          </ul>
          <button className="mt-12 py-2 px-4 bg-gray-500 text-white rounded-full">
            Change to Basic
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 text-black">
          <h3 className="text-1xl font-semibold mb-2">Pro</h3>
          <p className="text-2xl font-bold mb-4">NPR {prices.pro}</p>
          <p className="mb-4 text-left text-sm">For established businesses wanting advanced features.</p>
          <ul className="text-left">
            {renderFeatures(proPlanFeatures)}
          </ul>
          <button className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-full">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
