import { Card } from "../ui/card";
import { Patient, Medication, MedicationLog } from "../../App";
import { AlertTriangle, CheckCircle2, Users, TrendingUp } from "lucide-react";

interface CuidadorDashboardProps {
  patients: Patient[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
}

export function CuidadorDashboard({ patients, medications, medicationLogs }: CuidadorDashboardProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = medicationLogs.filter(log => log.scheduledTime.startsWith(today));
  
  const totalTaken = todayLogs.filter(log => log.status === "taken").length;
  const totalMissed = todayLogs.filter(log => log.status === "missed").length;
  const totalPending = todayLogs.filter(log => log.status === "pending").length;

  const patientsWithLowAdherence = patients.filter(p => p.adherence < 70);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-dashboard" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-dashboard)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8">
          <h1 className="text-white text-2xl mb-2">Dashboard</h1>
          <p className="text-white/90 text-sm">Visão geral dos seus pacientes</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 relative z-20 pb-6">
        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-[#14b8a6] mx-auto mb-2" />
            <p className="text-2xl text-[#14b8a6] mb-1">{totalTaken}</p>
            <p className="text-gray-600 text-xs">Tomados</p>
          </Card>
          
          <Card className="p-4 text-center shadow-lg">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl text-yellow-600 mb-1">{totalPending}</p>
            <p className="text-gray-600 text-xs">Pendentes</p>
          </Card>
          
          <Card className="p-4 text-center shadow-lg">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl text-red-600 mb-1">{totalMissed}</p>
            <p className="text-gray-600 text-xs">Perdidos</p>
          </Card>
        </div>

        {/* Alertas de Adesão Baixa */}
        {patientsWithLowAdherence.length > 0 && (
          <Card className="shadow-lg mb-6 bg-red-50 border-red-200">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-red-900 mb-1">Atenção: Adesão Baixa</h3>
                  <p className="text-red-700 text-sm">
                    {patientsWithLowAdherence.length} {patientsWithLowAdherence.length === 1 ? "paciente precisa" : "pacientes precisam"} de atenção
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {patientsWithLowAdherence.map(patient => (
                  <div key={patient.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <span className="text-gray-800">{patient.name}</span>
                    <span className="text-red-600">{patient.adherence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Resumo Geral */}
        <Card className="shadow-lg mb-6">
          <div className="p-5">
            <h3 className="text-[#1e3a8a] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumo Geral
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#14b8a6]" />
                  <span className="text-gray-700">Total de Pacientes</span>
                </div>
                <span className="text-[#1e3a8a]">{patients.length}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14b8a6]" />
                  <span className="text-gray-700">Adesão Média</span>
                </div>
                <span className="text-[#1e3a8a]">
                  {patients.length > 0 
                    ? Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Pacientes */}
        <Card className="shadow-lg">
          <div className="p-5">
            <h3 className="text-[#1e3a8a] mb-4">Seus Pacientes</h3>
            
            {patients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum paciente cadastrado ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {patients.map(patient => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{patient.name}</h4>
                      <p className="text-gray-500 text-sm">{patient.cpf}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg mb-1 ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
