import Link from "next/link";
import { getMicrogridById, getHomesForMicrogrid, getSupplyDemandSeries, getPowerQuality, getSecurityStatus } from "@/lib/mockData";
import { ArrowLeft } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import PowerQualityWidget from "@/components/PowerQualityWidget";
import SecurityWidget from "@/components/SecurityWidget";
import SupplyDemandChart from "@/components/SupplyDemandChart";
import HomesListClient from "./HomesListClient";

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
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 w-full py-8">
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
      <HomesListClient homes={homes} microgridId={id} />
    </div>
  );
}
