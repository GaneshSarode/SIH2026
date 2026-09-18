"use client";
import { useDemoStore, Scenario } from '@/lib/store';
import { Activity, CloudRain, ShieldAlert, Zap, X } from 'lucide-react';
import { useState } from 'react';

export default function DemoControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeScenario, triggerScenario, resetScenario } = useDemoStore();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <Activity className="w-6 h-6 text-[#00a651]" />
      </button>
    );
  }

  const buttons = [
    { id: "VOLTAGE_SAG", label: "Voltage Sag", icon: <Activity className="w-4 h-4" /> },
    { id: "CLOUD_COVER", label: "Cloud Cover", icon: <CloudRain className="w-4 h-4" /> },
    { id: "POWER_THEFT", label: "Power Theft", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "EV_RESPONSE", label: "EV Fleet Grid Support", icon: <Zap className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-white border border-gray-200 rounded-xl shadow-2xl w-80 overflow-hidden">
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <span className="font-bold text-sm tracking-widest uppercase">Demo Scenarios</span>
        <button onClick={() => setIsOpen(false)} className="hover:text-red-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {buttons.map(btn => (
          <button
            key={btn.id}
            onClick={() => triggerScenario(btn.id as Scenario)}
            disabled={activeScenario !== "NONE"}
            className={`flex items-center gap-2 p-2 rounded-lg text-sm font-semibold transition-all ${
              activeScenario === btn.id 
                ? "bg-[#00a651] text-white animate-pulse"
                : activeScenario !== "NONE"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {btn.icon}
            {activeScenario === btn.id ? "Running..." : btn.label}
          </button>
        ))}
        {activeScenario !== "NONE" && (
          <button 
            onClick={resetScenario}
            className="mt-2 text-xs text-red-500 font-bold uppercase hover:underline text-center w-full"
          >
            Reset Event
          </button>
        )}
      </div>
    </div>
  );
}
