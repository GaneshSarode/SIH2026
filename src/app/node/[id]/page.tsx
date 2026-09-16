import { getNodeDetails } from "@/lib/mockData";
import { ArrowLeft, Zap, Cable } from "lucide-react";
import Link from "next/link";
import NodeChart from "./NodeChart";

export default async function NodeDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getNodeDetails(id);
  const isLow = data.voltage < 220; // Example mock logic for styling
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm hover:shadow-md">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Node {id}</h1>
          <p className="text-gray-400">Live household telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">Voltage</span>
            <Cable className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-semibold tracking-tight ${isLow ? 'text-[var(--color-status-warning)]' : ''}`}>{data.voltage}</span>
            <span className="text-gray-500">V</span>
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">Current</span>
            <Zap className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">{data.current}</span>
            <span className="text-gray-500">A</span>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">Real Power</span>
            <Zap className="w-4 h-4 text-[var(--color-status-online)]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">{data.power}</span>
            <span className="text-gray-500">kW</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <h3 className="text-lg font-medium mb-4">24h Consumption Profile</h3>
        <NodeChart history={data.history} />
      </div>
    </div>
  );
}
