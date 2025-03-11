import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col  items-center justify-center -mt-16 bg-white pl-40 pr-40 ">
      <div className="relative z-20 text-center text-black max-w-8xl  px-4">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
          Showcase your products with ease—one stunning page, endless reach.
        </h1>
        <Link
          to="/register"
          className="inline-block text-white hover:text-white bg-blue-500 hover:bg-blue-700 text-lg px-8 py-3 rounded-full no-underline transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;