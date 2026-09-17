"use client";
import Link from "next/link";
import { ArrowLeft, Activity, Thermometer, Heart, Zap, Battery } from "lucide-react";
import { getBESSData } from "@/lib/mockData";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BESSPage() {
  const data = getBESSData();
  const isCharging = data.status === "charging";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Battery Energy Storage System</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time BESS telemetry and analytics</p>
        </div>
      </div>

      {/* SoC Hero */}
      <div className="p-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">State of Charge</p>
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-7xl font-bold tracking-tight text-[var(--color-status-online)]">{data.soc}</span>
          <span className="text-2xl text-gray-500">%</span>
        </div>
        <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{
              width: `${data.soc}%`,
              backgroundColor: data.soc > 20 ? 'var(--color-status-online)' : 'var(--color-status-critical)',
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Status: <span className={`font-semibold ${isCharging ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Temperature</span>
            <Thermometer className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">{data.temperature}<span className="text-sm text-gray-500 font-normal ml-1">°C</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Health</span>
            <Heart className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">{data.health}<span className="text-sm text-gray-500 font-normal ml-1">%</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Voltage</span>
            <Zap className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">{data.voltage}<span className="text-sm text-gray-500 font-normal ml-1">V</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Cycles</span>
            <Battery className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">{data.cycles}</span>
        </div>
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
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: '#64748b', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="soc" name="SoC (%)" stroke="var(--color-status-online)" strokeWidth={2} fillOpacity={1} fill="url(#socGradient)" activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
