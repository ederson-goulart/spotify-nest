"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Event {
  id: string;
  type: string;
  page: string;
  action: string | null;
  timestamp: string | Date;
  ip: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  isp: string | null;
}

interface RecentEventsTableProps {
  events: Event[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    PAGE_VIEW: "👁️",
    CREATE_BAND: "➕",
    UPDATE_BAND: "✏️",
    DELETE_BAND: "🗑️",
    CREATE_TRACK: "➕",
    UPDATE_TRACK: "✏️",
    DELETE_TRACK: "🗑️",
    ERROR: "❌",
  };
  return icons[type] || "📌";
}

function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return d.toLocaleDateString("pt-BR");
}

export function RecentEventsTable({
  events,
  pagination,
}: RecentEventsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedPage, setSelectedPage] = useState("ALL");

  const typeOptions = useMemo(
    () => ["ALL", ...Array.from(new Set(events.map((event) => event.type)))],
    [events],
  );

  const pageOptions = useMemo(
    () => ["ALL", ...Array.from(new Set(events.map((event) => event.page)))],
    [events],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        if (selectedType !== "ALL" && event.type !== selectedType) {
          return false;
        }
        if (selectedPage !== "ALL" && event.page !== selectedPage) {
          return false;
        }
        return true;
      }),
    [events, selectedType, selectedPage],
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">📋 Eventos Recentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Nr
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                <div className="flex flex-col gap-2">
                  <span>
                    <select
                      value={selectedType}
                      onChange={(event) => setSelectedType(event.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type === "ALL" ? "TIPO" : type.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                <div className="flex flex-col gap-2">
                  <span>
                    <select
                      value={selectedPage}
                      onChange={(event) => setSelectedPage(event.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {pageOptions.map((page) => (
                        <option key={page} value={page}>
                          {page === "ALL" ? "PÁGINA" : page}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Ação
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                IP
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                ISP
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Horário
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const page = pagination?.page ?? 1;
                const limit = pagination?.limit ?? 20;
                const rowNumber = (page - 1) * limit + index + 1;
                const formattedRowNumber = String(rowNumber).padStart(2, "0");
                return (
                  <tr
                    key={event.id || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {formattedRowNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getEventIcon(event.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {event.type.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {event.page}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {event.action || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {event.city && event.country
                          ? `${event.city}, ${event.country}`
                          : event.country || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {event.ip || "—"}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {event.isp || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.timestamp)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Nenhum evento registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              de {pagination.total} eventos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
