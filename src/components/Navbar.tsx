"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, X } from "lucide-react";
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
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
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

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
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

        {/* Desktop User Auth */}
        <div className="hidden lg:flex items-center gap-4">
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

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-[#004b87]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold uppercase tracking-wide transition-colors py-2 ${
                  isActive ? 'text-[#00a651]' : 'text-[#004b87] hover:text-[#00a651]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base font-bold text-red-600 hover:text-red-700 uppercase tracking-wide py-2"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full px-6 py-3 bg-[#00a651] text-white text-base font-bold uppercase tracking-wide hover:bg-[#008c44] transition-colors rounded-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
