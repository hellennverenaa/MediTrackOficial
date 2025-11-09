import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { CadastroPage } from "./components/CadastroPage";
import { CuidadorApp } from "./components/CuidadorApp";
import { PacienteApp } from "./components/PacienteApp";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export interface User {
  id: number;
  email: string;
  name: string;
  type: "paciente" | "cuidador";
  patientProfileId?: number; // Para usuários tipo paciente - vincula ao perfil de Patient
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthdate: string;
  adherence: number;
  cuidadorId: number; // ID do cuidador responsável
  userId?: number; // ID do usuário (se o paciente também é um usuário do sistema)
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
  
  // Banco de dados simulado de usuários
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    { id: 1, email: "paciente@teste.com", name: "João Silva", type: "paciente", patientProfileId: 1 },
    { id: 2, email: "cuidador@teste.com", name: "Dr. Maria Santos", type: "cuidador" },
  ]);
  
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "João Silva", cpf: "123.456.789-00", birthdate: "1985-03-15", adherence: 85, cuidadorId: 2, userId: 1 },
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

  const handleLogin = (email: string, password: string, mode: "paciente" | "cuidador"): boolean => {
    // Verifica se o usuário existe e se o tipo corresponde ao modo selecionado
    const user = registeredUsers.find(u => u.email === email && u.type === mode);
    
    if (user) {
      setCurrentUser(user);
      setCurrentPage(mode === "paciente" ? "paciente-app" : "cuidador-app");
      return true;
    }
    
    return false;
  };

  const handleSignup = (
    email: string, 
    password: string, 
    userType: "paciente" | "cuidador", 
    name: string,
    cuidadorEmail?: string,
    cpf?: string,
    birthdate?: string
  ): { success: boolean; error?: string } => {
    const newUserId = Date.now();
    
    // Se for paciente, precisa vincular a um cuidador
    if (userType === "paciente") {
      const cuidador = registeredUsers.find(u => u.email === cuidadorEmail && u.type === "cuidador");
      
      if (!cuidador) {
        return { success: false, error: "Cuidador não encontrado. Verifique o email do seu médico/cuidador." };
      }
      
      // Criar perfil de paciente vinculado ao cuidador
      const newPatientId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
      const newPatient: Patient = {
        id: newPatientId,
        name,
        cpf: cpf || "",
        birthdate: birthdate || "",
        adherence: 0,
        cuidadorId: cuidador.id,
        userId: newUserId
      };
      
      setPatients([...patients, newPatient]);
      
      // Criar usuário com vinculação ao perfil de paciente
      const newUser: User = {
        id: newUserId,
        email,
        name,
        type: userType,
        patientProfileId: newPatientId
      };
      
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      setCurrentPage("paciente-app");
      
      return { success: true };
    } else {
      // Se for cuidador, criar apenas o usuário
      const newUser: User = {
        id: newUserId,
        email,
        name,
        type: userType
      };
      
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      setCurrentPage("cuidador-app");
      
      return { success: true };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
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
      cuidadorId: patient.cuidadorId || currentUser?.id || 0,
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

  // Função para adicionar medicação de teste (para testar alarmes)
  const addTestMedication = (minutesFromNow: number) => {
    if (!currentUser) return;

    const myPatientProfile = patients.find(p => p.id === currentUser.patientProfileId);
    if (!myPatientProfile) return;

    // Calcular horário do alarme
    const alarmTime = new Date();
    alarmTime.setMinutes(alarmTime.getMinutes() + minutesFromNow);
    const timeStr = `${alarmTime.getHours().toString().padStart(2, "0")}:${alarmTime.getMinutes().toString().padStart(2, "0")}`;

    // Criar medicação de teste
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

    // Criar log pendente
    const newLogId = medicationLogs.length > 0 ? Math.max(...medicationLogs.map(l => l.id)) + 1 : 1;
    const testLog: MedicationLog = {
      id: newLogId,
      medicationId: newMedId,
      scheduledTime: alarmTime.toISOString(),
      status: "pending"
    };

    setMedicationLogs([...medicationLogs, testLog]);

    toast.success(`Alarme de teste programado para ${timeStr} (daqui ${minutesFromNow} minuto${minutesFromNow > 1 ? 's' : ''})`);
  };

  // Função para gerar logs automáticos para hoje baseado nas medicações
  const generateTodayLogs = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const newLogs: MedicationLog[] = [];
    let logId = medicationLogs.length > 0 ? Math.max(...medicationLogs.map(l => l.id)) + 1 : 1;

    medications.forEach(med => {
      // Verificar se já existem logs para hoje para este medicamento
      const existingTodayLogs = medicationLogs.filter(log => 
        log.medicationId === med.id && log.scheduledTime.startsWith(todayStr)
      );

      if (existingTodayLogs.length > 0) return; // Já tem logs para hoje

      if (med.frequencyType === "specific" && med.specificTimes) {
        // Criar log para cada horário específico
        med.specificTimes.forEach(time => {
          const [hours, minutes] = time.split(":");
          const scheduledDate = new Date(today);
          scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          newLogs.push({
            id: logId++,
            medicationId: med.id,
            scheduledTime: scheduledDate.toISOString(),
            status: scheduledDate <= new Date() ? "pending" : "pending"
          });
        });
      } else if (med.frequencyType === "interval" && med.interval && med.startTime) {
        // Criar logs baseado em intervalo
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

  // Gerar logs quando as medicações mudarem ou quando logar como paciente
  useEffect(() => {
    if (currentUser?.type === "paciente" && medications.length > 0) {
      generateTodayLogs();
    }
  }, [currentUser, medications]);

  // Sistema de alarmes em tempo real
  useEffect(() => {
    if (currentUser?.type !== "paciente") return;

    const checkAlarms = () => {
      const now = new Date();
      const currentMinute = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      
      medicationLogs.forEach(log => {
        if (log.status !== "pending") return;
        
        const logDate = new Date(log.scheduledTime);
        const logMinute = `${logDate.getHours().toString().padStart(2, "0")}:${logDate.getMinutes().toString().padStart(2, "0")}`;
        
        // Verificar se é o horário exato (mesmo minuto)
        if (currentMinute === logMinute && logDate.toDateString() === now.toDateString()) {
          const med = medications.find(m => m.id === log.medicationId);
          if (med && med.alarmEnabled) {
            // Disparar notificação
            const message = `⏰ Hora de tomar: ${med.name} ${med.dose}`;
            toast.info(message, {
              duration: 30000, // 30 segundos
              action: {
                label: "Confirmar",
                onClick: () => updateMedicationLog(log.id, "taken")
              }
            });
            
            // Tentar notificação do navegador (se permitido)
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

    // Verificar a cada 10 segundos (para testar)
    const interval = setInterval(checkAlarms, 10000);
    
    // Verificar imediatamente
    checkAlarms();

    return () => clearInterval(interval);
  }, [currentUser, medicationLogs, medications]);

  // Solicitar permissão para notificações ao fazer login como paciente
  useEffect(() => {
    if (currentUser?.type === "paciente" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-white">
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "login" && (
        <LoginPage 
          onNavigate={handleNavigate} 
          onLogin={handleLogin} 
          selectedMode={selectedMode}
        />
      )}
      {currentPage === "cadastro" && (
        <CadastroPage 
          onNavigate={handleNavigate} 
          onSignup={handleSignup}
          selectedMode={selectedMode}
        />
      )}
      
      {currentPage === "cuidador-app" && currentUser?.type === "cuidador" && (
        <CuidadorApp
          user={currentUser}
          patients={patients.filter(p => p.cuidadorId === currentUser.id)}
          medications={medications}
          medicationLogs={medicationLogs}
          onAddPatient={addPatient}
          onAddMedication={addMedication}
          onRemoveMedication={removeMedication}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === "paciente-app" && currentUser?.type === "paciente" && (() => {
        const myPatientProfile = patients.find(p => p.id === currentUser.patientProfileId);
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
