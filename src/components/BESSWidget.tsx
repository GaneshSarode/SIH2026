import { BESSData } from '@/lib/mockData';
import { Battery, BatteryCharging, Thermometer, Activity } from 'lucide-react';

export default function BESSWidget({ data }: { data: BESSData }) {
  const isCharging = data.status === 'charging';
  
  return (
    <div className="flex flex-col p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-gray-400">Battery System (BESS)</h3>
        {isCharging ? (
          <BatteryCharging className="w-5 h-5 text-[var(--color-status-online)]" />
        ) : (
          <Battery className="w-5 h-5 text-[var(--color-status-warning)]" />
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-4xl font-semibold tracking-tight">{data.soc}</span>
        <span className="text-gray-500 font-medium">%</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-[#0b0f19] rounded-full h-2.5 mb-6 overflow-hidden">
        <div 
          className="h-2.5 rounded-full transition-all duration-1000 ease-in-out" 
          style={{ 
            width: `${data.soc}%`,
            backgroundColor: data.soc > 20 ? 'var(--color-status-online)' : 'var(--color-status-critical)'
          }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Temp</span>
            <span className="text-sm font-medium">{data.temperature}°C</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Health</span>
            <span className="text-sm font-medium">{data.health}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
