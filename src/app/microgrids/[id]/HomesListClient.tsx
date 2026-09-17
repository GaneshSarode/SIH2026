"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, AlertTriangle, ChevronRight, LogIn, X } from "lucide-react";

interface HomeReading {
  id: string;
  microgrid_id: string;
  kwh_today: number;
  status: "online" | "low";
}

export default function HomesListClient({ homes, microgridId }: { homes: HomeReading[]; microgridId: string }) {
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ homeId: "", password: "", name: "" });
  const [authSuccess, setAuthSuccess] = useState("");

  const filtered = homes.filter((h) => h.id.toLowerCase().includes(search.toLowerCase()));

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccess(authMode === "login" ? `Logged in to ${authForm.homeId}` : `Home "${authForm.name}" registered`);
    setTimeout(() => { setShowAuth(false); setAuthSuccess(""); setAuthForm({ homeId: "", password: "", name: "" }); }, 2000);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Homes</h2>
          <span className="text-sm text-gray-500">{homes.length} connected</span>
        </div>
        <button
          onClick={() => { setShowAuth(true); setAuthMode("login"); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-status-online)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <LogIn className="w-3.5 h-3.5" /> Login / Register
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search homes by ID (e.g. H1, H2)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)] focus:border-transparent transition-all"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No homes found matching &quot;{search}&quot;</div>
        ) : (
          filtered.map((home) => {
            const isOnline = home.status === "online";
            return (
              <Link key={home.id} href={`/microgrids/${microgridId}/${home.id}`} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-status-online)] hover:bg-[var(--background)] transition-all group cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center gap-6">
                  <span className="font-mono text-lg font-semibold group-hover:text-[var(--color-status-online)] transition-colors">{home.id}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Usage</span>
                    <span className="font-semibold">{home.kwh_today.toFixed(1)} <span className="text-gray-500 text-sm font-normal">kWh</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {isOnline ? <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" /> : <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />}
                    <span className={`text-sm font-medium ${isOnline ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>{isOnline ? 'Online' : 'Low Output'}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-status-online)] transition-colors" />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Login / Register Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAuth(false)}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{authMode === "login" ? "Home Login" : "Register Home"}</h2>
              <button onClick={() => setShowAuth(false)} className="p-1.5 rounded-full hover:bg-[var(--background)] transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {authSuccess ? (
              <div className="text-center py-8"><CheckCircle2 className="w-12 h-12 text-[var(--color-status-online)] mx-auto mb-3" /><p className="font-semibold text-[var(--color-status-online)]">{authSuccess}</p></div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {authMode === "login" ? (
                  <>
                    <div><label className="text-sm text-gray-500 mb-1 block">Home ID</label><input type="text" required placeholder="e.g. H1" value={authForm.homeId} onChange={(e) => setAuthForm({ ...authForm, homeId: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]" /></div>
                    <div><label className="text-sm text-gray-500 mb-1 block">Password</label><input type="password" required placeholder="Enter password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]" /></div>
                  </>
                ) : (
                  <>
                    <div><label className="text-sm text-gray-500 mb-1 block">Home Name</label><input type="text" required placeholder="e.g. Residence 4" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]" /></div>
                    <div><label className="text-sm text-gray-500 mb-1 block">Set Password</label><input type="password" required placeholder="Create a password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]" /></div>
                  </>
                )}
                <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--color-status-online)] text-white font-semibold hover:opacity-90 transition-opacity mt-2">{authMode === "login" ? "Login" : "Register Home"}</button>
                <p className="text-sm text-center text-gray-500">{authMode === "login" ? "New home? " : "Already registered? "}<button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[var(--color-status-online)] font-medium hover:underline">{authMode === "login" ? "Register here" : "Login here"}</button></p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
