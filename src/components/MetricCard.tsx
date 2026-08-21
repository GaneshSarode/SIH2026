export default function MetricCard({ title, value, unit, description }: { title: string, value: string | number, unit?: string, description?: string }) {
  return (
    <div className="flex flex-col p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <span className="text-sm text-gray-400 mb-2">{title}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">{value}</span>
        {unit && <span className="text-gray-500 font-medium">{unit}</span>}
      </div>
      {description && <span className="text-xs text-gray-500 mt-2">{description}</span>}
    </div>
  );
}
