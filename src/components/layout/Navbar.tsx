"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exclude dashboard paths from marketing header
  const isDashboard = pathname.startsWith("/dashboard") || 
                      pathname === "/checkin" || 
                      pathname === "/mood" || 
                      pathname === "/journal" || 
                      pathname === "/stress" || 
                      pathname === "/burnout" || 
                      pathname === "/focus" || 
                      pathname === "/habits" || 
                      pathname === "/coach" || 
                      pathname === "/forecast" || 
                      pathname === "/settings";

  if (isDashboard) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[1px] shadow-md shadow-violet-500/10 group-hover:shadow-cyan-500/10 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors">
            Brain<span className="text-cyan-600">OS</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  isActive ? "text-cyan-600 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeTabMarker"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Call to Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="glow" className="flex items-center gap-1">
              Initialize OS <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2 px-3 border-t border-slate-100">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Initialize OS
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
