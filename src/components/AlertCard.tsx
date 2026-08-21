"use client";
import { Alert } from '@/lib/mockData';
import { AlertOctagon, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertCard({ alert, index }: { alert: Alert, index: number }) {
  const isCritical = alert.severity === 'critical';
  const colorHex = isCritical ? '#ef4444' : '#f59e0b';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col p-5 mb-4 rounded border"
      style={{ 
        borderColor: `color-mix(in srgb, ${colorHex} 30%, transparent)`, 
        backgroundColor: `color-mix(in srgb, ${colorHex} 5%, var(--color-surface))` 
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? <AlertOctagon className="w-5 h-5" style={{ color: colorHex }} /> : <AlertTriangle className="w-5 h-5" style={{ color: colorHex }} />}
          <h3 className="font-medium" style={{ color: colorHex }}>{alert.message}</h3>
        </div>
        <span className="text-xs text-gray-500">{alert.timeAgo}</span>
      </div>
      <p className="text-sm text-gray-300 pl-7">{alert.detail}</p>
      {alert.household_id && (
        <span className="text-xs font-mono pl-7 mt-2 text-gray-500">Source: {alert.household_id}</span>
      )}
    </motion.div>
  );
}
