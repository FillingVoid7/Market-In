"use client";
import React, { useState } from 'react';
import { Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast'; // You'll need to install react-hot-toast

const PricingDetails = () => {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

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
      yearlyPrice: "NPR 5000",
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
  ];

  const handlePlanSelection = (planName: string, isAuthenticated: boolean) => {
    if (!isAuthenticated) {
        toast.error('Please sign in to select a plan');
        return;
    }
    
    // Handle plan selection for authenticated users
    if (planName === "Free Plan" || planName === "Basic Plan") {
        // Add your plan selection logic here
        toast.success(`Selected ${planName}`);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-500 mr-2" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pricing Plans
            </h2>
          </div>
          <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
            Start your journey for free and upgrade as you grow
          </p>
          
          <div className="inline-flex items-center justify-center gap-4 p-2 bg-gray-100 rounded-full mb-12">
            <span className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
              !isYearly ? 'bg-white shadow-md text-blue-600 font-semibold' : 'text-gray-600'
            }`}>
              Monthly
            </span>
            <Toggle checked={isYearly} onChange={setIsYearly} />
            <span className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
              isYearly ? 'bg-white shadow-md text-blue-600 font-semibold' : 'text-gray-600'
            }`}>
              Yearly (Save 20%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 ${
                plan.highlight 
                  ? 'bg-white border-2 border-blue-500 shadow-2xl shadow-blue-100' 
                  : 'bg-white border border-gray-200 shadow-xl'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-4 py-2 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-base font-normal text-gray-600 ml-1">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm mb-8 border-b border-gray-100 pb-8">
                  {plan.targetAudience}
                </p>

                <ul className="space-y-4 mb-8">
                  {plan.keyFeatures.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.name, !!session)}
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
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