"use client";
import React, { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const Pricing = () => {
  const router = useRouter();
  const { data: session } = useSession();
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

  const prices = isYearly
    ? { free: 0, basic: 1000, pro: 2000 }
    : { free: 0, basic: 500, pro: 1000 };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handlePlanClick = (planTitle: string) => {
    if (!session) {
        toast.error('Please sign in to select a plan');
        router.push('/login');
        return;
    }

    if (planTitle.toLowerCase() === 'free' || planTitle.toLowerCase() === 'basic') {
        router.push(`/templates/${planTitle.toLowerCase()}`);
    }
  };

  return (
    <section className="py-20 bg-transparent text-center relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
      
      <div className="relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-6 text-white"
        >
          Choose Your Plan
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-center bg-white/5 backdrop-blur-sm p-2 rounded-full w-fit mx-auto"
        >
          <button
            onClick={() => setIsYearly(true)}
            className={`py-2 px-6 rounded-full transition-all duration-300 ${
              isYearly 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                : "text-gray-300"
            }`}
          >
            Billed Yearly
          </button>
          <span className="mx-2 text-gray-400">|</span>
          <button
            onClick={() => setIsYearly(false)}
            className={`py-2 px-6 rounded-full transition-all duration-300 ${
              !isYearly 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                : "text-gray-300"
            }`}
          >
            Billed Monthly
          </button>
        </motion.div>

        <div className="flex justify-center space-x-8 flex-wrap mt-8">
          {[
            { title: "Free", price: prices.free, features: freePlanFeatures },
            { title: "Basic", price: prices.basic, features: basicPlanFeatures },
          ].map((plan, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 w-80 text-white"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-3xl font-bold mb-4">
                {plan.price === 0 ? "Free" : `NPR ${plan.price}`}
              </p>
              <p className="mb-6 text-gray-300 text-sm">
                {index === 0
                  ? "For new users or local shops with basic needs."
                  : "For small businesses seeking better marketing."}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle2Icon className="w-5 h-5 mr-3 text-blue-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.title)}
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  index === 0
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    : "bg-white/10 hover:bg-white/20 border border-white/20"
                }`}
              >
                {index === 0 ? "Get Started Free" : "Upgrade to Basic"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;