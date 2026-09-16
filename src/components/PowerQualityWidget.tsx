import { PowerQuality } from '@/lib/mockData';
import { Zap, ActivitySquare, Waves } from 'lucide-react';

export default function PowerQualityWidget({ data }: { data: PowerQuality }) {
  // A sleek monospaced widget for engineering telemetry
  return (
    <div className="flex flex-col p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-gray-400">Power Quality (Grid-Tie)</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50">Synced</span>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-300">Voltage</span>
          </div>
          <span className="font-mono text-lg font-medium tracking-tight">{data.voltage.toFixed(1)} <span className="text-sm text-gray-500">V</span></span>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-3">
            <ActivitySquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-300">Frequency</span>
          </div>
          <span className="font-mono text-lg font-medium tracking-tight">{data.frequency.toFixed(2)} <span className="text-sm text-gray-500">Hz</span></span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Waves className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-300">THD (Harmonics)</span>
          </div>
          <span className="font-mono text-lg font-medium tracking-tight">{data.thd.toFixed(1)} <span className="text-sm text-gray-500">%</span></span>
        </div>
      </div>
    </div>
  );
}
