"use client";
import Link from "next/link";
import { ArrowLeft, Car, BatteryCharging, Plug, ArrowUpDown } from "lucide-react";
import { getV2GData } from "@/lib/mockData";

export default async function V2GPage() {
  const data = await getV2GData();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle-to-Grid (V2G)</h1>
          <p className="text-gray-500 dark:text-gray-400">Bidirectional EV power flow monitoring</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <Car className="w-8 h-8 mx-auto mb-3 text-purple-500" />
          <span className="text-4xl font-bold block">{data.connectedEVs}</span>
          <span className="text-sm text-gray-500 mt-1 block">Connected EVs</span>
        </div>
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <BatteryCharging className="w-8 h-8 mx-auto mb-3 text-purple-500" />
          <span className="text-4xl font-bold block">{data.totalCapacity}</span>
          <span className="text-sm text-gray-500 mt-1 block">kWh Total Capacity</span>
        </div>
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
          <ArrowUpDown className="w-8 h-8 mx-auto mb-3 text-[var(--color-status-online)]" />
          <span className="text-4xl font-bold text-[var(--color-status-online)] block">{data.netFlowToGrid}</span>
          <span className="text-sm text-gray-500 mt-1 block">kW Net to Grid</span>
        </div>
      </div>

      {/* Active Sessions */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Active Sessions</h2>
        <div className="flex flex-col gap-3">
          {data.sessions.map((session) => {
            const isDischarging = session.mode === "discharging";
            const isCharging = session.mode === "charging";
            return (
              <div
                key={session.vehicleId}
                className="flex items-center justify-between p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-2.5 rounded-lg ${isDischarging ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : isCharging ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    <Plug className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{session.vehicleName}</p>
                    <p className="text-sm text-gray-500">{session.vehicleId} · Connected since {session.connectedSince}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Battery</p>
                    <p className="font-semibold">{session.batteryLevel}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Power</p>
                    <p className={`font-semibold ${isDischarging ? 'text-[var(--color-status-online)]' : isCharging ? 'text-blue-500' : 'text-gray-500'}`}>
                      {isDischarging ? '+' : isCharging ? '-' : ''}{session.powerFlow} kW
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDischarging ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : isCharging ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
