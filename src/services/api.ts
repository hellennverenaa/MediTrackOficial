// src/services/api.ts
import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========================================
// 🔐 AUTENTICAÇÃO
// ========================================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  // Registrar novo usuário
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    // Salva token e usuário no localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Fazer login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    // Salva token e usuário no localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário logado
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ========================================
// 💊 MEDICAMENTOS
// ========================================

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosageMg: number;
  timesPerDay: number;
  schedules: string[]; // ["08:00", "14:00", "20:00"]
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationData {
  name: string;
  dosageMg: number;
  timesPerDay: number;
  schedules: string[];
  active?: boolean;
}

export interface UpdateMedicationData {
  name?: string;
  dosageMg?: number;
  timesPerDay?: number;
  schedules?: string[];
  active?: boolean;
}

export const medicationService = {
  // Listar todos os medicamentos
  getAll: async (): Promise<Medication[]> => {
    const response = await api.get('/medications');
    return response.data;
  },

  // Buscar medicamento por ID
  getById: async (id: string): Promise<Medication> => {
    const response = await api.get(`/medications/${id}`);
    return response.data;
  },

  // Criar novo medicamento
  create: async (data: CreateMedicationData): Promise<Medication> => {
    const response = await api.post('/medications', data);
    return response.data.medication;
  },

  // Atualizar medicamento
  update: async (id: string, data: UpdateMedicationData): Promise<Medication> => {
    const response = await api.put(`/medications/${id}`, data);
    return response.data.medication;
  },

  // Deletar medicamento
  delete: async (id: string): Promise<void> => {
    await api.delete(`/medications/${id}`);
  },

  // Ativar/Desativar medicamento
  toggleActive: async (id: string, active: boolean): Promise<Medication> => {
    const response = await api.put(`/medications/${id}`, { active });
    return response.data.medication;
  },
};

// ========================================
// 🔔 NOTIFICAÇÕES
// ========================================

export interface UpcomingNotification {
  medicationId: string;
  medicationName: string;
  dosageMg: number;
  scheduledTime: string;
}

export interface TakenRecord {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  takenAt: string;
  createdAt: string;
}

export const notificationService = {
  // Obter próximas notificações do dia
  getUpcoming: async (): Promise<UpcomingNotification[]> => {
    const response = await api.get('/notifications/upcoming');
    return response.data;
  },

  // Marcar medicamento como tomado
  markAsTaken: async (medicationId: string): Promise<TakenRecord> => {
    const response = await api.post('/notifications/taken', {
      medicationId,
      takenAt: new Date().toISOString(),
    });
    return response.data.record;
  },

  // Obter histórico
  getHistory: async (startDate?: string, endDate?: string): Promise<TakenRecord[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/notifications/history?${params.toString()}`);
    return response.data;
  },
};

export default api;