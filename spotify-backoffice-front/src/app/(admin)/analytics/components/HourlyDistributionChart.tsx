interface HourlyData {
  hour: number;
  count: number;
}

interface HourlyDistributionChartProps {
  data: HourlyData[];
}

export function HourlyDistributionChart({
  data,
}: HourlyDistributionChartProps) {
  const maxCount = Math.max(...data.map((h) => h.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        ⏰ Distribuição Horária (últimas 24h)
      </h2>
      <div className="flex items-end justify-between gap-1 h-48">
        {data.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
              title={`${item.hour}h: ${item.count} views`}
            >
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition"
                style={{
                  height: `${Math.max(height, 2)}%`,
                }}
              />
              <span className="text-xs text-gray-500">{item.hour}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
