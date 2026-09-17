import { getHomeTelemetry } from "@/lib/mockData";
import { ArrowLeft, Zap, Cable, Thermometer } from "lucide-react";
import Link from "next/link";
import HomeChart from "./HomeChart";

export default async function HomeDetail({ params }: { params: Promise<{ id: string; homeId: string }> }) {
  const { id, homeId } = await params;
  const data = await getHomeTelemetry(id, homeId);
  const isLow = data.voltage < 220;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href={`/microgrids/${id}`} className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{id} → {homeId}</h1>
          <p className="text-gray-500 dark:text-gray-400">Live household sensor telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Voltage</span>
            <Cable className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold tracking-tight ${isLow ? 'text-[var(--color-status-warning)]' : ''}`}>{data.voltage}</span>
            <span className="text-gray-500 text-sm">V</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Current</span>
            <Zap className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">{data.current}</span>
            <span className="text-gray-500 text-sm">A</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Temperature</span>
            <Thermometer className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold tracking-tight ${data.temperature > 40 ? 'text-[var(--color-status-critical)]' : ''}`}>{data.temperature}</span>
            <span className="text-gray-500 text-sm">°C</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-gray-500">Real Power</span>
            <Zap className="w-4 h-4 text-[var(--color-status-online)]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-[var(--color-status-online)]">{data.power}</span>
            <span className="text-gray-500 text-sm">kW</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-4">24h Consumption Profile</h3>
        <HomeChart history={data.history} />
      </div>
    </div>
  );
}
