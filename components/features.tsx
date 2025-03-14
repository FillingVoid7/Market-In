import React from "react";
import { LayoutDashboard, ShoppingBag, BarChart2 } from 'lucide-react';

const Features = () => {
  return (
    <section className="relative  flex flex-col items-center bg-white px-10 -mt-32">
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center text-center w-1/3 p-6 space-y-4">
          <LayoutDashboard size={40} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-black">Custom Product Website</h1>
          <p className="text-gray-600 font-medium">One-page design tailored to your product.</p>
        </div>

        <div className="flex flex-col items-center text-center w-1/3 p-6 space-y-4">
          <ShoppingBag size={40} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-black">Catalog Marketplace</h1>
          <p className="text-gray-600 font-medium">Expand reach with a shared digital mall.</p>
        </div>

        <div className="flex flex-col items-center text-center w-1/3 p-6 space-y-4">
          <BarChart2 size={40} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-black">Insightful Analytics</h1>
          <p className="text-gray-600 font-medium">Track performance and customer engagement.</p>
        </div>
      </div>

      <div className="mx-auto text-center max-w-4xl mt-20 px-4 bg-grey-900">
        <p className="text-3xl md:text-3xl font-bold text-gray-800 leading-tight">
          Effortlessly Create Stunning Single-Page Websites
          <span className="block mt-4 text-xl md:text-2xl font-medium text-gray-600">
            Showcase your products with images, videos, and exclusive offers—all in one place. Streamline your marketing and boost engagement like never before.
          </span>
        </p>
      </div>

    </section>
  );
};

export default Features;
