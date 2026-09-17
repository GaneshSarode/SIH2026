-- ============================================
-- GridWatch Row Level Security Policies
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================
-- 
-- SECURITY MODEL:
--   - Public (anon key): SELECT only on all tables
--   - Service Role (MQTT bridge): Full access (bypasses RLS)
--   - No INSERT/UPDATE/DELETE from the frontend
--
-- This ensures:
--   1. The website can display data but never modify it
--   2. Only the MQTT bridge (server-side) can write sensor data
--   3. Any unauthorized INSERT attempt from the browser is blocked
-- ============================================

-- Enable RLS on every table
ALTER TABLE microgrids ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bess_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2g_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Public READ access (dashboard is public-facing)
CREATE POLICY "anon_read_microgrids" ON microgrids FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_homes" ON homes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_sensor_readings" ON sensor_readings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_bess" ON bess_readings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_v2g" ON v2g_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_trade" ON trade_records FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_audit" ON security_audit_log FOR SELECT TO anon USING (true);

-- No INSERT/UPDATE/DELETE policies for anon = blocked automatically
-- The service_role key bypasses RLS entirely, so the MQTT bridge can write freely
