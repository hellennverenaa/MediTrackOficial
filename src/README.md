# 🏥 MediTrak - Gerenciamento Inteligente de Medicações

MediTrak é um aplicativo mobile-first de health-tech que facilita o gerenciamento de medicações com dois modos distintos: **Modo Paciente** e **Modo Médico/Cuidador**.

## ✨ Funcionalidades

### 👤 Modo Paciente
- **Timeline de Medicações**: Visualize todas as medicações do dia com horários
- **Alarmes em Tempo Real**: Sistema automático que dispara notificações no horário exato ⏰
- **Notificações Push**: Toast in-app + notificações do navegador
- **Geração Automática de Logs**: Sistema cria automaticamente as doses do dia
- **Confirmação Interativa**: Modal intuitivo para confirmar tomada, adiar ou pular dose
- **Histórico Visual**: Calendário de adesão com cores indicativas (verde/amarelo/vermelho)
- **Tratamentos Ativos**: Lista completa de medicações em uso
- **Estatísticas em Tempo Real**: Contadores de medicações tomadas, pendentes e perdidas
- **Botão de Teste**: Teste alarmes facilmente com medicações programadas 🧪

### 🩺 Modo Médico/Cuidador
- **Dashboard Completo**: Visão geral de todos os pacientes e estatísticas
- **Gerenciamento de Pacientes**: Adicionar e visualizar pacientes com CPF e dados pessoais
- **Adicionar Medicações**: Interface avançada com duas opções:
  - **Intervalos**: Define medicação a cada X horas (ex: a cada 8h)
  - **Horários Específicos**: Define horários exatos para cada dose
- **Monitoramento de Adesão**: Gráficos e relatórios detalhados por paciente
- **Controle de Alarmes**: Ativar/desativar notificações para cada medicação
- **Remoção de Medicações**: Gerenciar tratamentos ativos

### 🔐 Sistema de Autenticação
- **Landing Page Moderna**: Design mobile-first com cards interativos
- **Seleção de Modo**: Escolha entre Paciente ou Médico/Cuidador antes do login
- **Validação por Tipo**: Cada usuário só acessa o modo para o qual se cadastrou
- **Cadastro Completo**: Criação de conta com validação de senhas
- **Feedback Visual**: Mensagens de erro claras para login incorreto

## 🎨 Design System

### Cores Corporativas
- **Azul Principal**: `#1e3a8a` (títulos, botões primários)
- **Ciano/Turquesa**: `#00bcd4` (gradientes, fundos)
- **Verde-azulado**: `#14b8a6` (confirmações, sucessos)

### Identidade Visual
- **Background Ondulado**: Padrão SVG com ondas em todas as páginas
- **Cards Arredondados**: `rounded-3xl` para modernidade
- **Gradientes**: Transições suaves entre cores corporativas
- **Tipografia**: Sans-serif limpa e legível
- **Responsivo**: Mobile-first com adaptação para desktop

## 🚀 Tecnologias Utilizadas

- **React** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4.0** - Estilização utility-first
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast
- **Shadcn/UI** - Componentes acessíveis

## 📦 Componentes Shadcn/UI Incluídos

Todos os componentes UI necessários já estão instalados em `/components/ui/`:
- Button, Card, Input, Label, Tabs
- Dialog, Alert, Badge, Avatar
- Table, Switch, Select, Textarea
- Calendar, Checkbox, Radio Group
- Accordion, Dropdown Menu, Popover
- E muitos outros...

## 🧪 Como Testar

### Contas de Teste Pré-cadastradas:

**Modo Paciente:**
- Email: `paciente@teste.com`
- Senha: qualquer

**Modo Médico/Cuidador:**
- Email: `cuidador@teste.com`
- Senha: qualquer

### Criar Nova Conta:
1. Acesse a landing page
2. Escolha o modo desejado (Paciente ou Médico/Cuidador)
3. Clique em "Cadastre-se"
4. Preencha nome, email e senha (mínimo 6 caracteres)
5. Confirme a senha

## 📁 Estrutura de Arquivos

```
/
├── App.tsx                          # Componente principal com gerenciamento de estado
├── components/
│   ├── LandingPage.tsx             # Tela inicial com seleção de modo
│   ├── LoginPage.tsx               # Página de login com validação
│   ├── CadastroPage.tsx            # Página de cadastro
│   ├── CuidadorApp.tsx             # Container do modo cuidador
│   ├── PacienteApp.tsx             # Container do modo paciente
│   ├── cuidador/
│   │   ├── CuidadorDashboard.tsx   # Dashboard principal
│   │   ├── CuidadorPacientes.tsx   # Gerenciador de pacientes
│   │   ├── CuidadorPacientesList.tsx
│   │   ├── CuidadorPacienteDetails.tsx
│   │   ├── AddPacienteModal.tsx    # Modal adicionar paciente
│   │   ├── AddMedicationModal.tsx  # Modal adicionar medicação
│   │   ├── MedicamentosTab.tsx     # Aba de medicamentos
│   │   ├── AdesaoTab.tsx           # Aba de adesão/estatísticas
│   │   └── CuidadorPerfil.tsx      # Perfil do cuidador
│   ├── paciente/
│   │   ├── PacienteHojePage.tsx    # Timeline do dia
│   │   ├── PacienteTratamentosPage.tsx  # Lista de tratamentos
│   │   ├── PacienteHistoricoPage.tsx    # Histórico/calendário
│   │   └── MedicationModal.tsx     # Modal de confirmação
│   └── ui/                         # Componentes Shadcn/UI (43 componentes)
└── styles/
    └── globals.css                 # Estilos globais e tokens
```

## 🎯 Fluxos Principais

### Fluxo de Login (Paciente)
1. Landing Page → Clica em "Sou Paciente"
2. Login Page (Modo Paciente) → Insere credenciais
3. PacienteApp → Timeline com medicações do dia
4. Clica em "Confirmar agora" → Modal de confirmação
5. Escolhe "Sim, tomei" / "Adiar" / "Pular"

### Fluxo de Adicionar Medicação (Cuidador)
1. Landing Page → Clica em "Sou Médico/Cuidador"
2. Login Page (Modo Cuidador) → Insere credenciais
3. CuidadorApp → Tab "Pacientes"
4. Seleciona um paciente → Tab "Medicamentos"
5. Clica no botão "+" (FAB) → Modal complexo
6. Escolhe "Intervalos" ou "Horários Específicos"
7. Preenche dados e salva

## 🔄 Gerenciamento de Estado

O estado global é gerenciado no `App.tsx` e inclui:
- **registeredUsers**: Banco de dados simulado de usuários
- **patients**: Lista de pacientes
- **medications**: Lista de medicações
- **medicationLogs**: Histórico de tomadas (taken/missed/pending/snoozed)

## 🎨 Personalização

### Tokens de Design (globals.css)
O arquivo `styles/globals.css` contém tokens CSS customizados para:
- Tipografia (tamanhos, pesos, line-height)
- Cores (primárias, secundárias, estados)
- Espaçamentos e bordas
- Animações

### Tailwind CSS v4.0
Usando a nova sintaxe do Tailwind v4 sem arquivo de configuração.
Todos os tokens são gerenciados via CSS puro.

## ⚠️ Validações Implementadas

- ✅ Validação de tipo de conta no login
- ✅ Senha mínima de 6 caracteres no cadastro
- ✅ Confirmação de senha no cadastro
- ✅ Feedback visual com mensagens de erro
- ✅ Toast notifications para ações de sucesso
- ✅ Confirmação antes de remover medicações

## 📱 Responsividade

- **Mobile-First**: Design otimizado para telas pequenas (320px+)
- **Tablets**: Adaptação para telas médias (768px+)
- **Desktop**: Layout centralizado em telas grandes (1024px+)

## 🚧 Dados de Exemplo

O app vem com dados mock para facilitar testes:
- 2 pacientes cadastrados (Ana Silva, Carlos Santos)
- 2 medicações para o primeiro paciente
- Logs de medicação para o dia atual
- Gráficos de adesão com dados simulados

## 📝 Notas de Desenvolvimento

- Todos os componentes são TypeScript strict
- Uso de interfaces tipadas para props
- Componentização modular e reutilizável
- Sem uso de classes CSS customizadas (100% Tailwind)
- Performance otimizada com lazy loading quando necessário

## 🎉 Pronto para Download!

Todos os arquivos estão atualizados e funcionando corretamente. O projeto está pronto para ser baixado e executado em qualquer ambiente React/Vite.

---

**Desenvolvido para Figma Make** | Mobile-First Health-Tech Application
