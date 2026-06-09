"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Brain, LayoutDashboard, CalendarCheck, Smile, BookOpen, 
  Activity, ShieldAlert, Compass, CheckSquare, MessageSquare, 
  LineChart, Settings, LogOut, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "../ui/button";
import { AuthService } from "../../services/auth.service";
import { useRouter } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard className="w-4 h-4" />, href: "/dashboard" },
    { name: "Daily Check-In", icon: <CalendarCheck className="w-4 h-4" />, href: "/checkin" },
    { name: "Mood Logs", icon: <Smile className="w-4 h-4" />, href: "/mood" },
    { name: "Journal Analysis", icon: <BookOpen className="w-4 h-4" />, href: "/journal" },
    { name: "Stress Monitor", icon: <Activity className="w-4 h-4" />, href: "/stress" },
    { name: "Burnout Index", icon: <ShieldAlert className="w-4 h-4" />, href: "/burnout" },
    { name: "Focus Blocks", icon: <Compass className="w-4 h-4" />, href: "/focus" },
    { name: "Habits Streak", icon: <CheckSquare className="w-4 h-4" />, href: "/habits" },
    { name: "AI Therapist Coach", icon: <MessageSquare className="w-4 h-4" />, href: "/coach" },
    { name: "Wellness Forecast", icon: <LineChart className="w-4 h-4" />, href: "/forecast" },
    { name: "System Settings", icon: <Settings className="w-4 h-4" />, href: "/settings" }
  ];

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore errors, always redirect
    }
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0B1020] border-r border-white/5 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header logo */}
      <div>
        <div className={`h-16 flex items-center px-4 justify-between border-b border-white/5`}>
          <Link href="/dashboard" className="flex items-center space-x-2 group overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shrink-0">
              <div className="w-full h-full bg-[#0B1020] rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight text-white transition-opacity duration-300">
                Brain<span className="text-cyan-400">OS</span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all group relative ${
                  isActive 
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-600/10 border border-violet-500/20 text-white font-bold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {item.icon}
                </div>
                {!collapsed && <span className="truncate">{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-white/10 rounded text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer trigger */}
      <div className="p-3 border-t border-white/5">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 px-3 text-slate-400 hover:text-white cursor-pointer font-sans"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </Button>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
