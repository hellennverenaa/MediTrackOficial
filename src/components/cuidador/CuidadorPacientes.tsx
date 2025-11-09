import { useState } from "react";
import { Patient, Medication, MedicationLog } from "../../App";
import { CuidadorPacientesList } from "./CuidadorPacientesList";
import { CuidadorPacienteDetails } from "./CuidadorPacienteDetails";
import { AddPacienteModal } from "./AddPacienteModal";

interface CuidadorPacientesProps {
  patients: Patient[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  onAddPatient: (patient: Omit<Patient, "id" | "adherence">) => void;
  onAddMedication: (medication: Omit<Medication, "id">) => void;
  onRemoveMedication: (id: number) => void;
}

export function CuidadorPacientes({ 
  patients,
  medications,
  medicationLogs,
  onAddPatient,
  onAddMedication,
  onRemoveMedication
}: CuidadorPacientesProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const handleSelectPatient = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  const handleBackToList = () => {
    setSelectedPatientId(null);
  };

  const handleAddPatient = (patient: Omit<Patient, "id" | "adherence">) => {
    onAddPatient(patient);
    setShowAddPatient(false);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientMedications = medications.filter(m => m.patientId === selectedPatientId);
  const patientLogs = medicationLogs.filter(log => {
    const med = medications.find(m => m.id === log.medicationId);
    return med?.patientId === selectedPatientId;
  });

  if (selectedPatient) {
    return (
      <CuidadorPacienteDetails
        patient={selectedPatient}
        medications={patientMedications}
        medicationLogs={patientLogs}
        onBack={handleBackToList}
        onAddMedication={onAddMedication}
        onRemoveMedication={onRemoveMedication}
      />
    );
  }

  return (
    <>
      <CuidadorPacientesList
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onAddPatient={() => setShowAddPatient(true)}
      />
      
      {showAddPatient && (
        <AddPacienteModal
          onAdd={handleAddPatient}
          onClose={() => setShowAddPatient(false)}
        />
      )}
    </>
  );
}
