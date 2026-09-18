"use client";
import { PowerQuality } from '@/lib/mockData';
import { Zap, ActivitySquare, Waves, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useDemoStore } from '@/lib/store';

export default function PowerQualityWidget({ data: initialData }: { data: PowerQuality }) {
  const data = useTelemetry(initialData);
  const { activeScenario, scenarioPhase } = useDemoStore();
  
  const isSag = activeScenario === "VOLTAGE_SAG";
  const isRecovering = isSag && scenarioPhase === "responding";

  return (
    <div className="flex flex-col p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Power Quality (Grid-Tie)</h3>
        {isSag && scenarioPhase === "detecting" ? (
          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 font-bold border border-red-200 animate-pulse flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> FAULT DETECTED</span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-600 font-bold border border-green-200">IEEE 519 Compliant</span>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Voltage</span>
          </div>
          <span className={`font-mono text-lg font-bold tracking-tight ${data.voltage < 200 ? 'text-red-500' : 'text-[#004b87]'}`}>
            {data.voltage.toFixed(1)} <span className="text-sm text-gray-500 font-normal">V</span>
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-3">
            <ActivitySquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Frequency</span>
          </div>
          <span className="font-mono text-lg font-bold text-[#004b87] tracking-tight">{data.frequency.toFixed(2)} <span className="text-sm text-gray-500 font-normal">Hz</span></span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Waves className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">THD (Harmonics)</span>
          </div>
          <span className={`font-mono text-lg font-bold tracking-tight ${data.thd > 5 ? 'text-red-500' : 'text-[#004b87]'}`}>
            {data.thd.toFixed(1)} <span className="text-sm text-gray-500 font-normal">%</span>
          </span>
        </div>
      </div>

      {/* STATCOM Overlay */}
      {isRecovering && (
        <div className="absolute inset-0 bg-blue-50/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 border-2 border-blue-400 rounded-lg">
          <ActivitySquare className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <span className="font-bold text-blue-800 text-sm mb-1">STATCOM ACTIVE</span>
          <span className="text-xs text-blue-600 font-medium">Injecting Compensating Voltage...</span>
        </div>
      )}
    </div>
  );
}
