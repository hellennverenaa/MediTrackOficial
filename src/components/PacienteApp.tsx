import { useState } from "react";
import { User, Patient, Medication, MedicationLog } from "../App";
import { PacienteHojePage } from "./paciente/PacienteHojePage";
import { PacienteTratamentosPage } from "./paciente/PacienteTratamentosPage";
import { PacienteHistoricoPage } from "./paciente/PacienteHistoricoPage";
import { MedicationModal } from "./paciente/MedicationModal";
import { TestAlarmButton } from "./paciente/TestAlarmButton";
import { Home, Pill, Calendar, User as UserIcon } from "lucide-react";

interface PacienteAppProps {
  user: User;
  patient: Patient;
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onUpdateLog: (logId: number, status: "taken" | "missed" | "snoozed") => void;
  onLogout: () => void;
  onAddTestMedication?: (minutesFromNow: number) => void;
}

export function PacienteApp({ 
  user, 
  patient, 
  medications, 
  medicationLogs, 
  onUpdateLog,
  onLogout,
  onAddTestMedication
}: PacienteAppProps) {
  const [currentTab, setCurrentTab] = useState("hoje");
  const [showModal, setShowModal] = useState(false);
  const [currentLog, setCurrentLog] = useState<MedicationLog | null>(null);

  // Simular notificação pendente
  const pendingLogs = medicationLogs.filter(log => log.status === "pending");
  
  const handleShowModal = (log: MedicationLog) => {
    setCurrentLog(log);
    setShowModal(true);
  };

  const handleConfirm = (logId: number, status: "taken" | "missed" | "snoozed") => {
    onUpdateLog(logId, status);
    setShowModal(false);
    setCurrentLog(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <div className="pb-4">
        {currentTab === "hoje" && (
          <PacienteHojePage
            patient={patient}
            medications={medications}
            medicationLogs={medicationLogs}
            onShowModal={handleShowModal}
          />
        )}
        {currentTab === "tratamentos" && (
          <PacienteTratamentosPage medications={medications} />
        )}
        {currentTab === "historico" && (
          <PacienteHistoricoPage medicationLogs={medicationLogs} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setCurrentTab("hoje")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "hoje" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Hoje</span>
            </button>
            
            <button
              onClick={() => setCurrentTab("tratamentos")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "tratamentos" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <Pill className="w-6 h-6" />
              <span className="text-xs">Tratamentos</span>
            </button>
            
            <button
              onClick={() => setCurrentTab("historico")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "historico" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Histórico</span>
            </button>

            <button
              onClick={onLogout}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-gray-500 hover:text-red-500"
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de Confirmação */}
      {showModal && currentLog && (
        <MedicationModal
          log={currentLog}
          medications={medications}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Botão de Teste de Alarmes (apenas em desenvolvimento) */}
      {onAddTestMedication && (
        <TestAlarmButton onAddTestMedication={onAddTestMedication} />
      )}
    </div>
  );
}
