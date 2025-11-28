'use client';

import Link from 'next/link';
import Snowfall from '@/components/Snowfall';
import AudioPlayer from '@/components/AudioPlayer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <Snowfall />
      <AudioPlayer />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/background-got.jpg')] bg-cover bg-center opacity-60"></div>
      <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-cyan-500 font-medium tracking-[0.5em] uppercase text-xs sm:text-sm md:text-base mb-4">Winter of Projects</h2>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            VANTEDGE
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            The night is dark and full of noise. We map the invisible spectrum to bring order to the chaos.
            <br />
            <span className="text-cyan-400/80 italic mt-2 block">RF Noise Mapping System</span>
          </p>
        </div>

        <Link
          href="/selection"
          className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold text-white transition-all duration-300 bg-transparent border-2 border-slate-700 hover:border-cyan-500 rounded-none uppercase tracking-widest overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-cyan-900"></span>
          <span className="relative z-10 group-hover:text-cyan-400 transition-colors duration-300">Enter the Realm</span>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-cyan-500/10 transition-transform duration-500 ease-out"></div>
        </Link>
      </div>

      {/* Footer / Credits */}
      <div className="absolute bottom-8 text-center w-full text-slate-600 text-xs tracking-widest uppercase">
        Forged by Team VantEdge • IEEE WOP
      </div>
    </div>
  );
}
