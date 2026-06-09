"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AuthService } from "../../services/auth.service";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-w: 768px)");

  // Load real user from MongoDB on first mount
  useEffect(() => {
    AuthService.getCurrentUser().catch(() => {});
  }, []);

  const paddingLeft = isMobile ? "pl-0" : sidebarCollapsed ? "pl-16" : "pl-64";

  return (
    <div className="bg-[#0B1020] min-h-screen text-slate-100 font-sans flex flex-col">
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${paddingLeft}`}>
        <TopNavbar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
