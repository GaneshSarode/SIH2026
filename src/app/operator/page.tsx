"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import AlertCard from "@/components/AlertCard";
import SecurityWidget from "@/components/SecurityWidget";
import { getAlerts, getSecurityStatus } from "@/lib/mockData";
import { useState } from "react";
import { Power, PowerOff } from "lucide-react";

export default function OperatorDashboard() {
  const alerts = getAlerts();
  const securityData = getSecurityStatus();
  const [loadShedding, setLoadShedding] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Operator Console</h1>
            <p className="text-gray-400">Manage grid anomalies and load distribution.</p>
          </div>
          <button
            onClick={() => setLoadShedding(!loadShedding)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md ${
              loadShedding 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-gray-50'
            }`}
          >
            {loadShedding ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            {loadShedding ? 'Restore Non-Critical Load' : 'Shed Non-Critical Load'}
          </button>
        </div>
        
        {/* Cybersecurity Status Widget */}
        <SecurityWidget data={securityData} />

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-medium tracking-tight">Active Alerts</h2>
            <span className="text-sm font-medium text-[var(--color-status-warning)]">{alerts.length} unresolved</span>
          </div>
          
          {alerts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {alerts.map((alert, idx) => (
                <AlertCard key={alert.id} alert={alert} index={idx} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border border-dashed border-[var(--color-border)] rounded-lg">
              No active alerts. Grid is operating normally.
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
