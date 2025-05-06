"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleAuthAction = () => {
        if (session) {
            signOut({ callbackUrl: '/' });
        } else {
            router.push('/login');
        }
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Market-in
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center space-x-12"
                    >
                        {[
                            { href: "/", label: "Home" },
                            { href: "/featureDetails", label: "Features" },
                            { href: "/pricingDetails", label: "Pricing" },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="group relative py-1 text-white/90 text-lg font-medium hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleAuthAction}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                        >
                            {session ? 'Sign Out' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}