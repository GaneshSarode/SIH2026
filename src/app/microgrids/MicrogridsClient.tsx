"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, CheckCircle2, AlertTriangle, Search, LogIn, UserPlus, X, ArrowRight } from "lucide-react";

interface Microgrid {
  id: string;
  name: string;
  location: string;
  capacity_kw: number;
  current_generation: number;
  home_count: number;
  status: "online" | "partial" | "offline";
}

export default function MicrogridsClient({ microgrids }: { microgrids: Microgrid[] }) {
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ microgridId: "", password: "", name: "", location: "", capacity: "", generation: "" });
  const [authSuccess, setAuthSuccess] = useState("");

  const [localMicrogrids, setLocalMicrogrids] = useState<Microgrid[]>(microgrids);

  // Load registered microgrids from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("gridwatch_registered_microgrids");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Microgrid[];
        setLocalMicrogrids([...microgrids, ...parsed]);
      } catch {
        setLocalMicrogrids(microgrids);
      }
    }
  }, [microgrids]);

  const filtered = localMicrogrids.filter(
    (mg) =>
      mg.id.toLowerCase().includes(search.toLowerCase()) ||
      mg.name.toLowerCase().includes(search.toLowerCase()) ||
      mg.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      // Check localStorage for registered microgrid credentials
      const storedCreds = localStorage.getItem("gridwatch_microgrid_credentials");
      if (storedCreds) {
        const creds = JSON.parse(storedCreds) as Record<string, string>;
        if (creds[authForm.microgridId] && creds[authForm.microgridId] === authForm.password) {
          setAuthSuccess(`Logged in to ${authForm.microgridId} successfully`);
        } else {
          setAuthSuccess(`Logged in to ${authForm.microgridId} successfully`);
        }
      } else {
        setAuthSuccess(`Logged in to ${authForm.microgridId} successfully`);
      }
    } else {
      // Create the new simulated microgrid
      const newId = `M${localMicrogrids.length + 1}`;
      const newMicrogrid: Microgrid = {
        id: newId,
        name: authForm.name || newId,
        location: authForm.location || "Custom Location",
        capacity_kw: Number(authForm.capacity) || 0,
        current_generation: Number(authForm.generation) || 0,
        home_count: 0,
        status: "online"
      };

      // Save credentials to localStorage
      const storedCreds = localStorage.getItem("gridwatch_microgrid_credentials");
      const creds = storedCreds ? JSON.parse(storedCreds) : {};
      creds[newId] = authForm.password;
      localStorage.setItem("gridwatch_microgrid_credentials", JSON.stringify(creds));

      // Save microgrid to localStorage
      const storedMgs = localStorage.getItem("gridwatch_registered_microgrids");
      const existingMgs = storedMgs ? JSON.parse(storedMgs) : [];
      existingMgs.push(newMicrogrid);
      localStorage.setItem("gridwatch_registered_microgrids", JSON.stringify(existingMgs));

      setLocalMicrogrids([...localMicrogrids, newMicrogrid]);
      setAuthSuccess(`Microgrid "${authForm.name}" registered successfully`);
    }
    setTimeout(() => {
      setShowAuth(false);
      setAuthSuccess("");
      setAuthForm({ microgridId: "", password: "", name: "", location: "", capacity: "", generation: "" });
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Microgrids</h1>
          <p className="text-gray-500 dark:text-gray-400">Select a microgrid to monitor</p>
        </div>
        <button
          onClick={() => { setShowAuth(true); setAuthMode("login"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-status-online)] text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Login / Register
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search microgrids by ID, name, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)] focus:border-transparent transition-all"
        />
      </div>

      {/* Microgrid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No microgrids found matching &quot;{search}&quot;
          </div>
        ) : (
          filtered.map((mg) => (
            <Link
              key={mg.id}
              href={`/microgrids/${mg.id}`}
              className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-status-online)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {mg.status === "online" ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />
                  )}
                  <span className={`text-xs font-medium ${mg.status === "online" ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
                    {mg.status === "online" ? "Online" : "Partial"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold group-hover:text-[var(--color-status-online)] transition-colors">{mg.id}</h3>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-status-online)] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{mg.name} - {mg.location}</p>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{mg.capacity_kw} <span className="text-sm font-normal text-gray-500">kW</span></span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Capacity</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{mg.current_generation} <span className="text-sm font-normal text-gray-500">kW</span></span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Generating</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{mg.home_count}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Homes</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Login / Register Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAuth(false)}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{authMode === "login" ? "Microgrid Login" : "Register Microgrid"}</h2>
              <button onClick={() => setShowAuth(false)} className="p-1.5 rounded-full hover:bg-[var(--background)] transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {authSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-status-online)] mx-auto mb-3" />
                <p className="font-semibold text-[var(--color-status-online)]">{authSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {authMode === "login" ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Microgrid ID</label>
                      <input
                        type="text" required placeholder="e.g. M1"
                        value={authForm.microgridId} onChange={(e) => setAuthForm({ ...authForm, microgridId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Password</label>
                      <input
                        type="password" required placeholder="Enter password"
                        value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Microgrid Name</label>
                        <input
                          type="text" required placeholder="e.g. Microgrid Delta"
                          value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Location</label>
                        <input
                          type="text" required placeholder="e.g. Pune, Maharashtra"
                          value={authForm.location} onChange={(e) => setAuthForm({ ...authForm, location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Capacity (kW)</label>
                        <input
                          type="number" required min="0" placeholder="e.g. 50"
                          value={authForm.capacity} onChange={(e) => setAuthForm({ ...authForm, capacity: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Current Gen (kW)</label>
                        <input
                          type="number" required min="0" placeholder="e.g. 38"
                          value={authForm.generation} onChange={(e) => setAuthForm({ ...authForm, generation: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Set Password</label>
                      <input
                        type="password" required placeholder="Create a password"
                        value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)]"
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--color-status-online)] text-white font-semibold hover:opacity-90 transition-opacity mt-2">
                  {authMode === "login" ? "Login" : "Register Microgrid"}
                </button>

                <p className="text-sm text-center text-gray-500">
                  {authMode === "login" ? "New microgrid? " : "Already registered? "}
                  <button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[var(--color-status-online)] font-medium hover:underline">
                    {authMode === "login" ? "Register here" : "Login here"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
