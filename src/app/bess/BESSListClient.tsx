"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Battery, Search, Activity, CheckCircle2, ArrowRight } from "lucide-react";

export default function BESSListClient() {
  const [search, setSearch] = useState("");

  const units = [
    { id: "BESS-Alpha", location: "Sector 4 Data Center", capacity: 500, status: "online" },
    { id: "BESS-Beta", location: "Industrial Park A", capacity: 1200, status: "online" },
    { id: "BESS-Gamma", location: "Residential Grid 1", capacity: 250, status: "online" },
  ];

  const filtered = units.filter(
    (u) =>
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">BESS Units</h1>
          <p className="text-gray-500">Select a Battery Energy Storage System to monitor</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No BESS units found matching &quot;{search}&quot;
          </div>
        ) : (
          filtered.map((unit) => (
            <Link
              key={unit.id}
              href={`/bess/${unit.id}`}
              className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
                  <Battery className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
                  <span className="text-xs font-medium text-[var(--color-status-online)]">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">{unit.id}</h3>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-500 mb-4">{unit.location}</p>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{unit.capacity} <span className="text-sm font-normal text-gray-500">kWh</span></span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Capacity</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
