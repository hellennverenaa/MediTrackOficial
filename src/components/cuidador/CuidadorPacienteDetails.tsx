import { useState } from "react";
import { Patient, Medication, MedicationLog } from "../../App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { AdesaoTab } from "./AdesaoTab";
import { MedicamentosTab } from "./MedicamentosTab";
import { ArrowLeft } from "lucide-react";

interface CuidadorPacienteDetailsProps {
  patient: Patient;
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onBack: () => void;
  onAddMedication: (medication: Omit<Medication, "id">) => void;
  onRemoveMedication: (id: number) => void;
}

export function CuidadorPacienteDetails({ 
  patient, 
  medications,
  medicationLogs,
  onBack,
  onAddMedication,
  onRemoveMedication
}: CuidadorPacienteDetailsProps) {
  const [activeTab, setActiveTab] = useState("adesao");

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-details" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-details)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 -ml-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-white text-2xl mb-1">{patient.name}</h1>
          <p className="text-white/90 text-sm">{patient.cpf}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-2 relative z-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white shadow-lg rounded-lg p-1">
            <TabsTrigger value="adesao" className="flex-1 rounded-md">
              Adesão
            </TabsTrigger>
            <TabsTrigger value="medicamentos" className="flex-1 rounded-md">
              Medicamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adesao" className="mt-6">
            <AdesaoTab patient={patient} medications={medications} medicationLogs={medicationLogs} />
          </TabsContent>

          <TabsContent value="medicamentos" className="mt-6">
            <MedicamentosTab
              patient={patient}
              medications={medications}
              onAddMedication={onAddMedication}
              onRemoveMedication={onRemoveMedication}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
