"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/microgrids", label: "Microgrids" },
  { href: "/bess", label: "BESS" },
  { href: "/v2g", label: "V2G" },
  { href: "/trade", label: "Trade" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Only apply transparent styling if we are on the homepage
  const isHome = pathname === "/";
  const navBg = (isHome && !isScrolled) 
    ? "bg-transparent border-transparent shadow-none" 
    : "bg-[var(--color-surface)]/80 backdrop-blur-md border-[var(--color-border)] shadow-sm";

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-4xl flex justify-center">
      <nav className={`flex items-center gap-1 md:gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${navBg}`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-2 md:mr-4 pl-1">
          <Activity className={`w-5 h-5 ${isHome && !isScrolled ? 'text-white' : 'text-[var(--color-status-online)]'}`} />
          <span className={`font-semibold tracking-tight hidden sm:block ${isHome && !isScrolled ? 'text-white' : 'text-[var(--foreground)]'}`}>GridWatch</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const activeBg = (isHome && !isScrolled) ? 'bg-white/20 text-white' : 'bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-[var(--color-border)]';
            const inactiveBg = (isHome && !isScrolled) ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50';
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? activeBg : inactiveBg
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 ml-1 md:ml-3 rounded-full transition-colors ${
            isHome && !isScrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]'
          }`}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        {/* User Auth */}
        <div className={`ml-2 flex items-center pr-1 border-l pl-2 ${isHome && !isScrolled ? 'border-white/20' : 'border-[var(--color-border)]'}`}>
          {user ? (
            <button
              onClick={async () => await supabase.auth.signOut()}
              className={`text-xs font-medium transition-colors ${isHome && !isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-red-500'}`}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full bg-[var(--color-status-online)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
