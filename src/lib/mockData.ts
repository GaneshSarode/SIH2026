/**
 * mockData.ts
 * 
 * NOTE: These functions currently return realistic fake data for the GridWatch demo.
 * Later, you can swap these with actual Supabase client calls.
 * 
 * For example, getHouseholdReadings() will become:
 * const { data } = await supabase.from('households').select('*');
 * return data;
 */

export interface HouseholdReading {
  id: string;
  name?: string;
  kWhToday: number;
  status: "online" | "low";
}

export function getHouseholdReadings(): HouseholdReading[] {
  // TODO: Replace with `supabase.from('households').select('*')`
  return [
    { id: "H1", kWhToday: 18.4, status: "online" },
    { id: "H2", kWhToday: 15.9, status: "online" },
    { id: "H3", kWhToday: 9.2, status: "low" },
    { id: "H4", kWhToday: 12.1, status: "online" },
  ];
}

export interface SupplyDemandPoint {
  time: string;
  generation: number;
  demand: number;
}

export function getSupplyDemandSeries(): SupplyDemandPoint[] {
  // TODO: Replace with aggregate query on `readings` table by hour
  const data: SupplyDemandPoint[] = [];
  for (let i = 0; i <= 24; i += 2) {
    const hourString = `${i.toString().padStart(2, '0')}:00`;
    // Base generation follows a solar curve (peaks around noon)
    let generation = 0;
    if (i > 6 && i < 18) {
      generation = Math.max(0, 80 * Math.sin(((i - 6) / 12) * Math.PI)) + Math.random() * 10;
    }
    // Base demand has morning and evening peaks
    let demand = 20 + Math.random() * 10;
    if (i >= 7 && i <= 9) demand += 30;
    if (i >= 18 && i <= 21) demand += 40;

    data.push({
      time: hourString,
      generation: Math.round(generation),
      demand: Math.round(demand),
    });
  }
  return data;
}

export function getSourceMix(): { solarPct: number; windPct: number } {
  // TODO: Replace with DB aggregation logic depending on installed capacities
  return {
    solarPct: 74,
    windPct: 26,
  };
}

export interface Alert {
  id: string;
  household_id?: string;
  message: string;
  detail: string;
  severity: "warning" | "critical";
  timeAgo: string;
}

export function getAlerts(): Alert[] {
  // TODO: Replace with `supabase.from('alerts').select('*').eq('acknowledged', false)`
  return [
    {
      id: "alert-1",
      household_id: "H3",
      message: "Abnormal Low Output",
      detail: "Generation at H3 has dropped below 10% of expected output for over 15 minutes.",
      severity: "warning",
      timeAgo: "12m ago"
    },
    {
      id: "alert-2",
      message: "Main Inverter Voltage Spike",
      detail: "Grid voltage exceeded 250V briefly during low load period. Potential risk to sensitive equipment.",
      severity: "critical",
      timeAgo: "1h ago"
    },
    {
      id: "alert-3",
      message: "Peak Demand Approaching Capacity",
      detail: "Overall demand is at 85% of rated system capacity.",
      severity: "warning",
      timeAgo: "3h ago"
    }
  ];
}

export function getCapacityKW(): number {
  return 100;
}

// ---- BESS & Power Quality ----

export interface BESSData {
  soc: number;
  temperature: number;
  status: "charging" | "discharging" | "idle";
  health: number;
}

export function getBESSData(): BESSData {
  // TODO: Replace with query to BESS telemetry table
  return {
    soc: 78,
    temperature: 34.2,
    status: "charging",
    health: 91,
  };
}

export interface PowerQuality {
  voltage: number;
  frequency: number;
  thd: number;
}

export function getPowerQuality(): PowerQuality {
  // TODO: Replace with query to power quality telemetry table
  return {
    voltage: 231.5,
    frequency: 50.02,
    thd: 2.1,
  };
}

// ---- Node Details & Cybersecurity ----

export interface NodeTelemetry {
  voltage: number;
  current: number;
  power: number;
  history: { time: string; consumption: number }[];
}

export function getNodeDetails(id: string): NodeTelemetry {
  // TODO: Replace with query fetching specific household telemetry from readings table
  // Generating a realistic mock curve for a single household
  const history = [];
  for (let i = 0; i <= 24; i += 2) {
    const hourString = `${i.toString().padStart(2, '0')}:00`;
    let consumption = Math.random() * 0.5 + 0.1; // base load
    if (i >= 7 && i <= 9) consumption += 1.5; // morning peak
    if (i >= 18 && i <= 22) consumption += 2.5; // evening peak
    history.push({ time: hourString, consumption: Number(consumption.toFixed(2)) });
  }

  return {
    voltage: id === 'H3' ? 215.2 : 229.8,
    current: id === 'H3' ? 2.1 : 6.4,
    power: id === 'H3' ? 0.45 : 1.47,
    history
  };
}

export interface SecurityStatus {
  encrypted: boolean;
  activeNodes: number;
  unauthorizedAttempts: number;
  lastAudit: string;
}

export function getSecurityStatus(): SecurityStatus {
  // TODO: Replace with real auth/security log aggregation
  return {
    encrypted: true,
    activeNodes: 4,
    unauthorizedAttempts: 0,
    lastAudit: "2 mins ago"
  };
}
