"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, Sparkles, Smile, Compass, Plus, User } from "lucide-react";
import { Button } from "../ui/button";
import { useBrainStore } from "../../store/useBrainStore";

export const TopNavbar: React.FC = () => {
  const user = useBrainStore((state) => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const mockNotifications = [
    "HRV values are stabilized at 72ms.",
    "Stress forecast predicts a peak at Thursday 2:00 PM.",
    "Daily Pomodoro goal has been completed!"
  ];

  return (
    <header className="h-16 border-b border-white/5 bg-[#0B1020]/75 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      
      {/* Search area */}
      <div className="flex items-center space-x-3 w-1/3">
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search mental metrics, logs, AI tags..."
            className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* Access buttons, notification and user avatar menu */}
      <div className="flex items-center space-x-4">
        
        {/* Quick check-in shortcut */}
        <Link href="/checkin">
          <Button size="sm" variant="default" className="flex items-center gap-1 cursor-pointer font-mono text-xs">
            <Plus className="w-3.5 h-3.5" /> Check-In
          </Button>
        </Link>

        {/* Notifications center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl glassmorphism border border-white/10 p-3 shadow-2xl space-y-2 z-50 text-left">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1.5">
                Telemetry Alerts
              </h4>
              <div className="space-y-2 pt-1.5">
                {mockNotifications.map((notif, idx) => (
                  <p key={idx} className="text-xs text-slate-300 font-sans leading-normal">
                    • {notif}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
          >
            <div className="w-8 h-8 rounded-full bg-violet-600/35 overflow-hidden border border-violet-500/30 flex items-center justify-center text-xs text-white font-bold font-mono">
              {user ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            {user && (
              <span className="text-xs font-semibold text-slate-300 hidden md:block">{user.fullName}</span>
            )}
          </button>

          {showProfile && user && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl glassmorphism border border-white/10 p-3 shadow-2xl space-y-2.5 z-50 text-left">
              <div className="border-b border-white/5 pb-2">
                <h4 className="text-xs font-bold text-slate-200">{user.fullName}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</p>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link 
                    href="/settings" 
                    onClick={() => setShowProfile(false)}
                    className="block p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    System Preferences
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/forecast" 
                    onClick={() => setShowProfile(false)}
                    className="block p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Predictions
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
export default TopNavbar;
