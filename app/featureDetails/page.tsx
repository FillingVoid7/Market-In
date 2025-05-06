"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
    <motion.div 
        className="group p-8 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm
        transition-all duration-300 hover:border-blue-200 hover:bg-gradient-to-br 
        from-blue-50 to-white shadow-lg hover:shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
    >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600">
            {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const Features = () => {
    const router = useRouter();
    const mainFeatures = [
        {
            title: "Custom Website",
            description: "Create beautiful one-page designs to showcase your products professionally."
        },
        {
            title: "Digital Catalog",
            description: "Expand your reach with an organized digital showcase of your products."
        },
        {
            title: "Smart Analytics",
            description: "Track performance and understand your customer engagement better."
        }
    ];

    const allFeatures = [
        {
            title: "Design Freedom",
            description: "Choose from templates and customize to match your brand perfectly."
        },
        {
            title: "Social Integration",
            description: "Share seamlessly across Facebook, Instagram, and TikTok."
        },
        {
            title: "Customer Connect",
            description: "Built-in WhatsApp integration for direct customer communication."
        },
        {
            title: "Rich Media",
            description: "Support for images, videos, and interactive content display."
        },
        {
            title: "Smart Offers",
            description: "Create and manage special offers and promotions easily."
        },
        {
            title: "Mobile Ready",
            description: "Perfect viewing experience across all devices and screens."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
            <motion.button
                onClick={() => router.push('/')}
                className="fixed top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/80 
                backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all 
                duration-300 text-gray-600 hover:text-gray-900 z-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
            </motion.button>

            <section className="py-24 px-4">
                <motion.div 
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Sparkles className="w-8 h-8 text-blue-500" />
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                        bg-clip-text text-transparent">
                            Transform Your Business
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Empower your business with a professional online presence. Showcase products, 
                        manage offers, and grow your customer base—all from one simple platform.
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto">
                    {/* Main Features Section */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {mainFeatures.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </motion.div>

                    {/* All Features Section */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {allFeatures.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </motion.div>

                    {/* Enhanced CTA Button */}
                    <motion.div 
                        className="text-center mt-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link href="/pricingDetails" passHref>
                            <button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                                px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl 
                                transition-all duration-300 hover:transform hover:scale-105"
                                aria-label="Start Building Today"
                            >
                                Start Building Today
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Features;