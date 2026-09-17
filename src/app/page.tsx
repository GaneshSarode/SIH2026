import Link from "next/link";
import { Activity, Zap, Car, Globe, ShieldCheck, Leaf, TreePine } from "lucide-react";
import { getMicrogrids, getSecurityStatus } from "@/lib/mockData";

export default function Home() {
  const microgrids = getMicrogrids();
  const security = getSecurityStatus();
  const totalCapacity = microgrids.reduce((sum, m) => sum + m.capacity, 0);
  const totalGeneration = microgrids.reduce((sum, m) => sum + m.currentGeneration, 0);
  
  // Carbon impact: ~0.82 kg CO₂ saved per kWh of solar vs coal
  const co2SavedToday = Math.round(totalGeneration * 8 * 0.82);
  const treesEquivalent = Math.round(co2SavedToday / 22);

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="text-center pt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Activity className="w-10 h-10 text-[var(--color-status-online)]" />
          <h1 className="text-5xl font-bold tracking-tight">GridWatch</h1>
        </div>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Monitoring clean energy generation, storage, and distribution across microgrids — powering communities without a single gram of carbon.
        </p>

        {/* Live Stats Bar */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-10 flex-wrap">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[var(--color-status-online)]">{totalCapacity}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">kW Clean Capacity</span>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)]"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{totalGeneration}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">kW Generating Now</span>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)]"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{microgrids.length}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active Microgrids</span>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)]"></div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-6 h-6 text-[var(--color-status-online)]" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">{security.encrypted ? 'Encrypted' : 'Alert'}</span>
          </div>
        </div>

        {/* Carbon Impact Banner */}
        <div className="mt-8 mx-auto max-w-lg p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[var(--color-status-online)]" />
              <div className="text-left">
                <span className="text-2xl font-bold text-[var(--color-status-online)]">{co2SavedToday}</span>
                <span className="text-sm text-gray-500 ml-1">kg</span>
                <p className="text-xs text-gray-500">CO₂ avoided today</p>
              </div>
            </div>
            <div className="w-px h-10 bg-green-200 dark:bg-green-800"></div>
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-[var(--color-status-online)]" />
              <div className="text-left">
                <span className="text-2xl font-bold text-[var(--color-status-online)]">{treesEquivalent}</span>
                <p className="text-xs text-gray-500">Trees equivalent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-6">Monitoring Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Microgrids */}
          <Link href="/microgrids" className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-status-online)] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">{microgrids.filter(m => m.status === 'online').length}/{microgrids.length} Online</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-status-online)] transition-colors">Microgrids</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Monitor renewable microgrids and household energy consumption — 100% solar and wind powered.</p>
          </Link>

          {/* BESS */}
          <Link href="/bess" className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">78% SoC</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">BESS</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Battery Energy Storage — store surplus clean energy and eliminate diesel backup dependency.</p>
          </Link>

          {/* V2G */}
          <Link href="/v2g" className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-purple-500 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">4 EVs Connected</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">Vehicle-to-Grid (V2G)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Turn every parked EV into a mobile power bank — bidirectional charging for grid stability.</p>
          </Link>

          {/* International Trade */}
          <Link href="/trade" className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-amber-500 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">+640 MWh Net</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-500 transition-colors">International Trade</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Cross-border clean energy exchange — enabling renewable power trade across South Asia.</p>
          </Link>

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
