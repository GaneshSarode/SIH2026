/**
 * MQTT-to-Supabase Bridge
 * 
 * This script runs on your server (NOT in the browser).
 * It subscribes to the LNS MQTT broker over TLS and writes
 * incoming sensor data into Supabase.
 * 
 * Data Flow:
 *   Sensors → ESP32 → LoRa TX → Gateway → LNS → MQTT (TLS) → THIS BRIDGE → Supabase
 * 
 * SETUP:
 *   1. npm install mqtt @supabase/supabase-js dotenv
 *   2. Create a .env file (NOT .env.local) with:
 *      SUPABASE_URL=https://your-project.supabase.co
 *      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *      MQTT_BROKER_URL=mqtts://your-lns-broker:8883
 *      MQTT_TOPIC=application/+/device/+/event/up
 *      MQTT_USERNAME=your-username (optional)
 *      MQTT_PASSWORD=your-password (optional)
 *   3. node supabase/mqtt-bridge.js
 * 
 * SECURITY:
 *   - Uses MQTT over TLS (port 8883) — all data encrypted in transit
 *   - Uses Supabase Service Role Key (bypasses RLS for INSERT)
 *   - Logs every connection and error to security_audit_log
 *   - NEVER expose the Service Role Key in frontend code
 */

import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// ── Supabase (Service Role — full write access) ──
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── MQTT Client (TLS encrypted) ──
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL!, {
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  rejectUnauthorized: true, // Enforce valid TLS certificate
  protocol: 'mqtts',
});

const TOPIC = process.env.MQTT_TOPIC || 'application/+/device/+/event/up';

// ── Connection Handlers ──
mqttClient.on('connect', async () => {
  console.log('✅ Connected to MQTT broker over TLS');
  mqttClient.subscribe(TOPIC, (err) => {
    if (err) {
      console.error('❌ Subscribe error:', err);
    } else {
      console.log(`📡 Subscribed to: ${TOPIC}`);
    }
  });

  // Log successful connection to audit trail
  await supabase.from('security_audit_log').insert({
    event_type: 'mqtt_connect',
    details: 'MQTT bridge connected to LNS broker over TLS',
    severity: 'info',
    is_authorized: true,
  });
});

mqttClient.on('error', async (err) => {
  console.error('❌ MQTT error:', err.message);
  await supabase.from('security_audit_log').insert({
    event_type: 'mqtt_error',
    details: err.message,
    severity: 'critical',
    is_authorized: false,
  });
});

// ── Message Handler ──
mqttClient.on('message', async (topic, messageBuffer) => {
  try {
    const payload = JSON.parse(messageBuffer.toString());

    /**
     * Expected payload from LNS (ChirpStack/TTN format):
     * {
     *   "deviceName": "M1-H1",
     *   "data": {
     *     "voltage": 229.8,
     *     "current": 6.4,
     *     "temperature": 36.8,
     *     "power": 1.47
     *   }
     * }
     * 
     * Adjust the field mapping below to match your actual LNS output.
     */

    const deviceName = payload.deviceName || payload.devEUI || 'unknown';
    const sensorData = payload.data || payload.object || payload;

    // Parse microgrid and home IDs from device name (e.g., "M1-H1")
    const parts = deviceName.split('-');
    const microgridId = parts[0] || 'M1';
    const homeId = parts[1] || 'H1';

    // Insert sensor reading
    const { error } = await supabase.from('sensor_readings').insert({
      microgrid_id: microgridId,
      home_id: homeId,
      voltage: sensorData.voltage,
      current: sensorData.current,
      temperature: sensorData.temperature,
      power: sensorData.power,
    });

    if (error) {
      console.error('❌ DB insert error:', error.message);
    } else {
      console.log(`📥 ${microgridId}/${homeId}: V=${sensorData.voltage}V I=${sensorData.current}A T=${sensorData.temperature}°C P=${sensorData.power}kW`);
    }

    // If the payload contains BESS data
    if (sensorData.soc !== undefined) {
      await supabase.from('bess_readings').insert({
        soc: sensorData.soc,
        temperature: sensorData.bms_temperature || sensorData.temperature,
        voltage: sensorData.bms_voltage || sensorData.voltage,
        current: sensorData.bms_current || sensorData.current,
        status: sensorData.bms_status || 'idle',
        health: sensorData.bms_health || 100,
      });
    }

  } catch (err: any) {
    console.error('❌ Parse error:', err.message);
    await supabase.from('security_audit_log').insert({
      event_type: 'parse_error',
      details: `Failed to parse MQTT payload: ${err.message}`,
      severity: 'warning',
      is_authorized: true,
    });
  }
});

console.log('🔌 GridWatch MQTT Bridge starting...');
console.log(`   Broker: ${process.env.MQTT_BROKER_URL}`);
console.log(`   Topic:  ${TOPIC}`);
console.log('   TLS:    Enabled (mqtts://)');
