'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MantaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Manta Ray Core Body */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[60vw] h-[40vw] bg-accent-primary/20 rounded-[100%] blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 15, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Right Wing (Blue/Teal) */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[40vw] h-[30vw] bg-status-teal/15 rounded-[100%] blur-[100px]"
        animate={{
          x: [0, -120, 50, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.3, 0.8, 1],
          rotate: [0, -20, 10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Left Wing (Purple/Pink) */}
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[50vw] h-[35vw] bg-status-purple/15 rounded-[100%] blur-[140px]"
        animate={{
          x: [0, 80, -100, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 10, -15, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Glowing Core / Eye of the Manta */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] bg-white/5 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
