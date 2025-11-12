import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { CadastroPage } from "./components/CadastroPage";
import { CuidadorApp } from "./components/CuidadorApp";
import { PacienteApp } from "./components/PacienteApp";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { authService } from "./services/api"; // ← IMPORTA A API

export interface User {
  id: string; // ← Mudei de number para string (ID do back-end)
  email: string;
  name: string;
  type: "paciente" | "cuidador";
  patientProfileId?: number;
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthdate: string;
  adherence: number;
  cuidadorId: number;
  userId?: string; // ← Mudei para string
}

export interface Medication {
  id: number;
  patientId: number;
  name: string;
  dose: string;
  frequencyType: "interval" | "specific";
  interval?: number;
  startTime?: string;
  specificTimes?: string[];
  timesPerDay?: number;
  alarmEnabled: boolean;
}

export interface MedicationLog {
  id: number;
  medicationId: number;
  scheduledTime: string;
  status: "taken" | "missed" | "pending" | "snoozed";
  confirmedAt?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedMode, setSelectedMode] = useState<"paciente" | "cuidador">("paciente");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Dados simulados (manter para não quebrar o app)
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "João Silva", cpf: "123.456.789-00", birthdate: "1985-03-15", adherence: 85, cuidadorId: 2, userId: "1" },
    { id: 2, name: "Ana Silva", cpf: "123.456.789-00", birthdate: "1985-03-15", adherence: 85, cuidadorId: 2 },
    { id: 3, name: "Carlos Santos", cpf: "987.654.321-00", birthdate: "1978-07-22", adherence: 92, cuidadorId: 2 },
  ]);
  
  const [medications, setMedications] = useState<Medication[]>([
    { 
      id: 1, 
      patientId: 1, 
      name: "Paracetamol", 
      dose: "750 mg",
      frequencyType: "specific",
      specificTimes: ["06:00", "14:00", "22:00"],
      timesPerDay: 3,
      alarmEnabled: true
    },
    { 
      id: 2, 
      patientId: 1, 
      name: "Dipirona", 
      dose: "500 mg",
      frequencyType: "interval",
      interval: 8,
      startTime: "06:00",
      alarmEnabled: true
    },
  ]);

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    { id: 1, medicationId: 1, scheduledTime: "2025-11-03T06:00:00", status: "taken", confirmedAt: "2025-11-03T06:05:00" },
    { id: 2, medicationId: 1, scheduledTime: "2025-11-03T14:00:00", status: "pending" },
    { id: 3, medicationId: 1, scheduledTime: "2025-11-03T22:00:00", status: "pending" },
    { id: 4, medicationId: 2, scheduledTime: "2025-11-03T06:00:00", status: "taken", confirmedAt: "2025-11-03T06:10:00" },
    { id: 5, medicationId: 2, scheduledTime: "2025-11-03T14:00:00", status: "pending" },
  ]);

  // ========================================
  // 🔥 LOGIN AUTOMÁTICO DESABILITADO TEMPORARIAMENTE
  // ========================================
  useEffect(() => {
    // DESABILITADO! Não faz mais login automático ao recarregar
    console.log("⚠️ Login automático DESABILITADO");
    
    // Limpa tudo ao recarregar a página
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    
    // Sempre começa na landing
    setCurrentPage("landing");
    setCurrentUser(null);
  }, []);

  const handleLoginSuccess = (user: any, userType: "paciente" | "cuidador") => {
    console.log("🎯 [handleLoginSuccess] INÍCIO");
    console.log("🎯 [handleLoginSuccess] user recebido:", user);
    console.log("🎯 [handleLoginSuccess] userType:", userType);
    
    const newUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: userType
    };
    
    console.log("🎯 [handleLoginSuccess] newUser criado:", newUser);
    console.log("🎯 [handleLoginSuccess] Chamando setCurrentUser...");
    setCurrentUser(newUser);
    
    console.log("🎯 [handleLoginSuccess] currentUser setado!");
    console.log("🎯 [handleLoginSuccess] currentPage ANTES:", currentPage);
    
    // IMPORTANTE: Também atualiza a página AQUI para garantir sincronia
    const targetPage = userType === "cuidador" ? "cuidador-app" : "paciente-app";
    console.log("🎯 [handleLoginSuccess] targetPage:", targetPage);
    console.log("🎯 [handleLoginSuccess] Chamando setCurrentPage...");
    
    setCurrentPage(targetPage);
    
    console.log("🎯 [handleLoginSuccess] setCurrentPage chamado!");
    console.log("🎯 [handleLoginSuccess] FIM");
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage("landing");
    toast.success("Logout realizado com sucesso!");
  };

  const handleNavigate = (page: string, mode?: "paciente" | "cuidador") => {
    if (mode) {
      setSelectedMode(mode);
    }
    setCurrentPage(page);
  };

  const addPatient = (patient: Omit<Patient, "id" | "adherence">) => {
    const newPatient: Patient = {
      ...patient,
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
      adherence: 0,
      cuidadorId: patient.cuidadorId || parseInt(currentUser?.id || "0"),
    };
    setPatients([...patients, newPatient]);
  };

  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication: Medication = {
      ...medication,
      id: medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1,
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedicationLog = (logId: number, status: "taken" | "missed" | "snoozed") => {
    setMedicationLogs(medicationLogs.map(log => 
      log.id === logId 
        ? { ...log, status, confirmedAt: status === "taken" ? new Date().toISOString() : undefined }
        : log
    ));
  };

  const addTestMedication = (minutesFromNow: number) => {
    if (!currentUser) return;

    const myPatientProfile = patients.find(p => p.userId === currentUser.id);
    if (!myPatientProfile) return;

    const alarmTime = new Date();
    alarmTime.setMinutes(alarmTime.getMinutes() + minutesFromNow);
    const timeStr = `${alarmTime.getHours().toString().padStart(2, "0")}:${alarmTime.getMinutes().toString().padStart(2, "0")}`;

    const newMedId = medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1;
    const testMedication: Medication = {
      id: newMedId,
      patientId: myPatientProfile.id,
      name: "🧪 Teste de Alarme",
      dose: `Programado para ${timeStr}`,
      frequencyType: "specific",
      specificTimes: [timeStr],
      timesPerDay: 1,
      alarmEnabled: true
    };

    setMedications([...medications, testMedication]);

    const newLogId = medicationLogs.length > 0 ? Math.max(...medicationLogs.map(l => l.id)) + 1 : 1;
    const testLog: MedicationLog = {
      id: newLogId,
      medicationId: newMedId,
      scheduledTime: alarmTime.toISOString(),
      status: "pending"
    };

    setMedicationLogs([...medicationLogs, testLog]);
    toast.success(`Alarme de teste programado para ${timeStr}`);
  };

  const generateTodayLogs = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const newLogs: MedicationLog[] = [];
    let logId = medicationLogs.length > 0 ? Math.max(...medicationLogs.map(l => l.id)) + 1 : 1;

    medications.forEach(med => {
      const existingTodayLogs = medicationLogs.filter(log => 
        log.medicationId === med.id && log.scheduledTime.startsWith(todayStr)
      );

      if (existingTodayLogs.length > 0) return;

      if (med.frequencyType === "specific" && med.specificTimes) {
        med.specificTimes.forEach(time => {
          const [hours, minutes] = time.split(":");
          const scheduledDate = new Date(today);
          scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          newLogs.push({
            id: logId++,
            medicationId: med.id,
            scheduledTime: scheduledDate.toISOString(),
            status: "pending"
          });
        });
      } else if (med.frequencyType === "interval" && med.interval && med.startTime) {
        const [hours, minutes] = med.startTime.split(":");
        let currentTime = new Date(today);
        currentTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        while (currentTime.getDate() === today.getDate()) {
          newLogs.push({
            id: logId++,
            medicationId: med.id,
            scheduledTime: currentTime.toISOString(),
            status: "pending"
          });
          
          currentTime = new Date(currentTime.getTime() + (med.interval || 8) * 60 * 60 * 1000);
        }
      }
    });

    if (newLogs.length > 0) {
      setMedicationLogs([...medicationLogs, ...newLogs]);
    }
  };

  useEffect(() => {
    if (currentUser?.type === "paciente" && medications.length > 0) {
      generateTodayLogs();
    }
  }, [currentUser, medications]);

  useEffect(() => {
    if (currentUser?.type !== "paciente") return;

    const checkAlarms = () => {
      const now = new Date();
      const currentMinute = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      
      medicationLogs.forEach(log => {
        if (log.status !== "pending") return;
        
        const logDate = new Date(log.scheduledTime);
        const logMinute = `${logDate.getHours().toString().padStart(2, "0")}:${logDate.getMinutes().toString().padStart(2, "0")}`;
        
        if (currentMinute === logMinute && logDate.toDateString() === now.toDateString()) {
          const med = medications.find(m => m.id === log.medicationId);
          if (med && med.alarmEnabled) {
            const message = `⏰ Hora de tomar: ${med.name} ${med.dose}`;
            toast.info(message, {
              duration: 30000,
              action: {
                label: "Confirmar",
                onClick: () => updateMedicationLog(log.id, "taken")
              }
            });
            
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("MediTrak - Hora da Medicação!", {
                body: message,
                icon: "💊",
                tag: `medication-${log.id}`
              });
            }
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 10000);
    checkAlarms();

    return () => clearInterval(interval);
  }, [currentUser, medicationLogs, medications]);

  useEffect(() => {
    if (currentUser?.type === "paciente" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [currentUser]);

  console.log("🔄 [App.tsx] RENDER - currentPage:", currentPage);
  console.log("🔄 [App.tsx] RENDER - currentUser:", currentUser);

  return (
    <div className="min-h-screen bg-white">
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      
      {currentPage === "login" && (
        <LoginPage 
          onNavigate={handleNavigate}
          selectedMode={selectedMode}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {currentPage === "cadastro" && (
        <CadastroPage 
          onNavigate={handleNavigate}
          selectedMode={selectedMode}
          onSignupSuccess={handleLoginSuccess}
        />
      )}
      
      {currentPage === "cuidador-app" && (() => {
        console.log("🏥 [cuidador-app] Verificando condições...");
        console.log("🏥 [cuidador-app] currentUser:", currentUser);
        console.log("🏥 [cuidador-app] currentUser?.type:", currentUser?.type);
        console.log("🏥 [cuidador-app] Condição atendida?", currentUser?.type === "cuidador");
        
        if (currentUser?.type === "cuidador") {
          console.log("🏥 [cuidador-app] ✅ Renderizando CuidadorApp!");
          return (
            <CuidadorApp
              user={currentUser}
              patients={patients.filter(p => p.cuidadorId === parseInt(currentUser.id))}
              medications={medications}
              medicationLogs={medicationLogs}
              onAddPatient={addPatient}
              onAddMedication={addMedication}
              onRemoveMedication={removeMedication}
              onLogout={handleLogout}
            />
          );
        } else {
          console.log("🏥 [cuidador-app] ❌ Condição NÃO atendida - mostrando tela vazia");
          return null;
        }
      })()}
      
      {currentPage === "paciente-app" && currentUser?.type === "paciente" && (() => {
        const myPatientProfile = patients.find(p => p.userId === currentUser.id);
        return (
          <PacienteApp
            user={currentUser}
            patient={myPatientProfile || patients[0]}
            medications={medications.filter(m => m.patientId === (myPatientProfile?.id || patients[0]?.id))}
            medicationLogs={medicationLogs}
            onUpdateLog={updateMedicationLog}
            onLogout={handleLogout}
            onAddTestMedication={addTestMedication}
          />
        );
      })()}

      <Toaster position="top-center" />
    </div>
  );
}