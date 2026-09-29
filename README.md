<p align="center">
  <img src="public/gridwatch-logo-transparent.png" alt="GridWatch Logo" width="400"/>
</p>

<h3 align="center">Renewable Energy for a Smarter Tomorrow</h3>

<p align="center">
  <a href="https://sih-2026-nu.vercel.app/">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#architecture">🏗️ Architecture</a> •
  <a href="#tech-stack">🛠️ Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a>
</p>

---

## 📋 About

**GridWatch** is a comprehensive hardware + software platform for **monitoring and managing renewable energy systems**. Built by **Team IRON WILL** (SIH26217) for Smart India Hackathon 2026 under the **Renewable and Sustainable Energy** theme.

> **Problem Statement:** A well-defined monitoring system for renewable (generation, BESS, microgrids, V2G, international trade of power) and power quality management/improvement and power management.

**🌐 Live Website:** [https://sih-2026-nu.vercel.app/](https://sih-2026-nu.vercel.app/)

---

## ✨ Features

### 🔧 MANAGE — Monitoring & Management

| Feature | Description |
|---|---|
| **Real-time Monitoring Dashboard** | Live web dashboard with auto-updating telemetry data |
| **Microgrids** | Monitor multiple microgrids with capacity, generation, and home count tracking |
| **BESS (Battery Energy Storage)** | Track State of Charge, health metrics, voltage, current, and temperature |
| **V2G (Vehicle-to-Grid)** | Bidirectional EV power flow monitoring with per-vehicle dashboards |
| **Dynamic Pricing** | AI-driven 24h price curves with manual override and threshold alerts |
| **International Trade** | Cross-border renewable energy exchange analytics (Nepal, Bangladesh, Bhutan, Myanmar) |
| **Cybersecurity** | MQTT over TLS (AES-128) + Supabase Row Level Security (RLS) policies |
| **AI & Anomaly Detection** | Isolation Forest on expected-vs-actual generation residual |
| **Digital Twin** | Virtual replica of the physical grid for simulation and prediction |

### ⚡ GENERATE — Renewable Energy Sources

| Source | Description |
|---|---|
| **HESS** | Hybrid Energy Storage System (Solar + Wind + Battery) |
| **Grid-Forming Inverter** | Stabilizes voltage/frequency for islanded microgrids |
| **High Efficiency Solar Panels** | Maximized yield with MPPT tracking |
| **Wind Turbines** | Complementary generation during low-solar hours |
| **Biomass** | Agricultural waste converted to electricity |
| **Waste Energy Plants** | Wet waste → Biogas, Dry waste → Steam turbine |

---

## 🏗️ Architecture

### Hardware Pipeline (IoT → Cloud → Web)

```
┌─────────────────────────────┐
│  SENSORS                    │
│  (ZMPT101B / INA219)        │
└──────────┬──────────────────┘
           │ Analog/Digital
┌──────────▼──────────────────┐
│  ESP32 + LoRa Module        │
└──────────┬──────────────────┘
           │ LoRaWAN (AES-128)
┌──────────▼──────────────────┐
│  Milesight UG65 Gateway     │
└──────────┬──────────────────┘
           │ IP / Ethernet
┌──────────▼──────────────────┐
│  ChirpStack LNS             │
│  (LoRaWAN Network Server)   │
└──────────┬──────────────────┘
           │ MQTT / TLS (Port 8883)
┌──────────▼──────────────────┐
│  MQTT Broker                │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Node.js Ingestion Service  │
└──────────┬──────────────────┘
           │ HTTPS
┌──────────▼──────────────────┐
│  Supabase                   │
│  (PostgreSQL + RLS +        │
│   Realtime)                 │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Vercel                     │
│  (Next.js Dashboard /       │
│   Digital Twin)             │
└─────────────────────────────┘
```

### Database Security (Row Level Security)

```sql
-- Operators can only update their assigned microgrids
CREATE POLICY "Operators can update their assigned homes" ON homes
  FOR UPDATE USING (
    microgrid_id = (
      SELECT assigned_resource_id FROM user_profiles
      WHERE id = auth.uid()
    )
  );
```

### MQTT Topic Structure

```
application/{app_id}/device/{dev_eui}/event/up
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe codebase |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization (charts, graphs) |
| **Lucide Icons** | Modern icon set |

### Backend & Database
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database + Auth + Realtime + Row Level Security |
| **Vercel** | Serverless deployment and hosting |

### Hardware & IoT
| Component | Purpose |
|---|---|
| **ESP32** | Microcontroller with LoRa module |
| **ZMPT101B** | AC voltage sensor |
| **INA219** | Current/power sensor |
| **Milesight UG65** | Commercial LoRaWAN gateway |
| **ChirpStack** | Open-source LoRaWAN Network Server (LNS) |
| **MQTT over TLS** | Secure telemetry transport (Port 8883, AES-128) |

---

## 🎨 Dashboard Pages

Each page has its own unique color identity:

| Page | Color Theme | Description |
|---|---|---|
| 🟢 **Microgrids** | Emerald | Monitor multiple microgrids, register new ones |
| 🟠 **BESS** | Amber | Battery storage analytics with SoC, health, voltage |
| 🟣 **V2G** | Purple | Vehicle-to-Grid with per-EV dashboards |
| 🔵 **Trade** | Indigo | International renewable energy trade analytics |
| 🔵 **Pricing** | Teal | Dynamic pricing with 24h price curves |

---

## 💰 Feasibility

| Component | Cost |
|---|---|
| ESP32 | ₹500 |
| Sensors (ZMPT101B + INA219) | ₹300 |
| LoRa Module | ₹400 |
| Solar Panel | ₹2,000 |
| **Total per node** | **Under ₹5,000** |

**Software costs:** Zero recurring — ChirpStack (free), Supabase (free tier), Vercel (free hosting)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/GaneshSarode/SIH2026.git
cd SIH2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and Anon Key

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📚 Research & References

1. [Design and Implementation of Low Cost PV Monitoring System Based on LoRaWAN](https://www.academia.edu/53714627/) — Academia.edu
2. [LoRaWAN with Raspberry Pi & ChirpStack](https://rpi4cluster.com/lorawan-with-raspberry-pi/) — rpi4cluster.com
3. [ChirpStack Open-Source LoRaWAN Network Server](https://www.chirpstack.io/) — Official Docs
4. [Milesight UG65 LoRaWAN Gateway](https://www.milesight.com/iot/product/lorawan-gateway/ug65) — Milesight Official
5. [India Renewable Energy Market Report](https://www.ibef.org/industry/renewable-energy) — IBEF

---

## 🏆 Team IRON WILL

**Team ID:** SIH26217  
**Hackathon:** Smart India Hackathon 2026  
**Theme:** Renewable and Sustainable Energy  
**Category:** Hardware  

### Aligned With
- 🇮🇳 Make in India
- ⚡ National Smart Grid Mission
- 🌍 SDG 7 — Affordable & Clean Energy
- 🏭 SDG 9 — Industry, Innovation & Infrastructure

---

## 📄 License

This project is built for Smart India Hackathon 2026. All rights reserved by Team IRON WILL.
