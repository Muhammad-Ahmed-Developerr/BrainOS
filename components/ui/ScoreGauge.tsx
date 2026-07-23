'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  title: string;
  subtitle?: string;
  size?: number; // width/height in px
  strokeWidth?: number;
  colorScheme?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'blue';
  id?: string;
}

export default function ScoreGauge({
  score,
  title,
  subtitle,
  size = 180,
  strokeWidth = 12,
  colorScheme = 'cyan',
  id,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const colorMap = {
    cyan: {
      gradientStart: '#38bdf8',
      gradientEnd: '#06b6d4',
      text: 'text-cyan-400',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
    },
    purple: {
      gradientStart: '#c084fc',
      gradientEnd: '#a855f7',
      text: 'text-purple-400',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
    },
    emerald: {
      gradientStart: '#34d399',
      gradientEnd: '#10b981',
      text: 'text-emerald-400',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    },
    amber: {
      gradientStart: '#fbbf24',
      gradientEnd: '#f59e0b',
      text: 'text-amber-400',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
    },
    blue: {
      gradientStart: '#60a5fa',
      gradientEnd: '#3b82f6',
      text: 'text-blue-400',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
    },
    rose: {
      gradientStart: '#f87171',
      gradientEnd: '#ef4444',
      text: 'text-rose-400',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
    },
  };

  const selectedColor = colorMap[colorScheme];

  return (
    <div id={id} className="flex flex-col items-center justify-center relative">
      <div
        className="relative flex items-center justify-center rounded-full p-2"
        style={{ width: size, height: size, backgroundColor: selectedColor.bgGlow }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gaugeGrad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={selectedColor.gradientStart} />
              <stop offset="100%" stopColor={selectedColor.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gaugeGrad-${colorScheme})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-4xl font-extrabold tracking-tight ${selectedColor.text}`}
          >
            {clampedScore}
          </motion.span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
