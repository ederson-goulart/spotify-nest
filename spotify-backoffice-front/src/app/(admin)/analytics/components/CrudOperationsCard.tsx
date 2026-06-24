interface CrudOperationsCardProps {
  operations: Record<string, number>;
}

export function CrudOperationsCard({ operations }: CrudOperationsCardProps) {
  const operationLabels: Record<
    string,
    { label: string; icon: string; color: string }
  > = {
    CREATE_BAND: {
      label: "Criar Banda",
      icon: "➕",
      color: "bg-green-100 text-green-800",
    },
    UPDATE_BAND: {
      label: "Atualizar Banda",
      icon: "✏️",
      color: "bg-blue-100 text-blue-800",
    },
    DELETE_BAND: {
      label: "Deletar Banda",
      icon: "🗑️",
      color: "bg-red-100 text-red-800",
    },
    CREATE_TRACK: {
      label: "Criar Trilha",
      icon: "📝",
      color: "bg-purple-100 text-purple-800",
    },
    UPDATE_TRACK: {
      label: "Atualizar Trilha",
      icon: "✏️",
      color: "bg-indigo-100 text-indigo-800",
    },
    DELETE_TRACK: {
      label: "Deletar Trilha",
      icon: "🗑️",
      color: "bg-pink-100 text-pink-800",
    },
  };

  const totalOperations = Object.values(operations).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        🔄 Operações CRUD
      </h2>
      <div className="space-y-3">
        {Object.entries(operations).length > 0 ? (
          Object.entries(operations).map(([type, count]) => {
            const config = operationLabels[type] || {
              label: type,
              icon: "📦",
              color: "bg-gray-100 text-gray-800",
            };
            const percentage =
              totalOperations > 0 ? (count / totalOperations) * 100 : 0;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="text-gray-700 text-sm font-medium">
                      {config.label}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
                  >
                    {count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhuma operação registrada
          </p>
        )}
      </div>
      {totalOperations > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Total:</strong> {totalOperations} operações
          </p>
        </div>
      )}
    </div>
  );
}
