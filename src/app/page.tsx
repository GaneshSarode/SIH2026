import MetricCard from "@/components/MetricCard";
import HouseholdRow from "@/components/HouseholdRow";
import BESSWidget from "@/components/BESSWidget";
import PowerQualityWidget from "@/components/PowerQualityWidget";
import { getCapacityKW, getHouseholdReadings, getSupplyDemandSeries, getBESSData, getPowerQuality } from "@/lib/mockData";

export default function Home() {
  const capacity = getCapacityKW();
  const readings = getHouseholdReadings();
  const series = getSupplyDemandSeries();
  const bessData = getBESSData();
  const pqData = getPowerQuality();
  
  // Get latest generation/demand
  const latestData = series[series.length - 1];

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-3xl font-medium tracking-tight mb-6">System Overview</h1>
        
        {/* Top row: Core Generation Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard 
            title="Rated Capacity" 
            value={capacity} 
            unit="kW" 
          />
          <MetricCard 
            title="Current Generation" 
            value={latestData.generation} 
            unit="kW" 
          />
          <MetricCard 
            title="Current Demand" 
            value={latestData.demand} 
            unit="kW" 
          />
        </div>

        {/* Second row: Hardware Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BESSWidget data={bessData} />
          <PowerQualityWidget data={pqData} />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-medium tracking-tight">Household Supply Readings</h2>
          <span className="text-sm text-gray-500">{readings.length} connected</span>
        </div>
        <div className="flex flex-col gap-2">
          {readings.map((reading, idx) => (
            <HouseholdRow key={reading.id} reading={reading} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}
