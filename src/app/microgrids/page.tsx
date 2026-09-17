import Link from "next/link";
import { getMicrogrids } from "@/lib/mockData";
import { Zap, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export default function MicrogridsPage() {
  const microgrids = getMicrogrids();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--background)] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microgrids</h1>
          <p className="text-gray-500 dark:text-gray-400">Select a microgrid to monitor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {microgrids.map((mg) => (
          <Link
            key={mg.id}
            href={`/microgrids/${mg.id}`}
            className="group p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-status-online)] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                {mg.status === "online" ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />
                )}
                <span className={`text-xs font-medium ${mg.status === "online" ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
                  {mg.status === "online" ? "Online" : "Partial"}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-1 group-hover:text-[var(--color-status-online)] transition-colors">{mg.id}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{mg.name} · {mg.location}</p>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Capacity</span>
                <span className="font-semibold">{mg.capacity} <span className="text-xs text-gray-500 font-normal">kW</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Generation</span>
                <span className="font-semibold">{mg.currentGeneration} <span className="text-xs text-gray-500 font-normal">kW</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Homes</span>
                <span className="font-semibold">{mg.homeCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
