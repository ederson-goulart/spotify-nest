interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  description: string;
}

export function MetricCard({
  title,
  value,
  icon,
  description,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          <p className="text-gray-500 text-xs mt-2">{description}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
