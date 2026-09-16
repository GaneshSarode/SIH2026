import { SecurityStatus } from '@/lib/mockData';
import { ShieldCheck, ShieldAlert, Lock, Server } from 'lucide-react';

export default function SecurityWidget({ data }: { data: SecurityStatus }) {
  const isSecure = data.encrypted && data.unauthorizedAttempts === 0;

  return (
    <div className="flex flex-col p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-gray-400">Cybersecurity Posture</h3>
        {isSecure ? (
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-teal-900/30 text-teal-400 border border-teal-800/50">
            <ShieldCheck className="w-3 h-3" /> Secure
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/50">
            <ShieldAlert className="w-3 h-3" /> Vulnerable
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3 sm:border-b-0 sm:pb-0">
          <div className={`p-2 rounded-full ${data.encrypted ? 'bg-teal-900/30 text-teal-400' : 'bg-red-900/30 text-red-400'}`}>
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">MQTT Stream</span>
            <span className="text-sm font-medium">{data.encrypted ? 'AES-256 Encrypted' : 'Unencrypted'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-900/30 text-blue-400">
            <Server className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Node Authentication</span>
            <span className="text-sm font-medium">{data.activeNodes} Verified Nodes</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-gray-500">
        <span>Blocked Intrusion Attempts: {data.unauthorizedAttempts}</span>
        <span>Last Audit: {data.lastAudit}</span>
      </div>
    </div>
  );
}
