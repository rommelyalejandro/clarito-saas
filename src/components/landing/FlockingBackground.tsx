'use client';

import React, { useEffect, useRef, useState } from 'react';

// === Vector Math Helper ===
class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) { this.x = x; this.y = y; }
  add(v: Vector) { this.x += v.x; this.y += v.y; return this; }
  sub(v: Vector) { this.x -= v.x; this.y -= v.y; return this; }
  mult(n: number) { this.x *= n; this.y *= n; return this; }
  div(n: number) { this.x /= n; this.y /= n; return this; }
  mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() { let m = this.mag(); if (m !== 0) this.div(m); return this; }
  limit(max: number) { if (this.mag() > max) { this.normalize(); this.mult(max); } return this; }
  heading() { return Math.atan2(this.y, this.x); }
  static dist(v1: Vector, v2: Vector) { let dx = v1.x - v2.x; let dy = v1.y - v2.y; return Math.sqrt(dx*dx + dy*dy); }
  static sub(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y); }
}

// === Boid (Fish) Class ===
class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxForce: number;
  maxSpeed: number;
  color: string;
  size: number;
  shadowColor: string;

  constructor(x: number, y: number) {
    this.acceleration = new Vector(0, 0);
    // Start with random velocity
    let angle = Math.random() * Math.PI * 2;
    this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
    this.position = new Vector(x, y);
    this.maxSpeed = 3.0; // Max speed of a fish
    this.maxForce = 0.05; // Maximum steering force
    this.size = Math.random() * 2 + 2; // Size of the fish
    
    const colors = [
      { fill: 'rgba(45, 212, 191, 0.8)', shadow: 'rgba(45, 212, 191, 0.4)' },  // Teal
      { fill: 'rgba(167, 139, 250, 0.8)', shadow: 'rgba(167, 139, 250, 0.4)' }, // Purple
      { fill: 'rgba(129, 140, 248, 0.8)', shadow: 'rgba(129, 140, 248, 0.4)' }, // Indigo
    ];
    const chosen = colors[Math.floor(Math.random() * colors.length)];
    this.color = chosen.fill;
    this.shadowColor = chosen.shadow;
  }

  run(boids: Boid[], mouse: {x: number, y: number, radius: number}, width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.flock(boids);
    this.repel(mouse);
    this.update();
    this.borders(width, height);
    this.draw(ctx);
  }

  applyForce(force: Vector) {
    this.acceleration.add(force);
  }

  flock(boids: Boid[]) {
    let sep = this.separate(boids);   // Separation
    let ali = this.align(boids);      // Alignment
    let coh = this.cohesion(boids);   // Cohesion

    // Arbitrarily weight these forces for desired behavior
    sep.mult(1.8); // Fuerte separación para no superponerse
    ali.mult(1.0);
    coh.mult(1.2); // Mantenerlos juntos

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration to 0 each cycle
  }

  seek(target: Vector) {
    let desired = Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  repel(mouse: {x: number, y: number, radius: number}) {
    if (mouse.x < 0 && mouse.y < 0) return; // Mouse out of bounds
    
    let mouseVec = new Vector(mouse.x, mouse.y);
    let d = Vector.dist(this.position, mouseVec);
    if (d < mouse.radius) {
      // Steer away extremely fast
      let desired = Vector.sub(this.position, mouseVec);
      desired.normalize();
      desired.mult(this.maxSpeed * 3); // Flee speed!
      
      let steer = Vector.sub(desired, this.velocity);
      steer.limit(this.maxForce * 5); // Huge steering force to escape
      this.applyForce(steer);
    }
  }

  borders(width: number, height: number) {
    let pad = 50;
    if (this.position.x < -pad) this.position.x = width + pad;
    if (this.position.y < -pad) this.position.y = height + pad;
    if (this.position.x > width + pad) this.position.x = -pad;
    if (this.position.y > height + pad) this.position.y = -pad;
  }

  separate(boids: Boid[]) {
    let desiredseparation = 30.0;
    let steer = new Vector(0, 0);
    let count = 0;
    
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = Vector.dist(this.position, other.position);
      if ((d > 0) && (d < desiredseparation)) {
        let diff = Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce * 1.5);
    }
    return steer;
  }

  align(boids: Boid[]) {
    let neighbordist = 60.0;
    let sum = new Vector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return new Vector(0, 0);
    }
  }

  cohesion(boids: Boid[]) {
    let neighbordist = 60.0;
    let sum = new Vector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return new Vector(0, 0);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let theta = this.velocity.heading() + Math.PI / 2;
    ctx.fillStyle = this.color;
    
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(theta);
    
    // Glowing shadow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.shadowColor;

    ctx.beginPath();
    // Draws a sleek, diamond-like fish shape
    ctx.moveTo(0, -this.size * 2);
    ctx.lineTo(-this.size, this.size * 2);
    ctx.lineTo(0, this.size); // slight notch in the tail
    ctx.lineTo(this.size, this.size * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export default function FlockingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let flock: Boid[] = [];
    let animationFrameId: number;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Determine flock size based on screen width
      let numBoids = 150;
      if (window.innerWidth < 768) numBoids = 80;
      if (window.innerWidth > 1600) numBoids = 250;

      flock = [];
      for (let i = 0; i < numBoids; i++) {
        flock.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const animate = () => {
      // Create a nice trailing effect by using semi-transparent black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Interaction radius based on screen size
      const interactionRadius = Math.min(canvas.width, canvas.height) * 0.20;
      
      for (let i = 0; i < flock.length; i++) {
        flock[i].run(flock, { x: mousePos.x, y: mousePos.y, radius: interactionRadius }, canvas.width, canvas.height, ctx);
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
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-bg-main"
    >
      {/* Underlying ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      
      <canvas 
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
