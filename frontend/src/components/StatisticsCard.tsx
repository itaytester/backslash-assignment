export interface StatisticsCardProps {
  nodeCount: number;
  edgeCount: number;
  className?: string;
}

export function StatisticsCard({
  nodeCount,
  edgeCount,
  className = "",
}: StatisticsCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-grey-200 p-5 ${className}`}
    >
      <h2 className="text-sm font-semibold text-grey-700 mb-4">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatItem value={nodeCount} label="Nodes" variant="primary" />
        <StatItem value={edgeCount} label="Edges" variant="secondary" />
      </div>
    </div>
  );
}

function StatItem({
  value,
  label,
  variant,
}: {
  value: number;
  label: string;
  variant: "primary" | "secondary";
}) {
  const colorClass =
    variant === "primary" ? "text-primary-600" : "text-secondary-600";

  return (
    <div className="text-center p-3 bg-grey-50 rounded-xl">
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-grey-500 mt-1">{label}</p>
    </div>
  );
}

export default StatisticsCard;

