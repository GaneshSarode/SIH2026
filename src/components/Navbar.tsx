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
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 md:gap-2 px-3 py-2 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-sm">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-2 md:mr-4 pl-1">
          <Activity className="w-5 h-5 text-[var(--color-status-online)]" />
          <span className="font-semibold tracking-tight hidden sm:block">GridWatch</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-[var(--color-border)]'
                    : 'text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50'
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
          className="p-2 ml-1 md:ml-3 rounded-full text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        {/* User Auth */}
        <div className="ml-2 flex items-center pr-1 border-l border-[var(--color-border)] pl-2">
          {user ? (
            <button
              onClick={async () => await supabase.auth.signOut()}
              className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
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
