/**
 * mockData.ts -> supabaseData.ts
 * 
 * Central data layer for GridWatch.
 * Fetches from Supabase if configured, otherwise falls back to mock data.
 */
import { supabase, isSupabaseConfigured } from './supabase';

// ──────────────────────────────────────
// Microgrids
// ──────────────────────────────────────

export interface Microgrid {
  id: string;
  name: string;
  location: string;
  capacity_kw: number;
  current_generation: number;
  home_count: number;
  status: "online" | "partial" | "offline";
}

const MOCK_MICROGRIDS: Microgrid[] = [
  { id: "M1", name: "Microgrid Alpha", location: "Bhubaneswar, Odisha", capacity_kw: 50, current_generation: 38, home_count: 3, status: "online" },
  { id: "M2", name: "Microgrid Beta", location: "Cuttack, Odisha", capacity_kw: 75, current_generation: 52, home_count: 3, status: "online" },
  { id: "M3", name: "Microgrid Gamma", location: "Rourkela, Odisha", capacity_kw: 40, current_generation: 12, home_count: 3, status: "partial" },
];

export async function getMicrogrids(): Promise<Microgrid[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('microgrids').select('*').order('id');
    if (!error && data && data.length > 0) return data as Microgrid[];
  }
  return MOCK_MICROGRIDS;
}

export async function getMicrogridById(id: string): Promise<Microgrid | undefined> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('microgrids').select('*').eq('id', id).single();
    if (!error && data) return data as Microgrid;
  }
  return MOCK_MICROGRIDS.find(m => m.id === id);
}

// ──────────────────────────────────────
// Homes within a microgrid
// ──────────────────────────────────────

export interface HomeReading {
  id: string;
  microgrid_id: string;
  kwh_today: number;
  status: "online" | "low";
}

const MOCK_HOMES: Record<string, HomeReading[]> = {
  M1: [
    { id: "H1", microgrid_id: "M1", kwh_today: 18.4, status: "online" },
    { id: "H2", microgrid_id: "M1", kwh_today: 15.9, status: "online" },
    { id: "H3", microgrid_id: "M1", kwh_today: 9.2, status: "low" },
  ],
  M2: [
    { id: "H1", microgrid_id: "M2", kwh_today: 22.1, status: "online" },
    { id: "H2", microgrid_id: "M2", kwh_today: 14.5, status: "online" },
    { id: "H3", microgrid_id: "M2", kwh_today: 17.3, status: "online" },
  ],
  M3: [
    { id: "H1", microgrid_id: "M3", kwh_today: 11.8, status: "online" },
    { id: "H2", microgrid_id: "M3", kwh_today: 6.2, status: "low" },
    { id: "H3", microgrid_id: "M3", kwh_today: 8.9, status: "low" },
  ],
};

export async function getHomesForMicrogrid(microgridId: string): Promise<HomeReading[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('homes').select('*').eq('microgrid_id', microgridId).order('id');
    if (!error && data && data.length > 0) return data as HomeReading[];
  }
  return MOCK_HOMES[microgridId] || [];
}

// ──────────────────────────────────────
// Home telemetry (per-home sensor data)
// ──────────────────────────────────────

export interface HomeTelemetry {
  voltage: number;
  current: number;
  temperature: number;
  power: number;
  history: { time: string; consumption: number }[];
}

export async function getHomeTelemetry(microgridId: string, homeId: string): Promise<HomeTelemetry> {
  const history = [];
  for (let i = 0; i <= 24; i += 2) {
    const hourString = `${i.toString().padStart(2, '0')}:00`;
    let consumption = Math.random() * 0.5 + 0.1;
    if (i >= 7 && i <= 9) consumption += 1.5;
    if (i >= 18 && i <= 22) consumption += 2.5;
    history.push({ time: hourString, consumption: Number(consumption.toFixed(2)) });
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('microgrid_id', microgridId)
      .eq('home_id', homeId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();
      
    if (!error && data) {
      return {
        voltage: data.voltage,
        current: data.current,
        temperature: data.temperature,
        power: data.power,
        history, // using mock history since we don't have historical data generated yet
      };
    }
  }

  const isLow = homeId === 'H3' && microgridId !== 'M2';
  return {
    voltage: isLow ? 215.2 : 229.8,
    current: isLow ? 2.1 : 6.4,
    temperature: isLow ? 42.5 : 36.8,
    power: isLow ? 0.45 : 1.47,
    history,
  };
}

// ──────────────────────────────────────
// Supply & Demand (per microgrid)
// ──────────────────────────────────────

export interface SupplyDemandPoint {
  time: string;
  generation: number;
  demand: number;
}

export async function getSupplyDemandSeries(microgridId?: string): Promise<SupplyDemandPoint[]> {
  const data: SupplyDemandPoint[] = [];
  const capacityMultiplier = microgridId === 'M2' ? 1.5 : microgridId === 'M3' ? 0.8 : 1;
  for (let i = 0; i <= 24; i += 2) {
    const hourString = `${i.toString().padStart(2, '0')}:00`;
    let generation = 0;
    if (i > 6 && i < 18) {
      generation = Math.max(0, 80 * Math.sin(((i - 6) / 12) * Math.PI) * capacityMultiplier) + Math.random() * 10;
    }
    let demand = (20 + Math.random() * 10) * capacityMultiplier;
    if (i >= 7 && i <= 9) demand += 30;
    if (i >= 18 && i <= 21) demand += 40;
    data.push({ time: hourString, generation: Math.round(generation), demand: Math.round(demand) });
  }
  return data;
}

// ──────────────────────────────────────
// BESS
// ──────────────────────────────────────

export interface BESSData {
  soc: number;
  temperature: number;
  status: "charging" | "discharging" | "idle";
  health: number;
  capacity: number;
  voltage: number;
  current: number;
  cycles: number;
  history: { time: string; soc: number }[];
}

export async function getBESSData(): Promise<BESSData> {
  const history = [];
  let soc = 30;
  for (let i = 0; i <= 24; i += 2) {
    const hourString = `${i.toString().padStart(2, '0')}:00`;
    if (i > 6 && i < 16) soc = Math.min(100, soc + 8 + Math.random() * 4);
    else if (i >= 18) soc = Math.max(10, soc - 6 - Math.random() * 3);
    history.push({ time: hourString, soc: Math.round(soc) });
  }
  
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from('bess_readings').select('*').order('recorded_at', { ascending: false }).limit(1).single();
    if (!error && data) {
      return {
        soc: data.soc,
        temperature: data.temperature,
        status: data.status,
        health: data.health,
        capacity: data.capacity,
        voltage: data.voltage,
        current: data.current,
        cycles: data.cycles,
        history,
      };
    }
  }

  return {
    soc: 78,
    temperature: 34.2,
    status: "charging",
    health: 91,
    capacity: 50,
    voltage: 48.6,
    current: 12.4,
    cycles: 342,
    history,
  };
}

// ──────────────────────────────────────
// Power Quality
// ──────────────────────────────────────

export interface PowerQuality {
  voltage: number;
  frequency: number;
  thd: number;
}

export async function getPowerQuality(): Promise<PowerQuality> {
  return { voltage: 231.5, frequency: 50.02, thd: 2.1 };
}

// ──────────────────────────────────────
// V2G (Vehicle-to-Grid)
// ──────────────────────────────────────

export interface V2GSession {
  vehicleId: string;
  vehicleName: string;
  batteryLevel: number;
  mode: "charging" | "discharging" | "idle";
  powerFlow: number;
  connectedSince: string;
}

export interface V2GOverview {
  connectedEVs: number;
  totalCapacity: number;
  netFlowToGrid: number;
  sessions: V2GSession[];
}

export async function getV2GData(): Promise<V2GOverview> {
  return {
    connectedEVs: 4,
    totalCapacity: 120,
    netFlowToGrid: 18.5,
    sessions: [
      { vehicleId: "EV1", vehicleName: "Tata Nexon EV", batteryLevel: 82, mode: "discharging", powerFlow: 7.2, connectedSince: "08:30 AM" },
      { vehicleId: "EV2", vehicleName: "MG ZS EV", batteryLevel: 45, mode: "charging", powerFlow: 6.6, connectedSince: "09:15 AM" },
      { vehicleId: "EV3", vehicleName: "Hyundai Ioniq 5", batteryLevel: 91, mode: "discharging", powerFlow: 11.3, connectedSince: "07:00 AM" },
      { vehicleId: "EV4", vehicleName: "BYD Atto 3", batteryLevel: 67, mode: "idle", powerFlow: 0, connectedSince: "10:45 AM" },
    ],
  };
}

// ──────────────────────────────────────
// International Trade of Power
// ──────────────────────────────────────

export interface TradePartner {
  country: string;
  direction: "import" | "export";
  volume: number;
  pricePerUnit: number;
  status: "active" | "scheduled" | "completed";
}

export interface TradeOverview {
  totalImport: number;
  totalExport: number;
  tradeBalance: number;
  avgPrice: number;
  partners: TradePartner[];
  history: { month: string; imports: number; exports: number }[];
}

export async function getTradeData(): Promise<TradeOverview> {
  return {
    totalImport: 1250,
    totalExport: 1890,
    tradeBalance: 640,
    avgPrice: 4.82,
    partners: [
      { country: "Nepal", direction: "export", volume: 450, pricePerUnit: 4.5, status: "active" },
      { country: "Bangladesh", direction: "export", volume: 680, pricePerUnit: 5.1, status: "active" },
      { country: "Bhutan", direction: "import", volume: 820, pricePerUnit: 3.8, status: "active" },
      { country: "Myanmar", direction: "export", volume: 760, pricePerUnit: 5.4, status: "scheduled" },
      { country: "Sri Lanka", direction: "import", volume: 430, pricePerUnit: 4.2, status: "completed" },
    ],
    history: [
      { month: "Jan", imports: 180, exports: 220 },
      { month: "Feb", imports: 150, exports: 190 },
      { month: "Mar", imports: 200, exports: 280 },
      { month: "Apr", imports: 170, exports: 310 },
      { month: "May", imports: 220, exports: 350 },
      { month: "Jun", imports: 330, exports: 540 },
    ],
  };
}

// ──────────────────────────────────────
// Cybersecurity
// ──────────────────────────────────────

export interface SecurityStatus {
  encrypted: boolean;
  activeNodes: number;
  unauthorizedAttempts: number;
  lastAudit: string;
}

export async function getSecurityStatus(): Promise<SecurityStatus> {
  if (isSupabaseConfigured() && supabase) {
    const { count, error } = await supabase.from('security_audit_log').select('*', { count: 'exact', head: true }).eq('is_authorized', false);
    
    if (!error) {
      return {
        encrypted: true,
        activeNodes: 12,
        unauthorizedAttempts: count || 0,
        lastAudit: "Just now",
      };
    }
  }

  return {
    encrypted: true,
    activeNodes: 12,
    unauthorizedAttempts: 0,
    lastAudit: "2 mins ago",
  };
}
