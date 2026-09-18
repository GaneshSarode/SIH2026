"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Car, BatteryCharging, Plug, ArrowUpDown, Search, Zap } from "lucide-react";
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

  // Scenario Override: Switch all "idle" EVs to "discharging"
  let sessions = data.sessions;
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
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle-to-Grid (V2G)</h1>
          <p className="text-gray-500">Bidirectional EV power flow monitoring</p>
        </div>
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
          <span className="text-4xl font-bold block">{data.connectedEVs}</span>
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
            <Link key={session.vehicleId} href="#" className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-purple-500 transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <Car className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{session.vehicleId}</h3>
                  <p className="text-sm text-gray-500">{session.vehicleName}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
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
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
