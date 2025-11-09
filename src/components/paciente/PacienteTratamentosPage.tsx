import { Card } from "../ui/card";
import { Medication } from "../../App";
import { Pill, Clock } from "lucide-react";

interface PacienteTratamentosPageProps {
  medications: Medication[];
}

export function PacienteTratamentosPage({ medications }: PacienteTratamentosPageProps) {
  const getTimesDisplay = (med: Medication) => {
    if (med.frequencyType === "interval") {
      return `A cada ${med.interval} horas (início: ${med.startTime})`;
    } else {
      return med.specificTimes?.join(", ") || "";
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-tratamentos" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-tratamentos)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8">
          <h1 className="text-white text-2xl mb-1">Meus Tratamentos</h1>
          <p className="text-white/90 text-sm">
            {medications.length} {medications.length === 1 ? "medicamento ativo" : "medicamentos ativos"}
          </p>
        </div>
      </div>

      {/* Lista de Medicamentos */}
      <div className="px-6 -mt-6 relative z-20 pb-6">
        <div className="space-y-4">
          {medications.length === 0 ? (
            <Card className="p-8 text-center shadow-lg">
              <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum medicamento cadastrado ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Peça ao seu cuidador para adicionar seus medicamentos.
              </p>
            </Card>
          ) : (
            medications.map((med) => (
              <Card key={med.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00bcd4] to-[#14b8a6] rounded-full flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-[#1e3a8a] text-lg mb-1">{med.name}</h3>
                      <p className="text-gray-600 mb-3">{med.dose}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-[#14b8a6]" />
                          <span>{getTimesDisplay(med)}</span>
                        </div>
                        
                        {med.alarmEnabled && (
                          <div className="inline-flex items-center gap-1 bg-[#14b8a6]/10 text-[#14b8a6] px-3 py-1 rounded-full text-xs">
                            <span>🔔</span>
                            <span>Alarmes ativos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Informação */}
        {medications.length > 0 && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <div className="p-4">
              <p className="text-blue-800 text-sm text-center">
                💡 Você receberá notificações nos horários programados.<br />
                Não se esqueça de confirmar quando tomar seus medicamentos!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
