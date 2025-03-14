"use client";
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PricingDetails = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free Plan",
      monthlyPrice: "NPR 0",
      yearlyPrice: "NPR 0",
      targetAudience: "New users wanting to test the service or local shops with minimal needs.",
      keyFeatures: [
        "Basic customization options (limited colors and templates)",
        "Upload up to 3 product pages",
        "Access to a unique URL for sharing",
        "Basic customer support: FAQ"
      ],
      highlight: false
    },
    {
      name: "Basic Plan",
      monthlyPrice: "NPR 500",
      yearlyPrice: "NPR 1000",
      targetAudience: "Small businesses looking for more features to enhance their marketing.",
      keyFeatures: [
        "Advanced customization options (more colors and templates)",
        "Upload up to 15 product pages",
        "Basic analytics dashboard (views and clicks)",
        "Priority customer support (email support)",
        "Link sharing across multiple social media platforms with templates"
      ],
      highlight: true
    },
    {
      name: "Pro Plan",
      monthlyPrice: "NPR 1000",
      yearlyPrice: "NPR 2000",
      targetAudience: "Established businesses aiming for enhanced marketing capabilities.",
      keyFeatures: [
        "Full customization options",
        "Unlimited upload of product pages",
        "Comprehensive analytics dashboard",
        "Offer management (discounts, limited-time offers)",
        "Priority customer support (live chat and phone)",
        "Advanced social media integration"
      ],
      highlight: false
    }
  ];

  interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }

  const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
    <button
      className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Pricing Plans
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Build for free, upgrade when your network grows
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <Toggle checked={isYearly} onChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              Yearly (Save 20%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                plan.highlight ? 'border-2 border-blue-500 bg-white' : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-base font-normal text-gray-600">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm mb-8">
                  {plan.targetAudience}
                </p>

                <ul className="space-y-4 mb-8">
                  {plan.keyFeatures.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === "Free Plan" ? "Get Started" : "Upgrade Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;