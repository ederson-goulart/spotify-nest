interface TopPage {
  page: string;
  count: number;
}

interface TopPagesChartProps {
  pages: TopPage[];
}

export function TopPagesChart({ pages }: TopPagesChartProps) {
  const maxCount = Math.max(...pages.map((p) => p.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        📊 Páginas Mais Acessadas
      </h2>
      <div className="space-y-4">
        {pages.length > 0 ? (
          pages.map((page, index) => (
            <div key={page.page}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">
                  {index + 1}. {page.page}
                </span>
                <span className="text-gray-600 text-sm">
                  {page.count} views
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(page.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhum dado disponível
          </p>
        )}
      </div>
    </div>
  );
}
