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

      <div className="text-center text-black max-w-4xl mt-16 px-4">
        <p className="text-2xl font-medium leading-relaxed">
          A go-to platform that empowers clients to effortlessly create single-page websites for their products, featuring images, videos, and offers—streamlining and enhancing their marketing efforts.
        </p>
      </div>
    </section>
  );
};

export default Features;
