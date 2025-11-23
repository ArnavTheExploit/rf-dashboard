"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {

  // AUDIO + SNOW INIT
  useEffect(() => {
    // GOT THEME AUDIO
    const audio = new Audio("/got-theme.mp3");
    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(() => {});
    
    // Fade in volume
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 0.35) {
        vol += 0.02;
        audio.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 200);

    // SNOW EFFECT
    const snow = document.getElementById("snow");
    if (snow) {
      for (let i = 0; i < 60; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.textContent = "•";
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.fontSize = Math.random() * 10 + 8 + "px";
        flake.style.animationDuration = Math.random() * 5 + 5 + "s";
        flake.style.animationDelay = Math.random() * 5 + "s";
        snow.appendChild(flake);
      }
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/background.jpg"
        alt="Castle Background"
        fill
        className="object-cover opacity-50 blur-[1px]"
        priority
      />

      {/* FOG */}
      <div id="fog" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* SNOW */}
      <div id="snow" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center text-white gap-6 fade-in">

        {/* WOP LOGO */}
        <Image
          src="/WOP_WLOGO.png"
          alt="Winter Of Projects Logo"
          width={600}
          height={300}
          className="drop-shadow-2xl fade-in"
        />

        {/* CURVED VANTEDGE LOGO */}
        <Image
          src="/vantedge-logo.png"
          alt="VantEdge Logo"
          width={260}
          height={260}
          className="drop-shadow-2xl fade-in rounded-3xl"
        />

        {/* TRANSPARENT BUTTON */}
        <Link
          href="/dashboard"
          className="
            px-10 py-2 
            border border-white/70 
            text-white 
            text-xl 
            rounded-xl 
            font-semibold 
            shadow-2xl 
            transition-all 
            fade-in
            hover:bg-white/10
            backdrop-blur-sm
          "
        >
          Next →
        </Link>

      </div>
    </div>
  );
}
