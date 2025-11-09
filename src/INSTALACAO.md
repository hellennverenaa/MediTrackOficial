# 📦 Guia de Instalação - MediTrak

## Pré-requisitos

Certifique-se de ter instalado em seu sistema:
- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)

## 📋 Bibliotecas Necessárias

O projeto MediTrak utiliza as seguintes dependências:

### Dependências Principais
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "lucide-react": "latest",
  "sonner": "2.0.3"
}
```

### Dependências de Desenvolvimento
```json
{
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "@types/react": "^18.x",
  "@types/react-dom": "^18.x"
}
```

## 🚀 Instalação Rápida

### Opção 1: Usando npm

```bash
# Instalar todas as dependências
npm install

# Instalar dependências específicas
npm install react react-dom
npm install lucide-react
npm install sonner@2.0.3
npm install -D typescript tailwindcss
npm install -D @types/react @types/react-dom
```

### Opção 2: Usando yarn

```bash
# Instalar todas as dependências
yarn install

# Ou instalar individualmente
yarn add react react-dom
yarn add lucide-react
yarn add sonner@2.0.3
yarn add -D typescript tailwindcss
yarn add -D @types/react @types/react-dom
```

## 📦 Estrutura de package.json Sugerida

Crie ou atualize seu `package.json` com:

```json
{
  "name": "meditrak",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.400.0",
    "sonner": "2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.3.1",
    "tailwindcss": "^4.0.0"
  }
}
```

## ⚙️ Configuração do Projeto

### 1. Vite Config (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

### 2. TypeScript Config (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Tailwind CSS

**Observação**: O projeto usa **Tailwind CSS v4.0** que não requer `tailwind.config.js`.
Todos os estilos customizados estão em `styles/globals.css`.

Certifique-se de que seu `index.html` importa o CSS:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MediTrak - Gerenciamento de Medicações</title>
    <link rel="stylesheet" href="/styles/globals.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/App.tsx"></script>
  </body>
</html>
```

## 🏃 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
# ou
yarn build
```

Os arquivos compilados estarão na pasta `dist/`

### Preview da Build

```bash
npm run preview
# ou
yarn preview
```

## 🎯 Estrutura de Pastas Esperada

Após clonar o repositório, você deve ter:

```
meditrak/
├── node_modules/          (criado após npm install)
├── public/                (assets estáticos)
├── components/
│   ├── cuidador/
│   ├── paciente/
│   └── ui/
├── styles/
│   └── globals.css
├── App.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 Troubleshooting

### Erro: "Module not found"
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Cannot find module 'sonner'"
```bash
# Instale a versão específica do sonner
npm install sonner@2.0.3
```

### Erro no Tailwind CSS
```bash
# Verifique se o globals.css está importado
# e se o Tailwind está instalado corretamente
npm install -D tailwindcss@4
```

### TypeScript Errors
```bash
# Verifique os tipos do React
npm install -D @types/react @types/react-dom
```

## 📱 Testando no Mobile

### Opção 1: Usando ngrok
```bash
npm install -g ngrok
npm run dev
# Em outro terminal:
ngrok http 5173
```

### Opção 2: Usando rede local
```bash
# No vite.config.ts, adicione:
server: {
  host: '0.0.0.0',
  port: 5173
}

# Acesse via IP local: http://192.168.x.x:5173
```

## ✅ Verificação de Instalação

Para verificar se tudo está funcionando:

1. Execute `npm run dev`
2. Acesse `http://localhost:5173`
3. Você deve ver a **Landing Page** com dois cards:
   - "Sou Paciente"
   - "Sou Médico/Cuidador"
4. Tente fazer login com as contas de teste:
   - `paciente@teste.com`
   - `cuidador@teste.com`

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências foram instaladas
2. Confirme as versões do Node.js e npm
3. Limpe o cache e reinstale
4. Verifique se não há conflitos de porta (padrão: 5173)

---

**Projeto pronto para desenvolvimento!** 🎉
