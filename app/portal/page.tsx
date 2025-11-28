"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import Image from "next/image";

const cinzel = Cinzel({ subsets: ["latin"] });

export default function PortalPage() {
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        // Re-trigger snow effect if needed, or just let the global CSS handle it if it was global. 
        // Since snow was in page.tsx useEffect, we need to add it here too or move it to a component.
        // For now, I'll duplicate the snow logic for a consistent experience.

        const snow = document.getElementById("snow");
        if (snow && snow.childElementCount === 0) {
            for (let i = 0; i < 70; i++) {
                const flake = document.createElement("div");
                flake.className = "snowflake";
                flake.textContent = "•";
                flake.style.left = Math.random() * 100 + "vw";
                flake.style.fontSize = Math.random() * 12 + 8 + "px";
                flake.style.animationDuration = Math.random() * 6 + 5 + "s";
                flake.style.animationDelay = Math.random() * 5 + "s";
                snow.appendChild(flake);
            }
        }
    }, []);

    return (
        <div className={`portal-root relative w-full h-screen overflow-hidden bg-black ${cinzel.className}`}>

            {/* Background Image */}
            <Image
                src="/background.jpg"
                alt="Castle Background"
                fill
                priority
                className="object-cover opacity-[0.4]"
            />

            {/* Fog & Overlay */}
            <div id="fog" />
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90 z-10" />
            <div className="vignette"></div>
            <div id="snow"></div>

            {/* Content */}
            <div className="relative z-40 flex flex-col items-center justify-center h-full text-white gap-12 fade-in">

                <h1 className="text-4xl md:text-6xl tracking-[0.2em] uppercase text-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
                    Choose Your Path
                </h1>

                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center w-full max-w-6xl px-4">

                    {/* Option 1: The North */}
                    <Link
                        href="/dashboard"
                        className="group relative w-full md:w-1/3 aspect-3/4 border border-gray-600/50 bg-black/40 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:border-gray-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        onMouseEnter={() => setHovered('north')}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90 z-10" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center transition-all duration-500 group-hover:-translate-y-4">
                            <div className="w-24 h-24 mb-6 rounded-full border-2 border-gray-500 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                                {/* Wolf Icon / Placeholder */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                </svg>
                            </div>
                            <h2 className="text-3xl tracking-widest uppercase mb-2 group-hover:text-white transition-colors">The North</h2>
                            <p className="text-gray-400 text-sm font-sans tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                Monitor the realm's defenses and winter storms.
                            </p>
                        </div>
                    </Link>

                    {/* Option 2: King's Landing */}
                    <Link
                        href="/dashboard"
                        className="group relative w-full md:w-1/3 aspect-3/4 border border-yellow-900/30 bg-black/40 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:border-yellow-600/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]"
                        onMouseEnter={() => setHovered('south')}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90 z-10" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center transition-all duration-500 group-hover:-translate-y-4">
                            <div className="w-24 h-24 mb-6 rounded-full border-2 border-yellow-800/50 flex items-center justify-center bg-yellow-900/10 group-hover:bg-yellow-900/20 transition-colors">
                                {/* Crown Icon / Placeholder */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a1.125 1.125 0 00-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125v9.75" />
                                </svg>
                            </div>
                            <h2 className="text-3xl tracking-widest uppercase mb-2 text-yellow-500/80 group-hover:text-yellow-400 transition-colors">The Capital</h2>
                            <p className="text-yellow-100/60 text-sm font-sans tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                Manage resources and political intrigue.
                            </p>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
