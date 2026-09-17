# GridWatch — Supabase + MQTT Setup Guide

## Architecture
```
Sensors (ZMPT101B, ACS758, BMS)
    → ESP32 (reads analog/digital sensors)
    → LoRa TX (transmits via LoRaWAN)
    → Multi-Channel Gateway (receives LoRa packets)
    → LNS (LoRaWAN Network Server, e.g. ChirpStack/TTN)
    → MQTT over TLS (port 8883, AES-256 encrypted)
    → mqtt-bridge.ts (our bridge script)
    → Supabase Postgres (stores all telemetry)
    → GridWatch Web Dashboard (reads via anon key)
```

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **Project Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is for the MQTT bridge ONLY

## Step 2: Create Database Tables
1. Go to **SQL Editor** in Supabase dashboard
2. Paste and run `supabase/schema.sql`
3. Then paste and run `supabase/rls_policies.sql`

## Step 3: Configure the Website
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

The website will automatically detect these and switch from mock data to live Supabase queries.

## Step 4: Run the MQTT Bridge
Create a `.env` file in the project root (for the bridge only):
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-service-role-key
MQTT_BROKER_URL=mqtts://your-chirpstack-server:8883
MQTT_TOPIC=application/+/device/+/event/up
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
```

Then run:
```bash
npm install mqtt dotenv
npx tsx supabase/mqtt-bridge.ts
```

## Security Model
| Layer | Protection |
|-------|-----------|
| LoRa TX | AES-128 encryption at radio level |
| MQTT | TLS (port 8883), certificate validation |
| Supabase RLS | anon key = SELECT only, no INSERT/UPDATE/DELETE |
| Service Role | Used ONLY in mqtt-bridge.ts (server-side) |
| Audit Log | Every MQTT connection/error logged to `security_audit_log` |

> ⚠️ **NEVER put the Service Role Key in `.env.local` or any frontend code.**
> It goes in `.env` and is used only by `mqtt-bridge.ts`.
