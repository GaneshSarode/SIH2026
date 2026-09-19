"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Activity, CheckCircle2, AlertTriangle, LogIn, X, ArrowRight } from "lucide-react";
import { HomeReading } from "@/lib/mockData";
import { useDemoStore } from "@/lib/store";

export default function HomesListClient({ homes, microgridId }: { homes: HomeReading[], microgridId: string }) {
  const [search, setSearch] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ homeId: "", password: "", name: "" });
  const [authSuccess, setAuthSuccess] = useState("");
  const { activeScenario, scenarioPhase } = useDemoStore();

  const isTheft = activeScenario === "POWER_THEFT";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      setAuthSuccess(`Logged in to home ${authForm.homeId} successfully`);
    } else {
      setAuthSuccess(`Home "${authForm.name}" registered successfully`);
    }
    setTimeout(() => { setShowAuth(false); setAuthSuccess(""); setAuthForm({ homeId: "", password: "", name: "" }); }, 2000);
  };

  const filtered = homes.filter((home) => home.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Homes</h2>
          <span className="text-sm text-gray-500">{homes.length} connected</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No homes found matching "{search}"</div>
        ) : (
          filtered.map((home, index) => {
            // Apply theft scenario to the first home in the list
            const isTargetHome = index === 0 && isTheft && (scenarioPhase === "detecting" || scenarioPhase === "responding");
            const loadVal = isTargetHome ? "142.5" : (home.kwh_today / 2).toFixed(1); // Spike the load if theft
            const isOnline = home.status === "online" && !isTargetHome;

            return (
              <Link
                key={home.id}
                href={`/microgrids/${microgridId}/${home.id}`}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isTargetHome 
                    ? "bg-red-50 border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-status-online)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${isTargetHome ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600"}`}>
                    {isTargetHome ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold group-hover:text-[var(--color-status-online)] transition-colors">{home.id}</span>
                    <span className={`text-xs ${isTargetHome ? "text-red-500 font-bold uppercase tracking-widest" : "text-gray-500"}`}>
                      {isTargetHome ? "POWER THEFT DETECTED" : "Usage"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className={`font-mono text-lg font-bold tracking-tight ${isTargetHome ? "text-red-600" : ""}`}>
                      {loadVal} <span className="text-sm font-normal text-gray-500">kW</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 w-16 md:w-20 justify-end">
                    {isTargetHome ? (
                      <span className="text-xs font-medium text-red-600 px-2 py-1 bg-red-100 rounded-md">Critical</span>
                    ) : isOnline ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
                        <span className="text-xs font-medium text-[var(--color-status-online)] hidden md:inline">Online</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />
                        <span className="text-xs font-medium text-[var(--color-status-warning)] hidden md:inline">Low</span>
                      </>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-status-online)] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
