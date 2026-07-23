'use client';

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'emerald' | 'amber';
  interactive?: boolean;
  onClick?: () => void;
  id?: string;
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'cyan',
  interactive = true,
  onClick,
  id,
}: GlassCardProps) {
  const glowMap = {
    cyan: 'hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    purple: 'hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]',
    blue: 'hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]',
    emerald: 'hover:border-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
    amber: 'hover:border-amber-500/30 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
  };

  return (
    <motion.div
      id={id}
      onClick={onClick}
      whileHover={interactive ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`relative rounded-3xl bg-[#0a0a0c] backdrop-blur-2xl border border-white/5 p-6 shadow-2xl transition-all duration-300 ${
        interactive ? `cursor-pointer ${glowMap[glowColor]}` : ''
      } ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
