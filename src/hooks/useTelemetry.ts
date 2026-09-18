import { useState, useEffect } from 'react';
import { useDemoStore } from '@/lib/store';

// Helper to add random jitter (e.g. +/- 1%)
const addJitter = (value: number, percent: number) => {
  const jitter = value * (percent / 100) * (Math.random() * 2 - 1);
  return Number((value + jitter).toFixed(2));
};

export function useTelemetry<T extends Record<string, any>>(initialData: T): T {
  const [data, setData] = useState<T>(initialData);
  const { activeScenario, scenarioPhase } = useDemoStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = { ...prev };
        
        // Apply normal random jitter to all numeric fields
        const excludedKeys = ['connectedEVs', 'home_count', 'capacity', 'capacity_kw', 'cycles', 'activeNodes', 'totalCapacity', 'targetSoC'];
        for (const key in newData) {
          if (typeof newData[key] === 'number' && !excludedKeys.includes(key)) {
            if (key === 'soc' || key === 'health' || key === 'thd') {
              newData[key] = Math.max(0, Math.min(100, addJitter(newData[key] as number, 1))) as any;
            } else {
              newData[key] = addJitter(newData[key] as number, 0.5) as any;
            }
          }
        }

        // --- SCENARIO OVERRIDES ---
        const mutData = newData as any;
        
        // 1. VOLTAGE SAG
        if (activeScenario === "VOLTAGE_SAG") {
          if ('voltage' in mutData && 'thd' in mutData) {
            if (scenarioPhase === "detecting") {
              mutData['voltage'] = (160 + Math.random() * 5); 
              mutData['thd'] = (11.4 + Math.random() * 1);    
            } else if (scenarioPhase === "responding") {
              mutData['voltage'] = (215 + Math.random() * 10); 
              mutData['thd'] = (5.2 + Math.random() * 1);      
            } else if (scenarioPhase === "resolved") {
              mutData['voltage'] = (230 + Math.random() * 2);  
              mutData['thd'] = (2.1 + Math.random() * 0.5);    
            }
          }
        }
        
        // 2. CLOUD COVER
        if (activeScenario === "CLOUD_COVER") {
          if ('current_generation' in mutData) {
            if (scenarioPhase === "detecting") {
              mutData['current_generation'] = (Number((initialData as any)['current_generation']) * 0.2); 
            } else if (scenarioPhase === "responding" || scenarioPhase === "resolved") {
              mutData['current_generation'] = (Number((initialData as any)['current_generation']) * 0.25); 
            }
          }
        }
        
        return mutData as T;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialData, activeScenario, scenarioPhase]);

  return data;
}
