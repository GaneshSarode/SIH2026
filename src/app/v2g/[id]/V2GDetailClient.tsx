"use client";
import Link from "next/link";
import { ArrowLeft, Car, Battery, Zap, Activity, Thermometer, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EVTelemetry } from "@/lib/mockData";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function V2GDetailClient({ initialData }: { initialData: EVTelemetry }) {
  const data = useTelemetry(initialData);

  const isCharging = data.mode === "charging";
  const isDischarging = data.mode === "discharging";
  const isIdle = data.mode === "idle";

  const metrics = [
    { label: "Battery Health", value: data.soh, unit: "%", icon: <Activity className="w-4 h-4 text-gray-400" /> },
    { label: "Voltage", value: data.voltage, unit: "V", icon: <Zap className="w-4 h-4 text-gray-400" /> },
    { label: "Current", value: data.current, unit: "A", icon: <Activity className="w-4 h-4 text-gray-400" /> },
    { label: "Temperature", value: data.temperature, unit: "°C", icon: <Thermometer className="w-4 h-4 text-gray-400" /> },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      <div className="flex items-center gap-4">
        <Link href="/v2g" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{data.vehicleId} Dashboard</h1>
          <p className="text-gray-500">{data.vehicleName} - Vehicle-to-Grid Telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Primary SoC Card */}
        <div className="lg:col-span-1 p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 opacity-5 ${isCharging ? 'bg-blue-500' : isDischarging ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${data.soc * 2.83} 283`} className={isCharging ? "text-blue-500 transition-all duration-1000" : isDischarging ? "text-green-500 transition-all duration-1000" : "text-gray-500 transition-all duration-1000"} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tight">{data.soc.toFixed(1)}%</span>
              <span className="text-sm font-medium text-gray-500">SoC</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Status: {data.mode.charAt(0).toUpperCase() + data.mode.slice(1)}</h2>
            <div className="flex items-center gap-2 justify-center">
              <span className="font-mono font-bold text-lg">{data.powerFlow.toFixed(1)} kW</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
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
          
          <div className="col-span-2 p-6 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-purple-900">Next Trip Departure</p>
                    <h4 className="text-xl font-bold text-purple-950">{data.departureTime}</h4>
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-medium text-purple-900">Required SoC</p>
                <h4 className="text-xl font-bold text-purple-950">{data.targetSoC}%</h4>
             </div>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-6">24h V2G Power Flow (kW)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                formatter={(value: any) => [`${value} kW`, 'Power Flow']}
              />
              <Area type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
