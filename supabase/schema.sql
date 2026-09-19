-- ============================================
-- GridWatch Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Microgrids
CREATE TABLE microgrids (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  capacity_kw NUMERIC DEFAULT 0,
  current_generation NUMERIC DEFAULT 0,
  home_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'partial', 'offline')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homes within microgrids
CREATE TABLE homes (
  id TEXT NOT NULL,
  microgrid_id TEXT NOT NULL REFERENCES microgrids(id) ON DELETE CASCADE,
  kwh_today NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'low')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, microgrid_id)
);

-- Sensor readings (core telemetry — written by MQTT bridge)
CREATE TABLE sensor_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  microgrid_id TEXT NOT NULL,
  home_id TEXT NOT NULL,
  voltage NUMERIC NOT NULL,
  current NUMERIC NOT NULL,
  temperature NUMERIC NOT NULL,
  power NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (home_id, microgrid_id) REFERENCES homes(id, microgrid_id) ON DELETE CASCADE
);

-- Index for fast queries by home
CREATE INDEX idx_readings_home ON sensor_readings(microgrid_id, home_id, recorded_at DESC);

-- BESS telemetry
CREATE TABLE bess_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  soc NUMERIC NOT NULL,
  temperature NUMERIC,
  voltage NUMERIC,
  current NUMERIC,
  status TEXT DEFAULT 'idle' CHECK (status IN ('charging', 'discharging', 'idle')),
  health NUMERIC,
  capacity NUMERIC DEFAULT 50,
  cycles INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bess_time ON bess_readings(recorded_at DESC);

-- V2G sessions
CREATE TABLE v2g_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  vehicle_name TEXT,
  battery_level NUMERIC,
  mode TEXT DEFAULT 'idle' CHECK (mode IN ('charging', 'discharging', 'idle')),
  power_flow NUMERIC DEFAULT 0,
  connected_since TIMESTAMPTZ DEFAULT NOW(),
  disconnected_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- International trade records
CREATE TABLE trade_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('import', 'export')),
  volume_mwh NUMERIC NOT NULL,
  price_per_kwh NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'completed')),
  trade_month TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security audit log (cybersecurity)
CREATE TABLE security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  source_ip TEXT,
  node_id TEXT,
  details TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  is_authorized BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_time ON security_audit_log(created_at DESC);

-- Operator Profiles (for RLS mapping)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'operator' CHECK (role IN ('admin', 'operator')),
  assigned_resource_id TEXT, -- e.g. 'M1'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Seed data (matches our current mock data)
-- ============================================

INSERT INTO microgrids (id, name, location, capacity_kw, current_generation, home_count, status) VALUES
  ('M1', 'Microgrid Alpha', 'Bhubaneswar, Odisha', 50, 38, 3, 'online'),
  ('M2', 'Microgrid Beta', 'Cuttack, Odisha', 75, 52, 3, 'online'),
  ('M3', 'Microgrid Gamma', 'Rourkela, Odisha', 40, 12, 3, 'partial');

INSERT INTO homes (id, microgrid_id, kwh_today, status) VALUES
  ('H1', 'M1', 18.4, 'online'), ('H2', 'M1', 15.9, 'online'), ('H3', 'M1', 9.2, 'low'),
  ('H1', 'M2', 22.1, 'online'), ('H2', 'M2', 14.5, 'online'), ('H3', 'M2', 17.3, 'online'),
  ('H1', 'M3', 11.8, 'online'), ('H2', 'M3', 6.2, 'low'), ('H3', 'M3', 8.9, 'low');
