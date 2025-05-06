"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Redirect to pricing section of the landing page
            router.push('/#pricing');
        }
    }, [session, router]);

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
            {/* Back button */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
            </button>

            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Please sign in to continue</p>
                </div>
                <button
                    onClick={() => signIn('google', { callbackUrl: '/#pricing' })}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        {/* Google icon paths */}
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
