'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useBrainOS } from '@/context/BrainOSContext';
import { ViewType } from '@/types/brainos';
import {
  Brain,
  LayoutDashboard,
  CalendarCheck,
  Smile,
  Activity,
  Flame,
  Zap,
  Moon,
  BookOpen,
  Bot,
  Cpu,
  FileBarChart,
  Settings as SettingsIcon,
  BookMarked,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { activeView, setActiveView, scores, settings } = useBrainOS();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { view: 'checkin', label: 'Check-In', icon: <CalendarCheck className="w-4 h-4" /> },
    { view: 'mood', label: 'Mood', icon: <Smile className="w-4 h-4" /> },
    { view: 'stress', label: 'Stress', icon: <Activity className="w-4 h-4" /> },
    { view: 'burnout', label: 'Burnout', icon: <Flame className="w-4 h-4" /> },
    { view: 'focus', label: 'Focus', icon: <Zap className="w-4 h-4" /> },
    { view: 'sleep', label: 'Sleep', icon: <Moon className="w-4 h-4" /> },
    { view: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { view: 'coach', label: 'AI Coach', icon: <Bot className="w-4 h-4" /> },
    { view: 'architecture', label: 'AI Pipeline', icon: <Cpu className="w-4 h-4" /> },
    { view: 'reports', label: 'Reports', icon: <FileBarChart className="w-4 h-4" /> },
    { view: 'research', label: 'Research', icon: <BookMarked className="w-4 h-4" /> },
    { view: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#020203]/80 border-b border-white/5 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-brand-logo"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#020203] rounded-[10px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white uppercase group-hover:text-cyan-300 transition-colors">
                Brain<span className="text-cyan-400">OS</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-cyan-400 border border-white/10">
                V1.0.4 Stable
              </span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">Mental Health Operating System</span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#0a0a0c] p-1.5 rounded-full border border-white/5">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Quick Action */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="hidden md:flex items-center gap-2 text-xs text-white font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="text-[11px]">MongoDB Sync</span>
            <span className="text-gray-500 font-mono text-[10px] ml-1">({scores.overallScore})</span>
          </div>

          {/* User Profile / Sign Out */}
          {session?.user && (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1 px-3 text-xs text-gray-300">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="User" className="w-5 h-5 rounded-full border border-cyan-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span className="max-w-[100px] truncate text-white font-medium text-[11px]">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('brainos_user_authenticated');
                  }
                  signOut({ callbackUrl: '/' });
                }}
                className="p-1 rounded-full hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Check-in CTA Button */}
          <button
            onClick={() => handleNavClick('checkin')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-950 hover:bg-cyan-400 text-xs font-bold transition-all cursor-pointer shadow-md"
            id="navbar-quick-checkin-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Check-In</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#0a0a0c] border border-white/10 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeView === item.view
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
