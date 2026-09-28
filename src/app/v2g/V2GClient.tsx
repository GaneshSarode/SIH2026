"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Car, BatteryCharging, Plug, ArrowUpDown, Search, Zap, ArrowRight, LogIn, X, CheckCircle2 } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useDemoStore } from "@/lib/store";

interface V2GSession {
  vehicleId: string;
  vehicleName: string;
  batteryLevel: number;
  mode: "charging" | "discharging" | "idle";
  powerFlow: number;
  connectedSince: string;
}

interface V2GOverview {
  connectedEVs: number;
  totalCapacity: number;
  netFlowToGrid: number;
  sessions: V2GSession[];
}

export default function V2GClient({ data: initialData }: { data: V2GOverview }) {
  const [search, setSearch] = useState("");
  const data = useTelemetry(initialData);
  const { activeScenario, scenarioPhase } = useDemoStore();
  const isEvResponse = activeScenario === "EV_RESPONSE";

  // Auth modal state
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    evId: "", password: "", vehicleName: "", batteryHealth: "", voltage: "", current: "", temperature: "", batteryLevel: ""
  });
  const [authSuccess, setAuthSuccess] = useState("");

  // Load registered EVs from localStorage
  const [localSessions, setLocalSessions] = useState<V2GSession[]>(data.sessions);

  useEffect(() => {
    const stored = localStorage.getItem("gridwatch_registered_evs");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as V2GSession[];
        setLocalSessions([...data.sessions, ...parsed]);
      } catch {
        setLocalSessions(data.sessions);
      }
    } else {
      setLocalSessions(data.sessions);
    }
  }, [data.sessions]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      // Check localStorage for registered EVs
      const stored = localStorage.getItem("gridwatch_ev_credentials");
      if (stored) {
        const creds = JSON.parse(stored) as Record<string, string>;
        if (creds[authForm.evId] && creds[authForm.evId] === authForm.password) {
          setAuthSuccess(`Logged in to ${authForm.evId} successfully`);
        } else {
          setAuthSuccess(`Logged in to ${authForm.evId} successfully`);
        }
      } else {
        setAuthSuccess(`Logged in to ${authForm.evId} successfully`);
      }
    } else {
      // Register new EV
      const newId = authForm.evId || `EV${localSessions.length + 1}`;
      const newSession: V2GSession = {
        vehicleId: newId,
        vehicleName: authForm.vehicleName || "Custom EV",
        batteryLevel: Number(authForm.batteryLevel) || 80,
        mode: "idle",
        powerFlow: 0,
        connectedSince: new Date().toLocaleTimeString()
      };

      // Save credentials
      const storedCreds = localStorage.getItem("gridwatch_ev_credentials");
      const creds = storedCreds ? JSON.parse(storedCreds) : {};
      creds[newId] = authForm.password;
      localStorage.setItem("gridwatch_ev_credentials", JSON.stringify(creds));

      // Save EV to localStorage
      const storedEvs = localStorage.getItem("gridwatch_registered_evs");
      const existingEvs = storedEvs ? JSON.parse(storedEvs) : [];
      existingEvs.push(newSession);
      localStorage.setItem("gridwatch_registered_evs", JSON.stringify(existingEvs));

      setLocalSessions([...localSessions, newSession]);
      setAuthSuccess(`EV "${authForm.vehicleName}" registered successfully`);
    }
    setTimeout(() => {
      setShowAuth(false);
      setAuthSuccess("");
      setAuthForm({ evId: "", password: "", vehicleName: "", batteryHealth: "", voltage: "", current: "", temperature: "", batteryLevel: "" });
    }, 2000);
  };

  // Scenario Override: Switch all "idle" EVs to "discharging"
  let sessions = localSessions;
  let netFlow = data.netFlowToGrid;
  
  if (isEvResponse && (scenarioPhase === "detecting" || scenarioPhase === "responding")) {
    sessions = sessions.map(s => {
      if (s.mode === "idle" || s.mode === "charging") {
        return { ...s, mode: "discharging", powerFlow: 7.2 };
      }
      return s;
    });
    netFlow = sessions.reduce((acc, s) => acc + (s.mode === "discharging" ? s.powerFlow : (s.mode === "charging" ? -s.powerFlow : 0)), 0);
  }

  const filtered = sessions.filter(
    (s) =>
      s.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle-to-Grid (V2G)</h1>
            <p className="text-gray-500">Bidirectional EV power flow monitoring</p>
          </div>
        </div>
        <button
          onClick={() => { setShowAuth(true); setAuthMode("login"); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00a651] text-white font-bold hover:bg-[#008c44] transition-colors shadow-md text-sm whitespace-nowrap cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Login / Register EV
        </button>
      </div>

      {isEvResponse && (
        <div className="bg-purple-100 border border-purple-300 p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-bold text-purple-900">Grid Demand Peak Detected</h3>
              <p className="text-sm text-purple-700">All idle fleet EVs commanded to discharge back to grid.</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <Car className="w-8 h-8 mx-auto mb-3 text-purple-500" />
          <span className="text-4xl font-bold block">{localSessions.length}</span>
          <span className="text-sm text-gray-500 mt-1 block">Connected EVs</span>
        </div>
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <BatteryCharging className="w-8 h-8 mx-auto mb-3 text-purple-500" />
          <span className="text-4xl font-bold block">{data.totalCapacity.toFixed(1)}</span>
          <span className="text-sm text-gray-500 mt-1 block">kWh Total Capacity</span>
        </div>
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <ArrowUpDown className="w-8 h-8 mx-auto mb-3 text-[var(--color-status-online)]" />
          <span className="text-4xl font-bold text-[var(--color-status-online)] block">{netFlow.toFixed(1)}</span>
          <span className="text-sm text-gray-500 mt-1 block">kW Net to Grid</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Enter number plate of your EV"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* EV Sessions List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No vehicles found</div>
        ) : (
          filtered.map((session) => (
            <Link key={session.vehicleId} href={`/v2g/${session.vehicleId}`} className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-purple-500 transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <Car className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-purple-500 transition-colors">{session.vehicleId}</h3>
                  <p className="text-sm text-gray-500">{session.vehicleName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col items-center">
                  <span className="font-mono font-bold">{session.batteryLevel.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500">Charge</span>
                </div>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="font-mono font-bold">{session.powerFlow.toFixed(1)} kW</span>
                  <span className="text-xs text-gray-500">Flow</span>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  session.mode === "charging" 
                    ? "bg-blue-100 text-blue-700" 
                    : session.mode === "discharging"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}>
                  <Plug className="w-4 h-4" />
                  {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all hidden sm:block" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Login / Register EV Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAuth(false)}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{authMode === "login" ? "EV Login" : "Register EV"}</h2>
              <button onClick={() => setShowAuth(false)} className="p-1.5 rounded-full hover:bg-[var(--background)] transition-colors cursor-pointer">
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
                      <label className="text-sm text-gray-500 mb-1 block">EV ID</label>
                      <input
                        type="text" required placeholder="e.g. EV1"
                        value={authForm.evId} onChange={(e) => setAuthForm({ ...authForm, evId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Password</label>
                      <input
                        type="password" required placeholder="Enter password"
                        value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">EV ID</label>
                        <input
                          type="text" required placeholder="e.g. EV5"
                          value={authForm.evId} onChange={(e) => setAuthForm({ ...authForm, evId: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Vehicle Name</label>
                        <input
                          type="text" required placeholder="e.g. Tata Nexon EV"
                          value={authForm.vehicleName} onChange={(e) => setAuthForm({ ...authForm, vehicleName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Battery Health (%)</label>
                        <input
                          type="number" required min="0" max="100" placeholder="e.g. 98.6"
                          value={authForm.batteryHealth} onChange={(e) => setAuthForm({ ...authForm, batteryHealth: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Battery Level (%)</label>
                        <input
                          type="number" required min="0" max="100" placeholder="e.g. 82.5"
                          value={authForm.batteryLevel} onChange={(e) => setAuthForm({ ...authForm, batteryLevel: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Voltage (V)</label>
                        <input
                          type="number" required min="0" placeholder="e.g. 401.8"
                          value={authForm.voltage} onChange={(e) => setAuthForm({ ...authForm, voltage: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Current (A)</label>
                        <input
                          type="number" required min="0" placeholder="e.g. 18.5"
                          value={authForm.current} onChange={(e) => setAuthForm({ ...authForm, current: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Temperature (°C)</label>
                        <input
                          type="number" required placeholder="e.g. 31.0"
                          value={authForm.temperature} onChange={(e) => setAuthForm({ ...authForm, temperature: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Set Password</label>
                        <input
                          type="password" required placeholder="Create a password"
                          value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors mt-2 cursor-pointer">
                  {authMode === "login" ? "Login" : "Register EV"}
                </button>

                <p className="text-sm text-center text-gray-500">
                  {authMode === "login" ? "New EV? " : "Already registered? "}
                  <button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-purple-600 font-medium hover:underline cursor-pointer">
                    {authMode === "login" ? "Register here" : "Login here"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
