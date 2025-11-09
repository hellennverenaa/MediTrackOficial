# ⏰ Sistema de Alarmes e Notificações - MediTrak

## 🎯 Visão Geral

O MediTrak agora possui um **sistema completo de alarmes em tempo real** que:
- ✅ Gera automaticamente logs de medicação para o dia atual
- ✅ Monitora horários em tempo real
- ✅ Dispara alarmes quando chega a hora exata de tomar medicamentos
- ✅ Atualiza contadores (tomados/pendentes/perdidos) automaticamente
- ✅ Permite testar alarmes facilmente

## 🚀 Funcionalidades Implementadas

### 1. Geração Automática de Logs

**O que faz:**
- Quando paciente faz login, o sistema cria automaticamente todos os logs de medicação para o dia atual
- Respeita tanto medicações com horários específicos quanto intervalos
- Não duplica logs já existentes

**Como funciona:**
```typescript
// Para medicações com horários específicos (ex: 06:00, 14:00, 22:00)
- Cria 1 log para cada horário

// Para medicações com intervalos (ex: a cada 8 horas, começando às 06:00)
- Calcula todos os horários do dia (06:00, 14:00, 22:00)
- Cria 1 log para cada horário calculado
```

**Exemplo:**
```
Medicação: Paracetamol 750mg
Horários: 06:00, 14:00, 22:00

Logs gerados automaticamente:
├── Log 1: Hoje 06:00 - Status: pending
├── Log 2: Hoje 14:00 - Status: pending
└── Log 3: Hoje 22:00 - Status: pending
```

### 2. Sistema de Alarmes em Tempo Real

**O que faz:**
- Monitora constantemente o horário atual (verificação a cada 10 segundos)
- Quando chega a hora EXATA de um medicamento pendente:
  - Dispara toast notification na tela
  - Dispara notificação do navegador (se permitido)
  - Permite confirmar tomada direto da notificação

**Tipos de Notificação:**

#### Toast (In-App)
```
⏰ Hora de tomar: Paracetamol 750 mg
[Botão: Confirmar]
```
- Aparece na parte superior da tela
- Dura 30 segundos
- Tem botão para confirmar imediatamente

#### Notificação do Navegador
```
🔔 MediTrak - Hora da Medicação!
💊 ⏰ Hora de tomar: Paracetamol 750 mg
```
- Aparece como notificação do sistema
- Funciona mesmo se a aba não estiver em foco
- Requer permissão do usuário

### 3. Atualização em Tempo Real

**Contadores:**
```
┌─────────────┬─────────────┬─────────────┐
│  Tomados    │  Pendentes  │  Perdidos   │
│     2       │      3      │      0      │
└─────────────┴─────────────┴─────────────┘
```

**Atualizam automaticamente quando:**
- Paciente confirma tomada
- Paciente marca como perdido
- Paciente adia medicação
- Novo log é gerado

### 4. Botão de Teste de Alarmes 🧪

**Localização:**
- Botão roxo flutuante no canto inferior esquerdo
- Ícone de sino (Bell)
- Visível apenas no modo paciente

**Funcionalidades:**
- Adicionar alarme daqui 1 minuto
- Adicionar alarme daqui 2 minutos
- Adicionar alarme daqui 5 minutos

**O que faz:**
1. Cria uma medicação de teste chamada "🧪 Teste de Alarme"
2. Programa alarme para o horário selecionado
3. Cria log pendente
4. Quando chega a hora, dispara notificação igual às reais

## 📋 Como Usar

### Passo 1: Permitir Notificações

Quando fazer login como paciente pela primeira vez:

```
┌─────────────────────────────────────────────────┐
│ 🔔 O site MediTrak deseja enviar notificações   │
│                                                 │
│  [Bloquear]              [Permitir]             │
└─────────────────────────────────────────────────┘
```

**Clique em "Permitir"** para receber alarmes

### Passo 2: Verificar Medicações do Dia

Na tela "Hoje", você verá:

```
┌─────────────────────────────────────────────────┐
│ 📅 Medicações de Hoje                           │
├─────────────────────────────────────────────────┤
│ ✓ 06:00 - Paracetamol 750mg [Tomado]          │
│ ○ 14:00 - Paracetamol 750mg [Pendente]        │
│ ○ 22:00 - Paracetamol 750mg [Pendente]        │
│ ○ 06:00 - Dipirona 500mg    [Pendente]        │
└─────────────────────────────────────────────────┘
```

### Passo 3: Testar Alarmes

1. **Clique no botão roxo** (🔔) no canto inferior esquerdo
2. **Selecione um tempo:** "Daqui 1 minuto"
3. **Aguarde o alarme:**
   - Em 1 minuto, você receberá a notificação
   - Toast aparecerá na tela
   - Notificação do navegador também

### Passo 4: Confirmar Tomada

Quando o alarme disparar:

**Opção 1: Pela notificação toast**
- Clique no botão "Confirmar"
- Status muda para "Tomado" instantaneamente

**Opção 2: Pela timeline**
- Role até o medicamento
- Clique em "Confirmar agora"
- Modal abre com opções

**Opção 3: Pelo modal completo**
```
┌─────────────────────────────────────────────────┐
│ 💊 Hora da Medicação!                           │
│ Você tomou sua dose de Paracetamol 750mg?      │
│                                                 │
│  [✓ Sim, tomei]                                │
│  [⏰ Adiar 10 min]                              │
│  [✗ Pular esta dose]                           │
└─────────────────────────────────────────────────┘
```

## 🧪 Cenários de Teste

### Teste 1: Alarme Imediato (1 minuto)

**Objetivo:** Verificar se o sistema dispara alarme corretamente

**Passos:**
1. Login como paciente@teste.com
2. Clique no botão roxo de teste (🔔)
3. Selecione "Daqui 1 minuto"
4. Aguarde 1 minuto
5. **Esperado:**
   - Toast aparece no topo
   - Notificação do navegador (se permitido)
   - Botão "Confirmar" funciona

### Teste 2: Múltiplos Alarmes

**Objetivo:** Testar vários alarmes simultâneos

**Passos:**
1. Adicione alarme daqui 1 minuto
2. Adicione alarme daqui 2 minutos
3. Adicione alarme daqui 5 minutos
4. **Esperado:**
   - 3 medicações de teste na timeline
   - Alarmes disparam nos horários corretos
   - Contadores atualizam conforme confirmações

### Teste 3: Alarme com Aba em Background

**Objetivo:** Verificar notificações quando não está olhando

**Passos:**
1. Adicione alarme daqui 2 minutos
2. Mude para outra aba/janela
3. Aguarde o horário
4. **Esperado:**
   - Notificação do navegador aparece
   - Som de notificação (se configurado)
   - Ao voltar para a aba, vê o toast

### Teste 4: Contadores em Tempo Real

**Objetivo:** Verificar atualização automática dos números

**Passos:**
1. Observe os contadores iniciais
2. Confirme uma medicação pendente
3. **Esperado:**
   - "Tomados" aumenta +1
   - "Pendentes" diminui -1
   - Atualização instantânea

### Teste 5: Medicação Real (Cuidador + Paciente)

**Objetivo:** Fluxo completo real

**Passos:**
1. Login como cuidador@teste.com
2. Adicione medicação com horário específico (ex: próximos 5 minutos)
3. Logout e login como paciente@teste.com
4. Aguarde o horário
5. **Esperado:**
   - Alarme dispara no horário exato
   - Paciente pode confirmar
   - Status atualiza

## ⚙️ Configurações Técnicas

### Frequência de Verificação
```typescript
// Verifica alarmes a cada 10 segundos
const interval = setInterval(checkAlarms, 10000);
```

**Por que 10 segundos?**
- Precisão suficiente para alarmes
- Não sobrecarrega o sistema
- Economiza bateria em mobile

### Lógica de Disparo
```typescript
// Alarme dispara apenas:
1. Se status === "pending"
2. Se horário EXATO (mesmo minuto)
3. Se data === hoje
4. Se alarmEnabled === true
```

### Duração das Notificações
```typescript
Toast: 30 segundos (30000ms)
Notificação Navegador: Até ser fechada pelo usuário
```

## 🔔 Permissões de Notificação

### Estados Possíveis

**1. Default (Padrão)**
- Usuário nunca foi perguntado
- Sistema pede permissão ao fazer login

**2. Granted (Permitido)**
```
✅ Notificações permitidas
- Toast: Funciona sempre
- Navegador: Funciona sempre
```

**3. Denied (Negado)**
```
⚠️ Notificações bloqueadas
- Toast: Funciona normalmente
- Navegador: Não funciona
```

### Como Permitir Manualmente

**Chrome:**
1. Clique no cadeado/ícone ao lado da URL
2. Configurações do site
3. Notificações → Permitir

**Firefox:**
1. Clique no ícone (i) ao lado da URL
2. Permissões
3. Notificações → Permitir

**Safari:**
1. Safari → Preferências
2. Websites → Notificações
3. Permitir para o site

## 📊 Estrutura de Dados

### MedicationLog
```typescript
interface MedicationLog {
  id: number;
  medicationId: number;
  scheduledTime: string; // ISO 8601 (ex: "2025-11-03T14:00:00")
  status: "taken" | "missed" | "pending" | "snoozed";
  confirmedAt?: string;  // Timestamp da confirmação
}
```

### Estados de Log

**pending** → Aguardando tomada
- Alarme vai disparar no horário
- Botão "Confirmar agora" visível
- Conta como "Pendente"

**taken** → Já foi tomado
- Alarme não dispara
- Mostra hora da confirmação
- Conta como "Tomado"

**missed** → Paciente pulou/perdeu
- Alarme não dispara mais
- Marcado em vermelho
- Conta como "Perdido"

**snoozed** → Adiado (futuro)
- Adia por 10 minutos
- Ainda não implementado completamente

## 🐛 Troubleshooting

### Alarme não dispara

**Possíveis causas:**
1. ❌ Notificações bloqueadas
   - **Solução:** Permitir nas configurações do navegador

2. ❌ Horário já passou
   - **Solução:** Usar botão de teste com horário futuro

3. ❌ Status não está "pending"
   - **Solução:** Verificar se já foi confirmado

4. ❌ alarmEnabled === false
   - **Solução:** Cuidador reativar alarmes na medicação

### Contadores não atualizam

**Causa:** Cache de estado React
**Solução:** 
- Atualizar a página (F5)
- Fazer logout e login novamente

### Múltiplas notificações

**Causa:** Verificação muito frequente
**Normal:** Sistema verifica a cada 10s, mas só dispara 1x por minuto

### Toast não desaparece

**Causa:** Duração longa (30s)
**Normal:** É intencional para dar tempo de confirmar

## 🎨 Customização

### Mudar intervalo de verificação

Em `App.tsx`:
```typescript
// De 10 segundos para 5 segundos
const interval = setInterval(checkAlarms, 5000);
```

### Mudar duração do toast

Em `App.tsx`:
```typescript
toast.info(message, {
  duration: 60000, // 60 segundos ao invés de 30
  // ...
});
```

### Desativar botão de teste

Em `App.tsx`, não passar a prop:
```typescript
<PacienteApp
  // ...
  // Remover: onAddTestMedication={addTestMedication}
/>
```

## 📱 Experiência Mobile

### Push Notifications (Futuro)
Atualmente usa Web Notifications API.
Para produção, considere:
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNS)
- Service Workers para offline

### Vibração (Futuro)
```typescript
if ("vibrate" in navigator) {
  navigator.vibrate([200, 100, 200]); // padrão de vibração
}
```

## ✅ Checklist de Funcionalidades

### Implementadas ✅
- [x] Geração automática de logs do dia
- [x] Monitoramento de horários em tempo real
- [x] Toast notifications
- [x] Browser notifications
- [x] Botão de teste de alarmes
- [x] Contadores em tempo real
- [x] Confirmação pela notificação
- [x] Suporte a horários específicos
- [x] Suporte a intervalos
- [x] Permissão de notificações ao login

### Futuras 🔮
- [ ] Snooze funcional (adiar 10 min)
- [ ] Vibração em mobile
- [ ] Sons customizados
- [ ] Alarmes recorrentes automáticos
- [ ] Push notifications nativas
- [ ] Lembretes antes do horário (5 min antes)
- [ ] Estatísticas de alarmes perdidos

## 🎉 Resultado Final

Com essas implementações, o MediTrak agora:

✅ **Gera logs automaticamente** quando paciente faz login
✅ **Dispara alarmes em tempo real** no horário exato
✅ **Atualiza contadores** instantaneamente
✅ **Permite testes fáceis** com botão dedicado
✅ **Funciona em background** com notificações do navegador
✅ **Interface intuitiva** com confirmação rápida

**Status: SISTEMA DE ALARMES 100% FUNCIONAL! ⏰**

---

**Dica:** Para melhor experiência, sempre permita notificações ao fazer login e teste com o botão roxo antes de usar com medicações reais!
