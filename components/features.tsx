import React from "react";
import { LayoutDashboard, ShoppingBag, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative flex flex-col items-center bg-white px-10 py-20">
      <div className="flex justify-between w-full max-w-6xl">
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
            className="flex flex-col items-center text-center w-1/3 p-6 space-y-4"
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            // transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <feature.icon size={40} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-black">{feature.title}</h1>
            <p className="text-gray-600 font-medium">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mx-auto text-center max-w-4xl mt-20 px-4"
        variants={featureVariants}
        initial="hidden"
        whileInView="visible"
      >
        <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          Effortlessly Create Stunning Single-Page Websites
          <span className="block mt-4 text-xl md:text-2xl font-medium text-gray-600">
            Showcase your products with images, videos, and exclusive offers—all
            in one place. Streamline your marketing and boost engagement like
            never before.
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default Features;