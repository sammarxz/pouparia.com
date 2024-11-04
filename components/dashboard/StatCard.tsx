interface StatCardProps {
  label: string;
  value: string;
  color: string;
  currency?: string;
  percentage?: string;
}

export function StatCard({
  label,
  value,
  color,
  currency,
  percentage,
}: StatCardProps) {
  return (
    <div className="max-w-[200px]">
      <div className="text-base font-medium">
        <div className={`${color} flex gap-2`}>
          <span>{label}</span>
          {percentage && <span>({percentage})</span>}
        </div>
      </div>
      <div className="text-xl font-semibold">
        <span className="mr-1">{currency}</span>
        {value}
      </div>
    </div>
  );
}
