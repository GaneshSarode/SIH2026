"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, IndianRupee, AlertTriangle, TrendingUp, Settings, Save, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Mock 24h price data
const generatePriceHistory = () => {
  const data = [];
  for (let i = 0; i <= 24; i += 1) {
    let price = 4.0;
    if (i >= 6 && i <= 9) price = 6.5 + Math.random() * 1.5; // Morning peak
    else if (i >= 18 && i <= 22) price = 7.0 + Math.random() * 2; // Evening peak
    else if (i >= 0 && i <= 5) price = 2.5 + Math.random() * 0.5; // Off-peak night
    else price = 4.0 + Math.random() * 1; // Normal
    data.push({ time: `${i.toString().padStart(2, '0')}:00`, price: Number(price.toFixed(2)) });
  }
  return data;
};

export default function DynamicPricingPage() {
  const [priceHistory] = useState(generatePriceHistory);
  const [manualPrice, setManualPrice] = useState("5.00");
  const [threshold, setThreshold] = useState("7.00");
  const [saved, setSaved] = useState(false);

  const currentPrice = priceHistory[new Date().getHours()] || priceHistory[12];
  const avgPrice = (priceHistory.reduce((s, d) => s + d.price, 0) / priceHistory.length).toFixed(2);
  const peakPrice = Math.max(...priceHistory.map((d) => d.price)).toFixed(2);
  const offPeakPrice = Math.min(...priceHistory.map((d) => d.price)).toFixed(2);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing</h1>
          <p className="text-gray-500 dark:text-gray-400">Electricity pricing management and threshold alerts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Current Price</span>
            <IndianRupee className="w-4 h-4 text-[var(--color-status-online)]" />
          </div>
          <span className="text-2xl font-bold text-[var(--color-status-online)]">₹{currentPrice.price}<span className="text-sm text-gray-500 font-normal ml-1">/kWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Average Price</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold">₹{avgPrice}<span className="text-sm text-gray-500 font-normal ml-1">/kWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Peak Price</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-500">₹{peakPrice}<span className="text-sm text-gray-500 font-normal ml-1">/kWh</span></span>
        </div>
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Off-Peak</span>
            <IndianRupee className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-bold">₹{offPeakPrice}<span className="text-sm text-gray-500 font-normal ml-1">/kWh</span></span>
        </div>
      </div>

      {/* Price Chart with Threshold Line */}
      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">24h Price Curve</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: '#64748b', fontSize: '12px' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`₹${value}/kWh`, "Price"]}
              />
              <ReferenceLine y={Number(threshold)} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} label={{ value: `Threshold ₹${threshold}`, position: "right", fill: "#ef4444", fontSize: 12 }} />
              <ReferenceLine y={Number(manualPrice)} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Manual ₹${manualPrice}`, position: "left", fill: "#3b82f6", fontSize: 12 }} />
              <Line type="monotone" dataKey="price" stroke="var(--color-status-online)" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manual Price & Threshold Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Set Manual Price */}
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Set Electricity Price</h3>
              <p className="text-sm text-gray-500">Manually override the current price</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">Price (₹/kWh)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">/kWh</span>
              </div>
            </div>
            <div className="flex gap-2">
              {["3.00", "5.00", "7.50", "10.00"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setManualPrice(preset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${manualPrice === preset ? 'bg-blue-500 text-white border-blue-500' : 'bg-[var(--background)] border-[var(--color-border)] text-gray-500 hover:border-blue-500'}`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Set Threshold */}
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Price Threshold</h3>
              <p className="text-sm text-gray-500">Get alerts when price exceeds this value</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1.5 block">Threshold (₹/kWh)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 rounded-lg bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">/kWh</span>
              </div>
            </div>
            <div className="flex gap-2">
              {["5.00", "7.00", "8.50", "12.00"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setThreshold(preset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${threshold === preset ? 'bg-red-500 text-white border-red-500' : 'bg-[var(--background)] border-[var(--color-border)] text-gray-500 hover:border-red-500'}`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${saved ? 'bg-[var(--color-status-online)] text-white' : 'bg-[var(--color-status-online)] text-white hover:opacity-90'}`}
        >
          {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Settings</>}
        </button>
      </div>

      {/* Alert Status */}
      {Number(currentPrice.price) > Number(threshold) && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">Price Alert!</p>
            <p className="text-sm text-red-600 dark:text-red-400/80">Current price (₹{currentPrice.price}/kWh) exceeds your threshold (₹{threshold}/kWh). Consider shifting non-essential loads or using stored battery energy.</p>
          </div>
        </div>
      )}
    </div>
  );
}
