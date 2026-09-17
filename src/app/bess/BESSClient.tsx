"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Thermometer, Heart, Zap, Battery, Search, LogIn, UserPlus, X, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BESSData {
  soc: number;
  temperature: number;
  status: "charging" | "discharging" | "idle";
  health: number;
  capacity: number;
  voltage: number;
  current: number;
  cycles: number;
  history: { time: string; soc: number }[];
}

export default function BESSClient({ data }: { data: BESSData }) {
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ bessId: "", password: "", name: "", capacity: "" });
  const [authSuccess, setAuthSuccess] = useState("");
  const isCharging = data.status === "charging";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      setAuthSuccess(`Logged in to BESS ${authForm.bessId} successfully`);
    } else {
      setAuthSuccess(`BESS "${authForm.name}" registered successfully`);
    }
    setTimeout(() => { setShowAuth(false); setAuthSuccess(""); setAuthForm({ bessId: "", password: "", name: "", capacity: "" }); }, 2000);
  };

  // Filter metrics by search
  const metrics = [
    { label: "Temperature", value: data.temperature, unit: "°C", icon: <Thermometer className="w-4 h-4 text-gray-400" /> },
    { label: "Health", value: data.health, unit: "%", icon: <Heart className="w-4 h-4 text-gray-400" /> },
    { label: "Voltage", value: data.voltage, unit: "V", icon: <Zap className="w-4 h-4 text-gray-400" /> },
    { label: "Cycles", value: data.cycles, unit: "", icon: <Battery className="w-4 h-4 text-gray-400" /> },
  ];
  const filtered = search
    ? metrics.filter((m) => m.label.toLowerCase().includes(search.toLowerCase()))
    : metrics;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Battery Energy Storage System</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time BESS telemetry and analytics</p>
        </div>
        <button
          onClick={() => { setShowAuth(true); setAuthMode("login"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
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
          placeholder="Search BESS metrics (e.g. Temperature, Voltage)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* SoC Hero */}
      <div className="p-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">State of Charge</p>
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-7xl font-bold tracking-tight text-[var(--color-status-online)]">{data.soc}</span>
          <span className="text-2xl text-gray-500">%</span>
        </div>
        <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${data.soc}%`, backgroundColor: data.soc > 20 ? 'var(--color-status-online)' : 'var(--color-status-critical)' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Status: <span className={`font-semibold ${isCharging ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <div key={m.label} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-gray-500">{m.label}</span>
              {m.icon}
            </div>
            <span className="text-2xl font-bold">{m.value}{m.unit && <span className="text-sm text-gray-500 font-normal ml-1">{m.unit}</span>}</span>
          </div>
        ))}
      </div>

      {/* SoC History Chart */}
      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">24h State of Charge History</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-status-online)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-status-online)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--foreground)' }} itemStyle={{ color: 'var(--foreground)' }} labelStyle={{ color: '#64748b', fontSize: '12px' }} />
              <Area type="monotone" dataKey="soc" name="SoC (%)" stroke="var(--color-status-online)" strokeWidth={2} fillOpacity={1} fill="url(#socGradient)" activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Login / Register Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAuth(false)}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{authMode === "login" ? "BESS Login" : "Register BESS"}</h2>
              <button onClick={() => setShowAuth(false)} className="p-1.5 rounded-full hover:bg-[var(--background)] transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
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
                    <div><label className="text-sm text-gray-500 mb-1 block">BESS Unit ID</label><input type="text" required placeholder="e.g. BESS-01" value={authForm.bessId} onChange={(e) => setAuthForm({ ...authForm, bessId: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-sm text-gray-500 mb-1 block">Password</label><input type="password" required placeholder="Enter password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  </>
                ) : (
                  <>
                    <div><label className="text-sm text-gray-500 mb-1 block">BESS Name</label><input type="text" required placeholder="e.g. Battery Unit Alpha" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-sm text-gray-500 mb-1 block">Capacity (kWh)</label><input type="text" required placeholder="e.g. 50" value={authForm.capacity} onChange={(e) => setAuthForm({ ...authForm, capacity: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-sm text-gray-500 mb-1 block">Set Password</label><input type="password" required placeholder="Create a password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  </>
                )}
                <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:opacity-90 transition-opacity mt-2">{authMode === "login" ? "Login" : "Register BESS"}</button>
                <p className="text-sm text-center text-gray-500">{authMode === "login" ? "New BESS? " : "Already registered? "}<button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-blue-500 font-medium hover:underline">{authMode === "login" ? "Register here" : "Login here"}</button></p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
