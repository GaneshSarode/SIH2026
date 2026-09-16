"use client";
import { HouseholdReading } from '@/lib/mockData';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HouseholdRow({ reading, index }: { reading: HouseholdReading, index: number }) {
  const isOnline = reading.status === 'online';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/node/${reading.id}`} className="flex items-center justify-between p-4 mb-3 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-gray-300 hover:bg-gray-50 transition-colors group cursor-pointer shadow-sm hover:shadow-md">
        <div className="flex items-center gap-6">
          <span className="font-mono text-lg font-medium group-hover:text-[var(--color-status-online)] transition-colors">{reading.id}</span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Consumption Today</span>
            <span>{reading.kWhToday.toFixed(1)} <span className="text-gray-500 text-sm">kWh</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--color-status-online)]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning)]" />
            )}
            <span className={`text-sm font-medium ${isOnline ? 'text-[var(--color-status-online)]' : 'text-[var(--color-status-warning)]'}`}>
              {isOnline ? 'Online' : 'Low Output'}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-300 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
