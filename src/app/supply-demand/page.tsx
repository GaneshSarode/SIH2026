import SupplyDemandChart from "@/components/SupplyDemandChart";
import MetricCard from "@/components/MetricCard";
import { getSupplyDemandSeries, getSourceMix } from "@/lib/mockData";

export default function SupplyDemandPage() {
  const series = getSupplyDemandSeries();
  const mix = getSourceMix();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-medium tracking-tight mb-2">Supply & Demand</h1>
        <p className="text-gray-400">24-hour generation vs. consumption profile</p>
      </div>
      
      <SupplyDemandChart data={series} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
        <MetricCard 
          title="Solar Contribution" 
          value={mix.solarPct} 
          unit="%" 
          description="Percentage of total generation"
        />
        <MetricCard 
          title="Wind Contribution" 
          value={mix.windPct} 
          unit="%" 
          description="Percentage of total generation"
        />
      </div>
    </div>
  );
}
