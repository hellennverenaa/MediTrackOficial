import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Patient, Medication, MedicationLog } from "../../App";
import { Clock, CheckCircle2, Circle, Bell } from "lucide-react";

interface PacienteHojePageProps {
  patient: Patient;
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onShowModal: (log: MedicationLog) => void;
}

export function PacienteHojePage({ 
  patient, 
  medications, 
  medicationLogs,
  onShowModal 
}: PacienteHojePageProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = medicationLogs.filter(log => 
    log.scheduledTime.startsWith(today)
  );

  const pendingLogs = todayLogs.filter(log => log.status === "pending");
  const nextPending = pendingLogs[0];

  const getMedicationName = (medId: number) => {
    const med = medications.find(m => m.id === medId);
    return med ? `${med.name} ${med.dose}` : "Medicamento";
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-paciente" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-paciente)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8">
          <h1 className="text-white text-2xl mb-2">Olá, {patient.name.split(" ")[0]}! 👋</h1>
          <p className="text-white/90 text-sm">
            {new Date().toLocaleDateString("pt-BR", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20 pb-6">
        {/* Próxima Dose */}
        {nextPending && (
          <Card className="mb-6 shadow-lg bg-gradient-to-r from-[#1e3a8a] to-[#14b8a6] text-white p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm mb-1">Próxima Dose:</p>
                <p className="text-xl mb-1">{getMedicationName(nextPending.medicationId)}</p>
                <p className="text-white/90">{formatTime(nextPending.scheduledTime)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Timeline do Dia */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-[#1e3a8a] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Medicações de Hoje
            </h2>

            <div className="space-y-4">
              {todayLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma medicação agendada para hoje.
                </p>
              ) : (
                todayLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                      log.status === "taken"
                        ? "bg-green-50 border-green-200"
                        : log.status === "pending"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {log.status === "taken" ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg text-[#1e3a8a]">
                          {formatTime(log.scheduledTime)}
                        </span>
                        <span className="text-gray-600">
                          {getMedicationName(log.medicationId)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            log.status === "taken"
                              ? "bg-green-600 text-white"
                              : log.status === "pending"
                              ? "bg-blue-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {log.status === "taken"
                            ? "Tomado"
                            : log.status === "pending"
                            ? "Pendente"
                            : "Perdido"}
                        </span>
                      </div>

                      {log.status === "pending" && (
                        <Button
                          onClick={() => onShowModal(log)}
                          className="mt-3 w-full bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg"
                          size="sm"
                        >
                          Confirmar agora
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center shadow">
            <p className="text-2xl text-[#14b8a6] mb-1">
              {todayLogs.filter(l => l.status === "taken").length}
            </p>
            <p className="text-gray-600 text-xs">Tomados</p>
          </Card>
          <Card className="p-4 text-center shadow">
            <p className="text-2xl text-blue-600 mb-1">
              {todayLogs.filter(l => l.status === "pending").length}
            </p>
            <p className="text-gray-600 text-xs">Pendentes</p>
          </Card>
          <Card className="p-4 text-center shadow">
            <p className="text-2xl text-red-600 mb-1">
              {todayLogs.filter(l => l.status === "missed").length}
            </p>
            <p className="text-gray-600 text-xs">Perdidos</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
