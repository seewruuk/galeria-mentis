"use client";

import { useState } from "react";
import Image from "next/image";

export default function Timeout({ onUnlock, maintenanceData }) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const correctPassword = maintenanceData?.password || "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === correctPassword) {
            // Store in localStorage to persist across page reloads
            localStorage.setItem("maintenance_unlocked", "true");
            onUnlock();
        } else {
            setError(true);
            setInput("");
        }
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://galeria-mentis.vercel.app";
    const logoSrc = `${baseUrl}/assets/logo-white.svg`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12 text-center space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="relative w-64 h-20">
                            <Image
                                src={logoSrc}
                                alt="Galeria Mentis Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Main Message */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Under Construction
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Currently working on something amazing. Please check back soon.
                        </p>
                        
                        {/* Additional message from Sanity */}
                        {maintenanceData?.message && (
                            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {maintenanceData.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 text-left">
                                Enter Access Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setError(false);
                                }}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>
                        
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                <p className="text-red-300 text-sm">
                                    Incorrect password. Please try again.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            Access Site
                        </button>
                    </form>

                    {/* Contact Email */}
                    {maintenanceData?.contactEmail && (
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-gray-400 text-sm mb-2">Need assistance?</p>
                            <a
                                href={`mailto:${maintenanceData.contactEmail}`}
                                className="text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                                {maintenanceData.contactEmail}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
