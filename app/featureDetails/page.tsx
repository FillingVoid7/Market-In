"use client";
import React from "react";
import Link from "next/link";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
    <div className="group p-8 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-100 hover:bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transform hover:-translate-y-2">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600">
            {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

const Features = () => {
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
        <section className="relative bg-gradient-to-br from-blue-50 to-white py-24">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Transform Your Business
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Empower your business with a professional online presence. Showcase products, manage offers,
                    and grow your customer base—all from one simple platform.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Main Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {mainFeatures.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* All Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allFeatures.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-20">
                    <Link href="/pricingDetails" passHref>
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                            aria-label="Start Building Today"
                        >
                            Start Building Today
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Features;