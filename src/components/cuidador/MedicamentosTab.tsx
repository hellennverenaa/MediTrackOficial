import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Patient, Medication } from "../../App";
import { Plus, Pill, Clock, Trash2 } from "lucide-react";
import { AddMedicationModal } from "./AddMedicationModal";
import { toast } from "sonner@2.0.3";

interface MedicamentosTabProps {
  patient: Patient;
  medications: Medication[];
  onAddMedication: (medication: Omit<Medication, "id">) => void;
  onRemoveMedication: (id: number) => void;
}

export function MedicamentosTab({ 
  patient,
  medications, 
  onAddMedication,
  onRemoveMedication 
}: MedicamentosTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddMedication = (medication: Omit<Medication, "id">) => {
    onAddMedication({ ...medication, patientId: patient.id });
    setShowAddModal(false);
  };

  const handleRemove = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta medicação?")) {
      onRemoveMedication(id);
      toast.success("Medicação removida");
    }
  };

  const getTimesDisplay = (med: Medication) => {
    if (med.frequencyType === "interval") {
      return `A cada ${med.interval} horas (início: ${med.startTime})`;
    } else {
      return med.specificTimes?.join(", ") || "";
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {medications.length === 0 ? (
        <Card className="shadow-lg p-8 text-center">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">
            Nenhuma medicação cadastrada para {patient.name.split(" ")[0]}.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Medicação
          </Button>
        </Card>
      ) : (
        <>
          {medications.map((med) => (
            <Card key={med.id} className="shadow-lg">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00bcd4] to-[#14b8a6] rounded-full flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[#1e3a8a] text-lg mb-1">{med.name}</h3>
                    <p className="text-gray-600 mb-3">{med.dose}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[#14b8a6]" />
                        <span className="text-gray-700">{getTimesDisplay(med)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                          med.alarmEnabled
                            ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {med.alarmEnabled ? "🔔 Alarmes ativos" : "🔕 Sem alarmes"}
                        </span>
                        
                        <button
                          onClick={() => handleRemove(med.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal de Adicionar Medicação */}
      {showAddModal && (
        <AddMedicationModal
          onAdd={handleAddMedication}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
