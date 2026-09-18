"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Thermometer, Heart, Zap, Battery, Search, LogIn, X, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useDemoStore } from "@/lib/store";

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

export default function BESSDetailClient({ data: initialData, id }: { data: BESSData, id: string }) {
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ bessId: "", password: "", name: "", capacity: "" });
  const [authSuccess, setAuthSuccess] = useState("");
  
  const data = useTelemetry(initialData);
  const { activeScenario, scenarioPhase } = useDemoStore();
  
  const isCloudCover = activeScenario === "CLOUD_COVER";
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

  const metrics = [
    { label: "Temperature", value: data.temperature, unit: "°C", icon: <Thermometer className="w-4 h-4 text-gray-400" /> },
    { label: "Health", value: data.health, unit: "%", icon: <Heart className="w-4 h-4 text-gray-400" /> },
    { label: "Voltage", value: data.voltage, unit: "V", icon: <Zap className="w-4 h-4 text-gray-400" /> },
    { label: "Cycles", value: data.cycles, unit: "", icon: <Battery className="w-4 h-4 text-gray-400" /> },
  ];
  const filtered = search ? metrics.filter((m) => m.label.toLowerCase().includes(search.toLowerCase())) : metrics;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      <div className="flex items-center gap-4">
        <Link href="/bess" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Battery Energy Storage System</h1>
          <p className="text-gray-500">Real-time BESS telemetry and analytics for {id}</p>
        </div>
        <button onClick={() => { setShowAuth(true); setAuthMode("login"); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:opacity-90 transition-opacity">
          <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Portal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* HESS Logic Overlay for Demo */}
        {isCloudCover && (
          <div className="absolute inset-0 z-10 bg-black/5 rounded-2xl flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl border-2 border-[#004b87] shadow-2xl animate-in fade-in zoom-in">
              <h3 className="text-xl font-bold text-[#004b87] mb-2 flex items-center gap-2">
                <CloudRain className="w-6 h-6 text-blue-400" /> PV Generation Drop Detected
              </h3>
              {scenarioPhase === "detecting" ? (
                <p className="text-sm font-semibold text-orange-600 animate-pulse">Supercapacitor absorbing transient load...</p>
              ) : (
                <p className="text-sm font-semibold text-[#00a651]">Li-ion Battery ramping up to sustain load (HESS Active)</p>
              )}
            </div>
          </div>
        )}

        {/* Primary SoC Card */}
        <div className="lg:col-span-1 p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 opacity-5 ${isCharging ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${data.soc * 2.83} 283`} className={isCharging ? "text-green-500 transition-all duration-1000" : "text-blue-500 transition-all duration-1000"} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tight">{data.soc.toFixed(1)}%</span>
              <span className="text-sm font-medium text-gray-500">SoC</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">State of Charge</h2>
            <div className="flex items-center gap-2 justify-center">
              <div className={`w-2 h-2 rounded-full ${isCharging ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
              <span className={`text-sm font-medium ${isCharging ? 'text-green-600' : 'text-blue-600'}`}>
                {isCharging ? 'Charging' : 'Discharging'}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {filtered.map((metric, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                {metric.icon}
                <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{metric.value.toFixed(1)}</span>
                <span className="text-gray-500 font-medium">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-6">24h State of Charge History</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Area type="monotone" dataKey="soc" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSoc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}

function CloudRain(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>
}