import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Patient } from "../../App";
import { Plus, User, ChevronRight } from "lucide-react";

interface CuidadorPacientesListProps {
  patients: Patient[];
  onSelectPatient: (patientId: number) => void;
  onAddPatient: () => void;
}

export function CuidadorPacientesList({ patients, onSelectPatient, onAddPatient }: CuidadorPacientesListProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-pacientes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-pacientes)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8">
          <h1 className="text-white text-2xl mb-2">Meus Pacientes</h1>
          <p className="text-white/90 text-sm">
            {patients.length} {patients.length === 1 ? "paciente cadastrado" : "pacientes cadastrados"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 relative z-20 pb-6">
        {patients.length === 0 ? (
          <Card className="shadow-lg p-8 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">Nenhum paciente cadastrado ainda.</p>
            <Button
              onClick={onAddPatient}
              className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Paciente
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {patients.map(patient => (
              <Card
                key={patient.id}
                className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => onSelectPatient(patient.id)}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00bcd4] to-[#14b8a6] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[#1e3a8a] text-lg mb-1">{patient.name}</h3>
                    <p className="text-gray-500 text-sm">{patient.cpf}</p>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className={`text-xl mb-1 ${
                        patient.adherence >= 80 
                          ? "text-[#14b8a6]" 
                          : patient.adherence >= 70 
                          ? "text-yellow-600" 
                          : "text-red-600"
                      }`}>
                        {patient.adherence}%
                      </div>
                      <p className="text-gray-500 text-xs">Adesão</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={onAddPatient}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
