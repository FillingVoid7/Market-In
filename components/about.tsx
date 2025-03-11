import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Lightbulb, Users, Leaf } from "lucide-react";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const CoreValue = ({ icon: Icon, title, description }) => (
    <motion.div 
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="rounded-full bg-orange-100 p-3 mb-4">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );

  return (
    <section className=" py-16 px-6 bg-gray-50 mt-8">
      <div className="container mx-auto max-w-full">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Our company is dedicated to empowering individuals and businesses by providing high-quality services that
            meet the evolving needs of the modern world. We are passionate about innovation and strive to make a positive
            impact by delivering solutions that inspire, support growth, and foster success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-lg"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To deliver value-driven, customer-focused solutions that enable sustainable growth and drive meaningful
              change in our communities.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-lg"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="flex items-center mb-4">
              <Lightbulb className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To be a globally recognized brand, known for its innovation, integrity, and commitment to exceptional service.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="text-center mb-12"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Core Values</h3>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-12"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CoreValue 
            icon={CheckCircle2}
            title="Integrity"
            description="We uphold the highest standards of integrity in all of our actions and build trust through responsible practices."
          />
          <CoreValue 
            icon={Lightbulb}
            title="Innovation"
            description="We pursue continuous improvement and innovation, leveraging the latest technology to deliver better solutions."
          />
          <CoreValue 
            icon={Users}
            title="Customer Commitment"
            description="We prioritize our customers, committing to delivering the highest level of service and exceeding expectations."
          />
          <CoreValue 
            icon={Leaf}
            title="Sustainability"
            description="We are committed to sustainable practices that contribute positively to our communities and the environment."
          />
        </div>
      </div>
    </section>
  );
};

export default About;