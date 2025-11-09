import { useState } from "react";
import { User, Patient, Medication, MedicationLog } from "../App";
import { CuidadorDashboard } from "./cuidador/CuidadorDashboard";
import { CuidadorPacientes } from "./cuidador/CuidadorPacientes";
import { CuidadorPerfil } from "./cuidador/CuidadorPerfil";
import { LayoutDashboard, Users, User as UserIcon } from "lucide-react";

interface CuidadorAppProps {
  user: User;
  patients: Patient[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onAddPatient: (patient: Omit<Patient, "id" | "adherence">) => void;
  onAddMedication: (medication: Omit<Medication, "id">) => void;
  onRemoveMedication: (id: number) => void;
  onLogout: () => void;
}

export function CuidadorApp({ 
  user,
  patients, 
  medications, 
  medicationLogs,
  onAddPatient,
  onAddMedication,
  onRemoveMedication,
  onLogout 
}: CuidadorAppProps) {
  const [currentTab, setCurrentTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <div className="pb-4">
        {currentTab === "dashboard" && (
          <CuidadorDashboard 
            patients={patients}
            medications={medications}
            medicationLogs={medicationLogs}
          />
        )}
        {currentTab === "pacientes" && (
          <CuidadorPacientes
            patients={patients}
            medications={medications}
            medicationLogs={medicationLogs}
            onAddPatient={onAddPatient}
            onAddMedication={onAddMedication}
            onRemoveMedication={onRemoveMedication}
          />
        )}
        {currentTab === "perfil" && (
          <CuidadorPerfil user={user} onLogout={onLogout} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "dashboard" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-xs">Dashboard</span>
            </button>
            
            <button
              onClick={() => setCurrentTab("pacientes")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "pacientes" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Pacientes</span>
            </button>
            
            <button
              onClick={() => setCurrentTab("perfil")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentTab === "perfil" 
                  ? "text-[#1e3a8a] bg-[#00bcd4]/10" 
                  : "text-gray-500"
              }`}
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
