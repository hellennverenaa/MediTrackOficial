# 🔌 Exemplos de API - MediTrak

Este documento contém exemplos de como os dados devem ser estruturados quando você integrar o MediTrak com um backend real (Supabase, Firebase, etc.).

## 📋 Estrutura de Dados

### User (Usuário)

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  type: "paciente" | "cuidador";
  createdAt?: string;
  updatedAt?: string;
}
```

**Exemplo:**
```json
{
  "id": 1,
  "email": "joao@example.com",
  "name": "João Silva",
  "type": "paciente",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

### Patient (Paciente)

```typescript
interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthdate: string;
  adherence: number;
  cuidadorId?: number;
}
```

**Exemplo:**
```json
{
  "id": 1,
  "name": "Ana Silva",
  "cpf": "123.456.789-00",
  "birthdate": "1985-03-15",
  "adherence": 85,
  "cuidadorId": 2
}
```

### Medication (Medicação)

```typescript
interface Medication {
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
  createdAt?: string;
  createdBy?: number;
}
```

**Exemplo 1: Por Intervalos**
```json
{
  "id": 1,
  "patientId": 1,
  "name": "Dipirona",
  "dose": "500 mg",
  "frequencyType": "interval",
  "interval": 8,
  "startTime": "06:00",
  "alarmEnabled": true,
  "createdAt": "2025-11-01T10:00:00Z",
  "createdBy": 2
}
```

**Exemplo 2: Horários Específicos**
```json
{
  "id": 2,
  "patientId": 1,
  "name": "Paracetamol",
  "dose": "750 mg",
  "frequencyType": "specific",
  "specificTimes": ["06:00", "14:00", "22:00"],
  "timesPerDay": 3,
  "alarmEnabled": true,
  "createdAt": "2025-11-01T10:00:00Z",
  "createdBy": 2
}
```

### MedicationLog (Registro de Tomada)

```typescript
interface MedicationLog {
  id: number;
  medicationId: number;
  scheduledTime: string;
  status: "taken" | "missed" | "pending" | "snoozed";
  confirmedAt?: string;
}
```

**Exemplo:**
```json
{
  "id": 1,
  "medicationId": 1,
  "scheduledTime": "2025-11-03T06:00:00Z",
  "status": "taken",
  "confirmedAt": "2025-11-03T06:05:32Z"
}
```

## 🔐 Endpoints Sugeridos

### Autenticação

#### POST /auth/signup
**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123",
  "name": "João Silva",
  "type": "paciente"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "joao@example.com",
    "name": "João Silva",
    "type": "paciente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123",
  "mode": "paciente"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "joao@example.com",
    "name": "João Silva",
    "type": "paciente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Pacientes

#### GET /patients
**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "patients": [
    {
      "id": 1,
      "name": "Ana Silva",
      "cpf": "123.456.789-00",
      "birthdate": "1985-03-15",
      "adherence": 85
    }
  ]
}
```

#### POST /patients
**Request:**
```json
{
  "name": "Carlos Santos",
  "cpf": "987.654.321-00",
  "birthdate": "1978-07-22"
}
```

**Response:**
```json
{
  "patient": {
    "id": 2,
    "name": "Carlos Santos",
    "cpf": "987.654.321-00",
    "birthdate": "1978-07-22",
    "adherence": 0
  }
}
```

### Medicações

#### GET /medications?patientId={id}
**Response:**
```json
{
  "medications": [
    {
      "id": 1,
      "patientId": 1,
      "name": "Dipirona",
      "dose": "500 mg",
      "frequencyType": "interval",
      "interval": 8,
      "startTime": "06:00",
      "alarmEnabled": true
    }
  ]
}
```

#### POST /medications
**Request (Intervalos):**
```json
{
  "patientId": 1,
  "name": "Ibuprofeno",
  "dose": "400 mg",
  "frequencyType": "interval",
  "interval": 6,
  "startTime": "08:00",
  "alarmEnabled": true
}
```

**Request (Horários Específicos):**
```json
{
  "patientId": 1,
  "name": "Atorvastatina",
  "dose": "20 mg",
  "frequencyType": "specific",
  "timesPerDay": 1,
  "specificTimes": ["20:00"],
  "alarmEnabled": true
}
```

**Response:**
```json
{
  "medication": {
    "id": 3,
    "patientId": 1,
    "name": "Ibuprofeno",
    "dose": "400 mg",
    "frequencyType": "interval",
    "interval": 6,
    "startTime": "08:00",
    "alarmEnabled": true,
    "createdAt": "2025-11-03T10:00:00Z"
  }
}
```

#### DELETE /medications/{id}
**Response:**
```json
{
  "success": true,
  "message": "Medicação removida com sucesso"
}
```

### Logs de Medicação

#### GET /medication-logs?date={YYYY-MM-DD}&patientId={id}
**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "medicationId": 1,
      "scheduledTime": "2025-11-03T06:00:00Z",
      "status": "taken",
      "confirmedAt": "2025-11-03T06:05:32Z"
    },
    {
      "id": 2,
      "medicationId": 1,
      "scheduledTime": "2025-11-03T14:00:00Z",
      "status": "pending"
    }
  ]
}
```

#### POST /medication-logs
**Request:**
```json
{
  "medicationId": 1,
  "scheduledTime": "2025-11-03T14:00:00Z",
  "status": "taken"
}
```

**Response:**
```json
{
  "log": {
    "id": 3,
    "medicationId": 1,
    "scheduledTime": "2025-11-03T14:00:00Z",
    "status": "taken",
    "confirmedAt": "2025-11-03T14:03:12Z"
  }
}
```

#### PUT /medication-logs/{id}
**Request:**
```json
{
  "status": "taken"
}
```

**Response:**
```json
{
  "log": {
    "id": 3,
    "medicationId": 1,
    "scheduledTime": "2025-11-03T14:00:00Z",
    "status": "taken",
    "confirmedAt": "2025-11-03T14:03:12Z"
  }
}
```

### Estatísticas

#### GET /stats/adherence?patientId={id}&period={7d|30d|90d}
**Response:**
```json
{
  "adherence": {
    "overall": 85,
    "byDay": [
      { "date": "2025-11-03", "percentage": 100 },
      { "date": "2025-11-02", "percentage": 75 },
      { "date": "2025-11-01", "percentage": 100 }
    ],
    "byMedication": [
      {
        "medicationId": 1,
        "name": "Dipirona",
        "taken": 21,
        "total": 21,
        "percentage": 100
      }
    ]
  }
}
```

## 🗄️ Schema SQL Sugerido

### Tabela: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('paciente', 'cuidador')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: patients
```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  birthdate DATE NOT NULL,
  adherence DECIMAL(5,2) DEFAULT 0,
  cuidador_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: medications
```sql
CREATE TABLE medications (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dose VARCHAR(100) NOT NULL,
  frequency_type VARCHAR(20) NOT NULL CHECK (frequency_type IN ('interval', 'specific')),
  interval INTEGER,
  start_time TIME,
  specific_times TEXT[], -- Array de strings com horários
  times_per_day INTEGER,
  alarm_enabled BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: medication_logs
```sql
CREATE TABLE medication_logs (
  id SERIAL PRIMARY KEY,
  medication_id INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('taken', 'missed', 'pending', 'snoozed')),
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index para consultas rápidas por data
CREATE INDEX idx_medication_logs_scheduled_time ON medication_logs(scheduled_time);
CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
```

### Tabela: patient_cuidador (Many-to-Many)
```sql
CREATE TABLE patient_cuidador (
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  cuidador_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (patient_id, cuidador_id)
);
```

## 🔄 Fluxo de Sincronização

### Ao fazer login
1. Buscar dados do usuário
2. Se cuidador: buscar lista de pacientes
3. Se paciente: buscar suas medicações e logs do dia

### Ao adicionar medicação
1. Salvar no backend
2. Gerar logs pendentes para os próximos 7 dias
3. Atualizar UI local

### Ao confirmar tomada
1. Atualizar status do log no backend
2. Recalcular adherence do paciente
3. Atualizar UI local

### Sincronização periódica
- A cada 5 minutos: buscar novos logs
- A cada hora: atualizar estatísticas de adesão
- Push notifications para lembretes

## 🔔 Push Notifications

### Estrutura da notificação
```json
{
  "title": "Hora da Medicação! 💊",
  "body": "Dipirona 500 mg às 14:00",
  "data": {
    "type": "medication_reminder",
    "medicationId": 1,
    "logId": 123,
    "scheduledTime": "2025-11-03T14:00:00Z"
  },
  "actions": [
    { "action": "taken", "title": "Tomei" },
    { "action": "snooze", "title": "Adiar 10min" },
    { "action": "dismiss", "title": "Depois" }
  ]
}
```

## 🧪 Dados de Teste para Backend

### Seeds para desenvolvimento

```sql
-- Usuários de teste
INSERT INTO users (email, password_hash, name, type) VALUES
('paciente@teste.com', '$2a$10$...', 'João Silva', 'paciente'),
('cuidador@teste.com', '$2a$10$...', 'Dr. Maria Santos', 'cuidador');

-- Pacientes
INSERT INTO patients (name, cpf, birthdate, adherence, cuidador_id) VALUES
('Ana Silva', '123.456.789-00', '1985-03-15', 85, 2),
('Carlos Santos', '987.654.321-00', '1978-07-22', 92, 2);

-- Medicações
INSERT INTO medications (patient_id, name, dose, frequency_type, interval, start_time, alarm_enabled) VALUES
(1, 'Dipirona', '500 mg', 'interval', 8, '06:00', true);

INSERT INTO medications (patient_id, name, dose, frequency_type, specific_times, times_per_day, alarm_enabled) VALUES
(1, 'Paracetamol', '750 mg', 'specific', ARRAY['06:00', '14:00', '22:00'], 3, true);
```

## 📚 Bibliotecas Recomendadas

### Para integração com Supabase
```bash
npm install @supabase/supabase-js
```

### Para React Query (cache e sincronização)
```bash
npm install @tanstack/react-query
```

### Para validação
```bash
npm install zod
```

### Para datas
```bash
npm install date-fns
```

## 💡 Dicas de Implementação

1. **Use React Query** para cache automático e sincronização
2. **Implemente retry logic** para requests que falham
3. **Use optimistic updates** para melhor UX
4. **Implemente offline-first** com service workers
5. **Adicione logging** para debug em produção
6. **Use TypeScript** para type-safety com a API
7. **Implemente rate limiting** no backend
8. **Use transactions** para operações críticas
9. **Adicione indexes** para queries frequentes
10. **Implemente soft deletes** para auditoria

---

**Nota**: Estes são exemplos. Adapte conforme a arquitetura do seu backend!
