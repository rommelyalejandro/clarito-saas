'use client';

import React, { useEffect, useRef, useState } from 'react';

class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number = 0;
  vy: number = 0;
  randomFactor: number;

  constructor(x: number, y: number, canvasWidth: number, canvasHeight: number) {
    // Start particles near their base position instead of scattered across the whole screen
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.baseX = x;
    this.baseY = y;
    this.size = Math.random() * 1.5 + 0.5;
    // Halved spring stiffness for 50% slower return speed
    this.randomFactor = Math.random() * 0.0025 + 0.0025; 

    const colors = [
      'rgba(45, 212, 191, 0.9)',   // Teal
      'rgba(167, 139, 250, 0.9)',  // Purple
      'rgba(129, 140, 248, 0.9)',  // Indigo
      'rgba(255, 255, 255, 0.8)'   // White-ish
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouse: { x: number; y: number; radius: number }) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Mouse Repel Force
    if (distance < mouse.radius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      // Halved repel force for 50% slower reaction
      let force = Math.pow((maxDistance - distance) / maxDistance, 2);
      let pushX = forceDirectionX * force * 1.5; 
      let pushY = forceDirectionY * force * 1.5;

      this.vx -= pushX;
      this.vy -= pushY;
    }

    // Spring Force (returning to base position)
    let dxBase = this.baseX - this.x;
    let dyBase = this.baseY - this.y;
    this.vx += dxBase * this.randomFactor;
    this.vy += dyBase * this.randomFactor;

    // Friction / Damping - make it floatier and smoother
    this.vx *= 0.92;
    this.vy *= 0.92;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function MantaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    const initCanvas = () => {
      if (!containerRef.current || !canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particlesArray = [];
      
      // Step 1: Draw the Manta Ray SVG onto a temporary canvas to get pixel data
      const offscreenCanvas = document.createElement('canvas');
      const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;

      // Center and scale the Manta Ray based on screen size (doubled size)
      const scaleFactor = Math.min(canvas.width, canvas.height) / 90; 
      
      offCtx.translate(canvas.width / 2, canvas.height / 2);
      offCtx.scale(scaleFactor, scaleFactor);
      
      // Offset by half of the 100x100 SVG viewbox to perfectly center
      offCtx.translate(-50, -50);

      // Manta path (Same as Logo 4)
      const path = new Path2D("M50 10 C 60 40, 90 50, 95 60 C 90 65, 70 70, 50 90 C 30 70, 10 65, 5 60 C 10 50, 40 40, 50 10 Z");
      offCtx.fillStyle = "white";
      offCtx.fill(path);

      // Step 2: Read pixel data
      const imgData = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      const data = imgData.data;

      // The step controls particle density. Lower = more particles.
      const step = Math.min(canvas.width, canvas.height) < 768 ? 6 : 4; 

      for (let y = 0; y < offscreenCanvas.height; y += step) {
        for (let x = 0; x < offscreenCanvas.width; x += step) {
          const index = (y * offscreenCanvas.width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            // Include some randomness to base positions to make it look organic
            let randX = x + (Math.random() - 0.5) * 4;
            let randY = y + (Math.random() - 0.5) * 4;
            particlesArray.push(new Particle(randX, randY, canvas.width, canvas.height));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Interaction radius based on screen size
      const interactionRadius = Math.min(canvas.width, canvas.height) * 0.15;
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update({
          x: mousePos.x,
          y: mousePos.y,
          radius: interactionRadius
        });
        particlesArray[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  // Track mouse securely on the window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    // Using window listener instead of div listener ensures it catches events even if other things are on top
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0"
      style={{ 
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' 
      }}
    >
      {/* Background glow behind the particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-status-teal/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <canvas 
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
