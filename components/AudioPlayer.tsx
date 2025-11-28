'use client';

import { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Attempt to play on mount, but browser might block it until interaction
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked, waiting for interaction");
                }
            }
        };
        playAudio();

        // Add global click listener to start audio if it was blocked
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused && !isMuted) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            }
        };

        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [isMuted]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(!isMuted);
            if (!isMuted && audioRef.current.paused) {
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-4 md:right-6 z-[9999]">
            <audio ref={audioRef} src="/got-theme.mp3" loop />
            <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-slate-800 hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-sm"
                title={isMuted ? "Unmute Theme" : "Mute Theme"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-pulse">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
