import Link from "next/link";
import { Activity, Zap, Car, Globe, ShieldCheck, Leaf, TreePine, IndianRupee, ArrowRight, CheckCircle2 } from "lucide-react";
import { getMicrogrids, getSecurityStatus } from "@/lib/mockData";

export default async function Home() {
  const microgrids = await getMicrogrids();
  const security = await getSecurityStatus();
  const totalCapacity = microgrids.reduce((sum, m) => sum + m.capacity_kw, 0);
  const totalGeneration = microgrids.reduce((sum, m) => sum + m.current_generation, 0);
  
  const co2SavedToday = Math.round(totalGeneration * 8 * 0.82);
  const treesEquivalent = Math.round(co2SavedToday / 22);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      
      {/* 1. Waaree Hero Slider Style */}
      <section className="relative w-full h-[600px] bg-gray-900 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-solar.jpg" 
            alt="Solar Panels" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        </div>
        
        {/* Waaree Signature Blue Text Box (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-full md:w-[600px] bg-[#004b87] p-10 md:p-14 z-10 text-white">
          <h2 className="text-[#00a651] font-bold tracking-widest uppercase mb-2 text-sm">GridWatch Platform</h2>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Pioneering The Future of Clean Energy Networks
          </h1>
          <p className="text-gray-200 mb-8 max-w-md">
            Seamlessly monitor, manage, and trade renewable energy across international borders with our military-grade encrypted platform.
          </p>
          <Link href="/microgrids" className="inline-flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white px-6 py-3 font-bold uppercase tracking-wide transition-colors rounded-sm">
            Explore Solutions <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 2. Metrics Strip */}
      <section className="bg-white shadow-md z-20 relative border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-bold text-[#004b87] mb-1">{totalCapacity} <span className="text-2xl">kW</span></span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Capacity</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-bold text-[#00a651] mb-1">{totalGeneration} <span className="text-2xl">kW</span></span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Generation</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-bold text-[#004b87] mb-1">{microgrids.length}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Microgrids</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="flex items-center gap-2 text-[#00a651] mb-1">
                <ShieldCheck className="w-8 h-8" />
                <span className="text-4xl font-bold">{security.encrypted ? '100%' : 'Alert'}</span>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Encrypted Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Solutions Section */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004b87] mb-4">Our Grid Solutions</h2>
            <div className="w-20 h-1 bg-[#00a651] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Microgrids Card */}
            <div className="bg-white rounded-sm overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow group flex flex-col h-full border-t-4 border-transparent hover:border-[#00a651]">
              <div className="h-48 relative bg-gray-200">
                <img src="https://loremflickr.com/800/600/microgrid,solar/all" alt="Microgrids" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#004b87]/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#004b87] mb-3">Microgrid Monitoring</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                  Real-time monitoring of decentralized solar and wind microgrids. Track household energy consumption and predict load spikes.
                </p>
                <Link href="/microgrids" className="text-[#00a651] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* BESS Card */}
            <div className="bg-white rounded-sm overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow group flex flex-col h-full border-t-4 border-transparent hover:border-[#00a651]">
              <div className="h-48 relative bg-gray-200">
                <img src="https://loremflickr.com/800/600/battery,storage/all" alt="BESS" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#004b87]/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#004b87] mb-3">Battery Storage (BESS)</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                  Manage commercial battery storage systems. Monitor State of Charge (SoC), health metrics, and dispatch surplus energy.
                </p>
                <Link href="/bess" className="text-[#00a651] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* V2G Card */}
            <div className="bg-white rounded-sm overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow group flex flex-col h-full border-t-4 border-transparent hover:border-[#00a651]">
              <div className="h-48 relative bg-gray-200">
                <img src="https://loremflickr.com/800/600/electriccar,charging/all" alt="V2G" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#004b87]/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#004b87] mb-3">Vehicle-to-Grid (V2G)</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                  Transform EV fleets into mobile power banks. Enable bidirectional charging to stabilize the grid during peak demand hours.
                </p>
                <Link href="/v2g" className="text-[#00a651] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* International Trade */}
            <div className="bg-white rounded-sm overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow group flex flex-col h-full border-t-4 border-transparent hover:border-[#00a651]">
              <div className="h-48 relative bg-gray-200">
                <img src="https://loremflickr.com/800/600/powerline,transmission/all" alt="Trade" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#004b87]/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#004b87] mb-3">Cross-Border Trade</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                  Facilitate international renewable energy exchange. Automate grid balancing across South Asian nations.
                </p>
                <Link href="/trade" className="text-[#00a651] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Dynamic Pricing */}
            <div className="bg-white rounded-sm overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow group flex flex-col h-full md:col-span-2 border-t-4 border-transparent hover:border-[#00a651]">
              <div className="h-48 relative bg-gray-200">
                <img src="https://loremflickr.com/800/600/chart,dashboard/all" alt="Pricing" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#004b87]/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#004b87] mb-3">Dynamic Pricing & Analytics</h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                  Real-time tariff control center. Manually adjust electricity prices based on grid load, configure automatic threshold alerts, and visualize 24-hour demand curves.
                </p>
                <Link href="/pricing" className="text-[#00a651] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Split About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Text Side */}
            <div className="flex-1">
              <h3 className="text-[#00a651] font-bold tracking-widest uppercase mb-3 text-sm">About Iron Will</h3>
              <h2 className="text-4xl font-bold text-[#004b87] mb-6 leading-tight">Empowering a Carbon-Free Grid</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We are building the intelligence layer for the modern electricity grid. By integrating smart sensors, IoT gateways, and robust MQTT pipelines, we provide unparalleled visibility into decentralized energy generation.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00a651] shrink-0" />
                  <span className="text-gray-700 font-medium">100% Secure MQTT over TLS infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00a651] shrink-0" />
                  <span className="text-gray-700 font-medium">Real-time hardware integration with ESP32 & LoRa</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00a651] shrink-0" />
                  <span className="text-gray-700 font-medium">Role-Based Access Control (RBAC) via Supabase Auth</span>
                </li>
              </ul>
              <Link href="/register" className="inline-flex bg-[#004b87] hover:bg-[#003865] text-white px-8 py-3 font-bold uppercase tracking-wide transition-colors rounded-sm">
                Request Demo Access
              </Link>
            </div>
            {/* Image Side */}
            <div className="flex-1 relative h-[500px] w-full rounded-sm overflow-hidden shadow-xl">
              <img src="https://loremflickr.com/800/600/server,technology/all" alt="Corporate" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004b87] py-12 text-center text-white/80">
        <p className="text-sm font-medium tracking-wide">
          BUILT FOR SMART INDIA HACKATHON 2026 BY <span className="text-white font-bold">TEAM IRON WILL</span>
        </p>
      </footer>
    </div>
  );
}
