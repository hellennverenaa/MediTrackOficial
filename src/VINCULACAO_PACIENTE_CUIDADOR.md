# 🔗 Sistema de Vinculação Paciente-Cuidador

## 📋 Visão Geral

O MediTrak agora possui um **sistema completo de vinculação** entre pacientes e cuidadores/médicos. Quando um paciente se cadastra, ele é automaticamente vinculado ao médico/cuidador responsável.

## 🎯 Como Funciona

### Para o Cuidador/Médico

1. **Cadastro Simples**
   - Cuidador cria conta normalmente
   - Seleciona "Sou Médico/Cuidador"
   - Preenche: nome, email e senha
   - Pronto! Já pode gerenciar pacientes

2. **Informar Email aos Pacientes**
   - Após criar a conta, o cuidador deve informar seu **email** aos pacientes
   - Os pacientes usarão esse email para se vincular durante o cadastro

3. **Gerenciar Pacientes**
   - Cuidador vê apenas **seus próprios pacientes**
   - Pode adicionar medicações para cada paciente
   - Monitora adesão de cada paciente vinculado a ele

### Para o Paciente

1. **Cadastro com Vinculação**
   - Paciente seleciona "Sou Paciente"
   - Preenche seus dados pessoais
   - **IMPORTANTE**: Informa o email do médico/cuidador
   - Opcionalmente informa CPF e data de nascimento
   - Cria senha e confirma

2. **Validação Automática**
   - Sistema verifica se o email do cuidador existe
   - Se existir: cria conta e vincula automaticamente
   - Se não existir: exibe erro explicativo

3. **Acesso Personalizado**
   - Paciente vê apenas **suas próprias medicações**
   - Medicações são adicionadas pelo cuidador vinculado
   - Timeline mostra apenas suas doses do dia

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CUIDADOR CRIA CONTA                                     │
│    ✅ Email: dra.maria@example.com                         │
│    ✅ Tipo: Cuidador                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CUIDADOR INFORMA SEU EMAIL AO PACIENTE                 │
│    📧 "Use meu email: dra.maria@example.com"               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PACIENTE SE CADASTRA                                    │
│    ✅ Nome: João Silva                                     │
│    ✅ Email: joao@example.com                              │
│    ✅ Email do Cuidador: dra.maria@example.com            │
│    ✅ CPF: 123.456.789-00 (opcional)                       │
│    ✅ Data Nasc: 15/03/1985 (opcional)                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SISTEMA CRIA VINCULAÇÃO AUTOMÁTICA                     │
│    🔗 User João (id: 123, tipo: paciente)                 │
│    🔗 Patient João (id: 456, cuidadorId: 2, userId: 123)  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. CUIDADOR ADICIONA MEDICAÇÕES                           │
│    💊 Dra. Maria adiciona "Paracetamol 750mg"             │
│    💊 Para o paciente: João Silva                          │
│    💊 Horários: 06:00, 14:00, 22:00                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PACIENTE VÊ SUAS MEDICAÇÕES                            │
│    📱 João faz login                                       │
│    📱 Timeline mostra Paracetamol nos horários             │
│    📱 Pode confirmar tomada                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Estrutura de Dados

### Interface User
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  type: "paciente" | "cuidador";
  patientProfileId?: number; // Só para usuários tipo paciente
}
```

### Interface Patient
```typescript
interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthdate: string;
  adherence: number;
  cuidadorId: number; // ID do cuidador responsável
  userId?: number; // ID do usuário (se for usuário do sistema)
}
```

## 📝 Exemplo de Dados

### Usuário Cuidador
```json
{
  "id": 2,
  "email": "dra.maria@example.com",
  "name": "Dra. Maria Santos",
  "type": "cuidador"
}
```

### Usuário Paciente
```json
{
  "id": 1,
  "email": "joao@example.com",
  "name": "João Silva",
  "type": "paciente",
  "patientProfileId": 1
}
```

### Perfil de Paciente
```json
{
  "id": 1,
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "birthdate": "1985-03-15",
  "adherence": 85,
  "cuidadorId": 2,
  "userId": 1
}
```

## ✨ Funcionalidades

### ✅ Implementado

- [x] Cadastro de cuidador (sem vinculações)
- [x] Cadastro de paciente com email do cuidador
- [x] Validação automática de email do cuidador
- [x] Criação automática de perfil Patient ao cadastrar User paciente
- [x] Vinculação bidirecional (User ↔ Patient)
- [x] Filtragem de pacientes por cuidador
- [x] Filtragem de medicações por paciente
- [x] Mensagens de erro claras

### 🎨 Interface

- [x] Campo "Email do Médico/Cuidador" no cadastro de paciente
- [x] Campos opcionais de CPF e Data de Nascimento
- [x] Card informativo explicando a vinculação
- [x] Mensagens de erro visuais e claras
- [x] Validação em tempo real

## 🚀 Como Testar

### 1. Criar Conta de Cuidador

```
Landing Page > "Sou Médico/Cuidador" > Cadastre-se

Nome: Dr. João Silva
Email: dr.joao@teste.com
Senha: 123456
Confirmar Senha: 123456
```

### 2. Criar Conta de Paciente Vinculado

```
Landing Page > "Sou Paciente" > Cadastre-se

Nome: Maria Santos
Email: maria@teste.com
Email do Médico/Cuidador: dr.joao@teste.com  ← IMPORTANTE!
CPF: 123.456.789-00 (opcional)
Data de Nascimento: 15/03/1985 (opcional)
Senha: 123456
Confirmar Senha: 123456
```

### 3. Testar Erro (Email Inválido)

```
Landing Page > "Sou Paciente" > Cadastre-se

Email do Médico/Cuidador: emailinvalido@teste.com

❌ Erro: "Cuidador não encontrado. Verifique o email do seu médico/cuidador."
```

### 4. Login e Verificação

```
Cuidador:
- Login: dr.joao@teste.com
- Vê apenas pacientes vinculados a ele
- Pode adicionar medicações para Maria Santos

Paciente:
- Login: maria@teste.com
- Vê apenas suas próprias medicações
- Recebe lembretes nos horários programados
```

## 🔍 Validações Implementadas

### No Cadastro de Paciente
1. ✅ Email do cuidador é obrigatório
2. ✅ Email do cuidador deve existir no sistema
3. ✅ Email do cuidador deve ser tipo "cuidador"
4. ✅ Não pode usar email de outro paciente

### No Sistema
1. ✅ Paciente só vê suas próprias medicações
2. ✅ Cuidador só vê seus próprios pacientes
3. ✅ Medicações são vinculadas ao Patient, não ao User
4. ✅ Timeline do paciente filtra por patientProfileId

## 🎯 Benefícios

### Para o Paciente
- ✅ Cadastro rápido e intuitivo
- ✅ Vinculação automática ao médico
- ✅ Não precisa adicionar medicações manualmente
- ✅ Recebe lembretes configurados pelo médico

### Para o Cuidador
- ✅ Vê apenas seus pacientes
- ✅ Gerencia medicações centralizadamente
- ✅ Monitora adesão de cada paciente
- ✅ Pode ter múltiplos pacientes

### Para o Sistema
- ✅ Dados organizados e relacionados
- ✅ Segurança (cada um vê apenas seus dados)
- ✅ Escalável para múltiplos cuidadores
- ✅ Rastreabilidade completa

## 📊 Casos de Uso

### Caso 1: Médico com Múltiplos Pacientes
```
Dr. João (cuidador)
├── Maria Santos (paciente 1)
│   ├── Paracetamol 750mg
│   └── Dipirona 500mg
├── Carlos Silva (paciente 2)
│   ├── Losartana 50mg
│   └── Atorvastatina 20mg
└── Ana Oliveira (paciente 3)
    └── Metformina 850mg
```

### Caso 2: Familiar Cuidando de Idoso
```
João (cuidador - filho)
└── Maria (paciente - mãe)
    ├── Remédio da pressão
    ├── Remédio do diabetes
    └── Vitamina D
```

### Caso 3: Enfermeiro em Clínica
```
Enfermeira Paula (cuidador)
├── Paciente A (leito 101)
├── Paciente B (leito 102)
├── Paciente C (leito 103)
└── Paciente D (leito 104)
```

## ⚠️ Observações Importantes

### Contas de Teste Atualizadas

**Cuidador:**
- Email: `cuidador@teste.com`
- Senha: qualquer
- Tem 3 pacientes vinculados

**Paciente:**
- Email: `paciente@teste.com`
- Senha: qualquer
- Vinculado ao cuidador acima
- Vê medicações do Patient ID 1

### Para Adicionar Mais Pacientes

**Opção 1: Cuidador adiciona manualmente**
- Login como cuidador
- Vai em "Pacientes"
- Clica no botão "+"
- Adiciona paciente (não tem login próprio)

**Opção 2: Paciente se cadastra**
- Vai na landing page
- Cadastra-se como paciente
- Informa email do cuidador
- Ganha login próprio automaticamente

## 🔮 Próximos Passos

### Features Futuras (não implementadas)
- [ ] Múltiplos cuidadores por paciente
- [ ] Transferência de paciente entre cuidadores
- [ ] Convites por código (ao invés de email)
- [ ] Notificações quando paciente se vincula
- [ ] Histórico de vinculações
- [ ] Aprovação do cuidador para aceitar paciente

## 🆘 Troubleshooting

### "Cuidador não encontrado"
**Causa**: Email do cuidador não existe ou está errado
**Solução**: 
1. Verifique se o cuidador já criou conta
2. Confirme o email exato (case-sensitive)
3. Peça ao cuidador para repassar o email correto

### "Paciente não vê medicações"
**Causa**: Medicações não foram adicionadas pelo cuidador
**Solução**: 
1. Cuidador deve fazer login
2. Selecionar o paciente
3. Ir em "Medicamentos"
4. Adicionar medicações

### "Cuidador não vê o paciente"
**Causa**: Paciente se cadastrou com email errado
**Solução**: 
1. Verificar se email do cuidador está correto
2. Paciente pode precisar criar nova conta
3. Verificar se paciente completou cadastro

---

**Sistema 100% Funcional! 🎉**

Agora o MediTrak possui vinculação completa entre pacientes e cuidadores, tornando o gerenciamento de medicações muito mais eficiente e organizado.
