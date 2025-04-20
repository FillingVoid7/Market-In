// Updated Pricing Component
"use client";
import React, { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { motion } from "framer-motion";

const Pricing = () => {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(true);

  const freePlanFeatures = [
    "Basic customization options.",
    "3 product pages available.",
    "Unique URL sharing.",
    "Basic customer support.",
  ];

  const basicPlanFeatures = [
    "Advanced customization options.",
    "15 product pages available.",
    "Basic analytics dashboard.",
    "Priority email support.",
    "Social media link sharing.",
  ];

  const proPlanFeatures = [
    "Full customization options.",
    "Unlimited product pages.",
    "Comprehensive analytics.",
    "Offer management.",
    "Priority live support.",
    "Social media automation.",
  ];

  const renderFeatures = (features: string[]): JSX.Element[] => {
    return features.map((feature: string, index: number) => (
      <li key={index} className="mb-2 flex items-center">
        <CheckCircle2Icon className="w-4 h-4 mr-2 text-green-500" />
        {feature}
      </li>
    ));
  };

  const prices = isYearly
    ? { free: 0, basic: 1000, pro: 2000 }
    : { free: 0, basic: 500, pro: 1000 };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-6 text-black">Choose Your Plan</h2>

      <div className="mb-6 flex items-center justify-center">
        <button
          onClick={() => setIsYearly(true)}
          className={`py-2 px-4 rounded-full ${
            isYearly ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
          } focus:outline-none transition-all duration-300`}
        >
          Billed Yearly
        </button>
        <span className="mx-2 text-black">|</span>
        <button
          onClick={() => setIsYearly(false)}
          className={`py-2 px-4 rounded-full ${
            !isYearly ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
          } focus:outline-none transition-all duration-300`}
        >
          Billed Monthly
        </button>
      </div>

      <div className="flex justify-center space-x-8 flex-wrap mt-8">
        {[
          { title: "Free", price: prices.free, features: freePlanFeatures },
          { title: "Basic", price: prices.basic, features: basicPlanFeatures },
          { title: "Pro", price: prices.pro, features: proPlanFeatures },
        ].map((plan, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 text-black"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
            <p className="text-2xl font-bold mb-4">NPR {plan.price}</p>
            <p className="mb-4 text-left text-sm">
              {index === 0
                ? "For new users or local shops with basic needs."
                : index === 1
                ? "For small businesses seeking better marketing."
                : "For established businesses wanting advanced features."}
            </p>
            <ul className="text-left">{renderFeatures(plan.features)}</ul>
            <button
            onClick={() => {
              if (index === 0) {
                router.push('/templates/free');
              }
              if (index ===1){
                router.push('/templates/basic')
              }
              if (index ===2){
                router.push('/templates/pro')
              }
            }}
              className={`mt-4 py-2 px-4 ${
                index === 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white rounded-full transition-all duration-300`}
            >
              {index === 0 ? "Get Started Free" : index === 1 ? "Change to Basic" : "Upgrade to Pro"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;