import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200 last:border-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="w-full py-5 px-4 flex justify-between items-center bg-white  transition-colors duration-200 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start">
          <span className="text-left font-medium text-gray-900">{question}</span>
        </div>
        <span className="ml-4 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const faqData = {
    general: [
      {
        question: "How do I create an account?",
        answer: "Creating an account is simple! Visit our signup page, fill in your details including your email address and preferred password, and click 'Submit'. You'll receive a confirmation email to verify your account. Once verified, you can start using our services immediately.",
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes! We offer a comprehensive 14-day free trial for new users. During this period, you'll have access to all premium features with no commitment required. You can cancel anytime during the trial period.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
      },
    ],
    billing: [
      {
        question: "How does billing work?",
        answer: "Billing occurs monthly or annually, depending on your chosen plan. We offer flexible payment options and you can upgrade or downgrade your plan at any time.",
      },
      {
        question: "Can I get a refund?",
        answer: "Yes, we offer a 30-day money-back guarantee for all our paid plans. If you're not satisfied with our service, contact our support team for a full refund.",
      },
    ],
    technical: [
      {
        question: "What technical requirements are needed?",
        answer: "Our platform works on all modern web browsers (Chrome, Firefox, Safari, Edge). No additional software installation is required. We recommend a stable internet connection for optimal performance.",
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. All data is encrypted using industry-standard protocols, and we regularly perform security audits to ensure your information remains protected.",
      },
    ],
  };

  const categories = {
    all: "All Questions",
    general: "General",
    billing: "Billing",
    technical: "Technical",
  };

  const filterFAQs = () => {
    let filteredFAQs = [];
    Object.entries(faqData).forEach(([category, questions]) => {
      if (activeCategory === 'all' || activeCategory === category) {
        filteredFAQs = [...filteredFAQs, ...questions];
      }
    });
    return filteredFAQs;
  };

  return (
    <section className="py-16 px-4 bg-gray-50 mt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Find answers to common questions about our services and platform.
          </p>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">
          {filterFAQs().map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
          {filterFAQs().length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No FAQs found for this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;