import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MedicationLog, Medication } from "../../App";
import { Clock, X, CheckCircle2, XCircle, AlarmClock } from "lucide-react";

interface MedicationModalProps {
  log: MedicationLog;
  medications: Medication[];
  onConfirm: (logId: number, status: "taken" | "missed" | "snoozed") => void;
  onClose: () => void;
}

export function MedicationModal({ log, medications, onConfirm, onClose }: MedicationModalProps) {
  const medication = medications.find(m => m.id === log.medicationId);
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00bcd4]/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#1e3a8a]" />
              </div>
              <div>
                <h3 className="text-[#1e3a8a]">Lembrete das {formatTime(log.scheduledTime)}</h3>
                <p className="text-gray-500 text-sm">Hora da Medicação! 💊</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pergunta */}
          <div className="mb-6 text-center bg-gradient-to-r from-[#00bcd4]/10 to-[#14b8a6]/10 p-6 rounded-lg">
            <p className="text-gray-700 mb-2">Você tomou sua dose de</p>
            <p className="text-xl text-[#1e3a8a]">
              {medication?.name} {medication?.dose}?
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button
              onClick={() => onConfirm(log.id, "taken")}
              className="w-full bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg py-6 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Sim, tomei
            </Button>

            <Button
              onClick={() => onConfirm(log.id, "snoozed")}
              variant="outline"
              className="w-full border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-lg py-6 flex items-center justify-center gap-2"
            >
              <AlarmClock className="w-5 h-5" />
              Adiar 10 min
            </Button>

            <button
              onClick={() => onConfirm(log.id, "missed")}
              className="w-full text-red-500 hover:text-red-700 py-3 text-sm transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                Pular esta dose
              </span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
