import Link from "next/link";
import { getMicrogridById, getHomesForMicrogrid, getSupplyDemandSeries, getPowerQuality, getSecurityStatus } from "@/lib/mockData";
import { ArrowLeft, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import PowerQualityWidget from "@/components/PowerQualityWidget";
import SecurityWidget from "@/components/SecurityWidget";
import SupplyDemandChart from "@/components/SupplyDemandChart";

export default async function MicrogridDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const microgrid = await getMicrogridById(id);
  const homes = await getHomesForMicrogrid(id);
  const series = await getSupplyDemandSeries(id);
  const pqData = await getPowerQuality();
  const securityData = await getSecurityStatus();

  if (!microgrid) {
    return <div className="text-center py-20 text-gray-500">Microgrid not found.</div>;
  }

  const latestData = series[series.length - 1];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/microgrids" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{microgrid.id} — {microgrid.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{microgrid.location}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Rated Capacity" value={microgrid.capacity_kw} unit="kW" />
        <MetricCard title="Current Generation" value={latestData.generation} unit="kW" />
        <MetricCard title="Current Demand" value={latestData.demand} unit="kW" />
      </div>

      {/* Supply & Demand Chart */}
      <SupplyDemandChart data={series} />

      {/* Power Quality & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PowerQualityWidget data={pqData} />
        <SecurityWidget data={securityData} />
      </div>

      {/* Homes List */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Homes</h2>
          <span className="text-sm text-gray-500">{homes.length} connected</span>
        </div>
        <div className="flex flex-col gap-3">
          {homes.map((home) => {
            const isOnline = home.status === "online";
            return (
              <Link
                key={home.id}
                href={`/microgrids/${id}/${home.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-status-online)] hover:bg-[var(--background)] transition-all group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-lg font-semibold group-hover:text-[var(--color-status-online)] transition-colors">{home.id}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Usage</span>
                    <span className="font-semibold">{home.kwh_today.toFixed(1)} <span className="text-gray-500 text-sm font-normal">kWh</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />
                    )}
                    <span className={`text-sm font-medium ${isOnline ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
                      {isOnline ? 'Online' : 'Low Output'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-status-online)] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
