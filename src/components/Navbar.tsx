import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--color-border)] py-4 mb-8">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-medium tracking-tight">
          <Activity className="w-5 h-5 text-[var(--color-status-online)]" />
          <span>GridWatch</span>
        </Link>
        <div className="flex gap-6 items-center text-sm">
          <Link href="/supply-demand" className="text-gray-400 hover:text-white transition-colors">Supply & Demand</Link>
          <Link href="/policies" className="text-gray-400 hover:text-white transition-colors">Policies</Link>
          <Link href="/login" className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md hover:bg-gray-800 transition-colors">
            Operator login
          </Link>
        </div>
      </div>
    </nav>
  );
}
