import React from "react";
import { LayoutDashboard, ShoppingBag, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative flex flex-col items-center bg-transparent px-10 py-20">
      <div className="flex justify-between w-full max-w-6xl gap-8">
        {[
          {
            icon: LayoutDashboard,
            title: "Custom Product Website",
            description: "One-page design tailored to your product.",
          },
          {
            icon: ShoppingBag,
            title: "Catalog Marketplace",
            description: "Expand reach with a shared digital mall.",
          },
          {
            icon: BarChart2,
            title: "Insightful Analytics",
            description: "Track performance and customer engagement.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center w-1/3 p-8 space-y-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <feature.icon size={40} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              {feature.title}
            </h1>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
