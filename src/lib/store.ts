import { create } from 'zustand';

export type Scenario = "NONE" | "VOLTAGE_SAG" | "CLOUD_COVER" | "POWER_THEFT" | "EV_RESPONSE";

interface DemoState {
  activeScenario: Scenario;
  scenarioPhase: "idle" | "detecting" | "responding" | "resolved";
  triggerScenario: (scenario: Scenario) => void;
  resetScenario: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  activeScenario: "NONE",
  scenarioPhase: "idle",
  
  triggerScenario: (scenario) => {
    set({ activeScenario: scenario, scenarioPhase: "detecting" });
    
    // Simulate the lifecycle of a scenario
    setTimeout(() => {
      set((state) => state.activeScenario === scenario ? { ...state, scenarioPhase: "responding" } : state);
    }, 2500);
    
    setTimeout(() => {
      set((state) => state.activeScenario === scenario ? { ...state, scenarioPhase: "resolved" } : state);
    }, 7000);
    
    // Auto-reset
    setTimeout(() => {
      set((state) => state.activeScenario === scenario ? { ...state, activeScenario: "NONE", scenarioPhase: "idle" } : state);
    }, 12000);
  },
  
  resetScenario: () => set({ activeScenario: "NONE", scenarioPhase: "idle" })
}));
