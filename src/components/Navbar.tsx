"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 md:gap-6 px-4 py-2 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-sm">
        
        {/* Logo as Home Link */}
        <Link href="/" className="flex items-center gap-2 mr-2 md:mr-8">
          <Activity className="w-5 h-5 text-[var(--color-status-online)]" />
          <span className="font-semibold tracking-tight text-lg hidden sm:block">GridWatch</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              pathname === '/' 
                ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-[var(--color-border)]' 
                : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/supply-demand" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              pathname === '/supply-demand' 
                ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-[var(--color-border)]' 
                : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50'
            }`}
          >
            Supply & Demand
          </Link>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 ml-2 md:ml-4 rounded-full text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </nav>
    </div>
  );
}
