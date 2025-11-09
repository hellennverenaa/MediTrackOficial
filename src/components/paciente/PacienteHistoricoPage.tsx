import { Card } from "../ui/card";
import { MedicationLog } from "../../App";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";

interface PacienteHistoricoPageProps {
  medicationLogs: MedicationLog[];
}

export function PacienteHistoricoPage({
  medicationLogs,
}: PacienteHistoricoPageProps) {
  // Agrupar logs por dia
  const logsByDate = medicationLogs.reduce(
    (acc, log) => {
      const date = log.scheduledTime.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, MedicationLog[]>,
  );

  const dates = Object.keys(logsByDate).sort().reverse();

  const getAdherenceForDate = (logs: MedicationLog[]) => {
    const taken = logs.filter(
      (l) => l.status === "taken",
    ).length;
    const total = logs.length;
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  };

  const getColorForAdherence = (adherence: number) => {
    if (adherence === 100) return "bg-green-500";
    if (adherence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="wave-historico"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 50 Q 25 30, 50 50 T 100 50"
                  stroke="white"
                  fill="none"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#wave-historico)"
            />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8">
          <h1 className="text-white text-2xl mb-1">
            Histórico
          </h1>
          <p className="text-white/90 text-sm">
            Acompanhe sua adesão ao tratamento
          </p>
        </div>
      </div>

      {/* Calendário de Adesão */}
      <div className="px-6 -mt-6 relative z-20 pb-6">
        <Card className="shadow-lg mb-6">
          <div className="p-6">
            <h2 className="text-[#1e3a8a] mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendário de Adesão
            </h2>

            {dates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum histórico disponível ainda.
              </p>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {dates.slice(0, 21).map((date) => {
                  const logs = logsByDate[date];
                  const adherence = getAdherenceForDate(logs);
                  const colorClass =
                    getColorForAdherence(adherence);

                  return (
                    <div
                      key={date}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center text-white text-xs mb-1`}
                      >
                        {new Date(date).getDate()}
                      </div>
                      <span className="text-xs text-gray-500">
                        {adherence}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legenda */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Legenda:
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-gray-700">
                    100% (Tudo tomado)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-gray-700">
                    70-99% (Parcial)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-gray-700">
                    &lt;70% (Crítico)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Histórico Detalhado */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-[#1e3a8a] mb-4">
              Últimos Dias
            </h2>

            <div className="space-y-4">
              {dates.slice(0, 7).map((date) => {
                const logs = logsByDate[date];
                const adherence = getAdherenceForDate(logs);

                return (
                  <div
                    key={date}
                    className="border-l-4 border-[#14b8a6] pl-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-800">
                        {formatDate(date)}
                      </h3>
                      <span className="text-sm text-[#14b8a6]">
                        {adherence}% de adesão
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            log.status === "taken"
                              ? "bg-green-100"
                              : log.status === "missed"
                                ? "bg-red-100"
                                : "bg-gray-100"
                          }`}
                        >
                          {log.status === "taken" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : log.status === "missed" ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}