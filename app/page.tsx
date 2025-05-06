"use client";
import Features from "../components/features";
import Footer from "../components/footer";
import Header from "../components/header";
import OnboardingFlow from "../components/onboardingFlow";
import Pricing from "../components/pricing";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="pt-32 pb-20 px-4 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[10px] opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl animate-pulse" />
            </div>
          </div>

          <motion.div
            className="max-w-7xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Create.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Share.
              </span>{" "}
              Grow.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your products into stunning digital showcases. Share
              anywhere, track performance, and grow your business.
            </p>
            <div className="flex gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/pricingDetails")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </div>
          </motion.div>
        </div>

        <Features />
        <OnboardingFlow />
        <Pricing />
      </div>
      <Footer />
    </>
  );
}
