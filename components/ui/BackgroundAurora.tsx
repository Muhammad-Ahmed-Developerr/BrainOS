'use client';

import React, { useEffect, useRef } from 'react';

export default function BackgroundAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Glowing particle objects
    const particles = Array.from({ length: 28 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7',
    }));

    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Radial Aurora Mesh
      const gradient1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time) * 100,
        height * 0.2 + Math.cos(time * 0.8) * 80,
        10,
        width * 0.3,
        height * 0.2,
        width * 0.6
      );
      gradient1.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      gradient1.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      gradient1.addColorStop(1, 'rgba(2, 2, 3, 0)');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 1.2) * 120,
        height * 0.6 + Math.sin(time * 0.9) * 100,
        10,
        width * 0.7,
        height * 0.6,
        width * 0.5
      );
      gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.07)');
      gradient2.addColorStop(0.6, 'rgba(6, 182, 212, 0.03)');
      gradient2.addColorStop(1, 'rgba(2, 2, 3, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Render Floating Neural Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 2 + p.x) * 0.4);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
