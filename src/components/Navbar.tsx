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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-[#00a651]" />
          <span className="text-2xl font-bold tracking-tight text-[#004b87] uppercase">GridWatch</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                  isActive ? 'text-[#00a651]' : 'text-[#004b87] hover:text-[#00a651]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={async () => await supabase.auth.signOut()}
              className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wide"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#00a651] text-white text-sm font-bold uppercase tracking-wide hover:bg-[#008c44] transition-colors rounded-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
