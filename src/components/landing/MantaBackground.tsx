'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MantaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. Magical glowing aura that follows the manta ray */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[60vw] h-[40vw] bg-accent-primary/20 rounded-[100%] blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 15, -10, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[40vw] h-[30vw] bg-status-teal/15 rounded-[100%] blur-[100px]"
        animate={{
          x: [0, -120, 50, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. The literal Manta Ray that floats across the screen (Like Gemini Logo) */}
      <motion.div
        className="absolute z-10 opacity-60"
        initial={{ x: '-20vw', y: '80vh', rotate: -15, scale: 0.5 }}
        animate={{
          x: ['-20vw', '120vw'],
          y: ['80vh', '10vh', '40vh', '-20vh'],
          rotate: [-15, 10, -5, 20],
          scale: [0.5, 1.2, 0.8, 1.5]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        <svg 
          width="200" height="200" viewBox="0 0 100 100" 
          fill="none" xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_30px_rgba(45,212,191,0.8)] animate-pulse"
        >
          {/* Manta Ray elegant path */}
          <path 
            d="M50 10 C 60 40, 90 50, 95 60 C 90 65, 70 70, 50 90 C 30 70, 10 65, 5 60 C 10 50, 40 40, 50 10 Z" 
            fill="url(#manta-gradient)"
            fillOpacity="0.8"
          />
          {/* Manta Tail */}
          <path 
            d="M50 90 C 50 95, 48 110, 50 120" 
            stroke="url(#manta-gradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="manta-gradient" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="0.5" stopColor="#2DD4BF" />
              <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 3. A second, smaller manta ray swimming in the background */}
      <motion.div
        className="absolute z-0 opacity-30"
        initial={{ x: '120vw', y: '20vh', rotate: 210, scale: 0.3 }}
        animate={{
          x: ['120vw', '-20vw'],
          y: ['20vh', '60vh', '10vh', '80vh'],
          rotate: [210, 180, 220, 190]
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
          delay: 15
        }}
      >
        <svg 
          width="120" height="120" viewBox="0 0 100 100" 
          fill="none" xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_20px_rgba(167,139,250,0.6)]"
        >
          <path 
            d="M50 10 C 60 40, 90 50, 95 60 C 90 65, 70 70, 50 90 C 30 70, 10 65, 5 60 C 10 50, 40 40, 50 10 Z" 
            fill="url(#manta-gradient-2)"
            fillOpacity="0.6"
          />
          <defs>
            <linearGradient id="manta-gradient-2" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

    </div>
  );
}
