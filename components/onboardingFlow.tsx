import React from "react";
import { ArrowDownIcon, UserPlus, Layout, FileText, Share2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const OnboardingFlow = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create an account in just a few clicks to get started.",
    },
    {
      icon: Layout,
      title: "Choose Your Template",
      description: "Select from a variety of customizable templates that suit your brand and product.",
    },
    {
      icon: FileText,
      title: "Add Your Product Details",
      description: "Effortlessly upload images, videos, and pricing information to showcase your products.",
    },
    {
      icon: Share2,
      title: "Generate and Share Your Page",
      description: "Instantly generate a shareable link to your new single-page website and post it on your social media platforms.",
    },
    {
      icon: BarChart3,
      title: "Upgrade for Insights",
      description: "Consider upgrading to access advanced performance tracking and analytics to enhance your marketing strategy.",
    },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Getting Started</h2>
          <p className="text-gray-300">Follow these simple steps to get started</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute left-6 top-full h-8 flex items-center justify-center">
                  <ArrowDownIcon className="w-6 h-6 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlow;