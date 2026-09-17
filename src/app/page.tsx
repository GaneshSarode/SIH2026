import Link from "next/link";
import { Activity, Zap, Car, Globe, ShieldCheck, Leaf, TreePine, IndianRupee } from "lucide-react";
import { getMicrogrids, getSecurityStatus } from "@/lib/mockData";

export default async function Home() {
  const microgrids = await getMicrogrids();
  const security = await getSecurityStatus();
  const totalCapacity = microgrids.reduce((sum, m) => sum + m.capacity_kw, 0);
  const totalGeneration = microgrids.reduce((sum, m) => sum + m.current_generation, 0);
  
  // Carbon impact: ~0.82 kg CO₂ saved per kWh of solar vs coal
  const co2SavedToday = Math.round(totalGeneration * 8 * 0.82);
  const treesEquivalent = Math.round(co2SavedToday / 22);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Immersive Hero Section (SpaceX Style) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center -mt-16 bg-black overflow-hidden px-4">
        {/* Abstract energy grid background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
          <svg className="absolute w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto mt-20">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 uppercase" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Grid<span className="text-[var(--color-status-online)]">Watch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            THE FUTURE OF POWER. Monitoring clean energy generation, storage, and distribution without a single gram of carbon.
          </p>

          {/* Minimal Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap border-y border-white/10 py-8 backdrop-blur-sm bg-black/20">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-white mb-2">{totalCapacity}<span className="text-2xl text-[var(--color-status-online)]">kW</span></span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Clean Capacity</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-white mb-2">{totalGeneration}<span className="text-2xl text-[var(--color-status-online)]">kW</span></span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Generating Now</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-white mb-2">{microgrids.length}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Microgrids</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-[1px] h-12 bg-[var(--color-status-online)] opacity-50" />
        </div>
      </section>

      {/* Corporate Dashboard Section (Waaree Style) */}
      <section className="bg-gray-50 dark:bg-[#0f172a] flex-1 w-full px-4 py-16 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-[var(--foreground)]">Monitoring Modules</h2>
            <div className="w-24 h-1 bg-[var(--color-status-online)] rounded-full mb-4"></div>
            <p className="text-gray-500 text-center max-w-2xl">Access real-time data across all GridWatch infrastructure layers through our enterprise-grade monitoring dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Microgrids */}
            <Link href="/microgrids" className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <Zap className="w-8 h-8" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold">{microgrids.filter(m => m.status === 'online').length}/{microgrids.length} Online</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-[var(--color-status-online)] transition-colors">Microgrids</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex-1">Monitor renewable microgrids and household energy consumption — 100% solar and wind powered.</p>
            </Link>

            {/* BESS */}
            <Link href="/bess" className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Activity className="w-8 h-8" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold">78% SoC</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">BESS</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex-1">Battery Energy Storage — store surplus clean energy and eliminate diesel backup dependency.</p>
            </Link>

            {/* V2G */}
            <Link href="/v2g" className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  <Car className="w-8 h-8" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-semibold">4 EVs Connected</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">Vehicle-to-Grid</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex-1">Turn parked EVs into mobile power banks — bidirectional charging for grid stability.</p>
            </Link>

            {/* International Trade */}
            <Link href="/trade" className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                  <Globe className="w-8 h-8" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold">+640 MWh Net</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">International Trade</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex-1">Cross-border clean energy exchange — enabling renewable power trade across South Asia.</p>
            </Link>

            {/* Dynamic Pricing */}
            <Link href="/pricing" className="group flex flex-col p-8 rounded-3xl bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 md:col-span-2">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                  <IndianRupee className="w-8 h-8" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-semibold">Live Rates</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">Dynamic Pricing</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed flex-1">Set electricity rates manually, configure price thresholds, and monitor 24h price curves for optimal energy trading.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center pb-8">
        <p className="text-sm text-gray-400">
          Built by <span className="font-semibold text-[var(--foreground)]">Team Iron Will</span> · Smart India Hackathon 2026
        </p>
      </section>
    </div>
  );
}
