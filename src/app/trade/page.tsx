"use client";
import Link from "next/link";
import { ArrowLeft, Globe, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { getTradeData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default async function TradePage() {
  const data = await getTradeData();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">International Power Trade</h1>
          <p className="text-gray-500 dark:text-gray-400">Cross-border energy exchange analytics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Total Import</span>
            <TrendingDown className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold">{data.totalImport}<span className="text-sm text-gray-500 font-normal ml-1">MWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Total Export</span>
            <TrendingUp className="w-4 h-4 text-[var(--color-status-online)]" />
          </div>
          <span className="text-2xl font-bold">{data.totalExport}<span className="text-sm text-gray-500 font-normal ml-1">MWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Trade Balance</span>
            <ArrowUpDown className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-[var(--color-status-online)]">+{data.tradeBalance}<span className="text-sm text-gray-500 font-normal ml-1">MWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Avg Price</span>
            <Globe className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">₹{data.avgPrice}<span className="text-sm text-gray-500 font-normal ml-1">/kWh</span></span>
        </div>
      </div>

      {/* Trade History Chart */}
      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Monthly Trade Volume</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: '#64748b', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px' }} iconType="circle" />
              <Bar dataKey="imports" name="Imports (MWh)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exports" name="Exports (MWh)" fill="var(--color-status-online)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade Partners */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Trade Partners</h2>
        <div className="flex flex-col gap-3">
          {data.partners.map((partner) => {
            const isExport = partner.direction === "export";
            return (
              <div
                key={partner.country}
                className="flex items-center justify-between p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${isExport ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{partner.country}</p>
                    <p className="text-sm text-gray-500 capitalize">{partner.direction}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="font-semibold">{partner.volume} MWh</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">₹{partner.pricePerUnit}/kWh</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${partner.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : partner.status === 'scheduled' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
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
