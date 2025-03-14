"use client";
import Features from "../components/features";
import Footer from "../components/footer";
import Header from "../components/header";
import OnboardingFlow from "../components/onboardingFlow";
import Pricing from "../components/pricing";

export default function HomePage(){
    return(
        <>
        <div className = 'bg-gray-100'>
        <Header />
        <Features />
        <OnboardingFlow/>
        <Pricing />
        </div>

        <Footer/>
        </>
    )
}