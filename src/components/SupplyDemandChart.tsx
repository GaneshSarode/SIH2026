"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SupplyDemandChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[400px] p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 500 }}
            labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Line type="monotone" dataKey="generation" name="Generation (kW)" stroke="var(--color-status-online)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="demand" name="Demand (kW)" stroke="var(--color-status-critical)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
